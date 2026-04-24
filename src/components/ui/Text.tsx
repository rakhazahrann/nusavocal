import React from "react";
import { StyleProp, TextStyle } from "react-native";
import { Text as TamaguiText } from "tamagui";
import { TextVariant, TextTone, TextWeight, AppTextProps } from "@/types/components";








const variantMap: Record<TextVariant, { fontSize: number; lineHeight: number }> = {
  hero: { fontSize: 32, lineHeight: 40 },
  title: { fontSize: 24, lineHeight: 32 },
  subtitle: { fontSize: 18, lineHeight: 26 },
  body: { fontSize: 16, lineHeight: 24 },
  label: { fontSize: 14, lineHeight: 20 },
  caption: { fontSize: 12, lineHeight: 16 },
};

const toneColorMap: Record<TextTone, string> = {
  default: "$color",
  muted: "$colorMuted",
  accent: "$colorAccent",
  danger: "$colorDanger",
  success: "$colorSuccess",
};

const weightValueMap: Record<TextWeight, "400" | "500" | "600" | "700"> = {
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
};

const familyMap: Record<TextVariant, "$heading" | "$body"> = {
  hero: "$heading",
  title: "$heading",
  subtitle: "$heading",
  body: "$body",
  label: "$body",
  caption: "$body",
};

export const Text: React.FC<AppTextProps> = ({
  variant = "body",
  tone = "default",
  weight = "regular",
  style,
  children,
  ...props
}) => {
  const v = variantMap[variant];
  const toneColor = toneColorMap[tone];

  return (
    <TamaguiText
      fontSize={v.fontSize}
      lineHeight={v.lineHeight}
      color={toneColor as any}
      fontFamily={familyMap[variant]}
      fontWeight={weightValueMap[weight]}
      style={style}
      {...props}
    >
      {children}
    </TamaguiText>
  );
};
