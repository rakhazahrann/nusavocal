import React, { useEffect } from "react";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { ScreenWrapper } from "../components/common/ScreenWrapper";
import { useAuthStore } from "../stores/authStore";

export default function SplashScreen({ navigation }: any) {
  const { session, profile, isInitialized } = useAuthStore();

  useEffect(() => {
    if (!isInitialized) return; // Wait for auth to initialize

    const timer = setTimeout(() => {
      if (session && profile?.role === "admin") {
        // Admin user → go to admin panel
        navigation.replace("Admin");
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
    <ScreenWrapper style={styles.container}>
      <Text style={styles.title}>NusaVocal</Text>
      <ActivityIndicator
        size="small"
        color="#f48c25"
        style={{ marginTop: 16 }}
      />
      <Text style={styles.subtitle}>Loading...</Text>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a1a2e",
  },
  title: {
    fontSize: 24,
    color: "#e94560",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    color: "#a0a0b0",
    marginTop: 10,
  },
});
