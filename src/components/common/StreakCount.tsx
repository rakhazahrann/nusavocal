import React from "react";
import { View, Image, StyleSheet, Dimensions } from "react-native";
import { PixelText } from "./PixelText";

const SCREEN_WIDTH = Dimensions.get("window").width;

// Let the bar render at its natural aspect ratio
const BAR_WIDTH = SCREEN_WIDTH * 0.25;
const FIRE_SIZE = 24;

interface StreakCountProps {
  streak?: number;
}

export const StreakCount: React.FC<StreakCountProps> = ({ streak = 5 }) => {
  return (
    <View style={styles.container}>
      {/* Background bar — contain preserves the original PNG shape */}
      <Image
        source={require("../../../assets/images/empty-stat-bar.png")}
        style={styles.statBar}
        resizeMode="contain"
      />

      {/* Content: fire icon (left) + streak number (right) */}
      <View style={styles.content}>
        <Image
          source={require("../../../assets/images/icon/fire-icon.png")}
          style={styles.fireIcon}
          resizeMode="contain"
        />
        <PixelText size={14} color="#FFF" shadow style={styles.streakText}>
          {streak}
        </PixelText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: BAR_WIDTH,
    justifyContent: "center",
    alignItems: "center",
  },
  statBar: {
    position: "absolute",
    width: BAR_WIDTH,
    height: BAR_WIDTH, // Large enough to let contain fit natural ratio
  },
  content: {
    width: BAR_WIDTH,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  fireIcon: {
    width: 23,
    height: 30,
    marginLeft: 4,
  },
  streakText: {
    marginTop: 4,
    marginLeft: 12,
  },
});
