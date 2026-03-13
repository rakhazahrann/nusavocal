import React from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { NavBarBackground, BAR_HEIGHT } from "./BarBackground";
import { NavMapIcon } from "../map/Map-Icon";
import { NavBookIcon } from "../map/Book-Icon";
import { NavCupIcon } from "../map/Cup-Icon";
import { useAuthStore } from "../../stores/authStore";

const ICON_SIZE = 48;

// Profile images based on gender
const PROFILE_IMAGES = {
  man: require("../../../assets/images/characters/man-profile.png"),
  woman: require("../../../assets/images/characters/woman-profile.png"),
};

export const CustomTabBar = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  const { profile } = useAuthStore();

  // Determine profile image based on gender
  const profileImage = profile?.gender === "woman"
    ? PROFILE_IMAGES.woman
    : PROFILE_IMAGES.man;

  return (
    <View style={styles.container}>
      {/* Background bar image – stretches full width */}
      <NavBarBackground />

      {/* Icons row on top of the bar */}
      <View style={styles.tabContent}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const opacity = isFocused ? 1 : 0.6;

          let icon;
          switch (route.name) {
            case "Map":
              icon = <NavMapIcon size={ICON_SIZE} style={{ opacity }} />;
              break;
            case "Settings":
              icon = <NavBookIcon size={ICON_SIZE} style={{ opacity }} />;
              break;
            case "Leaderboard":
              icon = <NavCupIcon size={ICON_SIZE} style={{ opacity }} />;
              break;
            case "Profile":
              // Gender-based profile icon
              icon = (
                <View style={[styles.profileIconContainer, { opacity }]}>
                  <Image
                    source={profileImage}
                    style={styles.profileIcon}
                    resizeMode="contain"
                  />
                </View>
              );
              break;
            default:
              icon = <NavMapIcon size={ICON_SIZE} style={{ opacity }} />;
          }

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarButtonTestID}
              onPress={onPress}
              style={[styles.tabItem, isFocused && styles.tabItemFocused]}
              activeOpacity={0.8}
            >
              {icon}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: BAR_HEIGHT,
  },
  tabContent: {
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: BAR_HEIGHT,
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 24,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    padding: 4,
  },
  tabItemFocused: {
    transform: [{ scale: 1.15 }],
  },
  profileIconContainer: {
    width: 60,
    height: 60,
    paddingBottom: 5,
    borderRadius: 30,
    overflow: "hidden",
  },
  profileIcon: {
    width: "100%",
    height: "100%",
  },
});
