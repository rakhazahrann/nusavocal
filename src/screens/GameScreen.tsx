import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  useWindowDimensions,
  ScrollView,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useGameStore } from "@/store/gameStore";
import { GameScenario } from "@/types/store";
import { useVoiceRecognition } from "@/hooks/useVoiceRecognition";
import { getMatchScore } from "@/utils/scoring";

import { WaveBar } from "@/components/game/WaveBar";
import { EvaluationModal } from "@/components/game/EvaluationModal";
import { DUMMY_SCENARIOS, FALLBACK_BG } from "@/constants/gameMock";
import { GameHeader } from "@/components/glass/ProgressBar";

const DEFAULT_TARGET = "Tentu, ini dia.";
const SPEECH_LOCALE = "id-ID";

/* ================================================================
   MAIN GAME SCREEN
   ================================================================ */
export const GameScreen = ({ navigation, route }: any) => {
  const { stageId, vocabScore = 0 } = route?.params || {};
  const { currentScenarios: rawScenarios, fetchGameScenarios, isLoading } = useGameStore();
  
  // Use dummy fallback if array is empty
  const currentScenarios = (rawScenarios && rawScenarios.length > 0) ? rawScenarios : DUMMY_SCENARIOS;

  const [idx, setIdx] = useState(0);
  const {
    isRecording,
    isProcessing,
    transcription,
    finalResults,
    speechError,
    isVoiceAvailable,
    startRecording,
    stopRecording,
    resetTranscription,
  } = useVoiceRecognition();

  const [hasEval, setHasEval] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [matchScore, setMatchScore] = useState(0);
  const [speakScore, setSpeakScore] = useState(0);

  // New Chat States
  const [historyInteractions, setHistoryInteractions] = useState<{ [key: number]: { score: number; spoken: string; target: string } }>({});
  const [showEvalModal, setShowEvalModal] = useState(false);
  const [activeModalData, setActiveModalData] = useState({ score: 0, spoken: "", target: "" });

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scenRef = useRef<GameScenario | null>(null);
  const { height } = useWindowDimensions();
  const chatScrollRef = useRef<ScrollView>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (stageId) fetchGameScenarios(stageId);
  }, [stageId]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.2, duration: 900, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const scenario = currentScenarios[idx] || null;
  scenRef.current = scenario;

  const target = useMemo(
    () => scenario?.expected_voice_text?.trim() || DEFAULT_TARGET,
    [scenario]
  );
  const bg = scenario?.background_image_url || FALLBACK_BG;
  const total = currentScenarios.length || 1;
  const isLast = idx >= total - 1;
  const canGo = hasEval && isCorrect;

  const stages = useGameStore((s) => s.stages);
  const stageLabel = stages.find((s) => s.id === stageId)?.label || "Percakapan";

  const resetAttempt = () => {
    resetTranscription();
    setHasEval(false);
    setIsCorrect(false);
    setMatchScore(0);
  };

  const evaluate = (spoken: string) => {
    if (hasEval) return;
    const expected = scenRef.current?.expected_voice_text?.trim() || DEFAULT_TARGET;
    const s = getMatchScore(spoken.trim(), expected);
    setMatchScore(s);
    setHasEval(true);
    setIsCorrect(s >= 0.74);
    
    const interaction = { score: s, spoken: spoken.trim(), target: expected };
    
    // Store interactions in history state
    setHistoryInteractions((prev) => ({ ...prev, [idx]: interaction }));
    
    // Pop open details in bottom sheet
    setActiveModalData(interaction);
    setTimeout(() => setShowEvalModal(true), 400);
  };

  // Normal trigger on final results
  useEffect(() => {
    if (finalResults && !isRecording && !isProcessing) evaluate(finalResults);
  }, [finalResults, isRecording, isProcessing]);

  // Auto-finish & Silence Timeout logic
  useEffect(() => {
    if (!isRecording || !transcription || transcription === "Mendengarkan...") {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      return;
    }

    const currentExpected = scenRef.current?.expected_voice_text?.trim() || DEFAULT_TARGET;
    const currentScore = getMatchScore(transcription.trim(), currentExpected);

    // 1. Auto-finish if voice recognition matches target closely (> 85%)
    if (currentScore >= 0.85) {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      (async () => {
        await stopRecording();
        evaluate(transcription);
      })();
      return;
    }

    // 2. Auto-finish if user is silent for 2 seconds
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    silenceTimerRef.current = setTimeout(async () => {
      if (isRecording) {
        await stopRecording();
        evaluate(transcription);
      }
    }, 2000);

    return () => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    };
  }, [transcription, isRecording, scenario]);

  // Clean up timers
  useEffect(() => {
    return () => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    };
  }, []);

  // Auto scroll down on idx update or recording
  useEffect(() => {
    resetAttempt();
    setTimeout(() => {
      chatScrollRef.current?.scrollToEnd({ animated: true });
    }, 500);
  }, [idx, stageId]);

  const handleMic = async () => {
    if (!isVoiceAvailable) return;
    if (isRecording) {
      await stopRecording();
    } else {
      setHasEval(false);
      setIsCorrect(false);
      setMatchScore(0);
      await startRecording(SPEECH_LOCALE);
      // Gentle scroll to ensure mic area is visible if keyboard used or screen moves
      chatScrollRef.current?.scrollToEnd({ animated: true });
    }
  };

  const handleContinue = () => {
    if (!canGo) return;
    const n = speakScore + 1;
    setSpeakScore(n);
    if (!isLast) {
      setIdx((p) => p + 1);
    } else {
      navigation.replace("Result", {
        win: true,
        stageId,
        vocabScore,
        gameScore: n,
      });
    }
  };

  // ── Loading ──
  if (isLoading) {
    return (
      <View style={[s.root, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#F48C25" />
        <Text style={s.loadingTxt}>Memuat Percakapan...</Text>
      </View>
    );
  }

  const recording = isRecording || isProcessing;

  return (
    <View style={s.root}>
      {/* Top Banner fixed height */}
      <View style={[s.sceneWrap, { height: height * 0.35 }]}>
        <Image source={{ uri: bg }} style={s.sceneImg} />
        <LinearGradient
          colors={["rgba(255,255,255,0.8)", "transparent", "#FFFFFF"]}
          locations={[0, 0.6, 1]}
          style={StyleSheet.absoluteFillObject}
        />
        
        <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
          <GameHeader
            progress={total > 0 ? (idx + 1) / total : 0}
            onBack={() => navigation.goBack()}
            hearts={5}
          />
        </SafeAreaView>
      </View>

      {/* Chat Area with DARK NAVY BG OVERLAPPING */}
      <View style={s.chatAreaContainer}>
        <ScrollView
          ref={chatScrollRef}
          contentContainerStyle={s.chatScrollPadding}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => chatScrollRef.current?.scrollToEnd({ animated: true })}
        >
          {currentScenarios.slice(0, idx + 1).map((scen, i) => {
            const isCurrent = i === idx;
            const isPast = i < idx;

            const hist = historyInteractions[i] || {};
            const stepScore = hist.score ?? (isCurrent ? matchScore : 0);
            const stepSpoken = hist.spoken ?? (isCurrent ? transcription : "");
            const stepTarget = hist.target ?? scen.expected_voice_text;
            const isSuccess = isPast || (isCurrent && isCorrect);

            return (
              <View key={`msg-${scen.id || i}`} style={{ marginBottom: 32 }}>
                {/* NPC BUBBLE BLOCK */}
                <View style={s.chatRowLeft}>
                  <Image 
                    source={{ uri: "https://api.dicebear.com/7.x/avataaars/png?seed=Felix&backgroundColor=b6e3f4" }}
                    style={s.chatAvatar}
                  />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                     <View style={s.metaRow}>
                        <View style={s.numBadge}><Text style={s.numBadgeTxt}>{i + 1}</Text></View>
                     </View>
                     <View style={s.npcBubbleGlass}>
                        <Text style={s.npcTxtMain}>{scen.npc_text}</Text>
                        <TouchableOpacity style={s.speakerInlineBtn}>
                          <MaterialIcons name="volume-up" size={18} color="rgba(0,0,0,0.5)" />
                        </TouchableOpacity>
                     </View>
                  </View>
                </View>

                {/* USER BUBBLE BLOCK */}
                <View style={s.chatRowRight}>
                   <TouchableOpacity
                     activeOpacity={0.8}
                     disabled={!isPast && !(isCurrent && hasEval)}
                     onPress={() => {
                       setActiveModalData({ score: stepScore, spoken: stepSpoken, target: stepTarget });
                       setShowEvalModal(true);
                     }}
                     style={{ flex: 1, marginRight: 12, alignItems: 'flex-end' }}
                   >
                      <View style={s.metaRowRight}>
                         <View style={s.numBadge}><Text style={s.numBadgeTxt}>{i + 1}</Text></View>
                      </View>
                      
                      <View
                        style={[
                          s.userBubbleGlass,
                          isCurrent && !hasEval && s.bubbleGlowActive,
                          isSuccess && s.bubbleSuccessState
                        ]}
                      >
                         <View style={s.bubbleContentRow}>
                            {/* Conditional display logic */}
                            {isCurrent && !hasEval ? (
                              <Text style={[s.userTxtMain, isSuccess && { color: "#000000" }]}>
                                {target.split(/\s+/).map((word, wIdx) => {
                                  const cleanWord = word.toLowerCase().replace(/[^\w\s]/g, "");
                                  const spokenWords = transcription.toLowerCase().replace(/[^\w\s]/g, "").split(/\s+/);
                                  const isSpoken = spokenWords.includes(cleanWord);
                                  return (
                                    <Text key={wIdx} style={isSpoken ? { color: "#000000", fontFamily: "Poppins-Bold" } : { color: "rgba(0,0,0,0.3)" }}>
                                      {word}{" "}
                                    </Text>
                                  );
                                })}
                              </Text>
                            ) : (
                              <Text style={[s.userTxtMain, isSuccess && { color: "#000000" }]}>
                                {scen.expected_voice_text}
                              </Text>
                            )}

                            {(isPast || (isCurrent && hasEval)) && (
                               <View style={s.tinyScoreChip}>
                                 <Text style={s.tinyScoreTxt}>{Math.round(stepScore * 100)}</Text>
                               </View>
                            )}
                         </View>
                         {/* Audio wave display mimic */}
                         <View style={s.fakeMiniWaveRow}>
                            <MaterialIcons name="play-circle" size={20} color="#000000" style={{marginRight: 4}} />
                            {[3, 6, 4, 7, 3, 5, 4, 8, 3].map((h, w) => (
                              <View key={w} style={{ width: 2, height: h, backgroundColor: "#000000", opacity: isSuccess ? 1 : 0.5, marginHorizontal: 1 }} />
                            ))}
                         </View>
                      </View>
                   </TouchableOpacity>
                   
                   <Image 
                     source={{ uri: "https://api.dicebear.com/7.x/avataaars/png?seed=Milo&backgroundColor=ffdfbf" }}
                     style={s.chatAvatar}
                   />
                </View>
              </View>
            );
          })}
          <View style={{ height: 140 }} />
        </ScrollView>
      </View>

      {/* BOTTOM CONTROLS WITH TRANSPARENCY */}
      <View style={s.bottomPanelFixed}>
         {/* Notification overlay */}
         <View style={{ alignItems: 'center', marginBottom: 12 }}>
            {(transcription !== "" || recording) && !hasEval && (
              <View style={s.bubbleNotifyDark}>
                <Text style={{ color: '#000', fontSize: 13 }}>
                   {isProcessing ? "Sedang memproses..." : transcription}
                </Text>
              </View>
            )}
         </View>

         <View style={s.bottomActionInner}>
           {!canGo ? (
              <View style={s.micWrapFlex}>
                 <View style={s.waveFlexSide}>
                   {[3, 6, 4].map((h, index) => (
                     <WaveBar key={`l-${index}`} h={h} active={isRecording} d={index * 40} />
                   ))}
                 </View>

                 <View style={s.micCenterWrap}>
                     <Animated.View
                       style={[
                         s.micPulseGlow,
                         isRecording && {
                           transform: [{ scale: pulseAnim }],
                           backgroundColor: "rgba(0,0,0,0.1)",
                         },
                       ]}
                     />
                     <TouchableOpacity style={s.micFloatingBtn} onPress={handleMic} activeOpacity={0.8}>
                       {isRecording ? (
                          <LinearGradient colors={["#FFFFFF", "#F2F2F7"]} style={StyleSheet.absoluteFill}>
                            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#000000', borderRadius: 32}}>
                              <MaterialIcons name="stop" size={32} color="#000" />
                            </View>
                          </LinearGradient>
                       ) : (
                          <LinearGradient colors={["#000000", "#1A1A1A"]} style={StyleSheet.absoluteFill}>
                            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                               <MaterialIcons name="mic" size={32} color="#FFF" />
                            </View>
                          </LinearGradient>
                       )}
                     </TouchableOpacity>
                  </View>

                 <View style={s.waveFlexSide}>
                   {[4, 6, 3].map((h, index) => (
                     <WaveBar key={`r-${index}`} h={h} active={isRecording} d={index * 40 + 200} />
                   ))}
                 </View>
              </View>
           ) : (
             <TouchableOpacity style={s.fancyContinueBtn} onPress={handleContinue} activeOpacity={0.9}>
               <Text style={s.fancyContinueTxt}>{isLast ? "Selesai" : "Lanjut"}</Text>
               <MaterialIcons name="arrow-forward" size={20} color="#FFF" />
             </TouchableOpacity>
           )}
         </View>
         <SafeAreaView edges={["bottom"]} />
      </View>

      {/* Final Integration of Bottom Sheet Modal */}
      <EvaluationModal
        visible={showEvalModal}
        score={activeModalData.score}
        spoken={activeModalData.spoken}
        target={activeModalData.target}
        onClose={() => setShowEvalModal(false)}
        onAction={handleContinue}
      />
    </View>
  );
};

