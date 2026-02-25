import React from "react";
import { Text, TextProps, StyleSheet, TextStyle } from "react-native";

interface PixelTextProps extends TextProps {
  color?: string;
  size?: number;
  family?: "pixel" | "display";
  weight?: "300" | "400" | "500" | "600" | "700";
  shadow?: boolean;
}

export const PixelText: React.FC<PixelTextProps> = ({
  children,
  style,
  color = "#3e2723", // default text color
  size = 12,
  family = "pixel",
  weight = "400",
  shadow = false,
  ...props
}) => {
  let fontFamily = "PressStart2P-Regular";

  if (family === "display") {
    switch (weight) {
      case "300":
        fontFamily = "SpaceGrotesk-Light";
        break;
      case "500":
        fontFamily = "SpaceGrotesk-Medium";
        break;
      case "600":
        fontFamily = "SpaceGrotesk-SemiBold";
        break;
      case "700":
        fontFamily = "SpaceGrotesk-Bold";
        break;
      default:
        fontFamily = "SpaceGrotesk-Regular";
        break;
    }
  }

  const shadowStyle: TextStyle = shadow
    ? {
        textShadowColor: "rgba(0, 0, 0, 0.5)",
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 0,
      }
    : {};

  return (
    <Text
      style={[
        {
          fontFamily,
          fontSize: size,
          color,
          lineHeight: family === "pixel" ? size * 1.5 : undefined,
        },
        shadowStyle,
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};
