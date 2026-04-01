import React from "react";
import { SafeAreaView, StyleSheet, View, ViewProps } from "react-native";
import { colors, spacing } from "../../theme";

export interface ScreenProps extends ViewProps {
  padded?: boolean;
}

export const Screen: React.FC<ScreenProps> = ({ padded = true, style, children, ...props }) => {
  return (
    <SafeAreaView style={[styles.safeArea, style]} {...props}>
      <View style={[styles.inner, padded ? styles.padded : null]}>{children}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  inner: {
    flex: 1,
  },
  padded: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
});
