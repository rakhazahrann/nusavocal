import React from "react";
import { View, StyleSheet, ViewProps, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface WoodPanelProps extends ViewProps {
  children: React.ReactNode;
  innerPadding?: number;
  outerStyle?: ViewStyle;
}

export const WoodPanel: React.FC<WoodPanelProps> = ({
  children,
  innerPadding = 24,
  outerStyle,
  style,
  ...props
}) => {
  return (
    <View style={[styles.wrapper, outerStyle]} {...props}>
      {/* Absolute Pixel Corners Background (Dark Brown Outline) */}
      <View style={[StyleSheet.absoluteFill, styles.pixelOutline]} />

      {/* Wood Texture Layer */}
      <View style={styles.woodTextureContainer}>
        <LinearGradient
          colors={["#5d3a1a", "#4e3015", "#5d3a1a", "#4e3015"]}
          locations={[0, 0.33, 0.66, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        {/* Inner Parchment Area */}
        <View style={[styles.innerParchment, { padding: innerPadding }, style]}>
          {children}
        </View>

        {/* Decorative Screws */}
        <View style={[styles.screw, { top: 8, left: 8 }]} />
        <View style={[styles.screw, { top: 8, right: 8 }]} />
        <View style={[styles.screw, { bottom: 8, left: 8 }]} />
        <View style={[styles.screw, { bottom: 8, right: 8 }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    position: "relative",
    padding: 4, // Space for the outline
  },
  pixelOutline: {
    backgroundColor: "#3e2723", // Darkest brown border
    margin: 0,
    // Simulating pixel corners by removing corners (clipPath isn't standard in React Native View,
    // so we approximate or use borders. A simple border-radius is more robust natively unless using SVG)
    borderRadius: 8,
  },
  woodTextureContainer: {
    backgroundColor: "#5d3a1a",
    borderWidth: 4,
    borderColor: "#8b5a2b",
    borderRadius: 6,
    padding: 24, // Matches web padding
    overflow: "hidden", // Keep gradient inside
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 0,
    elevation: 5,
  },
  innerParchment: {
    backgroundColor: "#e6dcc3", // Light beige parchment color
    borderRadius: 4,
    // Pixel inset shadow approximation
    shadowColor: "#000",
    shadowOffset: {
      width: insetShadowFallback(4),
      height: insetShadowFallback(4),
    },
    shadowOpacity: 0.2,
    shadowRadius: 0,
    elevation: 1,
    borderWidth: 2,
    borderColor: "rgba(0,0,0,0.1)", // inset alternative
  },
  screw: {
    position: "absolute",
    width: 8,
    height: 8,
    backgroundColor: "#3e2723",
    borderRadius: 4,
  },
});

function insetShadowFallback(value: number) {
  // Inset shadows string is not natively supported like CSS `inset`,
  // we use standard shadow or inner views if critical.
  return value;
}
