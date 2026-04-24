import React, { useEffect } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { StageStatus } from "@/types/constants";
import { getStageX, getStageY, STAGE_NODE_SIZE } from "@/constants/stageLayout";
import { Text } from "@/components/ui/Text";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";

interface StageNodeProps {
  id: number;
  x: number;
  stageIndex: number;
  label: string;
  status: StageStatus;
  onPress: () => void;
  onDelete?: () => void;
}

export const StageNode: React.FC<StageNodeProps> = ({ id, x, stageIndex, label, status, onPress, onDelete }) => {
  const top = getStageY(stageIndex) - STAGE_NODE_SIZE / 2;
  const left = getStageX(x) - STAGE_NODE_SIZE / 2;

  // Reanimated shared values
  const scale = useSharedValue(1);
  const pingScale = useSharedValue(1);
  const pingOpacity = useSharedValue(0.15);

  useEffect(() => {
    if (status === "current") {
      // Pulsating "heartbeat" effect using Reanimated
      pingScale.value = withRepeat(
        withTiming(1.7, { duration: 1400, easing: Easing.out(Easing.sin) }),
        -1, // infinite repeat
        false // don't reverse
      );
      pingOpacity.value = withRepeat(
        withTiming(0, { duration: 1400, easing: Easing.out(Easing.sin) }),
        -1,
        false
      );
    } else {
      pingScale.value = 1;
      pingOpacity.value = 0.15;
    }
  }, [status]);

  const handlePressIn = () => {
    scale.value = withTiming(0.9, { duration: 200, easing: Easing.out(Easing.quad) });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10, stiffness: 200 });
  };

  const scaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const pingStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pingScale.value }],
    opacity: pingOpacity.value,
  }));

  const renderVisuals = () => {
    if (status === "completed") {
      return (
        <View style={styles.nodeWrapper}>
          <View style={[styles.node, styles.completedNode]}>
            <MaterialIcons name="check-circle" size={32} color="#000" />
          </View>
          <Text style={styles.labelCompleted}>{label}</Text>
        </View>
      );
    }

    if (status === "current") {
      return (
        <View style={styles.nodeWrapper}>
          <View style={styles.currentHalo} />
          <Animated.View style={[styles.pingRing, pingStyle]} />
          
          <View style={[styles.node, styles.currentNode]}>
            <MaterialIcons name="play-arrow" size={36} color="#FFF" />
          </View>
          <Text style={styles.labelCurrent}>NEXT LESSON</Text>
        </View>
      );
    }

    // Locked status
    return (
      <View style={[styles.nodeWrapper, { opacity: 0.4 }]}>
        <View style={[styles.node, styles.lockedNode]}>
          <MaterialIcons name="lock" size={24} color="#777" />
        </View>
        <Text style={styles.labelLocked}>{label}</Text>
      </View>
    );
  };

  return (
    <Animated.View
      style={[
        styles.absoluteContainer,
        { top, left, width: STAGE_NODE_SIZE, height: STAGE_NODE_SIZE },
        scaleStyle,
      ]}
    >
      <TouchableOpacity
        style={styles.touchable}
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        onLongPress={onDelete}
        disabled={status === "locked"}
      >
        {renderVisuals()}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  absoluteContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  touchable: {
    alignItems: "center",
    justifyContent: "center",
  },
  nodeWrapper: {
    alignItems: "center",
    justifyContent: "center",
    width: 120, // Increased to provide better hit area
    height: 140, 
  },
  node: {
    alignItems: "center",
    justifyContent: "center",
  },
  completedNode: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#FFFFFF", // Use solid white to prevent octagon glitch
    borderWidth: 2,
    borderColor: "rgba(0,0,0,0.05)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  currentNode: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#000000", 
    borderWidth: 4,
    borderColor: "#FFFFFF", 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  currentHalo: {
    position: "absolute",
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  lockedNode: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#F1F1F1", 
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    opacity: 0.6,
  },
  pingRing: {
    position: "absolute",
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 2,
    borderColor: "rgba(0,0,0,0.2)",
    backgroundColor: "transparent",
  },
  labelCompleted: {
    position: "absolute",
    bottom: -18,
    fontFamily: "SpaceGrotesk-Bold",
    fontSize: 10,
    letterSpacing: 2,
    textTransform: "uppercase",
    opacity: 0.6,
    textAlign: "center",
  },
  labelLocked: {
    position: "absolute",
    bottom: 8,
    fontFamily: "SpaceGrotesk-Bold",
    fontSize: 10,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  labelCurrent: {
    position: "absolute",
    bottom: -10,
    fontFamily: "SpaceGrotesk-Bold",
    fontSize: 11,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: "#000",
    textAlign: "center",
  },
});
