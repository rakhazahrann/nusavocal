import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ScreenWrapper } from "../../components/layout/ScreenWrapper";

export const LeaderboardScreen = () => {
  return (
    <ScreenWrapper style={styles.container}>
      <Text style={styles.title}>🏆 Leaderboard</Text>
      <View style={styles.list}>
        <Text style={styles.row}>1. Budi - Lvl 10</Text>
        <Text style={styles.row}>2. Siti - Lvl 9</Text>
        <Text style={styles.row}>3. Anton - Lvl 9</Text>
      </View>
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
    color: "#ffc947",
    marginBottom: 30,
  },
  list: {
    width: "80%",
  },
  row: {
    color: "#fff",
    fontSize: 18,
    marginVertical: 5,
  },
});
