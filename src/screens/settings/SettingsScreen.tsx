import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { ScreenWrapper } from "../../components/layout/ScreenWrapper";

export const SettingsScreen = ({ navigation }: any) => {
  return (
    <ScreenWrapper style={styles.container}>
      <Text style={styles.title}>⚙️ Settings</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Auth")}
      >
        <Text style={styles.buttonText}>Logout (Mock)</Text>
      </TouchableOpacity>
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
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#ef4444",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
