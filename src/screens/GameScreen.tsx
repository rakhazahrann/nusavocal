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
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useGameStore } from "@/store/gameStore";
import { GameScenario } from "@/types/store";
import { useVoiceRecognition } from "@/hooks/useVoiceRecognition";
import { getMatchScore } from "@/utils/scoring";

const FALLBACK_BG =
  "https://images.unsplash.com/photo-1569629743817-70d8db6c323b?auto=format&fit=crop&q=80&w=1200";
const DEFAULT_TARGET = "Tentu, ini dia.";
const SPEECH_LOCALE = "id-ID";

/* ================================================================
   Animated waveform bar used during recording
   ================================================================ */
const WaveBar = ({ h, active, d }: { h: number; active: boolean; d: number }) => {
  const a = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (active) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(a, { toValue: 1.35, duration: 250 + d, useNativeDriver: true }),
          Animated.timing(a, { toValue: 0.65, duration: 250 + d, useNativeDriver: true }),
        ])
      ).start();
    } else {
      a.stopAnimation();
      Animated.timing(a, { toValue: 1, duration: 150, useNativeDriver: true }).start();
    }
  }, [active]);
  return (
    <Animated.View
      style={{
        width: 2,
        height: h,
        borderRadius: 1,
        marginHorizontal: 2.5,
        backgroundColor: active ? "#1E293B" : "#E2E8F0",
        transform: [{ scaleY: a }],
      }}
    />
  );
};

/* ================================================================
   Feedback overlay after evaluation
   ================================================================ */
