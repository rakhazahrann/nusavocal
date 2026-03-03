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
import {
  STAGES,
  TOTAL_MAP_HEIGHT,
  getStageY,
} from "../../constants/stageLayout";

export const MainScreen = ({ navigation }: any) => {
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Scroll to the current stage on mount
  const scrollRef = useRef<Animated.ScrollView>(null);

  React.useEffect(() => {
    const currentStageIndex = STAGES.findIndex((s) => s.status === "current");
    if (currentStageIndex >= 0 && scrollRef.current) {
      const targetY = getStageY(currentStageIndex) - 300; // Center-ish
      setTimeout(() => {
        scrollRef.current?.scrollTo({
          y: Math.max(0, targetY),
          animated: true,
        });
      }, 500);
    }
  }, []);

  const handleStagePress = (stageId: number, label: string) => {
    Alert.alert(label, `Start Stage ${stageId}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Go!",
        onPress: () => {
          // TODO: Navigate to StageBriefing
          // navigation.navigate("StageBriefing", { stageId });
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Layer 1: Repeating grass tile background */}
      <DynamicBackground />

      {/* Layer 2: Scrollable map content */}
      <Animated.ScrollView
        ref={scrollRef}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ height: TOTAL_MAP_HEIGHT }}
        bounces={false}
      >
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
            onPress={() => handleStagePress(stage.id, stage.label)}
          />
        ))}
      </Animated.ScrollView>

      {/* Layer 3: Fixed TopBar overlay */}
      <View style={styles.topBarOverlay}>
        <TopBar />
      </View>
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
