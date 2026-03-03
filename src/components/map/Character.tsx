import React, { useEffect } from "react";
import { StyleSheet, Image } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from "react-native-reanimated";

const MAN_CHARA = require("../../../assets/images/characters/man-chara.png");
const MAN_WALK = require("../../../assets/images/characters/man-walk.png");

interface CharacterProps {
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  isWalking: boolean;
  scaleX?: number; // 1 for right, -1 for left
}

export const Character: React.FC<CharacterProps> = ({
  startX,
  startY,
  targetX,
  targetY,
  isWalking,
  scaleX = 1,
}) => {
  // Simple hop animation when walking
  const hopAnim = useSharedValue(0);
  const progress = useSharedValue(1); // 1 = standing at target

  useEffect(() => {
    if (isWalking) {
      progress.value = 0;
      progress.value = withTiming(1, {
        duration: 1500,
        easing: Easing.linear, // Smooth, consistent speed along the curve
      });
    } else {
      progress.value = 1;
    }
  }, [isWalking, startX, startY, targetX, targetY]);

  useEffect(() => {
    if (isWalking) {
      hopAnim.value = withRepeat(
        withSequence(
          withTiming(-4, { duration: 150, easing: Easing.out(Easing.quad) }),
          withTiming(0, { duration: 150, easing: Easing.in(Easing.quad) }),
        ),
        -1,
        true,
      );
    } else {
      hopAnim.value = withTiming(0, { duration: 100 });
    }
  }, [isWalking]);

  const animatedStyle = useAnimatedStyle(() => {
    const t = progress.value;
    const u = 1 - t;
    const tt = t * t;
    const uu = u * u;
    const uuu = uu * u;
    const ttt = tt * t;

    // Control points to match the SVG line (S-Curve)
    const midY = (startY + targetY) / 2;
    const cp1x = startX;
    const cp1y = midY;
    const cp2x = targetX;
    const cp2y = midY;

    // Cubic Bezier interpolation
    const currentX =
      uuu * startX + 3 * uu * t * cp1x + 3 * u * tt * cp2x + ttt * targetX;
    const currentY =
      uuu * startY + 3 * uu * t * cp1y + 3 * u * tt * cp2y + ttt * targetY;

    return {
      left: currentX,
      top: currentY,
      transform: [
        { scaleX }, // Face left or right
        { translateY: hopAnim.value },
      ],
    };
  });

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Image
        source={isWalking ? MAN_WALK : MAN_CHARA}
        style={styles.sprite}
        resizeMode="contain"
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: 48,
    height: 48,
    marginLeft: -24, // Center horizontally on coordinate
    marginTop: -48, // Place bottom of character at coordinate (assuming coordinate is the stage center)
    alignItems: "center",
    justifyContent: "flex-end",
    zIndex: 10, // Ensure character is above stages
  },
  sprite: {
    width: 48,
    height: 48,
  },
});
