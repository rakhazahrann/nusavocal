import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { YStack, GetProps } from "tamagui";
import { ScreenWrapperProps } from "@/types/components";



export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  style,
  ...props
}) => {
  return (
    <SafeAreaView style={[{ flex: 1, backgroundColor: "#1a1a2e" }, style]}>
      <YStack flex={1} {...props}>
        {children}
      </YStack>
    </SafeAreaView>
  );
};
