import React from "react";
import { Image, StyleSheet, StyleProp, ImageStyle } from "react-native";

const MAP_ICON = require("../../../assets/ui/icon/map-icon.png");

// Default size tuned to look good on the navbar
const DEFAULT_SIZE = 48;

interface NavMapIconProps {
  size?: number;
  style?: StyleProp<ImageStyle>;
}

export const NavMapIcon: React.FC<NavMapIconProps> = ({
  size = DEFAULT_SIZE,
  style,
}) => {
  return (
    <Image
      source={MAP_ICON}
      style={[{ width: size, height: size }, style]}
      resizeMode="contain"
    />
  );
};
