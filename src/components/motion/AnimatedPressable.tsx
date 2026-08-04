/**
 * AnimatedPressable — Micro-interaction wrapper
 *
 * Every tappable element gets a satisfying scale-down/spring-back.
 * Respects the global `reduceMotion` setting.
 *
 * Uses React Native's built-in Pressable + Reanimated for performance.
 *
 * Usage:
 *   <AnimatedPressable onPress={handlePress}>
 *     <Text>Tap me</Text>
 *   </AnimatedPressable>
 */
import React, { useCallback } from "react";
import { Pressable, StyleProp, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { springs, motionDurations } from "@/theme/motionTokens";
import { useSettingsStore } from "@/store/settingsStore";

const AnimatedPressableBase = Animated.createAnimatedComponent(Pressable);

interface AnimatedPressableProps {
  children: React.ReactNode;
  onPress?: () => void;
  onLongPress?: () => void;
  disabled?: boolean;
  /** Scale factor when pressed (default: 0.96) */
  activeScale?: number;
  /** Custom spring preset (default: "press") */
  springPreset?: keyof typeof springs;
  style?: StyleProp<ViewStyle>;
  /** Pass testID for accessibility */
  testID?: string;
  /** Additional props to pass through */
  activeOpacity?: number;
}

export const AnimatedPressable: React.FC<AnimatedPressableProps> = ({
  children,
  onPress,
  onLongPress,
  disabled = false,
  activeScale = 0.96,
  springPreset = "press",
  style,
  testID,
  activeOpacity = 0.85,
}) => {
  const reduceMotion = useSettingsStore((s) => s.reduceMotion);
  const scale = useSharedValue(1);
  const opacityVal = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    if (reduceMotion) return;
    scale.value = withTiming(activeScale, { duration: motionDurations.micro });
    opacityVal.value = withTiming(activeOpacity, { duration: motionDurations.micro });
  }, [reduceMotion, activeScale, activeOpacity]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, springs[springPreset]);
    opacityVal.value = withSpring(1, springs[springPreset]);
  }, [springPreset]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: disabled ? 0.5 : opacityVal.value,
  }));

  return (
    <AnimatedPressableBase
      testID={testID}
      style={[animatedStyle, style]}
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      accessible
      accessibilityRole="button"
      accessibilityState={{ disabled }}
    >
      {children}
    </AnimatedPressableBase>
  );
};
