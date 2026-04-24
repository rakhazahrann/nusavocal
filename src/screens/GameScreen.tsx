import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Animated,
  Platform,
  useWindowDimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useGameStore } from "@/store/gameStore";
import { GameScenario } from "@/types/store";
import { useVoiceRecognition } from "@/hooks/useVoiceRecognition";
import { getMatchScore } from "@/utils/scoring";



// Placeholder modern background (Airport check-in counter style)
const FALLBACK_BGURI = "https://images.unsplash.com/photo-1569629743817-70d8db6c323b?auto=format&fit=crop&q=80&w=1200";
const DEFAULT_TARGET_PHRASE = "Tentu, ini dia.";
const SPEECH_LOCALE = "id-ID";
export const GameScreen = ({ navigation, route }: any) => {
  const { stageId, vocabScore = 0 } = route?.params || {};
  const { currentScenarios, fetchGameScenarios, isLoading } = useGameStore();
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const {
    isRecording,
    isProcessing,
    transcription,
    finalResults,
    speechError,
    isVoiceAvailable,
    startRecording,
    stopRecording,
    resetTranscription
  } = useVoiceRecognition();

  const [hasEvaluated, setHasEvaluated] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [speakingScore, setSpeakingScore] = useState(0);

  // Pulse animation for mic
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scenarioRef = useRef<GameScenario | null>(null);

  useEffect(() => {
    if (stageId) {
      fetchGameScenarios(stageId);
    }
  }, [stageId]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.08, duration: 1200, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
      ])
    ).start();
  }, [pulseAnim]);

  const scenario: GameScenario | null = currentScenarios[currentScenarioIndex] || null;
  scenarioRef.current = scenario;

  const targetPhrase = useMemo(
    () => scenario?.expected_voice_text?.trim() || DEFAULT_TARGET_PHRASE,
    [scenario]
  );
  const backgroundSource = scenario?.background_image_url || FALLBACK_BGURI;
  const totalScenarios = currentScenarios.length || 1;
  const isLastScenario = currentScenarioIndex >= totalScenarios - 1;
  const canAdvance = hasEvaluated && isCorrect;

  const resetAttemptState = () => {
    resetTranscription();
    setHasEvaluated(false);
    setIsCorrect(false);
  };

  const evaluateTranscript = (spokenText: string) => {
    const expected = scenarioRef.current?.expected_voice_text?.trim() || DEFAULT_TARGET_PHRASE;
    const cleaned = spokenText.trim();
    const score = getMatchScore(cleaned, expected);
    const passed = score >= 0.74;

    setHasEvaluated(true);
    setIsCorrect(passed);
  };

  useEffect(() => {
    if (finalResults && !isRecording && !isProcessing) {
      evaluateTranscript(finalResults);
    }
  }, [finalResults, isRecording, isProcessing]);

  useEffect(() => {
    resetAttemptState();
  }, [currentScenarioIndex, stageId]);

  const handleMicPress = async () => {
    if (!isVoiceAvailable) return;

    if (isRecording) {
      await stopRecording();
    } else {
      setHasEvaluated(false);
      setIsCorrect(false);
      await startRecording(SPEECH_LOCALE);
    }
  };

  const handleContinue = () => {
    if (!canAdvance) return;

    const nextScore = speakingScore + 1;
    setSpeakingScore(nextScore);

    if (!isLastScenario) {
      setCurrentScenarioIndex((prev) => prev + 1);
      return;
    }

    navigation.replace("Result", {
      win: true,
      stageId,
      vocabScore,
      gameScore: nextScore,
    });
  };

  const instructionText = isProcessing
    ? "MEMPROSES UCAPAN..."
    : isRecording
      ? "KETUK LAGI UNTUK SELESAI"
      : hasEvaluated && !isCorrect
        ? "COBA UCAPKAN LAGI"
        : hasEvaluated && isCorrect
          ? "UCAPAN SUDAH SESUAI"
          : "TEKAN UNTUK MERESPON";

  const { height } = useWindowDimensions();

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={styles.loadingText}>Memuat Skenario...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      
      {/* TOP HALF: SCENARIO WINDOW */}
      <View style={[styles.imageContainer, { height: height * 0.38 }]}>
        {/* We can also apply an overlay that desaturates slightly but black/white UI is enough for monochrome */}
        <Image 
          source={{ uri: backgroundSource }} 
          style={styles.scenarioImage} 
        />
        <LinearGradient 
          colors={['rgba(0,0,0,0.6)', 'transparent', 'rgba(0,0,0,0.4)']} 
          locations={[0, 0.4, 1]}
          style={StyleSheet.absoluteFillObject} 
        />

        {/* Absolute Header inside the image area */}
        <View style={styles.headerAbsolute}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialIcons name="arrow-back-ios" size={20} color="#ffffff" style={{ marginLeft: 6 }} />
          </TouchableOpacity>
          <View style={styles.statusIndicator}>
             <View style={styles.statusDot} />
             <Text style={styles.statusText}>Live Scenario</Text>
          </View>
        </View>
      </View>

      {/* BOTTOM HALF: INTERACTION AREA */}
      <View style={styles.interactionArea}>
        
        {/* OVERLAPPING DIALOGUE BOX */}
        <View style={styles.dialogueWrapper}>
          <View style={styles.nameTab}>
            <Text style={styles.nameText}>{scenario?.npc_name || "Petugas Bandara"}</Text>
          </View>
          <BlurView intensity={80} tint="dark" style={styles.dialogueBox}>
             <Text style={styles.dialogueText}>
                {scenario?.npc_text || "Bisa saya lihat paspor dan tiket penerbangan Anda?"}
             </Text>

             {/* TARGET PHRASE & EVALUATION INDICATOR */}
             <View style={styles.targetPhraseContainer}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.targetPhraseLabel}>TUGAS ANDA:</Text>
                  <Text style={styles.targetPhraseText}>
                    Ucapkan <Text style={styles.targetPhraseHighlight}>"{targetPhrase}"</Text>
                  </Text>
                </View>
                <View style={styles.indicatorContainer}>
                  {hasEvaluated ? (
                    isCorrect ? (
                      <MaterialIcons name="check-circle" size={24} color="#4ADE80" />
                    ) : (
                      <MaterialIcons name="cancel" size={24} color="#F87171" />
                    )
                  ) : (
                    <View style={styles.pendingIndicator}>
                      <View style={styles.dot} />
                      <View style={styles.dot} />
                      <View style={styles.dot} />
                    </View>
                  )}
                </View>
             </View>
          </BlurView>
        </View>

        {/* MIC SECTION */}
        <View style={styles.micSection}>
           
           {/* LIVE TRANSCRIPTION */}
           <View style={styles.transcriptionContainer}>
             {(isRecording || isProcessing || transcription !== "") ? (
                <Text style={styles.transcriptionText}>{transcription}</Text>
             ) : null}
           </View>

           {speechError ? (
             <Text style={styles.errorText}>{speechError}</Text>
           ) : null}

           <View style={styles.micButtonContainer}>
              <Animated.View style={[styles.micPulseBg, { 
                transform: [{ scale: pulseAnim }], 
                opacity: pulseAnim.interpolate({ inputRange: [1, 1.08], outputRange: [0.3, 0] }) 
              }]} />
              <TouchableOpacity 
                activeOpacity={0.8} 
                style={styles.micButton}
                onPress={handleMicPress}
              >
                 <LinearGradient 
                    colors={["#23262F", "#14151A"]} 
                    style={[
                      styles.micGradient,
                      hasEvaluated && isCorrect ? { borderColor: "#4ADE80" } : undefined,
                      hasEvaluated && !isCorrect ? { borderColor: "#F87171" } : undefined,
                    ]}
                 >
                   {/* Waveform visual mimic - Monochrome */}
                   <View style={styles.waveformRow}>
                      <View style={[styles.waveLine, { height: 12 }, isRecording && { backgroundColor: "#4ADE80" }]} />
                      <View style={[styles.waveLine, { height: 24 }, isRecording && { backgroundColor: "#4ADE80" }]} />
                      <View style={[styles.waveLine, { height: 16 }, isRecording && { backgroundColor: "#4ADE80" }]} />
                      <MaterialIcons name="mic" size={44} color={isRecording ? "#4ADE80" : "#ffffff"} style={styles.micIcon} />
                      <View style={[styles.waveLine, { height: 16 }, isRecording && { backgroundColor: "#4ADE80" }]} />
                      <View style={[styles.waveLine, { height: 24 }, isRecording && { backgroundColor: "#4ADE80" }]} />
                      <View style={[styles.waveLine, { height: 12 }, isRecording && { backgroundColor: "#4ADE80" }]} />
                   </View>
                 </LinearGradient>
              </TouchableOpacity>
           </View>

           <Text style={styles.instructionText}>
             {instructionText}
           </Text>
        </View>

        {/* Action Button at the very bottom right */}
        <View style={styles.bottomBar}>
          <TouchableOpacity 
            style={[styles.nextButton, !canAdvance && styles.nextButtonDisabled]} 
            activeOpacity={0.8}
            onPress={handleContinue}
            disabled={!canAdvance}
          >
            <Text style={[styles.nextButtonText, !canAdvance && styles.nextButtonTextDisabled]}>
              {isLastScenario ? "SELESAI" : "LANJUTKAN"}
            </Text>
            <MaterialIcons name="arrow-forward" size={16} color={!canAdvance ? "rgba(255,255,255,0.3)" : "#0A0D14"} />
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050505", // Deepest monochrome back
  },
  loadingText: {
    fontFamily: "SpaceGrotesk-Medium",
    fontSize: 14,
    color: "#ffffff",
    marginTop: 16,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  
  // Scenerio Top Half
  imageContainer: {
    width: "100%",
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  scenarioImage: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },
  headerAbsolute: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  statusIndicator: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#ffffff", // Monochrome white dot
    marginRight: 6,
  },
  statusText: {
    fontFamily: "SpaceGrotesk-Medium",
    fontSize: 12,
    color: "#ffffff",
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  // Bottom Half
  interactionArea: {
    flex: 1,
    paddingHorizontal: 20,
  },
  dialogueWrapper: {
    width: '100%',
    marginTop: -45, // Overlap the image boundary
    zIndex: 10,
  },
  nameTab: {
    alignSelf: 'flex-start',
    backgroundColor: '#1E2128', // Dark grey
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    borderBottomWidth: 0,
    marginLeft: 16,
  },
  nameText: {
    fontFamily: "SpaceGrotesk-Bold",
    fontSize: 14,
    color: "#ffffff", // Monochrome name
  },
  dialogueBox: {
    width: '100%',
    padding: 20,
    minHeight: 110,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: "rgba(20, 22, 28, 0.85)", // Glassmonochrome
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  dialogueText: {
    fontFamily: "SpaceGrotesk-Medium",
    fontSize: 16,
    color: "#ffffff",
    lineHeight: 24,
  },

  micSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micButtonContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    height: 80,
  },
  micPulseBg: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.15)", // Monochrome pulse
  },
  micButton: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
    shadowColor: "#ffffff",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8,
  },
  micGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.25)",
  },
  waveformRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  waveLine: {
    width: 4,
    backgroundColor: "rgba(255, 255, 255, 0.5)", // Monochrome lines
    borderRadius: 2,
    marginHorizontal: 4,
  },
  micIcon: {
    marginHorizontal: 16,
  },

  instructionText: {
    marginTop: 24,
    fontFamily: "SpaceGrotesk-Bold",
    fontSize: 13,
    letterSpacing: 2,
    color: "rgba(255,255,255,0.6)",
  },

  bottomBar: {
    width: "100%",
    paddingBottom: Platform.OS === 'ios' ? 24 : 32,
    alignItems: "flex-end",
  },
  nextButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 99,
  },
  nextButtonDisabled: {
    backgroundColor: "#1E2128",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  nextButtonText: {
    fontFamily: "SpaceGrotesk-Bold",
    fontSize: 12,
    color: "#050505", // Inverse monochrome text
    letterSpacing: 1,
    marginRight: 6,
  },
  nextButtonTextDisabled: {
    color: "rgba(255,255,255,0.3)",
  },
  
  // Custom states additions
  targetPhraseContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  targetPhraseLabel: {
    fontFamily: "SpaceGrotesk-Medium",
    fontSize: 10,
    color: "rgba(255,255,255,0.5)",
    letterSpacing: 1,
    marginBottom: 4,
  },
  targetPhraseText: {
    fontFamily: "SpaceGrotesk-Medium",
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
  },
  targetPhraseHighlight: {
    fontFamily: "SpaceGrotesk-Bold",
    color: "#60A5FA", // A soft pastel blue for visual focal
  },
  indicatorContainer: {
    paddingLeft: 12,
    justifyContent: "center",
  },
  pendingIndicator: {
    flexDirection: "row",
    gap: 4,
    opacity: 0.3,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#ffffff",
  },
  transcriptionContainer: {
    minHeight: 24,
    marginBottom: 12,
    justifyContent: "center",
  },
  transcriptionText: {
    fontFamily: "SpaceGrotesk-Medium",
    fontSize: 14,
    color: "rgba(255,255,255,0.6)",
    fontStyle: 'italic',
    textAlign: "center",
  },
  errorText: {
    fontFamily: "SpaceGrotesk-Medium",
    fontSize: 12,
    color: "#FCA5A5",
    textAlign: "center",
    marginBottom: 12,
    paddingHorizontal: 12,
  },
});
