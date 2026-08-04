import React, { useEffect } from "react";
import { StyleProp, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
  withDelay,
  SharedValue,
} from "react-native-reanimated";
import {
  motionDurations,
  motionEasings,
  springs,
  enterPresets,
  type EnterPreset,
} from "@/theme/motionTokens";
import { useSettingsStore } from "@/store/settingsStore";
import { EnterAnimatedViewProps } from "@/types/components";

interface EnhancedEnterProps extends EnterAnimatedViewProps {
  /** Animation preset (default: "fadeSlideUp") */
  preset?: EnterPreset;
  /** Delay before animation starts (ms) */
  delay?: number;
  /** Use spring physics instead of timing */
  useSpring?: boolean;
}

export const EnterAnimatedView: React.FC<EnhancedEnterProps> = ({
  children,
  style,
  preset = "fadeSlideUp",
  delay = 0,
  useSpring: useSpringAnim = false,
}) => {
  const reduceMotion = useSettingsStore((s) => s.reduceMotion);
  const config = enterPresets[preset];

  const opacity = useSharedValue<number>(reduceMotion ? 1 : (config.fromOpacity ?? 0));
  const translateY = useSharedValue<number>(
    reduceMotion ? 0 : ("fromTranslateY" in config ? config.fromTranslateY : 0)
  );
  const translateX = useSharedValue<number>(
    reduceMotion ? 0 : ("fromTranslateX" in config ? config.fromTranslateX : 0)
  );
  const scale = useSharedValue<number>(
    reduceMotion ? 1 : ("fromScale" in config ? config.fromScale : 1)
  );

  useEffect(() => {
    if (reduceMotion) {
      opacity.value = 1;
      translateY.value = 0;
      translateX.value = 0;
      scale.value = 1;
      return;
    }

    const animate = (toVal: number, shared: SharedValue<number>) => {
      if (useSpringAnim) {
        shared.value = withDelay(delay, withSpring(toVal, springs.gentle));
      } else {
        shared.value = withDelay(
          delay,
          withTiming(toVal, {
            duration: motionDurations.medium,
            easing: motionEasings.ios,
          })
        );
      }
    };

    // Opacity always uses timing for predictable feel
    opacity.value = withDelay(
      delay,
      withTiming(1, {
        duration: motionDurations.short,
        easing: motionEasings.default,
      })
    );

    animate(0, translateY);
    animate(0, translateX);
    animate(1, scale);
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
    <Animated.View style={[animatedStyle, style]}>{children}</Animated.View>
  );
};
