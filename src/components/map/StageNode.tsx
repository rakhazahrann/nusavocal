import React, { useEffect, useRef } from "react";
import { View, StyleSheet, TouchableOpacity, Animated } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { StageStatus, getStageX, getStageY, STAGE_NODE_SIZE } from "../../constants/stageLayout";
import { Text } from "../ui";
import gsap from "gsap";

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

  // React Native Animated values for GSAP to drive
  const scale = useRef(new Animated.Value(1)).current;
  const pingScale = useRef(new Animated.Value(1)).current;
  const pingOpacity = useRef(new Animated.Value(0.15)).current;

  // Refs for GSAP to mutate directly before syncing to Animated
  const scaleData = useRef({ s: 1 }).current;
  const pingData = useRef({ s: 1, o: 0.15 }).current;

  useEffect(() => {
    let pingTween: gsap.core.Tween | null = null;
    
    if (status === "current") {
      // Create a pulsating ("berdebar") heartbeat effect
      pingTween = gsap.to(pingData, {
        s: 1.7,
        o: 0,
        duration: 1.4,
        repeat: -1,
        ease: "sine.out",
        onUpdate: () => {
          pingScale.setValue(pingData.s);
          pingOpacity.setValue(pingData.o);
        },
      });
    }

    return () => {
      if (pingTween) pingTween.kill();
    };
  }, [status]);

  const handlePressIn = () => {
    gsap.to(scaleData, {
      s: 0.9,
      duration: 0.2,
      ease: "power2.out",
      onUpdate: () => scale.setValue(scaleData.s),
    });
  };

  const handlePressOut = () => {
    gsap.to(scaleData, {
      s: 1,
      duration: 0.4,
      ease: "elastic.out(1.2, 0.5)",
      onUpdate: () => scale.setValue(scaleData.s),
    });
  };

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
          <Animated.View style={[styles.pingRing, { 
            transform: [{ scale: pingScale }], 
            opacity: pingOpacity 
          }]} />
          
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
        { transform: [{ scale: scale }] }
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
    width: 100, 
    height: 120, 
  },
  node: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  completedNode: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.6)",
    borderWidth: 1,
    borderColor: "rgba(198,198,198,0.15)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.03,
    shadowRadius: 40,
    elevation: 3,
  },
  currentNode: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#000", 
    borderWidth: 4,
    borderColor: "#FFF", 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  currentHalo: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  lockedNode: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(243,243,243,0.4)", 
    borderWidth: 1,
    borderColor: "rgba(198,198,198,0.1)",
  },
  pingRing: {
    position: "absolute",
    top: 12, // (120 - 96) / 2
    left: 2, // (100 - 96) / 2
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: "rgba(0,0,0,0.18)",
    backgroundColor: "transparent",
  },
  labelCompleted: {
    position: "absolute",
    bottom: -16,
    fontFamily: "SpaceGrotesk-Bold",
    fontSize: 10,
    letterSpacing: 2,
    textTransform: "uppercase",
    opacity: 0.4,
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
  },
});

