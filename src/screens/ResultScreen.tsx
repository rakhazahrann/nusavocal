import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useAuthStore } from "@/store/authStore";
import { useGameStore } from "@/store/gameStore";
import { colors } from "@/constants/colors";

// Pure Monochrome Design System Constants
const COLORS = {
  accent: colors.accent,
  text: colors.text,
  muted: colors.mutedText,
  surface: colors.surface,
  lightGray: colors.parchment,
  navy: colors.navy, // Fully monochrome black theme for the box
  error: colors.danger, // Keep red only for emergency errors
};

export const ResultScreen = ({ route, navigation }: any) => {
  const { stageId, vocabScore = 0, gameScore = 0, win = true } = route.params || {};
  const { user } = useAuthStore();
  const { saveProgress } = useGameStore();

  const [isSaving, setIsSaving] = useState(true);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Entry Animations
  const scaleAnim = useRef(new Animated.Value(0.7)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    const doSave = async () => {
      if (!user?.id || !stageId) {
        setIsSaving(false);
        startEnterAnimation();
        return;
      }
      try {
        const result = await saveProgress(user.id, stageId, gameScore, vocabScore);
        if (!result.success) {
          setSaveError(result.error || "Gagal menyimpan progress.");
        }
      } catch (e: any) {
        setSaveError(e.message || "Terjadi kesalahan.");
      } finally {
        setIsSaving(false);
        startEnterAnimation();
      }
    };
    doSave();
  }, []);

  const startEnterAnimation = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 7,
        tension: 45,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Revert to map
  const handleClose = () => {
    navigation.popToTop();
  };

  if (isSaving) {
    return (
      <View style={styles.loadingRoot}>
        <ActivityIndicator size="large" color={COLORS.accent} />
        <Text style={styles.loadingText}>Menyimpan pencapaian...</Text>
      </View>
    );
  }

  const isGameWin = win === true || win === "true";

  return (
    <View style={styles.root}>
      {/* Pure Monochrome Gradient background to match Vocab screen */}
      <LinearGradient
        colors={["#FFFFFF", "#F0F0F0"]}
        style={StyleSheet.absoluteFillObject}
      />

      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <View style={styles.mainContent}>
          
          {/* Hero Visual Section - Monochrome */}
          <Animated.View 
            style={[
              styles.heroWrap, 
              { opacity: opacityAnim, transform: [{ scale: scaleAnim }] }
            ]}
          >
            {/* Soft Mono Glass-effect Shell */}
            <View style={styles.outerRing}>
              <View style={styles.innerRing}>
                <MaterialCommunityIcons 
                  name={isGameWin ? "trophy-variant" : "close-circle-outline"} 
                  size={74} 
                  color={isGameWin ? "#ffc947" : COLORS.accent} 
                />
              </View>
            </View>

            {/* Clean Monochrome Badge */}
            <View style={styles.statusBadge}>
              <Text style={styles.statusBadgeText}>
                {isGameWin ? "STADIUM DISELESAIKAN" : "LATIHAN LAGI"}
              </Text>
            </View>

            <Text style={styles.titleText}>
              {isGameWin ? "Kerja Bagus!" : "Jangan Menyerah!"}
            </Text>
            
            <Text style={styles.subtitleText}>
              {isGameWin 
                ? "Keterampilan bahasamu semakin berkembang. Lanjutkan terus!"
                : "Coba lagi untuk hasil yang maksimal."}
            </Text>
          </Animated.View>

          {/* Stats & Cards container */}
          <Animated.View 
            style={[
              styles.statsContainer, 
              { opacity: opacityAnim, transform: [{ translateY: slideAnim }] }
            ]}
          >
            <View style={styles.scoreGrid}>
              {/* Item 1: Vocabulary */}
              <View style={styles.scoreCard}>
                <View style={styles.iconPlate}>
                  <MaterialIcons name="translate" size={22} color={COLORS.accent} />
                </View>
                <View style={styles.scoreDetail}>
                  <Text style={styles.cardLabel}>Kosa Kata</Text>
                  <View style={styles.scoreLine}>
                    <Text style={styles.cardValue}>{vocabScore}</Text>
                    <Text style={styles.cardUnit}>POIN</Text>
                  </View>
                </View>
              </View>

              {/* Item 2: Speaking */}
              <View style={styles.scoreCard}>
                <View style={styles.iconPlate}>
                  <MaterialIcons name="record-voice-over" size={22} color={COLORS.accent} />
                </View>
                <View style={styles.scoreDetail}>
                  <Text style={styles.cardLabel}>Pengucapan</Text>
                  <View style={styles.scoreLine}>
                    <Text style={styles.cardValue}>{gameScore}</Text>
                    <Text style={styles.cardUnit}>POIN</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Combined Total EXP Box (Pure Monochrome Black) */}
            <View style={styles.totalBox}>
              <View style={styles.totalLeft}>
                <Text style={styles.totalLabel}>Total Pengalaman</Text>
                <Text style={styles.totalValue}>
                  +{(Number(vocabScore) + Number(gameScore)) * 10}
                </Text>
              </View>
              <View style={styles.xpPill}>
                <Text style={styles.xpPillText}>XP</Text>
              </View>
            </View>

            {saveError && (
              <View style={styles.errorBar}>
                <MaterialIcons name="error-outline" size={16} color={COLORS.error} />
                <Text style={styles.errorText}>{saveError}</Text>
              </View>
            )}
          </Animated.View>
        </View>

        {/* Sticky Footer Actions (Black Primary Button) */}
        <Animated.View style={[styles.footer, { opacity: opacityAnim }]}>
          <TouchableOpacity 
            style={styles.mainButton}
            onPress={handleClose}
            activeOpacity={0.8}
          >
            <Text style={styles.mainButtonText}>Kembali Ke Peta</Text>
            <MaterialIcons name="arrow-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </Animated.View>

      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  safeArea: {
    flex: 1,
  },
  
  // LOADING
  loadingRoot: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  loadingText: {
    marginTop: 16,
    fontFamily: "Poppins-Medium",
    fontSize: 15,
    color: "#1F2937",
  },

  // MAIN CONTENT
  mainContent: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  // HERO SECTION
  heroWrap: {
    alignItems: "center",
    marginBottom: 32,
  },
  outerRing: {
    width: 136,
    height: 136,
    borderRadius: 68,
    borderWidth: 1.5,
    borderColor: "rgba(0,0,0,0.05)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
  },
  innerRing: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "rgba(0,0,0,0.03)",
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.05,
        shadowRadius: 16,
      },
      android: { elevation: 2 },
    }),
  },
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 16,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  statusBadgeText: {
    fontFamily: "Poppins-Bold",
    fontSize: 11,
    letterSpacing: 1.5,
    color: "#000000",
  },
  titleText: {
    fontFamily: "Poppins-Bold",
    fontSize: 36,
    color: "#000000",
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: -1,
  },
  subtitleText: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    color: "rgba(0,0,0,0.6)",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 24,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  // STATS SECTION
  statsContainer: {
    width: "100%",
    marginTop: 8,
  },
  scoreGrid: {
    gap: 12,
    marginBottom: 12,
  },
  scoreCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    borderRadius: 20,
    padding: 18,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
      },
      android: { elevation: 1 },
    }),
  },
  iconPlate: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: COLORS.lightGray,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  scoreDetail: {
    flex: 1,
  },
  cardLabel: {
    fontFamily: "Poppins-Medium",
    fontSize: 12,
    color: COLORS.muted,
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  scoreLine: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  cardValue: {
    fontFamily: "Poppins-Bold",
    fontSize: 28,
    color: COLORS.text,
    marginRight: 6,
    letterSpacing: -0.5,
  },
  cardUnit: {
    fontFamily: "Poppins-Bold",
    fontSize: 10,
    color: COLORS.muted,
    letterSpacing: 1,
  },

  // TOTAL EXP BOX (Mono Black)
  totalBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 24,
    padding: 24,
    marginTop: 8,
    backgroundColor: COLORS.navy,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 15 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
      },
      android: { elevation: 10 },
    }),
  },
  totalLeft: {},
  totalLabel: {
    fontFamily: "Poppins-Medium",
    fontSize: 13,
    color: "rgba(255,255,255,0.6)",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  totalValue: {
    fontFamily: "Poppins-Bold",
    fontSize: 38,
    color: "#FFFFFF",
    letterSpacing: -1.5,
  },
  xpPill: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 10,
  },
  xpPillText: {
    fontFamily: "Poppins-Bold",
    fontSize: 14,
    color: "#FFFFFF",
  },

  // ERROR
  errorBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FEE2E2",
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
    gap: 8,
  },
  errorText: {
    fontFamily: "Poppins-Medium",
    fontSize: 12,
    color: COLORS.error,
    flex: 1,
  },

  // FOOTER
  footer: {
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    paddingTop: 8,
  },
  mainButton: {
    flexDirection: "row",
    backgroundColor: COLORS.accent,
    height: 60,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
      },
      android: { elevation: 12 },
    }),
  },
  mainButtonText: {
    fontFamily: "Poppins-Bold",
    fontSize: 18,
    color: "#FFFFFF",
  },
});
