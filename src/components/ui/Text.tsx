import React from "react";
import { StyleSheet, Text as RNText, TextProps, TextStyle } from "react-native";
import { colors, typography } from "../../theme";

export type TextVariant =
  | "hero"
  | "title"
  | "subtitle"
  | "body"
  | "label"
  | "caption";

export interface AppTextProps extends TextProps {
  variant?: TextVariant;
  tone?: "default" | "muted" | "accent" | "danger" | "success";
  weight?: "regular" | "medium" | "semibold" | "bold";
}

const variantStyle: Record<TextVariant, TextStyle> = {
  hero: { fontSize: typography.size.hero, lineHeight: 40 },
  title: { fontSize: typography.size.title, lineHeight: 32 },
  subtitle: { fontSize: typography.size.subtitle, lineHeight: 26 },
  body: { fontSize: typography.size.body, lineHeight: 24 },
  label: { fontSize: typography.size.label, lineHeight: 20 },
  caption: { fontSize: typography.size.caption, lineHeight: 16 },
};

const toneColor = {
  default: colors.text,
  muted: colors.mutedText,
  accent: colors.accent,
  danger: colors.danger,
  success: colors.success,
} as const;

const weightFamily = {
  regular: typography.fontFamily.regular,
  medium: typography.fontFamily.medium,
  semibold: typography.fontFamily.semibold,
  bold: typography.fontFamily.bold,
} as const;

export const Text: React.FC<AppTextProps> = ({
  variant = "body",
  tone = "default",
  weight = "regular",
  style,
  ...props
}) => {
  return (
    <RNText
      style={[
        styles.base,
        variantStyle[variant],
        { color: toneColor[tone], fontFamily: weightFamily[weight] },
        style,
      ]}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  base: {
    color: colors.text,
  },
});
