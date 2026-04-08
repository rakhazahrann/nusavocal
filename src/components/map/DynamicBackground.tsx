import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const DynamicBackground = () => {
  return (
    <View style={styles.container}>
      {/* Base Background Color from Tailwind */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: "#f9f9f9" }]} />
      
      {/* Top Left Blob - Simplified to prevent sharp gradient box issues on Web */}
      <View style={[styles.blob, styles.topLeftBlob]} />

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
    opacity: 0.15,
  },
  topLeftBlob: {
    backgroundColor: "#e8e8e8",
    top: -100,
    left: -100,
    width: width * 0.8,
    height: width * 0.8,
  },
  bottomRightBlob: {
    backgroundColor: "#c6c6c6",
    bottom: -100,
    right: -100,
    width: width * 0.6,
    height: width * 0.6,
  },
  grainOverlay: {
    backgroundColor: "transparent",
  },
});

