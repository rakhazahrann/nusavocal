import React from "react";
import { StyleSheet, Image, View, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const Construction = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/under-contruction.jpg")}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a1a2e",
  },
  image: {
    width: width * 1.2,
    height: height * 1.2,
  },
});
