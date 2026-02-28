import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ScreenWrapper } from "../components/common/ScreenWrapper";
import { TopBar } from "../components/common/TopBar";

export const HomeScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <TopBar />
      <ScreenWrapper style={styles.content}>
        <Text style={styles.title}>Map</Text>
        <TouchableOpacity
          style={styles.stageButton}
          onPress={() =>
            navigation.navigate("Map", { screen: "StageBriefing" })
          }
        >
          <Text style={styles.buttonText}>Tap Stage 1</Text>
        </TouchableOpacity>
      </ScreenWrapper>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 140, // Space for the top header
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
