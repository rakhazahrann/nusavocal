import React from "react";
import { Image, StyleSheet, StyleProp, ImageStyle } from "react-native";

const CUP_ICON = require("../../../assets/ui/icon/cup-icon.png");

const DEFAULT_SIZE = 42;

interface NavCupIconProps {
  size?: number;
  style?: StyleProp<ImageStyle>;
}

export const NavCupIcon: React.FC<NavCupIconProps> = ({
  size = DEFAULT_SIZE,
  style,
}) => {
  return (
    <Image
      source={CUP_ICON}
      style={[{ width: size, height: size }, style]}
      resizeMode="contain"
    />
  );
};
