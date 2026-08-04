/**
 * ConfettiOverlay — Celebration particle system
 *
 * Pure Reanimated implementation — no Lottie dependency needed.
 * Renders 40 animated particles that burst from top-center, fall with gravity
 * and rotation, then fade out.
 *
 * Usage:
 *   <ConfettiOverlay visible={showConfetti} onFinish={() => setShowConfetti(false)} />
 */
import React, { useEffect, useMemo } from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import { colors } from "@/constants/colors";

const PARTICLE_COUNT = 40;
const DURATION = 2200; // Total animation duration

// Confetti colors — warm, celebratory palette
const CONFETTI_COLORS = [
  colors.gold,
  colors.accent,
  colors.streak,
  colors.xp,
  "#FF6B8A",  // Rose
  "#4ECDC4",  // Teal
  colors.accentLight,
  "#FFE66D",  // Bright yellow
];

interface ParticleConfig {
  color: string;
  size: number;
  shape: "square" | "rect" | "circle";
  startX: number;
  endX: number;
  endY: number;
  rotation: number;
  delay: number;
}

const generateParticles = (screenWidth: number, screenHeight: number): ParticleConfig[] => {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => {
    const angle = (Math.random() - 0.5) * Math.PI * 0.8; // Spread angle
    const velocity = 300 + Math.random() * 500;
    const colorIdx = Math.floor(Math.random() * CONFETTI_COLORS.length);

    return {
      color: CONFETTI_COLORS[colorIdx],
      size: 6 + Math.random() * 8,
      shape: (["square", "rect", "circle"] as const)[Math.floor(Math.random() * 3)],
      startX: screenWidth * 0.5 + (Math.random() - 0.5) * 60,
      endX: screenWidth * 0.5 + Math.sin(angle) * velocity,
      endY: screenHeight * 0.3 + Math.random() * screenHeight * 0.7,
      rotation: Math.random() * 720 - 360,
      delay: Math.random() * 300,
    };
  });
};

// ── Single Particle ─────────────────────────────────────────────

interface ParticleProps {
  config: ParticleConfig;
}

const Particle: React.FC<ParticleProps> = ({ config }) => {
  const progress = useSharedValue(0);
  const fadeOut = useSharedValue(1);

  useEffect(() => {
    progress.value = withDelay(
      config.delay,
      withTiming(1, { duration: DURATION * 0.7, easing: Easing.out(Easing.quad) })
    );
    fadeOut.value = withDelay(
      config.delay + DURATION * 0.5,
      withTiming(0, { duration: DURATION * 0.5, easing: Easing.in(Easing.quad) })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const t = progress.value;
    // Quadratic gravity curve
    const x = config.startX + (config.endX - config.startX) * t;
    const y = -200 + config.endY * t * t; // Start from above, accelerate down
    const rotate = config.rotation * t;

    return {
      position: "absolute" as const,
      left: x,
      top: y,
      opacity: fadeOut.value,
      transform: [
        { rotate: `${rotate}deg` },
        { scale: 1 - t * 0.3 }, // Shrink slightly as they fall
      ],
      width: config.shape === "rect" ? config.size * 2.5 : config.size,
      height: config.size,
      borderRadius: config.shape === "circle" ? config.size / 2 : 2,
      backgroundColor: config.color,
    };
  });

  return <Animated.View style={animatedStyle} />;
};

// ── Main Overlay ────────────────────────────────────────────────

interface ConfettiOverlayProps {
  visible: boolean;
  onFinish?: () => void;
}

export const ConfettiOverlay: React.FC<ConfettiOverlayProps> = ({
  visible,
  onFinish,
}) => {
  const { width, height } = useWindowDimensions();

  const particles = useMemo(
    () => (visible ? generateParticles(width, height) : []),
    [visible, width, height]
  );

  useEffect(() => {
    if (visible && onFinish) {
      const timer = setTimeout(() => onFinish(), DURATION + 500);
      return () => clearTimeout(timer);
    }
  }, [visible, onFinish]);

  if (!visible) return null;

  return (
    <Animated.View style={styles.overlay} pointerEvents="none">
      {particles.map((p, i) => (
        <Particle key={i} config={p} />
      ))}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    overflow: "hidden",
  },
});
