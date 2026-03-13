import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  ImageBackground,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { PixelText } from "../../components/common/PixelText";
import { useGameStore } from "../../stores/gameStore";

export const VocabFarmingScreen = ({ navigation, route }: any) => {
  const { stageId } = route?.params || {};
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);

  const { currentVocabQuestions, fetchVocabQuestions, isLoading } = useGameStore();

  useEffect(() => {
    if (stageId) {
      fetchVocabQuestions(stageId);
    }
  }, [stageId]);

  const currentQuestion = currentVocabQuestions[currentQuestionIndex];
  const options = currentQuestion?.options || [];

  // Fallback data when no DB data
  const fallbackOptions = [
    "LOREM IPSUM",
    "LOREM IPSUM",
    "LOREM IPSUM",
    "LOREM IPSUM",
  ];

  const handleNext = () => {
    // Check if answer is correct
    if (selectedOption !== null && currentQuestion) {
      const selectedOpt = options[selectedOption];
      if (selectedOpt?.is_correct) {
        setScore(score + 1);
      }
    }

    // Move to next question or go to game screen
    if (currentQuestionIndex < currentVocabQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
    } else {
      // All questions done, go to game screen
      navigation.replace("Gameplay", { stageId, vocabScore: score });
    }
  };

  const displayOptions = options.length > 0
    ? options.map(o => o.option_text)
    : fallbackOptions;

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#f48c25" />
        <PixelText size={10} color="#5B4434" style={{ marginTop: 16 }}>
          LOADING VOCAB...
        </PixelText>
      </SafeAreaView>
    );
  }

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

        {/* Progress indicator */}
        {currentVocabQuestions.length > 0 && (
          <View style={styles.progressContainer}>
            <PixelText family="pixelify" weight="600" size={12} color="#5B4434">
              {currentQuestionIndex + 1} / {currentVocabQuestions.length}
            </PixelText>
          </View>
        )}
      </View>

      <View style={styles.content}>
        {/* Placeholder for Image */}
        <View style={styles.imagePlaceholder}>
          {currentQuestion?.image_url ? (
            <Image
              source={{ uri: currentQuestion.image_url }}
              style={{ width: "100%", height: "100%", borderRadius: 16 }}
              resizeMode="contain"
            />
          ) : (
            <PixelText style={styles.placeholderText}>Airplane Placeholder</PixelText>
          )}
        </View>

        {/* Question Text */}
        <View style={styles.questionContainer}>
          <PixelText family="pixelify" weight="600" size={18} style={styles.questionText}>
            {currentQuestion?.question_text || "LOREM IPSUM ....."}
          </PixelText>
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {displayOptions.map((option, index) => {
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
          onPress={handleNext}
          disabled={selectedOption === null}
        >
          <Image
            source={require("../../../assets/images/game/next-button.png")}
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
    backgroundColor: "#F9E8D1",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 10,
  },
  backButton: {},
  backIcon: {
    width: 50,
    height: 50,
  },
  progressContainer: {
    backgroundColor: "rgba(93, 58, 26, 0.1)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 2,
    borderColor: "#5D3A1A",
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
    overflow: "hidden",
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
    paddingBottom: 5,
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
