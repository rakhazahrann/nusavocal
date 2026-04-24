import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Text,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useGameStore } from "@/store/gameStore";
import { OptionCard } from "@/components/glass/OptionCard";
import { ProgressBar } from "@/components/glass/ProgressBar";

export const VocabFarmingScreen = ({ navigation, route }: any) => {
  const { stageId } = route?.params || {};
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const scoreRef = useRef(0);

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
    { option_text: "LOREM IPSUM", is_correct: false },
    { option_text: "LOREM IPSUM", is_correct: false },
    { option_text: "LOREM IPSUM", is_correct: true },
    { option_text: "LOREM IPSUM", is_correct: false },
  ];

  const handleNext = () => {
    let newScore = scoreRef.current;

    // Check if answer is correct
    if (selectedOption !== null && currentQuestion) {
      const selectedOpt = options[selectedOption];
      if (selectedOpt?.is_correct) {
        newScore = newScore + 1;
        scoreRef.current = newScore;
        setScore(newScore);
      }
    }

    // Move to next question or go to game screen
    if (currentQuestionIndex < currentVocabQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
    } else {
      navigation.replace("Gameplay", { stageId, vocabScore: newScore });
    }
  };

  const displayOptions = options.length > 0 ? options : fallbackOptions;
  const progress = currentVocabQuestions.length > 0 
    ? (currentQuestionIndex + 1) / currentVocabQuestions.length 
    : 0;

  if (isLoading) {
    return (
      <LinearGradient colors={["#ffffff", "#f0f0f0"]} style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000000" />
        <Text style={styles.loadingText}>Loading Vocabulary...</Text>
      </LinearGradient>
    );
  }

  const optionLabels = ["A", "B", "C", "D"];

  return (
    <LinearGradient colors={["#ffffff", "#f0f0f0"]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Top Navigation Shell */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <BlurView intensity={45} tint="light" style={styles.backButtonGlass}>
              <MaterialIcons name="arrow-back" size={24} color="#000000" />
            </BlurView>
          </TouchableOpacity>

          <View style={styles.progressWrapper}>
            <ProgressBar progress={progress} />
          </View>

          <Text style={styles.progressText}>
            {currentQuestionIndex + 1}/{currentVocabQuestions.length || 1}
          </Text>
        </View>

        {/* Main Canvas */}
        <ScrollView 
          style={styles.mainCanvas} 
          contentContainerStyle={styles.mainCanvasContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Word Card */}
          <View style={styles.heroSection}>
            <View style={styles.heroImageWrapper}>
              <BlurView intensity={40} tint="light" style={styles.heroImageGlass}>
                <Image
                  source={{
                    uri: currentQuestion?.image_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuBavv2QuspPsPz6xkb1pEQ7nGtD6GCoI4KOw-N_8cd9WjnOMY3VLdomQaOqrq2NCRSFEBkFpwILd04pFE3CKMnFGtwUxTc0r30oqIz3Q2qqXVYP3gqLGAWeQXiqdcaSybBWhuw5tuLlxwVxwKXxKtfvuS_Sok3SVWR8sjsyx0EN8HsMp2_wnfy3b7lPtc7awt3f0KrG8Ze0shAQRXczh16BXiSeYc4xpzro8wYDCWNPx0cxfQljUkBkGRdLtj4lEwYcmkJDvkg15X0Z",
                  }}
                  style={styles.heroImage}
                  resizeMode="contain"
                />
              </BlurView>
            </View>

            <View style={styles.titleSection}>
              <Text style={styles.titleText}>
                {currentQuestion?.question_text || "Buku"}
              </Text>
              <Text style={styles.subtitleText}>PICK THE CORRECT TRANSLATION</Text>
            </View>
          </View>

          {/* Multiple Choice Bento Grid */}
          <View style={styles.optionsSection}>
            {displayOptions.map((option, index) => (
              <OptionCard
                key={index}
                label={optionLabels[index] || ""}
                text={option.option_text}
                isSelected={selectedOption === index}
                onPress={() => setSelectedOption(index)}
              />
            ))}
          </View>
        </ScrollView>

        {/* Sticky Action Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.nextStepButton,
              selectedOption === null && styles.nextStepButtonDisabled
            ]}
            onPress={handleNext}
            disabled={selectedOption === null}
            activeOpacity={0.8}
          >
            <Text style={styles.nextStepText}>Next Step</Text>
            <MaterialIcons name="keyboard-arrow-right" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Phonetic Accent Highlight Background */}
        <View pointerEvents="none" style={styles.bgAccentContainer}>
          <Text style={styles.bgAccentText} numberOfLines={1}>
            NUSA
          </Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontFamily: "SpaceGrotesk-Medium",
    fontSize: 16,
    color: "#121212",
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 8,
    width: "100%",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
  },
  backButtonGlass: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.45)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)",
  },
  progressWrapper: {
    flex: 1,
    paddingHorizontal: 24,
  },
  progressText: {
    fontFamily: "SpaceGrotesk-Bold",
    fontSize: 20,
    color: "#000000",
    letterSpacing: -0.5,
  },
  mainCanvas: {
    flex: 1,
    zIndex: 10,
  },
  mainCanvasContent: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    alignItems: "center",
  },
  heroSection: {
    width: "100%",
    alignItems: "center",
    marginBottom: 16,
  },
  heroImageWrapper: {
    width: 130,
    height: 130,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    ...Platform.select({
      android: {
        backgroundColor: "rgba(255,255,255,0.8)",
      }
    })
  },
  heroImageGlass: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "rgba(255, 255, 255, 0.45)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)",
  },
  heroImage: {
    width: "100%",
    height: "100%",
    // In React Native we can't easily do mix-blend-multiply without SVG/special views
    // but the image provided has a white-ish background so it will integrate reasonably.
  },
  titleSection: {
    alignItems: "center",
  },
  titleText: {
    fontFamily: "SpaceGrotesk-Bold",
    fontSize: 32,
    color: "#121212",
    letterSpacing: -1,
    marginBottom: 2,
    textAlign: "center",
    ...(Platform.OS === 'android' ? { lineHeight: 38 } : {}),
  },
  subtitleText: {
    fontFamily: "SpaceGrotesk-Medium",
    fontSize: 12,
    color: "rgba(18, 18, 18, 0.6)",
    letterSpacing: 2.5,
    textTransform: "uppercase",
  },
  optionsSection: {
    width: "100%",
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    paddingBottom: Platform.OS === 'ios' ? 12 : 8,
    width: "100%",
    zIndex: 10,
    backgroundColor: "transparent",
  },
  nextStepButton: {
    height: 58,
    backgroundColor: "#000000",
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 15,
  },
  nextStepButtonDisabled: {
    opacity: 0.5,
  },
  nextStepText: {
    fontFamily: "SpaceGrotesk-Bold",
    fontSize: 18,
    color: "#ffffff",
    marginRight: 8,
  },
  bgAccentContainer: {
    position: "absolute",
    top: "50%",
    right: -60,
    transform: [{ translateY: -120 }, { rotate: "90deg" }],
    opacity: 0.03,
    zIndex: 0,
  },
  bgAccentText: {
    fontFamily: "SpaceGrotesk-Bold",
    fontSize: 200,
    color: "#000000",
    lineHeight: 200,
  },
});
