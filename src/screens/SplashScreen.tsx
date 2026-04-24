import { colors } from "@/constants/colors";
import { spacing } from "@/constants/spacing";
import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Screen } from "@/components/ui/Screen";
import { Text } from "@/components/ui/Text";

import { useAuthStore } from "@/store/authStore";
import { EnterAnimatedView } from "@/components/motion/EnterAnimatedView";

export const SplashScreen = ({ navigation }: any) => {
  const { session, profile, isInitialized } = useAuthStore();

  useEffect(() => {
    if (!isInitialized) return; // Wait for auth to initialize

    const timer = setTimeout(() => {
      if (session && profile?.nickname) {
        navigation.replace("Main");
      } else if (session) {
        navigation.replace("Auth", {
          screen: "ProfileCreation" });
      } else {
        navigation.replace("Auth");
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [isInitialized, navigation]);

  return (
    <Screen padded={false}>
      <View style={styles.container}>
        <EnterAnimatedView>
          <Text variant="hero" weight="bold">
            NusaVocal
          </Text>
          <Text variant="body" tone="muted" style={{ marginTop: spacing.sm }}>
            Loading...
          </Text>

          <ActivityIndicator
            size="small"
            color={colors.accent}
            style={{ marginTop: spacing.lg }}
          />
        </EnterAnimatedView>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: colors.background } });
