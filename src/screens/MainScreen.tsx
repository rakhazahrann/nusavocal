import React, { useRef, useEffect } from "react";
import { StyleSheet, View, TouchableOpacity, ActivityIndicator, useWindowDimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  runOnJS,
} from "react-native-reanimated";
import { TopBar } from "@/components/common/TopBar";
import { DynamicBackground } from "@/components/map/DynamicBackground";
import { StageNode } from "@/components/map/StageNode";
import { StagePath } from "@/components/map/StagePath";
import { MapDecorations } from "@/components/map/MapDecorations";
import { StagePopup } from "@/components/map/StagePopup";
import {
  STAGE_SPACING,
  MAP_PADDING_TOP,
  MAP_PADDING_BOTTOM,
  getStageY,
  getStageX,
  STAGES as FALLBACK_STAGES,
} from "@/constants/stageLayout";
import { useAuthStore } from "@/store/authStore";
import { useGameStore } from "@/store/gameStore";
import { Stage } from "@/types/store";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Text } from "@/components/ui/Text";
import { Card } from "@/components/ui/Card";
import { colors } from "@/constants/colors";


export const MainScreen = ({ navigation }: any) => {
  const scrollY = useSharedValue(0);
  const { height: viewportHeight } = useWindowDimensions();
  const { profile, user } = useAuthStore();
  const { stages: dbStages, fetchStages, isLoading, error } = useGameStore();

  const scrollOffsetRef = useRef(0);

  // No-op: GSAP scroll tween removed, using native animated scroll
  const killScrollTween = React.useCallback(() => {}, []);

  const setScrollOffset = React.useCallback((y: number) => {
    scrollOffsetRef.current = y;
  }, []);

  // STAGE DATA: STRICTLY DATABASE ONLY
  // No more fallbacks to hardcoded tutorial stages.
  const stages = dbStages.map((s, i) => {
    let status = s.status;
    // Admins can access everything
    if (profile?.role === "admin" && status === "locked") {
      status = "completed";
    }

    return {
      id: s.id,
      x: s.x_position,
      label: s.label,
      description: s.description,
      image_url: s.image_url,
      status: status,
      decorations: FALLBACK_STAGES[i]?.decorations || [],
    };
  });

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

  // Determine initial index for scrolling
  const currentStageIndex = stages.findIndex((s) => s.status === "current");
  const initialIndex = currentStageIndex >= 0 ? currentStageIndex : 0;

  const [selectedStageId, setSelectedStageId] = React.useState<number | null>(null);
  const [selectedStageLabel, setSelectedStageLabel] = React.useState<string>("");
  const [selectedStageDescription, setSelectedStageDescription] = React.useState<string>("");
  const [popupVisible, setPopupVisible] = React.useState(false);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
      runOnJS(setScrollOffset)(event.contentOffset.y);
    },
  });

  // Sync selected stage with the current stage from DB
  useEffect(() => {
    if (!stages.length) return;

    const dbCurrent = stages.find((s) => s.status === "current");
    const nextSelectedId = selectedStageId ?? dbCurrent?.id ?? stages[0]?.id ?? null;

    if (nextSelectedId !== selectedStageId) {
      setSelectedStageId(nextSelectedId);
    }

    const selectedStage = stages.find((s) => s.id === nextSelectedId) || stages[0];
    if (selectedStage) {
      setSelectedStageLabel(selectedStage.label);
      setSelectedStageDescription(selectedStage.description || `Misi ke-${selectedStage.id}`);
    }
  }, [stages]);

  // Scroll to the current stage on mount
  const scrollRef = useRef<Animated.ScrollView>(null);

  const scrollToStage = (stageIndex: number, animated: boolean) => {
    if (!scrollRef.current) return;

    const safeViewportHeight = Math.max(1, viewportHeight || 1);
    const desiredViewportY = safeViewportHeight * 0.65; // keep node a bit lower to fit popup above
    const stageY = getStageY(stageIndex, stages.length);

    const rawTarget = stageY - desiredViewportY;
    const maxScroll = Math.max(0, totalMapHeight - safeViewportHeight);
    const clamped = Math.max(0, Math.min(rawTarget, maxScroll));

    scrollOffsetRef.current = clamped;
    scrollRef.current?.scrollTo({ y: clamped, animated });
  };

  // Cleanup no longer needed without GSAP tweens

  React.useEffect(() => {
    if (initialIndex < 0) return;
    const t = setTimeout(() => {
      scrollToStage(initialIndex, true);
    }, 500);
    return () => clearTimeout(t);
  }, [initialIndex, viewportHeight, totalMapHeight]);

  const handleStagePress = (stageId: number, label: string, index: number) => {
    // Ensure the target stage has enough space for the popup (esp. near top)
    scrollToStage(index, true);

    setSelectedStageId(stageId);
    setSelectedStageLabel(label);
    setSelectedStageDescription(stages[index].description || `Misi ke-${stageId}`);
    setPopupVisible(true);
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

        {/* Dotted path connecting stages */}
        <StagePath stages={stages} />

        {/* Stage nodes */}
        {stages.map((stage, index) => {
          const isSelected = stage.id === selectedStageId;
          const nodeStatus = isSelected ? "current" : (stage.status === "current" ? "completed" : stage.status);
          return (
            <StageNode
              key={stage.id}
              id={stage.id}
              x={stage.x}
              stageIndex={index}
              totalStages={stages.length}
              label={stage.label}
              status={nodeStatus}
              onPress={() => handleStagePress(stage.id, stage.label, index)}
            />
          );
        })}

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
        description={selectedStageDescription}
        onCancel={() => setPopupVisible(false)}
        onStart={(stageId) => {
          setPopupVisible(false);
          navigation.navigate("VocabFarming", { stageId });
        }}
      />

      {/* Error / Empty State Feedback */}
      {!isLoading && (error || (user?.id && stages.length === 0)) && (
        <View style={styles.errorContainer}>
          <Card style={{ padding: 16, alignItems: "center" }}>
            <MaterialIcons name="error-outline" size={24} color="#D32F2F" style={{ alignSelf: 'center', marginBottom: 5 }} />
            <Text tone="danger" style={{ textAlign: "center" }}>
              {error ? error : "Belum ada stage yang dipublikasikan."}
            </Text>
            {error && (
              <TouchableOpacity onPress={() => user?.id && fetchStages(user.id)} style={{ marginTop: 10 }}>
                <Text tone="muted" style={{ textAlign: "center", textDecorationLine: "underline" }}>
                  COBA LAGI
                </Text>
              </TouchableOpacity>
            )}
          </Card>
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
    backgroundColor: colors.background,
  },
  topBarOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
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
