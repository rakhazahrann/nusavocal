import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ImageBackground,
  SafeAreaView,
} from "react-native";
import { PixelText } from "../../components/common/PixelText";

export const VocabFarmingScreen = ({ navigation }: any) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const options = [
    "LOREM IPSUM",
    "LOREM IPSUM",
    "LOREM IPSUM",
    "LOREM IPSUM",
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Image
            source={require("../../../assets/images/game/back-button.png")}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Placeholder for Airplane Image */}
        <View style={styles.imagePlaceholder}>
          <PixelText style={styles.placeholderText}>Airplane Placeholder</PixelText>
        </View>

        {/* Question Text */}
        <View style={styles.questionContainer}>
          <PixelText family="pixelify" weight="600" size={18} style={styles.questionText}>LOREM IPSUM .....</PixelText>
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {options.map((option, index) => {
            const isSelected = selectedOption === index;
            const bgSource = isSelected
              ? require("../../../assets/images/game/selected-bar.png")
              : require("../../../assets/images/game/unselected-bar.png");

            return (
              <TouchableOpacity
                key={index}
                activeOpacity={0.8}
                onPress={() => setSelectedOption(index)}
                style={styles.optionButton}
              >
                <ImageBackground
                  source={bgSource}
                  style={styles.optionBackground}
                  resizeMode="stretch"
                >
                  <PixelText
                    style={[
                      styles.optionText,
                      isSelected && styles.selectedOptionText,
                    ]}
                    family="pixelify"
                    weight="500"
                    size={16}
                    color={isSelected ? "#412414" : "#FFFFFF"}
                    shadow={!isSelected}
                  >
                    {option}
                  </PixelText>
                </ImageBackground>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Footer Area for Next Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.nextButtonContainer,
            selectedOption === null && styles.hidden,
          ]}
          onPress={() => navigation.replace("Gameplay")}
          disabled={selectedOption === null}
        >
          <Image
            source={require("../../../assets/images/stage/next-button.png")}
            style={styles.nextIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9E8D1", // Used exact color from user feedback
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    alignItems: "flex-start",
    zIndex: 10,
  },
  backButton: {
    // Intentionally empty according to user request
  },
  backIcon: {
    width: 50,
    height: 50,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    alignItems: "center",
  },
  imagePlaceholder: {
    width: 250,
    height: 150,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 40,
    borderWidth: 2,
    borderColor: "rgba(0,0,0,0.1)",
    borderStyle: "dashed",
  },
  placeholderText: {
    color: "#8a7a6a",
    fontWeight: "bold",
  },
  questionContainer: {
    width: "100%",
    alignItems: "flex-start",
    marginBottom: 20,
    paddingLeft: 10,
  },
  questionText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#5B4434",
    letterSpacing: 0.5,
    textAlign: "left",
  },
  optionsContainer: {
    width: "100%",
    gap: 16,
    alignItems: "center",
  },
  optionButton: {
    width: "100%",
    maxWidth: 320,
    height: 60,
  },
  optionBackground: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 5, // Fine-tuned for pixel art bar alignment
  },
  optionText: {
    letterSpacing: 0,
    textAlign: "center",
  },
  selectedOptionText: {
    textShadowColor: "transparent",
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    alignItems: "flex-end",
    justifyContent: "center",
    height: 100,
  },
  nextButtonContainer: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  hidden: {
    opacity: 0,
  },
  nextIcon: {
    width: 100,
    height: 45,
  },
});
