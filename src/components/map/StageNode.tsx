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

const STAGE_CURRENT = require("../../../assets/images/building/bandara.png");
const STAGE_LOCKED = require("../../../assets/images/building/lock-stage.png");
const STAGE_COMPLETED = require("../../../assets/images/building/ojek-pengkolan.png");

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

  // LOGIKA POSISI BANGUNAN (Kiri atau Kanan)
  // Jika x < 0.5 (Jalan di kiri, index genap), geser bangunan ke kiri (-90)
  // Jika x >= 0.5 (Jalan di kanan, index ganjil), geser bangunan ke kanan (90)
  const isLeftSide = x < 0.5;
  const buildingOffsetX = isLeftSide ? -70 : 70;

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
          top: posY - 35, // Center vertically
        },
        animatedStyle,
      ]}
    >
      <TouchableOpacity
        onPress={status !== "locked" ? onPress : undefined}
        activeOpacity={status === "locked" ? 1 : 0.7}
        style={[
          styles.touchable,
          { transform: [{ translateX: buildingOffsetX }] },
        ]}
      >
        <View style={styles.imageContainer}>
          {/* Shadow Layer: Duplicate image with tint and offset */}
          <Image
            source={getStageImage(status)}
            style={[styles.stageImage, styles.shadow]}
            resizeMode="contain"
          />
          {/* Main Asset Layer */}
          <Image
            source={getStageImage(status)}
            style={styles.stageImage}
            resizeMode="contain"
          />
        </View>
        {/* Stage label (Berada di bawah asset building) */}
        <View style={styles.labelContainer}>
          <Text
            style={[styles.label, status === "locked" && styles.labelLocked]}
            numberOfLines={1}
          >
            {label.toUpperCase()}
          </Text>
          <Text
            style={[
              styles.stageNumber,
              status === "locked" && styles.labelLocked,
            ]}
          >
            (Stage {id})
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    // Center at posX, posY
    width: 200,
    marginLeft: -100,
    height: 150,
    marginTop: -75,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  touchable: {
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer: {
    width: 170,
    height: 170,
    position: "relative",
  },
  stageImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  shadow: {
    tintColor: "rgba(0,0,0,0.25)",
    top: 6, // Offset for depth
    left: 6,
  },
  labelContainer: {
    alignItems: "center",
    marginTop: -40,
  },
  label: {
    color: "#333", // Warna teks lebih gelap agar terlihat di rumput
    fontSize: 10,
    fontFamily: "PressStart2P_400Regular",
    textAlign: "center",
    textShadowColor: "rgba(255, 255, 255, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  stageNumber: {
    color: "#444",
    fontSize: 8,
    fontFamily: "PressStart2P_400Regular",
    textAlign: "center",
    marginTop: 2,
  },
  labelLocked: {
    color: "#999",
  },
});
