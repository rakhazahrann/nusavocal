import React from "react";
import { View, StyleSheet, useWindowDimensions } from "react-native";
import { colors } from "@/constants/colors";

export const DynamicBackground = () => {
  const { width } = useWindowDimensions();
  return (
    <View style={styles.container}>
      {/* Base Background Color from global tokens */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.background }]} />
      
      {/* Top Left Blob */}
      <View style={[styles.blob, styles.topLeftBlob, { width: width * 0.8, height: width * 0.8 }]} />

      {/* Bottom Right Blob */}
      <View style={[styles.blob, styles.bottomRightBlob, { width: width * 0.6, height: width * 0.6 }]} />

      {/* Subtle Grain Overlay approximation */}
      <View style={[StyleSheet.absoluteFill, styles.grainOverlay]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: -20, // Sit far behind everything
    overflow: "hidden",
  },
  blob: {
    position: "absolute",
    borderRadius: 9999, // Perfect circle
    opacity: 0.12,
  },
  topLeftBlob: {
    backgroundColor: colors.accent,
    top: -100,
    left: -100,
  },
  bottomRightBlob: {
    backgroundColor: colors.gold,
    bottom: -100,
    right: -100,
  },
  grainOverlay: {
    backgroundColor: "transparent",
  },
});

