import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { ScreenWrapper } from "../../components/common/ScreenWrapper";

export const VocabFarmingScreen = ({ navigation }: any) => {
  return (
    <ScreenWrapper style={styles.container}>
      <Text style={styles.title}>Vocab Farming</Text>
      <Text style={styles.word}>Ongkos = Tarif</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.replace("Gameplay")}
      >
        <Text style={styles.buttonText}>Lanjut Skenario</Text>
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
  word: {
    fontSize: 24,
    color: "#ffc947",
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
