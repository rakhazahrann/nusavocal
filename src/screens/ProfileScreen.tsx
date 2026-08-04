import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Screen } from "@/components/ui/Screen";
import { Text } from "@/components/ui/Text";
import { TopBar } from "@/components/common/TopBar";
import { UserAvatar } from "@/components/common/UserAvatar";
import { EnterAnimatedView } from "@/components/motion/EnterAnimatedView";
import { colors } from "@/constants/colors";

const UI = {
  borderLight: "rgba(0,0,0,0.06)",
  surfaceElevated: "#FFFCF5",
  warning: "#E8A838",
  warningLight: "#FFF3D6",
  streak: "#E8652B",
  xp: "#7C5CFC",
  hero: ["#3B9B6A", "#2B7A4E", "#1D5E3A"] as const,
  xpGradient: ["#9070FF", "#7C5CFC"] as const,
};

const DUMMY_PROFILE = {
  name: "Nara Penjelajah",
  username: "@penjelajah",
  joinedAt: "Bergabung sejak Januari 2026",
  level: 8,
  currentXp: 420,
  nextLevelXp: 900,
  totalXp: 6420,
  streak: 7,
  rank: 10,
  completedStages: 20,
};

const DUMMY_ACHIEVEMENTS = [
  { id: "first", icon: "flag" as const, label: "Langkah Pertama", detail: "Stage pertama selesai", color: colors.accent },
  { id: "streak", icon: "local-fire-department" as const, label: "Api Seminggu", detail: "Runtun belajar 7 hari", color: UI.streak },
  { id: "speaker", icon: "record-voice-over" as const, label: "Berani Bicara", detail: "10 latihan suara", color: colors.adventure },
];

const DUMMY_ACTIVITY = [
  { id: "market", icon: "storefront" as const, title: "Percakapan di Pasar", detail: "Stage selesai · Skor 92", time: "Hari ini", color: colors.accent },
  { id: "vocab", icon: "translate" as const, title: "Kosakata Perjalanan", detail: "12 kata baru dipelajari", time: "Kemarin", color: UI.xp },
  { id: "streak", icon: "local-fire-department" as const, title: "Runtun belajar bertambah", detail: "Belajar 7 hari tanpa jeda", time: "2 hari lalu", color: UI.streak },
];

