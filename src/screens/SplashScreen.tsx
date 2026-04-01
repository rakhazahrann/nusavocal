import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Screen, Text } from "../components/ui";
import { colors, spacing } from "../theme";
import { useAuthStore } from "../stores/authStore";
import { EnterAnimatedView } from "../motion/EnterAnimatedView";

export default function SplashScreen({ navigation }: any) {
  const { session, profile, isInitialized } = useAuthStore();

  useEffect(() => {
    if (!isInitialized) return; // Wait for auth to initialize

    const timer = setTimeout(() => {
      if (session && profile?.role === "admin") {
        navigation.replace("Main");
      } else if (session && profile?.gender && profile?.nickname) {
        // Fully authenticated user with complete profile
        navigation.replace("Main");
      } else if (session && !profile?.gender) {
        // Authenticated but needs character selection
        navigation.replace("Auth", {
          screen: "CharacterSelect",
        });
      } else if (session && profile?.gender && !profile?.nickname) {
        // Authenticated but needs nickname
        navigation.replace("Auth", {
          screen: "ProfileCreation",
          params: { characterId: profile?.character_id || "ira" },
        });
      } else {
        // Not authenticated
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
    backgroundColor: colors.background,
  },
});
