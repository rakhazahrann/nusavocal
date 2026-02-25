import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { ScreenWrapper } from "../../components/layout/ScreenWrapper";

export const ResultScreen = ({ route, navigation }: any) => {
  const isWin = route.params?.win;

  return (
    <ScreenWrapper style={styles.container}>
      <Text style={styles.title}>
        {isWin ? "✨ Stage Clear! ✨" : "💀 Game Over 💀"}
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.popToTop()}
      >
        <Text style={styles.buttonText}>Kembali ke Peta</Text>
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
