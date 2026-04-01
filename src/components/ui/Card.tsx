import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { colors, radius, spacing } from "../../theme";

export interface CardProps extends ViewProps {
  padded?: boolean;
}

export const Card: React.FC<CardProps> = ({ padded = true, style, ...props }) => {
  return (
    <View
      style={[styles.base, padded ? styles.padded : null, style]}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  padded: {
    padding: spacing.lg,
  },
});
