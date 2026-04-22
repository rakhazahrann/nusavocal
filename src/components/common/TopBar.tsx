import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { BlurView } from "expo-blur";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Text } from "../ui/Text";
import { UserAvatar } from "./UserAvatar";
import { useAuthStore } from "../../stores/authStore";

export const TopBar = () => {
  const { profile } = useAuthStore();

  return (
    <View style={styles.container}>
      <BlurView intensity={70} tint="light" style={styles.blurContainer}>
        <View style={styles.leftContainer}>
          <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
            <MaterialIcons name="menu" size={24} color="#1a1c1c" />
          </TouchableOpacity>
          <Text style={styles.title}>NusaVocal</Text>
        </View>

        <View style={styles.rightContainer}>
          <View style={styles.streakBadge}>
            <MaterialIcons name="local-fire-department" size={20} color="#f97316" />
            <Text style={styles.streakText}>12</Text>
          </View>
          
          <View style={styles.avatarContainer}>
            <UserAvatar
              name={profile?.nickname || profile?.username}
              avatarUrl={profile?.avatar_url}
              size={32}
            />
          </View>
        </View>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 16,
    left: 16,
    right: 16,
    zIndex: 50,
  },
  blurContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 9999,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(226,232,240,0.4)",
    backgroundColor: "rgba(255,255,255,0.7)",
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  iconButton: {
    padding: 8,
    borderRadius: 9999,
  },
  title: {
    fontFamily: "SpaceGrotesk-Bold",
    fontSize: 20,
    textTransform: "uppercase",
    letterSpacing: -0.5,
    color: "#1a1c1c",
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(244,244,245,0.5)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: "rgba(226,232,240,0.3)",
  },
  streakText: {
    fontFamily: "SpaceGrotesk-Bold",
    fontSize: 14,
    color: "#1a1c1c",
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(198,198,198,0.3)",
  },
});

