import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { ScreenWrapper } from "../../components/layout/ScreenWrapper";

export const StageBriefingScreen = ({ navigation }: any) => {
  return (
    <ScreenWrapper style={styles.container}>
      <Text style={styles.title}>Stage 1: Pangkalan Ojek</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("VocabFarming")}
      >
        <Text style={styles.buttonText}>Belajar Vocab Dulu</Text>
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
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#0f3460",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
