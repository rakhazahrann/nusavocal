import React from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  Dimensions,
  Image,
} from "react-native";

const { width, height } = Dimensions.get("window");

interface AdventureBackgroundProps {
  children?: React.ReactNode;
}

export const AdventureBackground: React.FC<AdventureBackgroundProps> = ({
  children,
}) => {
  return (
    <View style={styles.container}>
      {/* Base Grass Layer (Tiled) */}
      <ImageBackground
        source={require("../../../assets/images/map/grass-tile.png")}
        style={StyleSheet.absoluteFill}
        resizeMode="repeat"
      >
        {/* Central Dirt Path */}
        <View style={styles.pathContainer}>
          <Image
            source={require("../../../assets/images/map/dirt-path.png")}
            style={styles.dirtPath}
            resizeMode="repeat"
          />
        </View>

        {/* Content */}
        <View style={styles.content}>{children}</View>

        {/* Console Frame Overlay */}
        <View style={styles.frameOverlay} pointerEvents="none" />
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#4CAF50",
  },
  pathContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
  },
  dirtPath: {
    width: 120,
    height: "100%",
    opacity: 0.9,
  },
  content: {
    flex: 1,
    zIndex: 1,
  },
  frameOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 20,
    borderColor: "rgba(0,0,0,0.8)",
    borderRadius: 40,
    margin: -10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 10,
  },
});
