import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenWrapperProps } from "@/types/components";



export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  style,
  ...props
}) => {
  return (
    <SafeAreaView style={[{ flex: 1, backgroundColor: "#1a1a2e" }, style]}>
      <View style={{ flex: 1 }} {...props}>
        {children}
      </View>
    </SafeAreaView>
  );
};
