import React from "react";
import { Image, StyleSheet, StyleProp, ImageStyle } from "react-native";

const PLAYER_ICON = require("../../../assets/ui/icon/player-icon.png");

const DEFAULT_SIZE = 42;

interface NavPlayerIconProps {
  size?: number;
  style?: StyleProp<ImageStyle>;
}

export const NavPlayerIcon: React.FC<NavPlayerIconProps> = ({
  size = DEFAULT_SIZE,
  style,
}) => {
  return (
    <Image
      source={PLAYER_ICON}
      style={[{ width: size, height: size }, style]}
      resizeMode="contain"
    />
  );
};
