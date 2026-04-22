import React from "react";
import { SafeAreaView, StyleProp, ViewStyle } from "react-native";
import { YStack, GetProps } from "tamagui";

export type ScreenWrapperProps = Omit<GetProps<typeof YStack>, "children" | "style"> & {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

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
