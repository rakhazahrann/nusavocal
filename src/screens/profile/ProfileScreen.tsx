import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { ScreenWrapper } from "../../components/layout/ScreenWrapper";

export const ProfileScreen = ({ navigation }: any) => {
  return (
    <ScreenWrapper style={styles.container}>
      <Text style={styles.title}>👤 Profile</Text>
      <Text style={styles.subtitle}>Level 3 — Pedagang</Text>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    color: "#fff",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#a0a0b0",
  },
});
