import React from "react";
import { View, StyleSheet } from "react-native";
import {
  StageData,
  getStageX,
  getStageY,
  STAGE_NODE_SIZE,
} from "../../constants/stageLayout";

interface StagePathProps {
  stages: StageData[];
}

/**
 * Draws a winding path of dots connecting consecutive stages.
 * Each pair of adjacent stages is connected by a series of small
 * circular dots that follow a curve between them.
 */
export const StagePath: React.FC<StagePathProps> = ({ stages }) => {
  const dots: React.ReactNode[] = [];

  for (let i = 0; i < stages.length - 1; i++) {
    const fromX = getStageX(stages[i].x) + STAGE_NODE_SIZE / 2;
    const fromY = getStageY(i);
    const toX = getStageX(stages[i + 1].x) + STAGE_NODE_SIZE / 2;
    const toY = getStageY(i + 1);

    const isCompleted =
      stages[i].status === "completed" && stages[i + 1].status !== "locked";

    // Generate dots along the path between the two stages
    const numDots = 12;
    for (let d = 0; d <= numDots; d++) {
      const t = d / numDots;

      // Add a slight curve by using a sin wave for the X offset
      const curveMagnitude = (toX - fromX) * 0.3;
      const curveOffset = Math.sin(t * Math.PI) * curveMagnitude;

      const dotX =
        fromX + (toX - fromX) * t + curveOffset * (t < 0.5 ? -1 : 1) * 0.3;
      const dotY = fromY + (toY - fromY) * t;

      dots.push(
        <View
          key={`path-${i}-${d}`}
          style={[
            styles.dot,
            {
              left: dotX - 4,
              top: dotY - 4,
              backgroundColor: isCompleted ? "#c8a43a" : "#8b7355",
              opacity: isCompleted ? 0.9 : 0.5,
            },
          ]}
        />,
      );
    }
  }

  return <View style={StyleSheet.absoluteFill}>{dots}</View>;
};

const styles = StyleSheet.create({
  dot: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.2)",
  },
});
