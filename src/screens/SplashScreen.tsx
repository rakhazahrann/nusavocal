import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { Screen } from "@/components/ui/Screen";
import { Text } from "@/components/ui/Text";
import { EnterAnimatedView } from "@/components/motion/EnterAnimatedView";
import { colors } from "@/constants/colors";
import { useAuthStore } from "@/store/authStore";

export const SplashScreen = ({ navigation }: any) => {
  const { session, profile, isInitialized } = useAuthStore();

  useEffect(() => {
    if (!isInitialized) return;

    const timer = setTimeout(() => {
      if (session && profile?.nickname) {
        navigation.replace("Main");
      } else if (session) {
        navigation.replace("Auth", {
          screen: "ProfileCreation",
        });
      } else {
        navigation.replace("Auth");
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [isInitialized, navigation]);

  return (
    <Screen padded={false}>
      <View className="flex-1 items-center justify-center bg-background">
        <EnterAnimatedView>
          <Text variant="hero" weight="bold">
            NusaVocal
          </Text>
          <Text variant="body" tone="muted" className="mt-sm">
            Loading...
          </Text>

          <ActivityIndicator size="small" color={colors.accent} className="mt-lg" />
        </EnterAnimatedView>
      </View>
    </Screen>
  );
};