const StatCard = ({ icon, label, value, color }: { icon: keyof typeof MaterialIcons.glyphMap; label: string; value: string; color: string }) => (
  <View style={styles.statCard} accessible accessibilityLabel={`${label}: ${value}`}>
    <View style={[styles.statIcon, { backgroundColor: `${color}18` }]}>
      <MaterialIcons name={icon} size={21} color={color} />
    </View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

export const ProfileScreen = () => {
  const progress = DUMMY_PROFILE.currentXp / DUMMY_PROFILE.nextLevelXp;

  return (
    <Screen padded={false}>
      <TopBar />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <EnterAnimatedView style={styles.content}>
          <LinearGradient colors={UI.hero} style={styles.heroCard}>
            <View style={styles.heroPatternOne} />
            <View style={styles.heroPatternTwo} />
            <View style={styles.avatarFrame}>
              <UserAvatar name={DUMMY_PROFILE.name} size={78} />
            </View>
            <View style={styles.heroCopy}>
              <Text style={styles.profileName}>{DUMMY_PROFILE.name}</Text>
              <Text style={styles.username}>{DUMMY_PROFILE.username}</Text>
              <Text style={styles.joinedAt}>{DUMMY_PROFILE.joinedAt}</Text>
            </View>
            <View style={styles.leagueBadge}>
              <MaterialIcons name="workspace-premium" size={20} color={colors.gold} />
              <Text style={styles.leagueText}>Liga Rimba</Text>
            </View>
          </LinearGradient>

          <View style={styles.levelCard} accessible accessibilityLabel={`Level ${DUMMY_PROFILE.level}, ${DUMMY_PROFILE.currentXp} dari ${DUMMY_PROFILE.nextLevelXp} EXP`}>
            <View style={styles.levelHeader}>
              <View>
                <Text style={styles.sectionEyebrow}>PERJALANANMU</Text>
                <Text style={styles.levelTitle}>Level {DUMMY_PROFILE.level}</Text>
              </View>
              <Text style={styles.levelXp}>{DUMMY_PROFILE.currentXp} / {DUMMY_PROFILE.nextLevelXp} XP</Text>
            </View>
            <View style={styles.progressTrack}>
              <LinearGradient
                colors={UI.xpGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.progressFill, { width: `${progress * 100}%` }]}
              />
            </View>
            <Text style={styles.progressHint}>{DUMMY_PROFILE.nextLevelXp - DUMMY_PROFILE.currentXp} XP lagi menuju Level {DUMMY_PROFILE.level + 1}</Text>
          </View>

          <View style={styles.statsGrid}>
            <StatCard icon="auto-awesome" label="Total XP" value={DUMMY_PROFILE.totalXp.toLocaleString("id-ID")} color={UI.xp} />
            <StatCard icon="local-fire-department" label="Runtun" value={`${DUMMY_PROFILE.streak} hari`} color={UI.streak} />
            <StatCard icon="emoji-events" label="Peringkat" value={`#${DUMMY_PROFILE.rank}`} color={colors.gold} />
            <StatCard icon="check-circle" label="Stage selesai" value={`${DUMMY_PROFILE.completedStages}`} color={colors.accent} />
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Pencapaian</Text>
            <Text style={styles.sectionMeta}>3 dari 12 terbuka</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.achievementsRow}>
            {DUMMY_ACHIEVEMENTS.map((achievement) => (
              <View key={achievement.id} style={styles.achievementCard}>
                <View style={[styles.achievementIcon, { backgroundColor: `${achievement.color}18` }]}>
                  <MaterialIcons name={achievement.icon} size={28} color={achievement.color} />
                </View>
                <Text style={styles.achievementLabel}>{achievement.label}</Text>
                <Text style={styles.achievementDetail}>{achievement.detail}</Text>
              </View>
            ))}
          </ScrollView>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Aktivitas terbaru</Text>
            <Text style={styles.sectionMeta}>7 hari terakhir</Text>
          </View>
          <View style={styles.activityCard}>
            {DUMMY_ACTIVITY.map((activity, index) => (
              <View key={activity.id} style={[styles.activityRow, index < DUMMY_ACTIVITY.length - 1 && styles.activityDivider]}>
                <View style={[styles.activityIcon, { backgroundColor: `${activity.color}18` }]}>
                  <MaterialIcons name={activity.icon} size={22} color={activity.color} />
                </View>
                <View style={styles.activityCopy}>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <Text style={styles.activityDetail}>{activity.detail}</Text>
                </View>
                <Text style={styles.activityTime}>{activity.time}</Text>
              </View>
            ))}
          </View>

          <LinearGradient colors={[UI.warningLight, UI.surfaceElevated]} style={styles.focusCard}>
            <View style={styles.focusIcon}>
              <MaterialIcons name="explore" size={26} color={UI.warning} />
            </View>
            <View style={styles.focusCopy}>
              <Text style={styles.focusLabel}>Target berikutnya</Text>
              <Text style={styles.focusTitle}>Percakapan di Stasiun</Text>
              <Text style={styles.focusDetail}>Selesaikan 8 kosakata untuk membuka latihan suara.</Text>
            </View>
            <MaterialIcons name="chevron-right" size={25} color={colors.darkGray} />
          </LinearGradient>
        </EnterAnimatedView>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  scrollContent: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 124, alignItems: "center" },
  content: { width: "100%", maxWidth: 760 },
  heroCard: { minHeight: 144, borderRadius: 24, padding: 18, flexDirection: "row", alignItems: "center", overflow: "hidden" },
  heroPatternOne: { position: "absolute", width: 150, height: 150, borderRadius: 75, borderWidth: 28, borderColor: "rgba(255,255,255,0.06)", right: -35, top: -65 },
  heroPatternTwo: { position: "absolute", width: 90, height: 90, borderRadius: 45, backgroundColor: "rgba(255,255,255,0.05)", left: -30, bottom: -45 },
  avatarFrame: { padding: 4, borderRadius: 46, backgroundColor: colors.white, marginRight: 14 },
  heroCopy: { flex: 1, minWidth: 0 },
  profileName: { fontFamily: "Poppins-Bold", fontSize: 20, lineHeight: 27, color: colors.white },
  username: { fontFamily: "Poppins-Medium", fontSize: 13, color: "rgba(255,255,255,0.78)" },
  joinedAt: { fontFamily: "Poppins-Regular", fontSize: 10, color: "rgba(255,255,255,0.64)", marginTop: 5 },
  leagueBadge: { position: "absolute", right: 14, top: 14, flexDirection: "row", alignItems: "center", gap: 4, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 5, backgroundColor: "rgba(0,0,0,0.20)" },
  leagueText: { fontFamily: "Poppins-SemiBold", fontSize: 10, color: colors.white },
  levelCard: { marginTop: 14, padding: 17, borderRadius: 20, backgroundColor: colors.surface, borderWidth: 1, borderColor: UI.borderLight },
  levelHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
  sectionEyebrow: { fontFamily: "Poppins-Bold", fontSize: 9, letterSpacing: 1.2, color: UI.xp },
  levelTitle: { fontFamily: "Poppins-Bold", fontSize: 19, color: colors.text },
  levelXp: { fontFamily: "Poppins-SemiBold", fontSize: 12, color: colors.darkGray },
  progressTrack: { height: 9, borderRadius: 5, backgroundColor: colors.parchment, overflow: "hidden", marginTop: 12 },
  progressFill: { height: "100%", borderRadius: 5 },
  progressHint: { fontFamily: "Poppins-Regular", fontSize: 11, color: colors.darkGray, marginTop: 7 },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 14 },
  statCard: { width: "48%", flexGrow: 1, minHeight: 116, borderRadius: 19, padding: 14, backgroundColor: colors.surface, borderWidth: 1, borderColor: UI.borderLight },
  statIcon: { width: 38, height: 38, borderRadius: 13, alignItems: "center", justifyContent: "center", marginBottom: 8 },
  statValue: { fontFamily: "Poppins-Bold", fontSize: 20, lineHeight: 25, color: colors.text },
  statLabel: { fontFamily: "Poppins-Regular", fontSize: 11, color: colors.darkGray },
  sectionHeader: { flexDirection: "row", alignItems: "baseline", justifyContent: "space-between", marginTop: 24, marginBottom: 11 },
  sectionTitle: { fontFamily: "Poppins-Bold", fontSize: 18, color: colors.text },
  sectionMeta: { fontFamily: "Poppins-Regular", fontSize: 11, color: colors.darkGray },
  achievementsRow: { gap: 10, paddingRight: 4 },
  achievementCard: { width: 156, minHeight: 148, borderRadius: 19, padding: 14, backgroundColor: colors.surface, borderWidth: 1, borderColor: UI.borderLight },
  achievementIcon: { width: 48, height: 48, borderRadius: 16, alignItems: "center", justifyContent: "center", marginBottom: 12 },
  achievementLabel: { fontFamily: "Poppins-SemiBold", fontSize: 13, color: colors.text },
  achievementDetail: { fontFamily: "Poppins-Regular", fontSize: 10, lineHeight: 15, color: colors.darkGray, marginTop: 3 },
  activityCard: { borderRadius: 20, paddingHorizontal: 14, backgroundColor: colors.surface, borderWidth: 1, borderColor: UI.borderLight },
  activityRow: { minHeight: 78, flexDirection: "row", alignItems: "center", paddingVertical: 12 },
  activityDivider: { borderBottomWidth: 1, borderBottomColor: UI.borderLight },
  activityIcon: { width: 42, height: 42, borderRadius: 14, alignItems: "center", justifyContent: "center", marginRight: 11 },
  activityCopy: { flex: 1, minWidth: 0 },
  activityTitle: { fontFamily: "Poppins-SemiBold", fontSize: 13, color: colors.text },
  activityDetail: { fontFamily: "Poppins-Regular", fontSize: 10, color: colors.darkGray, marginTop: 2 },
  activityTime: { maxWidth: 58, textAlign: "right", fontFamily: "Poppins-Regular", fontSize: 9, color: colors.mutedText, marginLeft: 6 },
  focusCard: { marginTop: 16, minHeight: 96, borderRadius: 20, padding: 14, flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: colors.border },
  focusIcon: { width: 48, height: 48, borderRadius: 16, backgroundColor: colors.white, alignItems: "center", justifyContent: "center", marginRight: 12 },
  focusCopy: { flex: 1, minWidth: 0 },
  focusLabel: { fontFamily: "Poppins-Bold", fontSize: 9, letterSpacing: 0.8, color: UI.warning },
  focusTitle: { fontFamily: "Poppins-SemiBold", fontSize: 14, color: colors.text },
  focusDetail: { fontFamily: "Poppins-Regular", fontSize: 10, lineHeight: 15, color: colors.darkGray, marginTop: 2 },
});
