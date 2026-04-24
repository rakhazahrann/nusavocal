import React from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { getStageX, getStageY } from "@/constants/stageLayout";

interface Stage {
  id: number;
  x: number;
}

interface StagePathProps {
  stages: Stage[];
}

export const StagePath: React.FC<StagePathProps> = ({ stages }) => {
  if (stages.length < 2) return null;

  // Calculate the total bounding box for the SVG
  const minX = 0;
  const maxX = 400; // Map width
  const topY = getStageY(stages.length - 1);
  const bottomY = getStageY(0);
  const height = bottomY - topY + 200; // Add padding

  // Generate SVG path string
  let pathStr = "";

  for (let i = 0; i < stages.length - 1; i++) {
    const current = stages[i];
    const next = stages[i + 1];

    const startX = getStageX(current.x);
    const startY = getStageY(i) - topY + 100; // Adjust for top padding
    const endX = getStageX(next.x);
    const endY = getStageY(i + 1) - topY + 100;

    if (i === 0) {
      pathStr += `M ${startX} ${startY} `;
    }

    const midY = (startY + endY) / 2;

    // Use a simple S-curve (Bezier) connecting the current to the next node
    pathStr += `C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY} `;
  }

  return (
    <View style={styles.container} pointerEvents="none">
      <Svg
        width="100%"
        height={height}
        style={{ position: "absolute", top: topY - 100 }}
      >
        <Path
          d={pathStr}
          fill="none"
          stroke="rgba(119,119,119,0.3)" // Matches text-outline-variant/20
          strokeWidth={4}
          strokeDasharray="12 12"
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1, // Behind the nodes
  },
});

