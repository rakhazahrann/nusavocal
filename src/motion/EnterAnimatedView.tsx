import React, { useEffect } from "react";
import { StyleProp, ViewStyle } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { motionDurations } from "./tokens";
import { useSettingsStore } from "../stores/settingsStore";

export interface EnterAnimatedViewProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const EnterAnimatedView: React.FC<EnterAnimatedViewProps> = ({ children, style }) => {
  const reduceMotion = useSettingsStore((s) => s.reduceMotion);
  const opacity = useSharedValue(reduceMotion ? 1 : 0);
  const translateY = useSharedValue(reduceMotion ? 0 : 12);

  useEffect(() => {
    if (reduceMotion) {
      opacity.value = 1;
      translateY.value = 0;
      return;
    }

    opacity.value = withTiming(1, {
      duration: motionDurations.short,
      easing: Easing.out(Easing.quad),
    });
    translateY.value = withTiming(0, {
      duration: motionDurations.short,
      easing: Easing.out(Easing.quad),
    });
  }, [reduceMotion]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <Animated.View style={[animatedStyle, style]}>{children}</Animated.View>
  );
};
