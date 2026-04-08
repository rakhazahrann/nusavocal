import React, { useEffect, useRef } from "react";
import { View, StyleSheet, TouchableOpacity, Modal, Animated } from "react-native";
import { BlurView } from "expo-blur";
import { Text } from "../ui";
import gsap from "gsap";

interface StagePopupProps {
  visible: boolean;
  stageId: number | null;
  label: string;
  description?: string;
  onCancel: () => void;
  onStart: (stageId: number) => void;
}

export const StagePopup: React.FC<StagePopupProps> = ({
  visible,
  stageId,
  label,
  description,
  onCancel,
  onStart,
}) => {
  const floatY = useRef(new Animated.Value(0)).current;
  const floatData = useRef({ y: 0 }).current;

  useEffect(() => {
    if (!visible) return;

    const tween = gsap.to(floatData, {
      y: -8,
      duration: 1.5,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      onUpdate: () => {
        floatY.setValue(floatData.y);
      },
    });

    return () => {
      tween.kill();
    };
  }, [visible, floatData, floatY]);

  if (!visible || stageId === null) return null;

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onCancel}>
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={onCancel}
      >
        <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
          <Animated.View style={[styles.popupCard, { transform: [{ translateY: floatY }] }]}>
            <BlurView intensity={80} tint="light" style={styles.blurContainer}>
              <View style={styles.content}>
                <View style={styles.header}>
                  <Text style={styles.title}>{label}</Text>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>UNIT {stageId}</Text>
                  </View>
                </View>
                
                <Text style={styles.description}>
                  {description || "Master common daily expressions and polite greetings."}
                </Text>

                <TouchableOpacity 
                  style={styles.startButton} 
                  activeOpacity={0.8}
                  onPress={() => onStart(stageId)}
                >
                  <Text style={styles.startText}>START LESSON</Text>
                </TouchableOpacity>
              </View>
              {/* Tooltip tail */}
              <View style={styles.tooltipTail} />
            </BlurView>
          </Animated.View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  popupCard: {
    width: 256, // matching w-64
    marginBottom: 100, // floating above the node
    shadowColor: "#1a1c1c",
    shadowOffset: { width: 0, height: 40 },
    shadowOpacity: 0.08,
    shadowRadius: 40,
    elevation: 10,
  },
  blurContainer: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(198,198,198,0.15)",
    overflow: "visible", // for tail
    backgroundColor: "rgba(255,255,255,0.8)",
  },
  content: {
    padding: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  title: {
    fontFamily: "SpaceGrotesk-Bold",
    fontSize: 18,
    letterSpacing: -0.5,
    color: "#000",
  },
  badge: {
    backgroundColor: "#e2e2e2", // surface-container-highest
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  badgeText: {
    fontFamily: "SpaceGrotesk-Bold",
    fontSize: 9,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: "#000",
  },
  description: {
    fontFamily: "SpaceGrotesk-Regular",
    fontSize: 14,
    lineHeight: 20,
    color: "#474747", // on-surface-variant
    marginBottom: 16,
  },
  startButton: {
    backgroundColor: "#000", // primary
    paddingVertical: 12,
    borderRadius: 9999,
    alignItems: "center",
  },
  startText: {
    fontFamily: "SpaceGrotesk-Bold",
    fontSize: 12,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: "#FFF",
  },
  tooltipTail: {
    position: "absolute",
    bottom: -8,
    left: "50%",
    marginLeft: -8,
    width: 16,
    height: 16,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "rgba(198,198,198,0.15)",
    transform: [{ rotate: "45deg" }],
  }
});

