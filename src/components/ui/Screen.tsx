import * as React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { cn } from "@/lib/utils";
import { ScreenProps } from "@/types/components";

function Screen({ padded = true, style, className, children, ...props }: ScreenProps) {
  return (
    <SafeAreaView className="bg-background flex-1" style={style} {...props}>
      <View className={cn("flex-1", padded && "px-lg pt-lg", className)}>{children}</View>
    </SafeAreaView>
  );
}

export { Screen };
