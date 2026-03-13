import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { HealthCount } from "./HealthCount";
import { StreakCount } from "./StreakCount";
import { NavBarBackground, BAR_HEIGHT, SCREEN_WIDTH } from "./BarBackground";
import { useAuthStore } from "../../stores/authStore";

// Profile images based on gender
const PROFILE_IMAGES = {
  man: require("../../../assets/images/characters/man-profile.png"),
  woman: require("../../../assets/images/characters/woman-profile.png"),
};

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
  const { profile } = useAuthStore();

  // Determine profile image based on gender
  const profileImage = profile?.gender === "woman"
    ? PROFILE_IMAGES.woman
    : PROFILE_IMAGES.man;

  return (
    <View style={styles.container}>
      {/* Wood bar background – same asset as TabBar */}
      <NavBarBackground style={styles.barOverride} />

      {/* Hearts – left side */}
      <HealthCount lives={lives} maxLives={maxLives} />

      {/* Profile icon – center-right */}
      <View style={styles.profileContainer}>
        <Image source={profileImage} style={styles.profileImage} resizeMode="contain" />
      </View>

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
  profileContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
});
