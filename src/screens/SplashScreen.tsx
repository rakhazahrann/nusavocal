import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ScreenWrapper } from "../components/common/ScreenWrapper";

export default function SplashScreen({ navigation }: any) {
  useEffect(() => {
    // Navigate to Login after a short delay
    const timer = setTimeout(() => {
      navigation.replace("Auth");
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <ScreenWrapper style={styles.container}>
      <Text style={styles.title}>NusaVocal</Text>
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
