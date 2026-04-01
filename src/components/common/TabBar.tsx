import React from "react";
import { View, StyleSheet, Pressable, Image } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAuthStore } from "../../stores/authStore";
import { colors, radius, spacing } from "../../theme";

const BAR_HEIGHT = 72;

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

          const color = isFocused ? colors.text : colors.mutedText;
          const iconSize = 26;

          let iconNode: React.ReactNode = null;
          if (route.name === "Map") {
            iconNode = <MaterialIcons name="map" size={iconSize} color={color} />;
          } else if (route.name === "Leaderboard") {
            iconNode = <MaterialIcons name="emoji-events" size={iconSize} color={color} />;
          } else if (route.name === "Profile") {
            iconNode = (
              <View style={[styles.profileIconContainer, isFocused && styles.profileFocused]}>
                <Image source={profileImage} style={styles.profileIcon} />
              </View>
            );
          } else {
            iconNode = <MaterialIcons name="settings" size={iconSize} color={color} />;
          }

          return (
            <Pressable
              key={route.key}
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarButtonTestID}
              onPress={onPress}
              style={[styles.tabItem, isFocused && styles.tabItemFocused]}
            >
              {iconNode}
              {isFocused ? <View style={styles.activePill} /> : null}
            </Pressable>
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
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  tabContent: {
    flexDirection: "row",
    height: BAR_HEIGHT,
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: spacing.lg,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minWidth: 72,
  },
  tabItemFocused: {
    transform: [{ scale: 1.02 }],
  },
  activePill: {
    marginTop: 6,
    width: 18,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.accent,
  },
  profileIconContainer: {
    width: 30,
    height: 30,
    borderRadius: radius.pill,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
  },
  profileFocused: {
    borderColor: colors.accent,
  },
  profileIcon: {
    width: "100%",
    height: "100%",
  },
});

