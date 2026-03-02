import React from "react";
import { StyleSheet, Image, TouchableOpacity, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  useSharedValue,
  Easing,
} from "react-native-reanimated";
import {
  StageStatus,
  STAGE_NODE_SIZE,
  getStageX,
  getStageY,
} from "../../constants/stageLayout";

const STAGE_CURRENT = require("../../../assets/images/map/stage-current.png");
const STAGE_LOCKED = require("../../../assets/images/map/stage-locked.png");
const STAGE_COMPLETED = require("../../../assets/images/map/stage-completed.png");

interface StageNodeProps {
  id: number;
  x: number;
  stageIndex: number;
  label: string;
  status: StageStatus;
  onPress?: () => void;
}

const getStageImage = (status: StageStatus) => {
  switch (status) {
    case "completed":
      return STAGE_COMPLETED;
    case "current":
      return STAGE_CURRENT;
    case "locked":
    default:
      return STAGE_LOCKED;
  }
};

export const StageNode: React.FC<StageNodeProps> = ({
  id,
  x,
  stageIndex,
  label,
  status,
  onPress,
}) => {
  const posX = getStageX(x);
  const posY = getStageY(stageIndex);

  // Bounce animation for the current stage
  const bounceAnim = useSharedValue(0);

  React.useEffect(() => {
    if (status === "current") {
      bounceAnim.value = withRepeat(
        withSequence(
          withTiming(-8, { duration: 600, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 600, easing: Easing.inOut(Easing.ease) }),
        ),
        -1, // infinite
        false,
      );
    }
  }, [status]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: bounceAnim.value }],
    };
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          left: posX,
          top: posY - STAGE_NODE_SIZE / 2,
        },
        animatedStyle,
      ]}
    >
      <TouchableOpacity
        onPress={status !== "locked" ? onPress : undefined}
        activeOpacity={status === "locked" ? 1 : 0.7}
        style={styles.touchable}
      >
        <Image
          source={getStageImage(status)}
          style={styles.stageImage}
          resizeMode="contain"
        />
        {/* Stage label */}
        <View style={styles.labelContainer}>
          <Text
            style={[styles.label, status === "locked" && styles.labelLocked]}
            numberOfLines={1}
          >
            {label}
          </Text>
          <Text
            style={[
              styles.stageNumber,
              status === "locked" && styles.labelLocked,
            ]}
          >
            Stage {id}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: STAGE_NODE_SIZE,
    alignItems: "center",
  },
  touchable: {
    alignItems: "center",
  },
  stageImage: {
    width: STAGE_NODE_SIZE,
    height: STAGE_NODE_SIZE,
  },
  labelContainer: {
    marginTop: 4,
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.55)",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    minWidth: STAGE_NODE_SIZE + 20,
  },
  label: {
    color: "#fff",
    fontSize: 10,
    fontFamily: "PressStart2P_400Regular",
    textAlign: "center",
  },
  stageNumber: {
    color: "#fbbf24",
    fontSize: 8,
    fontFamily: "PressStart2P_400Regular",
    textAlign: "center",
    marginTop: 2,
  },
  labelLocked: {
    color: "#888",
  },
});
