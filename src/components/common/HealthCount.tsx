import React from "react";
import { View, Image, StyleSheet, Dimensions } from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;
const HEART_SIZE = SCREEN_WIDTH * 0.09;

interface HealthCountProps {
  lives?: number;
  maxLives?: number;
  size?: number;
}

export const HealthCount: React.FC<HealthCountProps> = ({
  lives = 3,
  maxLives = 3,
  size = HEART_SIZE,
}) => {
  const hearts = [];

  for (let i = 1; i <= maxLives; i++) {
    let source;
    if (lives >= i) {
      source = require("../../../assets/images/icon/full-heart.png");
    } else if (lives >= i - 0.5) {
      source = require("../../../assets/images/icon/half-heart.png");
    } else {
      source = require("../../../assets/images/icon/empty-heart.png");
    }

    hearts.push(
      <Image
        key={`heart-${i}`}
        source={source}
        style={[styles.heart, { width: 29, height: 29 }]}
        resizeMode="contain"
      />,
    );
  }

  return <View style={styles.container}>{hearts}</View>;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  heart: {
    // Size set via inline style from prop
  },
});
