import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { ScreenWrapper } from "../../components/layout/ScreenWrapper";

export const OverworldMapScreen = ({ navigation }: any) => {
  return (
    <ScreenWrapper style={styles.container}>
      <Text style={styles.title}>Map</Text>
      <TouchableOpacity
        style={styles.stageButton}
        onPress={() => navigation.navigate("Map", { screen: "StageBriefing" })}
      >
        <Text style={styles.buttonText}>Tap Stage 1</Text>
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
    fontSize: 20,
    color: "#fff",
    marginBottom: 20,
  },
  stageButton: {
    backgroundColor: "#4ade80",
    padding: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: "#1a1a2e",
    fontWeight: "bold",
  },
});
