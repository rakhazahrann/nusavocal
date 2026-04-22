import React from "react";
import { SafeAreaView } from "react-native";
import { YStack } from "tamagui";

export interface ScreenProps {
  padded?: boolean;
  children?: React.ReactNode;
  style?: any;
  [key: string]: any;
}

export const Screen: React.FC<ScreenProps> = ({
  padded = true,
  style,
  children,
  ...props
}) => {
  return (
    <SafeAreaView style={[{ flex: 1, backgroundColor: "#F7F7F8" }, style]} {...props}>
      <YStack
        flex={1}
        paddingHorizontal={padded ? "$lg" : undefined}
        paddingTop={padded ? "$lg" : undefined}
      >
        {children}
      </YStack>
    </SafeAreaView>
  );
};