/* ================================================================
   STYLES — two-tone split layout matching the Figma mockup
   ================================================================ */
const DARK = "#1E1E2E";
const DARK_SURFACE = "#282838";

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FFFFFF" },

  loadingTxt: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    color: "#666666",
    marginTop: 14,
  },

  /* ──────── HEADER STYLES ──────── */
  sceneWrap: {
    width: "100%",
    position: "relative",
  },
  sceneImg: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: "cover",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerCircleBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  headerCenterPill: {
    flex: 1,
    marginHorizontal: 10,
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  pillStageTxt: {
    fontFamily: "Poppins-Regular",
    fontSize: 10,
    color: "rgba(0, 0, 0, 0.5)",
  },
  pillTitleTxt: {
    fontFamily: "Poppins-Bold",
    fontSize: 13,
    color: "#000000",
    marginTop: 1,
  },
  headerRightWrap: {
    flexDirection: "row",
    gap: 8,
  },
  streakPill: {
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    borderRadius: 12,
    paddingHorizontal: 12,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  streakTxt: {
    fontFamily: "Poppins-Bold",
    color: "#000000",
    fontSize: 13,
  },

  /* ──────── CHAT AREA (MONOCHROME LIGHT) ──────── */
  chatAreaContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    marginTop: -32,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: "hidden",
  },
  chatScrollPadding: {
    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: 160, // Give plenty of space for the absolute bottom bar
  },
  
  // Message blocks
  chatRowLeft: {
    flexDirection: "row",
    alignItems: "flex-start",
    maxWidth: "85%",
  },
  chatRowRight: {
    flexDirection: "row",
    alignItems: "flex-start",
    alignSelf: "flex-end",
    maxWidth: "85%",
  },
  chatAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#E5E5EA",
    backgroundColor: "#F2F2F7",
  },
  
  // Sub layouts
  metaRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  metaRowRight: {
    flexDirection: "row",
    marginBottom: 6,
    alignSelf: "flex-end",
  },
  numBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    justifyContent: "center",
    alignItems: "center",
  },
  numBadgeTxt: {
    fontSize: 9,
    fontFamily: "Poppins-Bold",
    color: "rgba(0, 0, 0, 0.4)",
  },

  // Bubbles
  npcBubbleGlass: {
    backgroundColor: "#F2F2F7",
    borderRadius: 20,
    borderTopLeftRadius: 4,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  npcTxtMain: {
    fontFamily: "Poppins-Medium",
    fontSize: 15,
    color: "#000000",
    lineHeight: 22,
  },
  speakerInlineBtn: {
    marginTop: 8,
    alignSelf: "flex-start",
  },

  userBubbleGlass: {
    backgroundColor: "#F2F2F7",
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 20,
    borderTopRightRadius: 4,
    padding: 16,
    minWidth: 150,
  },
  bubbleGlowActive: {
    borderColor: "#E5E5EA",
    backgroundColor: "#F2F2F7",
  },
  bubbleSuccessState: {
    borderColor: "#E5E5EA",
    backgroundColor: "#F2F2F7",
  },
  bubbleContentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  userTxtMain: {
    fontFamily: "Poppins-Medium",
    fontSize: 15,
    color: "#000000",
    textAlign: "right",
    flex: 1,
  },
  tinyScoreChip: {
    backgroundColor: "#000000",
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  tinyScoreTxt: {
    fontSize: 9,
    fontFamily: "Poppins-Bold",
    color: "#FFFFFF",
  },
  fakeMiniWaveRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    opacity: 0.7,
    alignSelf: "flex-end",
  },

  /* ──────── BOTTOM CONTROL BAR ──────── */
  bottomPanelFixed: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  bubbleNotifyDark: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  bottomActionInner: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
  },
  micWrapFlex: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  waveFlexSide: {
    flexDirection: "row",
    justifyContent: "center",
    width: 60,
  },
  micCenterWrap: {
    width: 84,
    height: 84,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
  },
  micPulseGlow: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  micFloatingBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  fancyContinueBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000000",
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    elevation: 4,
  },
  fancyContinueTxt: {
    fontFamily: "Poppins-Bold",
    fontSize: 16,
    color: "#FFFFFF",
  },
});
