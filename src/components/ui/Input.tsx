import React from "react";
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from "react-native";
import { colors, radius, spacing, typography } from "../../theme";
import { Text } from "./Text";

export interface InputProps extends TextInputProps {
  label?: string;
  helperText?: string;
  errorText?: string;
  containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  helperText,
  errorText,
  containerStyle,
  style,
  ...props
}) => {
  const hasError = Boolean(errorText);
  return (
    <View style={[styles.container, containerStyle]}>
      {label ? (
        <Text variant="caption" tone="muted" style={{ marginBottom: spacing.xs }}>
          {label}
        </Text>
      ) : null}

      <TextInput
        placeholderTextColor={colors.mutedText}
        style={[
          styles.input,
          hasError ? styles.inputError : null,
          style,
        ]}
        {...props}
      />

      {hasError ? (
        <Text variant="caption" tone="danger" style={{ marginTop: spacing.xs }}>
          {errorText}
        </Text>
      ) : helperText ? (
        <Text variant="caption" tone="muted" style={{ marginTop: spacing.xs }}>
          {helperText}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  input: {
    height: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.body,
    color: colors.text,
  },
  inputError: {
    borderColor: colors.danger,
  },
});
