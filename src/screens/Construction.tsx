import React from "react";
import { StyleSheet, Text, Image, View } from "react-native";
import { ScreenWrapper } from "../components/common/ScreenWrapper";

export const Construction = ({ navigation }: any) => {
  return (
    <ScreenWrapper style={styles.container}>
      <Text style={styles.emoji}>🚧</Text>
      <Text style={styles.title}>Under Construction</Text>
      <Text style={styles.subtitle}>Halaman ini masih dalam pengembangan.</Text>
      <Text style={styles.subtitle}>Nantikan update selanjutnya!</Text>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    color: "#ffc947",
    fontWeight: "bold",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 14,
    color: "#a0a0b0",
    textAlign: "center",
    marginBottom: 4,
  },
});
