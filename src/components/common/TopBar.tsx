import React, { useMemo } from "react";
import { View, StyleSheet, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
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
const DUMMY_STREAK = 7;

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

  const displayName = profile?.nickname || profile?.username || "Penjelajah";
  const greeting = getGreeting();

  return (
    <View style={styles.wrapper}>
      <View style={styles.card}>
        <View
          style={styles.avatarSection}
          accessible
          accessibilityLabel={`${displayName}, level ${level}`}
        >
          <View style={styles.avatarInner}>
            <UserAvatar
              name={displayName}
              avatarUrl={profile?.avatar_url}
              size={54}
            />
          </View>
          <View style={styles.levelBadge}>
            <Text style={styles.levelBadgeText}>{level}</Text>
          </View>
        </View>

        {/* ── Center: Greeting + level/exp ── */}
        <View style={styles.infoColumn}>
          <View style={styles.greetingRow}>
            <Text style={styles.greetingText} numberOfLines={1}>
              {greeting}, <Text style={styles.nameText}>{displayName}!</Text>
            </Text>
          </View>

          <Text style={styles.levelNumber}>Level {level}</Text>
          <View style={styles.expRow}>
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
            <Text style={styles.expLabel}>{currentLevelExp} / {nextLevelExp} XP</Text>
          </View>
        </View>

        <View style={styles.quickStats}>
          <View
            style={[styles.statItem, styles.statDivider]}
            accessible
            accessibilityLabel={`Runtun belajar ${DUMMY_STREAK} hari`}
          >
            <MaterialIcons name="local-fire-department" size={23} color="#F97316" />
            <Text style={styles.statValue}>{DUMMY_STREAK}</Text>
          </View>
          <View
            style={styles.statItem}
            accessible
            accessibilityLabel={`${totalExp} total EXP`}
          >
            <MaterialIcons name="hexagon" size={23} color="#55C96B" />
            <Text style={styles.statValue}>{totalExp}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

// ── Styles ───────────────────────────────────────────────────────

const TOPBAR_HEIGHT = 86;
const CARD_RADIUS = 22;

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
    paddingHorizontal: 14,
    gap: 12,
    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 6,
    // Subtle border
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.04)",
  },

  avatarSection: {
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#D8F0D8",
  },
  levelBadge: {
    position: "absolute",
    right: -2,
    bottom: -2,
    width: 25,
    height: 25,
    borderRadius: 13,
    backgroundColor: "#F5A623",
    borderWidth: 2,
    borderColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  levelBadgeText: {
    fontFamily: "Poppins-Bold",
    fontSize: 12,
    color: colors.white,
  },

  // ── Info column ──
  infoColumn: {
    flex: 1,
    justifyContent: "center",
    minWidth: 0,
  },
  greetingRow: {
    flexDirection: "row",
    minWidth: 0,
  },
  greetingText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 13,
    color: colors.text,
    lineHeight: 17,
  },
  nameText: {
    fontFamily: "Poppins-Bold",
    fontSize: 13,
    color: colors.text,
  },

  levelNumber: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 11,
    color: colors.darkGray,
    lineHeight: 15,
  },
  expRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  expBarTrack: {
    flex: 1,
    height: 7,
    borderRadius: 4,
    backgroundColor: ACCENT_GREEN_BG,
    overflow: "hidden",
  },
  expBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  expLabel: {
    fontFamily: "Poppins-Medium",
    fontSize: 9,
    color: colors.darkGray,
    minWidth: 74,
  },
  quickStats: {
    height: 42,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  statItem: {
    minWidth: 48,
    height: 30,
    paddingHorizontal: 7,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  statDivider: {
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  statValue: {
    fontFamily: "Poppins-Bold",
    fontSize: 12,
    lineHeight: 17,
    color: colors.text,
  },
});
