import React from "react";
import { TextInput, TextInputProps, ViewStyle } from "react-native";
import { YStack } from "tamagui";
import { Text } from "./Text";
import { colors, radius, spacing, typography } from "../../theme";

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
    <YStack width="100%" style={containerStyle}>
      {label ? (
        <Text
          variant="caption"
          tone="muted"
          style={{ marginBottom: spacing.xs }}
        >
          {label}
        </Text>
      ) : null}

      <TextInput
        placeholderTextColor={colors.mutedText}
        style={[
          {
            height: 48,
            borderRadius: radius.md,
            borderWidth: 1,
            borderColor: hasError ? colors.danger : colors.border,
            backgroundColor: colors.surface,
            paddingHorizontal: spacing.md,
            fontFamily: typography.fontFamily.regular,
            fontSize: typography.size.body,
            color: colors.text,
          },
          style,
        ]}
        {...props}
      />

      {hasError ? (
        <Text
          variant="caption"
          tone="danger"
          style={{ marginTop: spacing.xs }}
        >
          {errorText}
        </Text>
      ) : helperText ? (
        <Text
          variant="caption"
          tone="muted"
          style={{ marginTop: spacing.xs }}
        >
          {helperText}
        </Text>
      ) : null}
    </YStack>
  );
};
