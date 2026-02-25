import React from "react";
import { SafeAreaView, StyleSheet, ViewProps } from "react-native";

interface ScreenWrapperProps extends ViewProps {
  children: React.ReactNode;
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  style,
  ...props
}) => {
  return (
    <SafeAreaView style={[styles.container, style]} {...props}>
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e", // Deep Navy background from design system
  },
});
