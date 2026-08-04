/**
 * ShimmerButton — Premium CTA with gradient sweep animation
 *
 * A call-to-action button with a periodic light-streak sweep (like Duolingo's "Start" button).
 * Combines gradient background + animated shimmer + press micro-interaction.
 *
 * Usage:
 *   <ShimmerButton label="START LESSON" onPress={handleStart} />
 *   <ShimmerButton label="Continue" icon="arrow-forward" variant="dark" />
 */
import React, { useEffect } from "react";
import { StyleSheet, Text, View, StyleProp, ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  withSequence,
  interpolate,
  Easing,
  withSpring,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, gradients } from "@/constants/colors";
import { springs, motionDurations } from "@/theme/motionTokens";
import { useSettingsStore } from "@/store/settingsStore";

interface ShimmerButtonProps {
  label: string;
  onPress?: () => void;
  icon?: keyof typeof MaterialIcons.glyphMap;
  disabled?: boolean;
  variant?: "accent" | "dark" | "gold";
  style?: StyleProp<ViewStyle>;
  /** Shimmer interval in ms (default: 3000) */
  shimmerInterval?: number;
}

export const ShimmerButton: React.FC<ShimmerButtonProps> = ({
  label,
  onPress,
  icon,
  disabled = false,
  variant = "accent",
  style,
  shimmerInterval = 3000,
}) => {
  const reduceMotion = useSettingsStore((s) => s.reduceMotion);
  const shimmerProgress = useSharedValue(-1);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  // Periodic shimmer sweep
  useEffect(() => {
    if (reduceMotion || disabled) return;

    shimmerProgress.value = withRepeat(
      withSequence(
        withDelay(shimmerInterval, withTiming(-1, { duration: 0 })),
        withTiming(2, { duration: 600, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      false
    );
  }, [reduceMotion, disabled, shimmerInterval]);

  const handlePressIn = () => {
    if (reduceMotion) return;
    scale.value = withTiming(0.97, { duration: motionDurations.micro });
    opacity.value = withTiming(0.9, { duration: motionDurations.micro });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, springs.press);
    opacity.value = withSpring(1, springs.press);
  };

  // Shimmer light streak
  const shimmerStyle = useAnimatedStyle(() => {
    const translateXPercent = interpolate(
      shimmerProgress.value,
      [-1, 0, 1, 2],
      [-100, -50, 50, 150]
    );
    const opacityVal = interpolate(
      shimmerProgress.value,
      [-1, 0, 0.5, 1, 2],
      [0, 0.4, 0.6, 0.4, 0]
    );

    return {
      transform: [{ translateX: translateXPercent }],
      opacity: opacityVal,
    };
  });

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: disabled ? 0.5 : opacity.value,
  }));

  const gradientColors = {
    accent: gradients.accent as unknown as [string, string],
    dark: ["#1A2024", "#0D1210"] as [string, string],
    gold: gradients.gold as unknown as [string, string],
  }[variant];

  const textColor = variant === "gold" ? colors.navy : "#FFFFFF";

  return (
    <Animated.View style={[containerStyle, style]}>
      <Animated.View style={styles.pressable}>
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <View
            style={styles.content}
            onTouchStart={handlePressIn}
            onTouchEnd={() => {
              handlePressOut();
              if (!disabled && onPress) onPress();
            }}
            onTouchCancel={handlePressOut}
          >
            <Text style={[styles.label, { color: textColor }]}>{label}</Text>
            {icon && (
              <MaterialIcons
                name={icon}
                size={20}
                color={textColor}
                style={{ marginLeft: 8 }}
              />
            )}
          </View>

          {/* Shimmer streak overlay */}
          <Animated.View style={[styles.shimmerStreak, shimmerStyle]} />
        </LinearGradient>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  pressable: {
    borderRadius: 18,
    overflow: "hidden",
    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  gradient: {
    position: "relative",
    overflow: "hidden",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    paddingHorizontal: 32,
  },
  label: {
    fontFamily: "Poppins-Bold",
    fontSize: 16,
    letterSpacing: 1,
  },
  shimmerStreak: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: "40%",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    transform: [{ skewX: "-20deg" }],
  },
});
