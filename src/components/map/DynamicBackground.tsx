import React from "react";
import { StyleSheet, View, ImageBackground } from "react-native";

import { SCREEN_WIDTH, TOTAL_MAP_HEIGHT } from "../../constants/stageLayout";

const PLAIN_GRASS_TILE = require("../../../assets/images/map/grass-tile.png");

/**
 * A simple repeating grass background tile for the Dynamic Floating Path map.
 * This fills the entire scrollable area.
 */
export const DynamicBackground = () => {
  return (
    <View style={StyleSheet.absoluteFill}>
      <ImageBackground
        source={PLAIN_GRASS_TILE}
        style={styles.background}
        resizeMode="repeat"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    width: "100%",
    height: "100%",
  },
});
