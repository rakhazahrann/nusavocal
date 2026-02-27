import React from "react";
import {
  Image,
  ImageSourcePropType,
  StyleProp,
  ImageStyle,
} from "react-native";

interface GameIconProps {
  source: ImageSourcePropType;
  size?: number;
  width?: number;
  height?: number;
  style?: StyleProp<ImageStyle>;
}

export const GameIcon: React.FC<GameIconProps> = ({
  source,
  size = 32,
  width,
  height,
  style,
}) => {
  return (
    <Image
      source={source}
      style={[
        { width: width || size, height: height || size, overflow: "visible" },
        style,
      ]}
      resizeMode="contain"
    />
  );
};
