import React from "react";
import { Image, StyleSheet, StyleProp, ImageStyle } from "react-native";

const BOOK_ICON = require("../../../assets/ui/icon/book-icon.png");

const DEFAULT_SIZE = 42;

interface NavBookIconProps {
  size?: number;
  style?: StyleProp<ImageStyle>;
}

export const NavBookIcon: React.FC<NavBookIconProps> = ({
  size = DEFAULT_SIZE,
  style,
}) => {
  return (
    <Image
      source={BOOK_ICON}
      style={[{ width: size, height: size }, style]}
      resizeMode="contain"
    />
  );
};
