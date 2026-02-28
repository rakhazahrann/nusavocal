import React from "react";
import { Image, StyleSheet, Dimensions } from "react-native";

const BAR_BG = require("../../../assets/images/bar.png");

// The bar.png is a wide horizontal wood plank (~5:1 aspect ratio)
// We make it fill the full screen width and calculate the height proportionally
const SCREEN_WIDTH = Dimensions.get("window").width;
const BAR_ASPECT_RATIO = 5; // approximate width:height ratio of bar.png
const BAR_HEIGHT = SCREEN_WIDTH / BAR_ASPECT_RATIO;

interface NavBarBackgroundProps {
  style?: object;
}

export const NavBarBackground: React.FC<NavBarBackgroundProps> = ({
  style,
}) => {
  return (
    <Image source={BAR_BG} style={[styles.bar, style]} resizeMode="stretch" />
  );
};

const styles = StyleSheet.create({
  bar: {
    width: SCREEN_WIDTH,
    height: BAR_HEIGHT,
    position: "absolute",
    bottom: 0,
    left: 0,
  },
});

export { BAR_HEIGHT, SCREEN_WIDTH };
