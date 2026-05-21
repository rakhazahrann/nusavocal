import React, { useRef, useEffect } from "react";
import { Animated } from "react-native";
import { colors } from "@/constants/colors";

export const WaveBar = ({ h, active, d }: { h: number; active: boolean; d: number }) => {
  const a = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (active) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(a, { toValue: 1.8, duration: 350, delay: d, useNativeDriver: true }),
          Animated.timing(a, { toValue: 1, duration: 350, useNativeDriver: true }),
        ])
      ).start();
    } else {
      a.setValue(1);
    }
  }, [active]);

  return (
    <Animated.View
      style={{
        width: 3,
        height: h * 4,
        borderRadius: 2,
        marginHorizontal: 3,
        backgroundColor: active ? colors.success : colors.gray,
        transform: [{ scaleY: a }],
      }}
    />
  );
};
