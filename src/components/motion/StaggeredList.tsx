/**
 * StaggeredList — Choreographed list entrance
 *
 * Children appear one-by-one with configurable delay, direction, and spring physics.
 * Perfect for leaderboard rows, option cards, form fields, stats grids.
 *
 * Usage:
 *   <StaggeredList preset="fadeSlideUp" staggerMs={70}>
 *     <Card>Item 1</Card>
 *     <Card>Item 2</Card>
 *     <Card>Item 3</Card>
 *   </StaggeredList>
 */
import React, { useEffect, useMemo } from "react";
import { StyleProp, ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  Easing,
} from "react-native-reanimated";
import {
  stagger,
  springs,
  motionDurations,
  enterPresets,
  motionEasings,
  type EnterPreset,
} from "@/theme/motionTokens";
import { useSettingsStore } from "@/store/settingsStore";

interface StaggeredItemProps {
  children: React.ReactNode;
  index: number;
  staggerMs: number;
  preset: EnterPreset;
  useSpring?: boolean;
  style?: StyleProp<ViewStyle>;
}

const StaggeredItem: React.FC<StaggeredItemProps> = ({
  children,
  index,
  staggerMs,
  preset,
  useSpring: useSpringAnim = false,
  style,
}) => {
  const reduceMotion = useSettingsStore((s) => s.reduceMotion);
  const config = enterPresets[preset];

  const opacity = useSharedValue<number>(reduceMotion ? 1 : (config.fromOpacity ?? 0));
  const translateY = useSharedValue<number>(reduceMotion ? 0 : ("fromTranslateY" in config ? config.fromTranslateY : 0));
  const translateX = useSharedValue<number>(reduceMotion ? 0 : ("fromTranslateX" in config ? config.fromTranslateX : 0));
  const scale = useSharedValue<number>(reduceMotion ? 1 : ("fromScale" in config ? config.fromScale : 1));

  useEffect(() => {
    if (reduceMotion) {
      opacity.value = 1;
      translateY.value = 0;
      translateX.value = 0;
      scale.value = 1;
      return;
    }

    const delay = index * staggerMs;

    opacity.value = withDelay(
      delay,
      withTiming(1, { duration: motionDurations.medium, easing: motionEasings.default })
    );

    if (useSpringAnim) {
      translateY.value = withDelay(delay, withSpring(0, springs.gentle));
      translateX.value = withDelay(delay, withSpring(0, springs.gentle));
      scale.value = withDelay(delay, withSpring(1, springs.bouncy));
    } else {
      translateY.value = withDelay(
        delay,
        withTiming(0, { duration: motionDurations.medium, easing: motionEasings.ios })
      );
      translateX.value = withDelay(
        delay,
        withTiming(0, { duration: motionDurations.medium, easing: motionEasings.ios })
      );
      scale.value = withDelay(
        delay,
        withTiming(1, { duration: motionDurations.medium, easing: motionEasings.ios })
      );
    }
  }, [reduceMotion]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { scale: scale.value },
    ],
  }));

  return (
    <Animated.View style={[animatedStyle, style]}>
      {children}
    </Animated.View>
  );
};

// ── Main Component ──────────────────────────────────────────────

interface StaggeredListProps {
  children: React.ReactNode;
  /** Animation direction preset (default: "fadeSlideUp") */
  preset?: EnterPreset;
  /** Delay between items in ms (default: stagger.normal = 70) */
  staggerMs?: number;
  /** Use spring physics instead of timing (default: false) */
  useSpring?: boolean;
  /** Container style */
  style?: StyleProp<ViewStyle>;
  /** Style applied to each item wrapper */
  itemStyle?: StyleProp<ViewStyle>;
}

export const StaggeredList: React.FC<StaggeredListProps> = ({
  children,
  preset = "fadeSlideUp",
  staggerMs = stagger.normal,
  useSpring: useSpringAnim = false,
  style,
  itemStyle,
}) => {
  const childArray = useMemo(
    () => React.Children.toArray(children).filter(Boolean),
    [children]
  );

  return (
    <Animated.View style={style}>
      {childArray.map((child, index) => (
        <StaggeredItem
          key={index}
          index={index}
          staggerMs={staggerMs}
          preset={preset}
          useSpring={useSpringAnim}
          style={itemStyle}
        >
          {child}
        </StaggeredItem>
      ))}
    </Animated.View>
  );
};
