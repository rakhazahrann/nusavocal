import React, { useEffect, useRef } from "react";
import { StyleProp, ViewStyle, Animated, Easing } from "react-native";
import { motionDurations } from "@/theme/motionTokens";
import { EnterAnimatedViewProps } from "@/types/components";



/**
 * Web-specific enter animation using RN Animated API (no GSAP).
 */
export const EnterAnimatedView: React.FC<EnterAnimatedViewProps> = ({ children, style }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: motionDurations.short,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: motionDurations.short,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[{ opacity, transform: [{ translateY }] }, style]}>
      {children}
    </Animated.View>
  );
};