const FeedbackOverlay = ({
  score,
  onRetry,
}: {
  score: number;
  onRetry: () => void;
}) => {
  const pct = Math.round(score * 100);
  const good = pct >= 74;
  const mid = pct >= 50 && pct < 74;

  const emoji = good ? "😄" : mid ? "😊" : "😕";
  const label = good ? "Bagus!" : mid ? "Lumayan!" : "Coba Lagi";
  const accent = good ? "#22C55E" : mid ? "#F48C25" : "#EF4444";

  return (
    <View style={fb.wrap}>
      <Text style={{ fontSize: 40, marginBottom: 4 }}>{emoji}</Text>
      <Text style={[fb.label, { color: accent }]}>{label}</Text>

      <View style={fb.row}>
        <View style={fb.statBox}>
          <Text style={[fb.pct, { color: accent }]}>{pct}%</Text>
          <Text style={fb.statLabel}>Pengucapan</Text>
        </View>
        {good && (
          <View style={fb.statBox}>
            <Text style={[fb.pct, { color: "#22C55E" }]}>+20</Text>
            <Text style={fb.statLabel}>XP</Text>
          </View>
        )}
      </View>

      {!good && (
        <TouchableOpacity style={fb.retry} onPress={onRetry} activeOpacity={0.7}>
          <MaterialIcons name="refresh" size={16} color="#64748B" />
          <Text style={fb.retryText}>Coba Lagi</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const fb = StyleSheet.create({
  wrap: {
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 24,
  },
  label: {
    fontFamily: "SpaceGrotesk-Bold",
    fontSize: 22,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    gap: 24,
  },
  statBox: { alignItems: "center" },
  pct: {
    fontFamily: "SpaceGrotesk-Bold",
    fontSize: 28,
  },
  statLabel: {
    fontFamily: "SpaceGrotesk-Regular",
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
  },
  retry: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 18,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 99,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  retryText: {
    fontFamily: "SpaceGrotesk-SemiBold",
    fontSize: 13,
    color: "#0F172A",
  },
});

/* ================================================================
   MAIN GAME SCREEN
   ================================================================ */
export const GameScreen = ({ navigation, route }: any) => {
  const { stageId, vocabScore = 0 } = route?.params || {};
  const { currentScenarios, fetchGameScenarios, isLoading } = useGameStore();
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

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scenRef = useRef<GameScenario | null>(null);
  const { height, width } = useWindowDimensions();

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
    const expected = scenRef.current?.expected_voice_text?.trim() || DEFAULT_TARGET;
    const s = getMatchScore(spoken.trim(), expected);
    setMatchScore(s);
    setHasEval(true);
    setIsCorrect(s >= 0.74);
  };

  useEffect(() => {
    if (finalResults && !isRecording && !isProcessing) evaluate(finalResults);
  }, [finalResults, isRecording, isProcessing]);

  useEffect(() => {
    resetAttempt();
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
      {/* ─────────── TOP HALF: White bg ─────────── */}
      <View style={[s.sceneWrap, { height: height * 0.6 }]}>
        {/* Header */}
        <SafeAreaView edges={["top"]} style={s.safeTop}>
          <View style={s.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={s.backBtn}
              activeOpacity={0.7}
            >
              <MaterialIcons name="chevron-left" size={28} color="#0F172A" />
            </TouchableOpacity>

            <View style={s.headerCenter}>
              <Text style={s.headerTitle}>{stageLabel}</Text>
              <Text style={s.headerSub}>
                Percakapan {idx + 1} / {total}
              </Text>
            </View>

            <TouchableOpacity style={s.reportBtn} activeOpacity={0.7}>
              <MaterialIcons name="flag" size={18} color="#94A3B8" />
              <Text style={s.reportTxt}>Laporkan</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        {/* Scene Image */}
        <View style={[s.sceneWrap, { height: height * 0.24 }]}>
          <Image source={{ uri: bg }} style={s.sceneImg} />
          <LinearGradient
            colors={["transparent", "rgba(255,255,255,0.6)", "#FFFFFF"]}
            locations={[0.4, 0.8, 1]}
            style={StyleSheet.absoluteFillObject}
          />
          {/* NPC Name Badge */}
          <View style={s.npcBadge}>
            <Text style={s.npcBadgeText}>{scenario?.npc_name || "NPC"}</Text>
          </View>
        </View>

        {/* NPC Dialog Bubble */}
        <View style={s.bubbleWrap}>
          <View style={s.bubble}>
            <View style={{ flex: 1 }}>
              <Text style={s.bubbleMain}>
                {scenario?.npc_text ||
                  "Wilujeng sumping di Bandung!\nKamana tujuan anjeun?"}
              </Text>
              <Text style={s.bubbleSub}>
                Selamat datang di Bandung!{"\n"}Mau ke mana tujuanmu?
              </Text>
            </View>
            <TouchableOpacity style={s.speakerBtn} activeOpacity={0.7}>
              <MaterialIcons name="volume-up" size={22} color="#64748B" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* ─────────── BOTTOM HALF: White Floating Card ─────────── */}
      <View style={s.bottomHalf}>
        {/* User Task Header */}
        <View style={s.taskHeader}>
          <View style={s.taskLabelRow}>
            <View style={s.taskIcon}>
              <MaterialIcons name="assignment" size={14} color="#64748B" />
            </View>
            <Text style={s.taskLabel}>Tugas Kamu</Text>
          </View>
          <Text style={s.taskHint}>Ucapkan jawabanmu</Text>
        </View>

        {/* Target Phrase */}
        <View style={s.targetWrap}>
          <Text style={s.targetMain}>{target}</Text>
          <Text style={s.targetSub}>
            Saya mau ke pusat kota.
          </Text>
        </View>

        {/* Transcription feedback */}
        {(transcription !== "" || recording) && !hasEval && (
          <View style={s.liveBox}>
            <MaterialIcons
              name={isProcessing ? "hourglass-top" : "graphic-eq"}
              size={14}
              color="#F48C25"
            />
            <Text style={s.liveTxt}>
              {isProcessing ? "Sedang memproses..." : transcription}
            </Text>
          </View>
        )}

        {speechError && !hasEval ? (
          <View style={s.errBox}>
            <MaterialIcons name="error-outline" size={14} color="#F87171" />
            <Text style={s.errTxt}>{speechError}</Text>
          </View>
        ) : null}

        {/* MIC / FEEDBACK area */}
        <View style={s.micArea}>
          {hasEval ? (
            <FeedbackOverlay score={matchScore} onRetry={resetAttempt} />
          ) : (
            <>
              {/* Waveform and Mic Layout */}
              <View style={s.waveRow}>
                {/* Waveform Left */}
                <View style={s.waveSide}>
                  {[3, 6, 4, 8, 5, 7].map((h, i) => (
                    <WaveBar key={`l-${i}`} h={h} active={isRecording} d={i * 35} />
                  ))}
                </View>

                {/* Mic button */}
                <View style={s.micBtnWrap}>
                  <Animated.View
                    style={[
                      s.micPulse,
                      isRecording && {
                        transform: [{ scale: pulseAnim }],
                        opacity: 0.2,
                        backgroundColor: "#1E293B",
                      },
                    ]}
                  />
                  <TouchableOpacity
                    style={[s.micBtn, isRecording && s.micBtnRec]}
                    onPress={handleMic}
                    activeOpacity={0.8}
                  >
                    <View style={[s.micInner, isRecording && { backgroundColor: "#EF4444" }]}>
                      <MaterialIcons
                        name={isRecording ? "stop" : "mic"}
                        size={32}
                        color="#FFFFFF"
                      />
                    </View>
                  </TouchableOpacity>
                </View>

                {/* Waveform Right */}
                <View style={s.waveSide}>
                  {[7, 5, 8, 4, 6, 3].map((h, i) => (
                    <WaveBar key={`r-${i}`} h={h} active={isRecording} d={i * 35 + 200} />
                  ))}
                </View>
              </View>

              <Text style={s.micHint}>
                {isProcessing
                  ? "Sedang memproses..."
                  : isRecording
                    ? "Sedang mendengarkan..."
                    : "Ketuk untuk mulai berbicara"}
              </Text>
            </>
          )}
        </View>

        {/* DEBUG: Temporary Test Result Screen Button */}
        <TouchableOpacity
          style={{
            alignSelf: "center",
            paddingVertical: 6,
            paddingHorizontal: 12,
            marginBottom: 8,
            backgroundColor: "#F1F5F9",
            borderRadius: 8,
          }}
          activeOpacity={0.7}
          onPress={() =>
            navigation.replace("Result", {
              win: true,
              stageId: stageId || 1,
              vocabScore: 85,
              gameScore: 90,
            })
          }
        >
          <Text style={{ fontSize: 11, fontFamily: "SpaceGrotesk-Bold", color: "#F48C25" }}>
            🛠️ TEST RESULT SCREEN
          </Text>
        </TouchableOpacity>

        {/* Continue button */}
        <SafeAreaView edges={["bottom"]} style={s.safeBottom}>
          <TouchableOpacity
            style={[s.contBtn, !canGo && s.contBtnOff]}
            onPress={handleContinue}
            disabled={!canGo}
            activeOpacity={0.8}
          >
            <Text style={[s.contTxt, !canGo && s.contTxtOff]}>
              {isLast ? "Selesai" : "Lanjut"}
            </Text>
            <MaterialIcons
              name="arrow-forward"
              size={18}
              color={canGo ? "#1E293B" : "rgba(255,255,255,0.25)"}
            />
          </TouchableOpacity>
        </SafeAreaView>
      </View>
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

  // ── Loading ──
  loadingTxt: {
    fontFamily: "SpaceGrotesk-Medium",
    fontSize: 14,
    color: "#94A3B8",
    marginTop: 14,
  },

  /* ──────── TOP HALF ──────── */
  topHalf: {
    backgroundColor: "#FFFFFF",
  },
  safeTop: {
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontFamily: "SpaceGrotesk-Bold",
    fontSize: 18,
    color: "#0F172A",
  },
  headerSub: {
    fontFamily: "SpaceGrotesk-Regular",
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 1,
  },
  reportBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingRight: 4,
  },
  reportTxt: {
    fontFamily: "SpaceGrotesk-Medium",
    fontSize: 11,
    color: "#94A3B8",
  },

  // Scene
  sceneWrap: {
    width: "100%",
    position: "relative",
  },
  sceneImg: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: "cover",
  },
  npcBadge: {
    position: "absolute",
    bottom: 12,
    left: 20,
    backgroundColor: "#1E293B",
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
  },
  npcBadgeText: {
    fontFamily: "SpaceGrotesk-SemiBold",
    fontSize: 13,
    color: "#FFFFFF",
  },

  // Bubble
  bubbleWrap: {
    paddingHorizontal: 20,
    marginTop: -8,
    paddingBottom: 16,
  },
  bubble: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
      },
      android: { elevation: 3 },
    }),
  },
  bubbleMain: {
    fontFamily: "SpaceGrotesk-Bold",
    fontSize: 16,
    color: "#0F172A",
    lineHeight: 24,
    marginBottom: 6,
  },
  bubbleSub: {
    fontFamily: "SpaceGrotesk-Regular",
    fontSize: 13,
    color: "#94A3B8",
    lineHeight: 20,
    fontStyle: "italic",
  },
  speakerBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  /* ──────── BOTTOM HALF ──────── */
  bottomHalf: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 24,
    marginTop: -16, // Pull up to overlap scene
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
      },
      android: { elevation: 12 },
    }),
  },

  // Task header
  taskHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  taskLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  taskIcon: {
    width: 26,
    height: 26,
    borderRadius: 6,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  taskLabel: {
    fontFamily: "SpaceGrotesk-SemiBold",
    fontSize: 14,
    color: "#475569",
  },
  taskHint: {
    fontFamily: "SpaceGrotesk-Regular",
    fontSize: 12,
    color: "#94A3B8",
  },

  // Target
  targetWrap: {
    alignItems: "center",
    marginBottom: 20,
    marginTop: 8,
  },
  targetMain: {
    fontFamily: "SpaceGrotesk-Bold",
    fontSize: 18,
    color: "#0F172A",
    lineHeight: 26,
    marginBottom: 4,
    textAlign: "center",
  },
  targetSub: {
    fontFamily: "SpaceGrotesk-Regular",
    fontSize: 14,
    color: "#64748B",
    fontStyle: "italic",
    textAlign: "center",
  },

  // Live transcription
  liveBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(244,140,37,0.08)",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 9,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(244,140,37,0.15)",
  },
  liveTxt: {
    fontFamily: "SpaceGrotesk-Medium",
    fontSize: 13,
    color: "#F48C25",
    fontStyle: "italic",
    flex: 1,
  },

  // Error
  errBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(239,68,68,0.08)",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 9,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.15)",
  },
  errTxt: {
    fontFamily: "SpaceGrotesk-Medium",
    fontSize: 12,
    color: "#F87171",
    flex: 1,
  },

  // Mic area
  micArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 10,
  },
  waveRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  waveSide: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 80,
  },
  micBtnWrap: {
    width: 84,
    height: 84,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 12,
  },
  micPulse: {
    position: "absolute",
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: "transparent",
  },
  micBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
      },
      android: { elevation: 6 },
    }),
  },
  micBtnRec: {},
  micInner: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1E293B",
  },
  micHint: {
    fontFamily: "SpaceGrotesk-Medium",
    fontSize: 13,
    color: "#94A3B8",
    marginTop: 16,
    textAlign: "center",
  },

  // Continue
  safeBottom: {
    paddingBottom: Platform.OS === "ios" ? 0 : 8,
  },
  contBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F48C25",
    paddingVertical: 14,
    borderRadius: 14,
    gap: 6,
    ...Platform.select({
      ios: {
        shadowColor: "#F48C25",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 8,
      },
      android: { elevation: 6 },
    }),
  },
  contBtnOff: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    shadowOpacity: 0,
    elevation: 0,
  },
  contTxt: {
    fontFamily: "SpaceGrotesk-Bold",
    fontSize: 16,
    color: "#FFFFFF",
  },
  contTxtOff: {
    color: "rgba(255,255,255,0.4)",
  },
});
