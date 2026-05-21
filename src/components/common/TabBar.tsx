import React, { useEffect } from "react";
import { View, StyleSheet, Pressable, Dimensions, Platform } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  Easing,
  interpolate,
} from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ROUTES } from "@/constants/routes";
import { colors } from "@/constants/colors";

const { width } = Dimensions.get("window");
const TAB_BAR_WIDTH = width * 0.72;
const TAB_BAR_HEIGHT = 64;
const BORDER_RADIUS = 32;
const INDICATOR_SIZE = 48;

export const CustomTabBar = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  const [layoutWidth, setLayoutWidth] = React.useState(0);
  const translateX = useSharedValue(0);
  const scale = useSharedValue(1);

  const tabCount = state.routes.length;
  const TAB_ITEM_WIDTH = layoutWidth / tabCount;

  useEffect(() => {
    if (layoutWidth > 0) {
      const targetX =
        state.index * TAB_ITEM_WIDTH + (TAB_ITEM_WIDTH - INDICATOR_SIZE) / 2;

      // Liquid squish animation
      scale.value = withTiming(
        0.7,
        { duration: 120, easing: Easing.bezier(0.25, 0.1, 0.25, 1) },
        () => {
          scale.value = withSpring(1, { damping: 12, stiffness: 200 });
        }
      );

      translateX.value = withSpring(targetX, {
        mass: 0.8,
        damping: 15,
        stiffness: 130,
      });
    }
  }, [state.index, layoutWidth, TAB_ITEM_WIDTH]);

  const animatedIndicatorStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { scaleX: interpolate(scale.value, [0.7, 1], [1.25, 1], "clamp") },
      { scaleY: scale.value },
    ],
    opacity: layoutWidth > 0 ? 1 : 0,
  }));

  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      <View
        style={styles.solidBase}
        onLayout={(e) => setLayoutWidth(e.nativeEvent.layout.width)}
      >
        {/* Layer 1: Animated indicator */}
        {layoutWidth > 0 && (
          <Animated.View
            style={[styles.indicatorWrapper, animatedIndicatorStyle]}
          >
            <View style={styles.indicator} />
          </Animated.View>
        )}

        {/* Layer 2: Tab icons */}
        {state.routes.map((route, index) => {
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

          let iconName: keyof typeof MaterialCommunityIcons.glyphMap = "map-outline";
          if (route.name === ROUTES.MAP) iconName = "map-outline";
          else if (route.name === ROUTES.LEADERBOARD) iconName = "trophy-outline";
          else if (route.name === ROUTES.PROFILE) iconName = "account-outline";

          const iconColor = isFocused ? "#ffffff" : "rgba(255, 255, 255, 0.4)";

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={styles.tabItem}
            >
              <Animated.View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  transform: [{ scale: isFocused ? 1.1 : 1 }],
                }}
              >
                <MaterialCommunityIcons
                  name={iconName}
                  size={24}
                  color={iconColor}
                />
              </Animated.View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 24,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  solidBase: {
    flexDirection: "row",
    alignItems: "center",
    height: TAB_BAR_HEIGHT,
    borderRadius: BORDER_RADIUS,
    width: TAB_BAR_WIDTH,
    overflow: "hidden",
    backgroundColor: colors.navy,
    // Shadow for depth
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
  tabItem: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  indicatorWrapper: {
    position: "absolute",
    top: 8,
    bottom: 8,
    width: INDICATOR_SIZE,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  indicator: {
    width: INDICATOR_SIZE,
    height: INDICATOR_SIZE,
    borderRadius: INDICATOR_SIZE / 2,
    backgroundColor: colors.accent,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
});
