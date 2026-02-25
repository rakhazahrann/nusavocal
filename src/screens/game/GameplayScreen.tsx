import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { ScreenWrapper } from "../../components/layout/ScreenWrapper";

export const GameplayScreen = ({ navigation }: any) => {
  return (
    <ScreenWrapper style={styles.container}>
      <Text style={styles.title}>Conversation Battle!</Text>
      <TouchableOpacity
        style={styles.winButton}
        onPress={() => navigation.replace("Result", { win: true })}
      >
        <Text style={styles.buttonText}>Simulate Win</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.loseButton}
        onPress={() => navigation.replace("Result", { win: false })}
      >
        <Text style={styles.buttonText}>Simulate Lose</Text>
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
  winButton: {
    backgroundColor: "#4ade80",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  loseButton: {
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
