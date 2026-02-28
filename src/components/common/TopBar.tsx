import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { HealthCount } from "./HealthCount";
import { StreakCount } from "./StreakCount";
import { NavBarBackground, BAR_HEIGHT, SCREEN_WIDTH } from "./BarBackground";

interface TopBarProps {
  lives?: number;
  maxLives?: number;
  streak?: number;
}

export const TopBar: React.FC<TopBarProps> = ({
  lives = 3,
  maxLives = 3,
  streak = 0,
}) => {
  return (
    <View style={styles.container}>
      {/* Wood bar background – same asset as TabBar */}
      <NavBarBackground style={styles.barOverride} />

      {/* Hearts – left side */}
      <HealthCount lives={lives} maxLives={maxLives} />

      {/* Streak bar – right side */}
      <StreakCount streak={streak} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: BAR_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 30,
    paddingRight: 30,
  },
  barOverride: {
    bottom: undefined,
    top: 0,
  } as any,
});
