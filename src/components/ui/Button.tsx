import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  ViewStyle,
  PressableProps,
} from "react-native";
import { colors, radius, spacing, typography } from "../../theme";
import { Text } from "./Text";
import { useSettingsStore } from "../../stores/settingsStore";

export type ButtonVariant = "primary" | "secondary" | "ghost";

export interface ButtonProps extends Omit<PressableProps, "style"> {
  label: string;
  variant?: ButtonVariant;
  loading?: boolean;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  variant = "primary",
  loading = false,
  disabled,
  style,
  ...props
}) => {
  const reduceMotion = useSettingsStore((s) => s.reduceMotion);
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        variantStyles[variant],
        isDisabled && styles.disabled,
        !reduceMotion && pressed && !isDisabled ? styles.pressed : null,
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === "primary" ? "#fff" : colors.text} />
      ) : (
        <Text
          variant="label"
          weight="semibold"
          tone={variant === "primary" ? "default" : "default"}
          style={{
            color: variant === "primary" ? "#FFFFFF" : colors.text,
            fontFamily: typography.fontFamily.semibold,
          }}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
};

const variantStyles: Record<ButtonVariant, ViewStyle> = {
  primary: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  secondary: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  ghost: {
    backgroundColor: "transparent",
    borderColor: "transparent",
  },
};

const styles = StyleSheet.create({
  base: {
    height: 48,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.6,
  },
});
