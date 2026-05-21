import React, { useMemo } from "react";
import { View, StyleSheet, Platform, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Circle } from "react-native-svg";
import { MaterialIcons } from "@expo/vector-icons";
import { Text } from "@/components/ui/Text";
import { UserAvatar } from "./UserAvatar";
import { useAuthStore } from "@/store/authStore";
import { useGameStore } from "@/store/gameStore";
import { colors } from "@/constants/colors";

// ── Design constants ────────────────────────────────────────────
const ACCENT_GREEN = colors.accent; // success token
const ACCENT_GREEN_LIGHT = "#A1DBA8";
const ACCENT_GREEN_BG = "rgba(80, 166, 92, 0.10)";
const RING_SIZE = 48;
const RING_STROKE = 3;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

// ── Helpers ─────────────────────────────────────────────────────

/** Returns a time-appropriate Indonesian greeting */
const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 11) return "Selamat pagi";
  if (hour < 15) return "Selamat siang";
  if (hour < 18) return "Selamat sore";
  return "Selamat malam";
};

/** EXP required to reach a given level */
const getExpForLevel = (level: number): number => level * 500;

/** Derive level & progress from total EXP */
const getLevelInfo = (totalExp: number) => {
  let level = 1;
  let remaining = totalExp;

  while (remaining >= getExpForLevel(level)) {
    remaining -= getExpForLevel(level);
    level++;
  }

  return {
    level,
    currentLevelExp: remaining,
    nextLevelExp: getExpForLevel(level),
    totalExp,
  };
};

// ── Component ───────────────────────────────────────────────────

export const TopBar = () => {
  const { profile } = useAuthStore();
  const { stages } = useGameStore();

  const totalExp = useMemo(() => {
    const completedCount = stages.filter((s) => s.status === "completed").length;
    return completedCount * 500;
  }, [stages]);

  const { level, currentLevelExp, nextLevelExp } = getLevelInfo(totalExp);
  const progressRatio = Math.min(currentLevelExp / Math.max(nextLevelExp, 1), 1);

  // SVG ring progress
  const strokeDashoffset = RING_CIRCUMFERENCE * (1 - progressRatio);

  const displayName = profile?.nickname || profile?.username || "Penjelajah";
  const greeting = getGreeting();

  return (
    <View style={styles.wrapper}>
      <View style={styles.card}>
        {/* ── Left: Avatar with SVG progress ring ── */}
        <View style={styles.avatarSection}>
          {/* SVG progress ring */}
          <Svg
            width={RING_SIZE}
            height={RING_SIZE}
            style={styles.ringSvg}
          >
            {/* Background ring */}
            <Circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RING_RADIUS}
              stroke={ACCENT_GREEN_BG}
              strokeWidth={RING_STROKE}
              fill="none"
            />
            {/* Progress ring */}
            <Circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RING_RADIUS}
              stroke={ACCENT_GREEN}
              strokeWidth={RING_STROKE}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${RING_CIRCUMFERENCE}`}
              strokeDashoffset={strokeDashoffset}
              rotation="-90"
              origin={`${RING_SIZE / 2}, ${RING_SIZE / 2}`}
            />
          </Svg>
          {/* Avatar centered inside ring */}
          <View style={styles.avatarInner}>
            <UserAvatar
              name={displayName}
              avatarUrl={profile?.avatar_url}
              size={36}
            />
          </View>
        </View>

        {/* ── Center: Greeting + level/exp ── */}
        <View style={styles.infoColumn}>
          {/* Row 1: Greeting */}
          <View style={styles.greetingRow}>
            <Text style={styles.greetingText}>{greeting}, </Text>
            <Text style={styles.nameText} numberOfLines={1}>
              {displayName}
            </Text>
          </View>

          {/* Row 2: Level + EXP bar inline */}
          <View style={styles.levelRow}>
            <Text style={styles.levelNumber}>{level} lvl</Text>
            <View style={styles.dot} />

            {/* Progress bar with EXP text overlaid */}
            <View style={styles.expBarContainer}>
              <View style={styles.expBarTrack}>
                <LinearGradient
                  colors={[ACCENT_GREEN, ACCENT_GREEN_LIGHT]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[
                    styles.expBarFill,
                    { width: `${Math.max(progressRatio * 100, 5)}%` as any },
                  ]}
                />
              </View>
              <Text style={styles.expLabel}>
                <Text style={styles.expValue}>{currentLevelExp} EXP</Text>
                <Text style={styles.expTotal}> / {nextLevelExp}</Text>
              </Text>
            </View>
          </View>
        </View>

        {/* ── Right: Settings gear ── */}
        <TouchableOpacity style={styles.gearButton} activeOpacity={0.6}>
          <MaterialIcons name="settings" size={18} color="#9CA3AF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ── Styles ───────────────────────────────────────────────────────

const TOPBAR_HEIGHT = 68;
const CARD_RADIUS = 18;

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? 10 : 12,
  },
  card: {
    height: TOPBAR_HEIGHT,
    borderRadius: CARD_RADIUS,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 10,
    paddingRight: 12,
    gap: 10,
    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
    // Subtle border
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.04)",
  },

  // ── Avatar with ring ──
  avatarSection: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  ringSvg: {
    position: "absolute",
  },
  avatarInner: {
    width: 38,
    height: 38,
    borderRadius: 19,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },

  // ── Info column ──
  infoColumn: {
    flex: 1,
    justifyContent: "center",
    gap: 3,
  },
  greetingRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  greetingText: {
    fontFamily: "Poppins-Regular",
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 18,
  },
  nameText: {
    fontFamily: "Poppins-Bold",
    fontSize: 14,
    color: colors.text,
    lineHeight: 18,
    flexShrink: 1,
  },

  // ── Level row ──
  levelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  levelNumber: {
    fontFamily: "Poppins-Bold",
    fontSize: 12,
    color: ACCENT_GREEN,
    lineHeight: 16,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#D1D5DB",
  },
  expBarContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  expBarTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: ACCENT_GREEN_BG,
    overflow: "hidden",
  },
  expBarFill: {
    height: "100%",
    borderRadius: 3,
  },
  expLabel: {
    flexDirection: "row",
  },
  expValue: {
    fontFamily: "Poppins-Bold",
    fontSize: 10,
    color: ACCENT_GREEN,
    lineHeight: 14,
  },
  expTotal: {
    fontFamily: "Poppins-Regular",
    fontSize: 10,
    color: "#9CA3AF",
    lineHeight: 14,
  },

  // ── Gear button ──
  gearButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F9FAFB",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.04)",
  },
});
