import React, { useRef } from "react";
import { StyleSheet, View, Alert } from "react-native";
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
  STAGES,
  TOTAL_MAP_HEIGHT,
  getStageY,
  getStageX,
} from "../../constants/stageLayout";

export const MainScreen = ({ navigation }: any) => {
  const scrollY = useSharedValue(0);

  // Initialize character position to the "current" stage
  const currentStageIndex = STAGES.findIndex((s) => s.status === "current");
  const initialIndex = currentStageIndex >= 0 ? currentStageIndex : 0;

  const [charStartX, setCharStartX] = React.useState(() =>
    getStageX(STAGES[initialIndex].x),
  );
  const [charStartY, setCharStartY] = React.useState(() =>
    getStageY(initialIndex),
  );
  const [charTargetX, setCharTargetX] = React.useState(() =>
    getStageX(STAGES[initialIndex].x),
  );
  const [charTargetY, setCharTargetY] = React.useState(() =>
    getStageY(initialIndex),
  );
  const [isWalking, setIsWalking] = React.useState(false);
  const [scaleX, setScaleX] = React.useState(1);

  const [selectedStageId, setSelectedStageId] = React.useState<number | null>(null);
  const [selectedStageLabel, setSelectedStageLabel] = React.useState<string>("");
  const [popupVisible, setPopupVisible] = React.useState(false);

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

    const targetX = getStageX(STAGES[index].x);
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
    setPopupVisible(true);

    // Wait for the walking animation to finish (1500ms duration defined in Character)
    setTimeout(() => {
      setIsWalking(false);
    }, 1500);
  };

  return (
    <View style={styles.container}>
      {/* Layer 2: Scrollable map content */}
      <Animated.ScrollView
        ref={scrollRef}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ height: TOTAL_MAP_HEIGHT }}
        bounces={false}
      >
        {/* Layer 1: Repeating grass tile background */}
        <DynamicBackground />
        {/* Decorative elements (trees, buildings) */}
        <MapDecorations stages={STAGES} />

        {/* Dotted path connecting stages */}
        <StagePath stages={STAGES} />

        {/* Stage nodes */}
        {STAGES.map((stage, index) => (
          <StageNode
            key={stage.id}
            id={stage.id}
            x={stage.x}
            stageIndex={index}
            label={stage.label}
            status={stage.status}
            onPress={() => handleStagePress(stage.id, stage.label, index)}
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
          // navigation.navigate("StageBriefing", { stageId });
        }}
      />
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
});
