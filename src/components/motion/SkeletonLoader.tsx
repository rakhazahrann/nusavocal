/**
 * SkeletonLoader — Shimmer loading placeholder
 *
 * Replaces boring ActivityIndicator with a shimmer effect that matches
 * the shape of the content being loaded.
 *
 * Usage:
 *   <SkeletonLoader width={200} height={20} borderRadius={10} />
 *   <SkeletonLoader width="100%" height={60} borderRadius={16} />
 *   <SkeletonLoader variant="circle" size={48} />
 */
import React, { useEffect } from "react";
import { StyleSheet, View, useWindowDimensions, StyleProp, ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  interpolate,
} from "react-native-reanimated";
import { colors } from "@/constants/colors";

// ── Shimmer Bar ─────────────────────────────────────────────────

interface SkeletonLoaderProps {
  /** Width of the skeleton (number or "100%") */
  width?: number | `${number}%` | "100%";
  /** Height of the skeleton */
  height?: number;
  /** Border radius */
  borderRadius?: number;
  /** Circle variant — sets width/height to `size` */
  variant?: "rect" | "circle";
  /** Size for circle variant */
  size?: number;
  /** Custom style */
  style?: StyleProp<ViewStyle>;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = "100%",
  height = 16,
  borderRadius = 8,
  variant = "rect",
  size = 40,
  style,
}) => {
  const shimmerProgress = useSharedValue(0);
  const { width: screenWidth } = useWindowDimensions();

  useEffect(() => {
    shimmerProgress.value = withRepeat(
      withTiming(1, { duration: 1200, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const isCircle = variant === "circle";
  const resolvedWidth = isCircle ? size : width;
  const resolvedHeight = isCircle ? size : height;
  const resolvedRadius = isCircle ? size / 2 : borderRadius;

  const shimmerStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      shimmerProgress.value,
      [0, 1],
      [-screenWidth, screenWidth]
    );

    return {
      transform: [{ translateX }],
    };
  });

  return (
    <View
      style={[
        {
          width: resolvedWidth as any,
          height: resolvedHeight,
          borderRadius: resolvedRadius,
          backgroundColor: colors.parchment,
          overflow: "hidden",
        },
        style,
      ]}
    >
      <Animated.View style={[styles.shimmer, shimmerStyle]} />
    </View>
  );
};

// ── Skeleton Group Presets ───────────────────────────────────────

/** Pre-composed skeleton matching a leaderboard row */
export const SkeletonRow: React.FC<{ style?: StyleProp<ViewStyle> }> = ({ style }) => (
  <View style={[styles.row, style]}>
    <SkeletonLoader variant="circle" size={40} />
    <View style={styles.rowTexts}>
      <SkeletonLoader width="60%" height={14} borderRadius={6} />
      <SkeletonLoader width="40%" height={10} borderRadius={5} style={{ marginTop: 6 }} />
    </View>
    <SkeletonLoader width={48} height={20} borderRadius={10} />
  </View>
);

/** Pre-composed skeleton matching a score card */
export const SkeletonCard: React.FC<{ style?: StyleProp<ViewStyle> }> = ({ style }) => (
  <View style={[styles.card, style]}>
    <SkeletonLoader width={46} height={46} borderRadius={12} />
    <View style={styles.cardTexts}>
      <SkeletonLoader width="50%" height={12} borderRadius={6} />
      <SkeletonLoader width="30%" height={24} borderRadius={8} style={{ marginTop: 4 }} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  shimmer: {
    ...StyleSheet.absoluteFillObject,
    width: "80%",
    backgroundColor: "rgba(255,255,255,0.5)",
    // Diagonal gradient effect via transform
    transform: [{ skewX: "-20deg" }],
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  rowTexts: {
    flex: 1,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    gap: 16,
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  cardTexts: {
    flex: 1,
  },
});
