/**
 * AnimatedCounter — Rolling number animation
 *
 * Smoothly animates from 0 (or previous value) to target number.
 * Great for scores, XP, stats — anything where the number should "count up".
 *
 * Usage:
 *   <AnimatedCounter value={1250} suffix=" XP" duration={800} />
 *   <AnimatedCounter value={98} prefix="+" suffix="%" />
 */
import React, { useEffect } from "react";
import { TextStyle, StyleProp } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
  useDerivedValue,
} from "react-native-reanimated";
import { motionDurations, motionEasings } from "@/theme/motionTokens";
import { useSettingsStore } from "@/store/settingsStore";

// We need to use TextInput for animated text (React Native limitation)
import { TextInput } from "react-native";
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

interface AnimatedCounterProps {
  /** Target number to count to */
  value: number;
  /** Duration in ms (default: 800) */
  duration?: number;
  /** Text prefix (e.g. "+" ) */
  prefix?: string;
  /** Text suffix (e.g. " XP", "%") */
  suffix?: string;
  /** Text style */
  style?: StyleProp<TextStyle>;
  /** Number of decimal places (default: 0) */
  decimals?: number;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = motionDurations.hero,
  prefix = "",
  suffix = "",
  style,
  decimals = 0,
}) => {
  const reduceMotion = useSettingsStore((s) => s.reduceMotion);
  const animatedValue = useSharedValue(reduceMotion ? value : 0);

  useEffect(() => {
    if (reduceMotion) {
      animatedValue.value = value;
    } else {
      animatedValue.value = withTiming(value, {
        duration,
        easing: motionEasings.ios,
      });
    }
  }, [value, reduceMotion, duration]);

  const animatedText = useDerivedValue(() => {
    const num = decimals > 0
      ? animatedValue.value.toFixed(decimals)
      : Math.round(animatedValue.value).toString();
    return `${prefix}${num}${suffix}`;
  });

  const animatedProps = useAnimatedProps(() => ({
    text: animatedText.value,
    defaultValue: animatedText.value,
  }));

  return (
    <AnimatedTextInput
      editable={false}
      underlineColorAndroid="transparent"
      style={[
        {
          padding: 0,
          margin: 0,
          // Remove any TextInput default styling
          borderWidth: 0,
        },
        style,
      ]}
      animatedProps={animatedProps}
    />
  );
};
