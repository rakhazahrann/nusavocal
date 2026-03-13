import React from "react";
import { View, StyleSheet, ViewProps, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface WoodPanelProps extends ViewProps {
  children: React.ReactNode;
  innerPadding?: number;
  outerStyle?: ViewStyle;
  variant?: "wood" | "light";
}

export const WoodPanel: React.FC<WoodPanelProps> = ({
  children,
  innerPadding = 24,
  outerStyle,
  variant = "wood",
  style,
  ...props
}) => {
  const isLight = variant === "light";

  return (
    <View style={[styles.wrapper, outerStyle]} {...props}>
      {/* Absolute Pixel Corners Background */}
      <View
        style={[
          StyleSheet.absoluteFill,
          styles.pixelOutline,
          isLight && styles.lightOutline,
        ]}
      />

      {/* Main Texture Layer */}
      <View
        style={[
          styles.textureContainer,
          isLight && styles.lightTextureContainer,
        ]}
      >
        {!isLight && (
          <LinearGradient
            colors={["#5d3a1a", "#4e3015", "#5d3a1a", "#4e3015"]}
            locations={[0, 0.33, 0.66, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        )}

        {/* Inner Content Area */}
        <View
          style={[
            styles.innerArea,
            isLight && styles.lightInnerArea,
            { padding: innerPadding },
            style,
          ]}
        >
          {children}
        </View>

        {/* Decorative Screws */}
        <View
          style={[
            styles.screw,
            isLight && styles.lightScrew,
            { top: 8, left: 8 },
          ]}
        />
        <View
          style={[
            styles.screw,
            isLight && styles.lightScrew,
            { top: 8, right: 8 },
          ]}
        />
        <View
          style={[
            styles.screw,
            isLight && styles.lightScrew,
            { bottom: 8, left: 8 },
          ]}
        />
        <View
          style={[
            styles.screw,
            isLight && styles.lightScrew,
            { bottom: 8, right: 8 },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    position: "relative",
    padding: 4,
  },
  pixelOutline: {
    backgroundColor: "#3e2723",
    borderRadius: 8,
  },
  lightOutline: {
    backgroundColor: "#5D3A1A", // Dark brown for light theme high contrast
  },
  textureContainer: {
    flex: 1,
    backgroundColor: "#5d3a1a",
    borderWidth: 4,
    borderColor: "#8b5a2b",
    borderRadius: 6,
    padding: 16, // Redundant due to innerArea, let's keep it tidy
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 0,
    elevation: 5,
  },
  lightTextureContainer: {
    backgroundColor: "#FDF4E7", // Soft cream background
    borderColor: "#D1C4B5",
    shadowOpacity: 0.2,
  },
  innerArea: {
    flex: 1,
    backgroundColor: "#e6dcc3",
    borderRadius: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 0,
    elevation: 1,
    borderWidth: 2,
    borderColor: "rgba(0,0,0,0.1)",
  },
  lightInnerArea: {
    backgroundColor: "#FFFFFF",
    borderColor: "#5D3A1A",
    borderWidth: 2,
    shadowOpacity: 0.1,
  },
  screw: {
    position: "absolute",
    width: 6,
    height: 6,
    backgroundColor: "#3e2723",
    borderRadius: 3,
  },
  lightScrew: {
    backgroundColor: "#D1C4B5",
  },
});

function insetShadowFallback(value: number) {
  return value;
}
