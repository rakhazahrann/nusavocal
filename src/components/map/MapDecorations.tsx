import React from "react";
import { Image, StyleSheet, View } from "react-native";
import {
  StageData,
  DecoType,
  SCREEN_WIDTH,
  STAGE_NODE_SIZE,
  getStageX,
  getStageY,
} from "../../constants/stageLayout";

const PALM_TREE = require("../../../assets/images/map/palm-tree.png");
const BUSHES = require("../../../assets/images/map/bushes.png");
const RUMAH_ADAT = require("../../../assets/images/map/rumah-adat.png");

const getDecoSource = (type: DecoType) => {
  switch (type) {
    case "palm":
      return PALM_TREE;
    case "bush":
      return BUSHES;
    case "rumah":
      return RUMAH_ADAT;
  }
};

const getDecoSize = (type: DecoType, scale: number = 1) => {
  switch (type) {
    case "palm":
      return { width: 50 * scale, height: 70 * scale };
    case "bush":
      return { width: 35 * scale, height: 28 * scale };
    case "rumah":
      return { width: 70 * scale, height: 55 * scale };
  }
};

interface MapDecorationsProps {
  stages: StageData[];
}

/**
 * Renders decorative elements (palm trees, bushes, traditional houses)
 * positioned relative to each stage node, adding life and depth to the map.
 */
export const MapDecorations: React.FC<MapDecorationsProps> = ({ stages }) => {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {stages.map((stage, stageIndex) =>
        (stage.decorations || []).map((deco, decoIndex) => {
          const stageX = getStageX(stage.x) + STAGE_NODE_SIZE / 2;
          const stageY = getStageY(stageIndex);
          const size = getDecoSize(deco.type, deco.scale);

          const decoX = stageX + deco.offsetX * SCREEN_WIDTH - size.width / 2;
          const decoY = stageY + deco.offsetY - size.height / 2;

          return (
            <Image
              key={`deco-${stageIndex}-${decoIndex}`}
              source={getDecoSource(deco.type)}
              style={[
                styles.decoration,
                {
                  left: decoX,
                  top: decoY,
                  width: size.width,
                  height: size.height,
                },
              ]}
              resizeMode="contain"
            />
          );
        }),
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  decoration: {
    position: "absolute",
  },
});
