import React from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Path, Defs, Pattern, Image as SvgImage } from "react-native-svg";
import {
  StageData,
  getStageX,
  getStageY,
  STAGE_NODE_SIZE,
  SCREEN_WIDTH,
  TOTAL_MAP_HEIGHT,
} from "../../constants/stageLayout";
// Import fungsi helper tadi
import { generatePixelPath } from "../../utils/pixelPathGenerator";

const DIRT_PATH_TEXTURE = require("../../../assets/images/map/dirt-texture.png");

interface StagePathProps {
  stages: StageData[];
}

export const StagePath: React.FC<StagePathProps> = ({ stages }) => {
  if (!stages || stages.length < 2) return null;

  let fullPathString = "";

  for (let i = 0; i < stages.length - 1; i++) {
    const startX = getStageX(stages[i].x);
    const startY = getStageY(i);
    const endX = getStageX(stages[i + 1].x);
    const endY = getStageY(i + 1);

    // 🔥 PANGGIL HELPER DI SINI
    // pixelSize mengatur seberapa besar kotak-kotaknya. Kita pakai 4 agar
    // tangga-tangganya masih terlihat jelas bernuansa pixel art namun curve-nya mulus
    fullPathString += generatePixelPath(startX, startY, endX, endY, 4);
  }

  const BORDER_COLOR = "#6d4e34";
  const BASE_COLOR = "#e6c483";
  const PATH_WIDTH = 40; // Sesuaikan lebar

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg
        width={SCREEN_WIDTH}
        height={TOTAL_MAP_HEIGHT}
        style={StyleSheet.absoluteFill}
        // @ts-ignore - 'shapeRendering' is not explicitly typed in react-native-svg for Svg component
        shapeRendering="crispEdges" // Tetap wajib pakai ini!
      >
        <Defs>
          <Pattern
            id="dirtPattern"
            patternUnits="userSpaceOnUse"
            width="64"
            height="64"
          >
            <SvgImage
              href={DIRT_PATH_TEXTURE}
              x="0"
              y="0"
              width="64"
              height="64"
              preserveAspectRatio="none"
            />
          </Pattern>
        </Defs>

        {/* LAYER BORDER */}
        <Path
          d={fullPathString}
          stroke={BORDER_COLOR}
          strokeWidth={PATH_WIDTH + 10}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round" // Round membuat jalur tebal curve jadi mulus
        />

        {/* LAYER ISI (Pasir) */}
        <Path
          d={fullPathString}
          stroke={BASE_COLOR}
          strokeWidth={PATH_WIDTH}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* LAYER TEXTURE */}
        <Path
          d={fullPathString}
          stroke="url(#dirtPattern)"
          strokeWidth={PATH_WIDTH}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.8}
        />
      </Svg>
    </View>
  );
};
