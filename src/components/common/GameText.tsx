import React from "react";
import { Text, TextStyle } from "react-native";
import { GameTextProps } from "@/types/components";

const fontFamilyByWeight: Record<NonNullable<GameTextProps["weight"]>, string> = {
  "300": "Poppins-Light",
  "400": "Poppins-Regular",
  "500": "Poppins-Medium",
  "600": "Poppins-SemiBold",
  "700": "Poppins-Bold",
};

export const GameText: React.FC<GameTextProps> = ({
  children,
  style,
  color = "#3e2723", // default text color
  size = 12,
  family = "game",
  weight = "400",
  shadow = false,
  ...props
}) => {
  const fontFamily = fontFamilyByWeight[weight];

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
          lineHeight: family === "game" ? size * 1.5 : undefined,
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
