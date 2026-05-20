import React, { useEffect } from "react";
import { View, StyleSheet, Pressable, Dimensions, Platform } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  Easing,
  interpolate,
} from "react-native-reanimated";
import { Map, BookOpen, Trophy, User } from "@tamagui/lucide-icons";
import { useTheme } from "tamagui";
import { ROUTES } from "@/constants/routes";

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
  const theme = useTheme();
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
        style={styles.glassBase}
        onLayout={(e) => setLayoutWidth(e.nativeEvent.layout.width)}
      >
        {/* Layer 1: Native backdrop blur (iOS) / solid frosted (Android) */}
        <BlurView
          intensity={Platform.OS === "ios" ? 80 : 100}
          tint="light"
          style={StyleSheet.absoluteFill}
        />

        {/* Layer 2: Liquid glass surface — glossy highlight gradient */}
        <LinearGradient
          colors={[
            "rgba(255,255,255,0.55)",
            "rgba(255,255,255,0.08)",
            "rgba(255,255,255,0.0)",
            "rgba(255,255,255,0.12)",
          ]}
          locations={[0, 0.35, 0.6, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.glassShine}
        />

        {/* Layer 2b: Horizontal shimmer for liquid refraction feel */}
        <LinearGradient
          colors={[
            "rgba(255,255,255,0.0)",
            "rgba(255,255,255,0.15)",
            "rgba(255,255,255,0.0)",
          ]}
          locations={[0, 0.5, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.glassShine}
        />

        {/* Layer 2c: Inner border glow */}
        <View style={styles.innerBorder} />

        {/* Layer 3: Animated indicator */}
        {layoutWidth > 0 && (
          <Animated.View
            style={[styles.indicatorWrapper, animatedIndicatorStyle]}
          >
            <View style={styles.indicator} />
          </Animated.View>
        )}

        {/* Layer 4: Tab icons */}
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

          let Icon = Map;
          if (route.name === ROUTES.MAP) Icon = Map;
          else if (route.name === ROUTES.LEADERBOARD) Icon = Trophy;
          else if (route.name === ROUTES.PROFILE) Icon = User;

          const iconColor = isFocused ? "#ffffff" : "#6b7280";

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
                <Icon
                  size={24}
                  color={iconColor}
                  strokeWidth={isFocused ? 2.5 : 2}
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
  glassBase: {
    flexDirection: "row",
    alignItems: "center",
    height: TAB_BAR_HEIGHT,
    borderRadius: BORDER_RADIUS,
    width: TAB_BAR_WIDTH,
    overflow: "hidden",
    backgroundColor:
      Platform.OS === "android"
        ? "rgba(240, 242, 245, 0.92)"
        : "rgba(255, 255, 255, 0.45)",
    // Shadow for depth
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 16,
  },
  glassShine: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: BORDER_RADIUS,
  },
  innerBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: BORDER_RADIUS,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",
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
    backgroundColor: "#1a1c1e",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
});
