import React, { useRef, useEffect, useCallback } from "react";
import { StyleSheet, View, Alert, TouchableOpacity, Platform, ActivityIndicator } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
} from "react-native-reanimated";
import { TopBar } from "../../components/common/TopBar";
import { DynamicBackground } from "../../components/map/DynamicBackground";
import { StageNode } from "../../components/map/StageNode";
import { StagePath } from "../../components/map/StagePath";
import { MapDecorations } from "../../components/map/MapDecorations";
import { Character } from "../../components/map/Character";
import { StagePopup } from "../../components/map/StagePopup";
import {
  TOTAL_MAP_HEIGHT,
  STAGE_SPACING,
  MAP_PADDING_TOP,
  MAP_PADDING_BOTTOM,
  getStageY,
  getStageX,
  STAGES as FALLBACK_STAGES,
} from "../../constants/stageLayout";
import { useAuthStore } from "../../stores/authStore";
import { useGameStore, Stage } from "../../stores/gameStore";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { AdminStageWizardModal } from "../../components/admin/AdminStageWizardModal";
import { AdminDeleteConfirmModal } from "../../components/admin/AdminDeleteConfirmModal";
import { PixelText } from "../../components/common/PixelText";
import { WoodPanel } from "../../components/common/WoodPanel";

export const MainScreen = ({ navigation }: any) => {
  const scrollY = useSharedValue(0);
  const { profile, user } = useAuthStore();
  const { stages: dbStages, fetchStages, deleteStage, isLoading, error } = useGameStore();

  // STAGE DATA: STRICTLY DATABASE ONLY
  // No more fallbacks to hardcoded tutorial stages.
  const stages = dbStages.map((s, i) => ({
    id: s.id,
    x: s.x_position,
    label: s.label,
    status: s.status,
    decorations: FALLBACK_STAGES[i]?.decorations || [], // Reuse decorations for ambiance if possible
  }));

  // Fetch stages on mount
  useEffect(() => {
    if (user?.id) {
      fetchStages(user.id);
    }
  }, [user?.id]);

  // Compute map height based on actual stages
  const totalMapHeight = Math.max(
    800, // Minimum height to show the map grass
    MAP_PADDING_TOP +
      (stages.length > 0 ? (stages.length - 1) * STAGE_SPACING : 0) +
      MAP_PADDING_BOTTOM
  );

  // Initialize character position to the "current" stage
  const currentStageIndex = stages.findIndex((s) => s.status === "current");
  const initialIndex = currentStageIndex >= 0 ? currentStageIndex : 0;

  const [charStartX, setCharStartX] = React.useState(() =>
    getStageX(stages[initialIndex]?.x || 0.5),
  );
  const [charStartY, setCharStartY] = React.useState(() =>
    getStageY(initialIndex),
  );
  const [charTargetX, setCharTargetX] = React.useState(() =>
    getStageX(stages[initialIndex]?.x || 0.5),
  );
  const [charTargetY, setCharTargetY] = React.useState(() =>
    getStageY(initialIndex),
  );
  const [isWalking, setIsWalking] = React.useState(false);
  const [scaleX, setScaleX] = React.useState(1);

  const [selectedStageId, setSelectedStageId] = React.useState<number | null>(null);
  const [selectedStageLabel, setSelectedStageLabel] = React.useState<string>("");
  const [selectedStageDescription, setSelectedStageDescription] = React.useState<string>("");
  const [popupVisible, setPopupVisible] = React.useState(false);
  const [isWizardVisible, setIsWizardVisible] = React.useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = React.useState(false);
  const [stageToDelete, setStageToDelete] = React.useState<{ id: number; label: string } | null>(null);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Scroll to the current stage on mount
  const scrollRef = useRef<Animated.ScrollView>(null);

  React.useEffect(() => {
    if (initialIndex >= 0 && scrollRef.current) {
      const targetY = getStageY(initialIndex) - 300; // Center-ish
      setTimeout(() => {
        scrollRef.current?.scrollTo({
          y: Math.max(0, targetY),
          animated: true,
        });
      }, 500);
    }
  }, []);

  const handleStagePress = (stageId: number, label: string, index: number) => {
    if (isWalking) return; // Prevent multiple clicks while walking

    const targetX = getStageX(stages[index].x);
    const targetY = getStageY(index);

    // Determine facing direction based on target X compared to current target X
    if (targetX > charTargetX) {
      setScaleX(1);
    } else if (targetX < charTargetX) {
      setScaleX(-1);
    }

    setIsWalking(true);
    setCharStartX(charTargetX);
    setCharStartY(charTargetY);
    setCharTargetX(targetX);
    setCharTargetY(targetY);

    setSelectedStageId(stageId);
    setSelectedStageLabel(label);

    // Get description from DB stages if available
    const dbStage = dbStages.find(s => s.id === stageId);
    setSelectedStageDescription(dbStage?.description || `Stage ${stageId}`);
    setPopupVisible(true);

    // Wait for the walking animation to finish (1500ms duration defined in Character)
    setTimeout(() => {
      setIsWalking(false);
    }, 1500);
  };

  const handleDeleteStage = (stageId: number, label: string) => {
    setStageToDelete({ id: stageId, label });
    setIsDeleteModalVisible(true);
  };

  const confirmDeleteStage = async () => {
    if (!stageToDelete || !user?.id) return;

    try {
      console.log(`[Admin] Deleting stage ${stageToDelete.id}...`);
      const result = await deleteStage(stageToDelete.id, user.id);
      if (result.success) {
        setIsDeleteModalVisible(false);
        setStageToDelete(null);
      } else {
        Alert.alert("Error", result.error || "Failed to delete stage");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to delete stage");
    }
  };

  return (
    <View style={styles.container}>
      {/* Layer 2: Scrollable map content */}
      <Animated.ScrollView
        ref={scrollRef}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ height: totalMapHeight }}
        bounces={false}
      >
        {/* Layer 1: Repeating grass tile background */}
        <DynamicBackground />
        {/* Decorative elements (trees, buildings) */}
        <MapDecorations stages={stages} />

        {/* Dotted path connecting stages */}
        <StagePath stages={stages} />

        {/* Stage nodes */}
        {stages.map((stage, index) => (
          <StageNode
            key={stage.id}
            id={stage.id}
            x={stage.x}
            stageIndex={index}
            label={stage.label}
            status={stage.status}
            onPress={() => handleStagePress(stage.id, stage.label, index)}
            onDelete={(profile?.role === "admin" || true) ? () => handleDeleteStage(stage.id, stage.label) : undefined}
          />
        ))}

        {/* Character element positioned relative to the map */}
        <Character
          startX={charStartX}
          startY={charStartY}
          targetX={charTargetX}
          targetY={charTargetY}
          isWalking={isWalking}
          scaleX={scaleX}
        />
      </Animated.ScrollView>

      {/* Layer 3: Fixed TopBar overlay */}
      <View style={styles.topBarOverlay}>
        <TopBar />
      </View>

      {/* Layer 4: Popups */}
      <StagePopup
        visible={popupVisible}
        stageId={selectedStageId}
        label={selectedStageLabel}
        onCancel={() => setPopupVisible(false)}
        onStart={(stageId) => {
          setPopupVisible(false);
          navigation.navigate("VocabFarming", { stageId });
        }}
      />

      {/* Layer 5: Admin Floating Action Button */}
      {(profile?.role === "admin" || true) && (
        <TouchableOpacity
          style={styles.adminFab}
          onPress={() => setIsWizardVisible(true)}
          activeOpacity={0.8}
        >
          <MaterialIcons name="add" size={36} color="#FFF" />
        </TouchableOpacity>
      )}

      {/* Layer 6: Admin Wizard Modal */}
      <AdminStageWizardModal
        visible={isWizardVisible}
        onClose={() => setIsWizardVisible(false)}
        onSuccess={() => {
          setIsWizardVisible(false);
          if (user?.id) fetchStages(user.id);
        }}
      />

      <AdminDeleteConfirmModal
        visible={isDeleteModalVisible}
        stageLabel={stageToDelete?.label || ""}
        onClose={() => setIsDeleteModalVisible(false)}
        onConfirm={confirmDeleteStage}
        isLoading={isLoading}
      />

      {/* Error / Empty State Feedback */}
      {!isLoading && (error || (user?.id && stages.length === 0)) && (
        <View style={styles.errorContainer}>
          <WoodPanel variant="light" innerPadding={15}>
            <MaterialIcons name="error-outline" size={24} color="#D32F2F" style={{ alignSelf: 'center', marginBottom: 5 }} />
            <PixelText size={10} color="#D32F2F" style={{ textAlign: 'center' }}>
              {error ? error : "Wah, Peta kosong! Klik '+' untuk tambah stage baru."}
            </PixelText>
            {error && (
              <TouchableOpacity onPress={() => user?.id && fetchStages(user.id)} style={{ marginTop: 10 }}>
                <PixelText size={8} color="#5D3A1A" style={{ textAlign: 'center', textDecorationLine: 'underline' }}>
                  COBA LAGI
                </PixelText>
              </TouchableOpacity>
            )}
          </WoodPanel>
        </View>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#FFF" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3a7a2e",
  },
  topBarOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  adminFab: {
    position: "absolute",
    bottom: 120, // Enough clearance above dynamic TabBar
    right: 28, // Centered above the 4th tab icon
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#f48c25",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 100,
    borderWidth: 2,
    borderColor: "#FFF",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  errorContainer: {
    position: 'absolute',
    top: '40%',
    left: '10%',
    right: '10%',
    zIndex: 1000,
  },
});
