import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Screen } from "@/components/ui/Screen";
import { Text } from "@/components/ui/Text";
import { TopBar } from "@/components/common/TopBar";
import { UserAvatar } from "@/components/common/UserAvatar";
import { EnterAnimatedView } from "@/components/motion/EnterAnimatedView";
import { colors } from "@/constants/colors";

type LeaderboardPlayer = {
  id: string;
  name: string;
  username: string;
  level: number;
  stages: number;
  streak: number;
  xp: number;
  isCurrentUser?: boolean;
};

const DUMMY_LEADERBOARD: LeaderboardPlayer[] = [
  { id: "1", name: "Ayu Lestari", username: "ayulestari", level: 14, stages: 38, streak: 21, xp: 12840 },
  { id: "2", name: "Bima Pratama", username: "bimap", level: 13, stages: 36, streak: 18, xp: 11920 },
  { id: "3", name: "Citra Maharani", username: "citram", level: 12, stages: 34, streak: 15, xp: 10750 },
  { id: "4", name: "Dimas Saputra", username: "dimass", level: 11, stages: 31, streak: 12, xp: 9840 },
  { id: "5", name: "Sekar Arum", username: "sekararum", level: 10, stages: 29, streak: 10, xp: 8960 },
  { id: "6", name: "Raka Wijaya", username: "rakaw", level: 10, stages: 27, streak: 9, xp: 8420 },
  { id: "7", name: "Nadia Putri", username: "nadiap", level: 9, stages: 25, streak: 8, xp: 7760 },
  { id: "8", name: "Fajar Nugraha", username: "fajarn", level: 9, stages: 24, streak: 8, xp: 7310 },
  { id: "9", name: "Gita Permata", username: "gitap", level: 8, stages: 22, streak: 7, xp: 6840 },
  { id: "10", name: "Nara", username: "penjelajah", level: 8, stages: 20, streak: 7, xp: 6420, isCurrentUser: true },
];

const PODIUM_COLORS = [colors.gold, "#AAB3BD", "#B97850"];
const UI = {
  accentMuted: "rgba(59, 155, 106, 0.12)",
  accentLight: "#7ECFA0",
  borderLight: "rgba(0,0,0,0.06)",
  surfaceElevated: "#FFFCF5",
  warningLight: "#FFF3D6",
  streak: "#E8652B",
};

const PodiumPlayer = ({ player, rank }: { player: LeaderboardPlayer; rank: number }) => {
  const isWinner = rank === 1;

  return (
    <View style={[styles.podiumPlayer, isWinner && styles.podiumWinner]}>
      <View style={styles.podiumAvatarWrap}>
        <UserAvatar name={player.name} size={isWinner ? 64 : 54} />
        <View style={[styles.rankBadge, { backgroundColor: PODIUM_COLORS[rank - 1] }]}>
          <Text style={styles.rankBadgeText}>{rank}</Text>
        </View>
      </View>
      <Text style={styles.podiumName} numberOfLines={1}>{player.name.split(" ")[0]}</Text>
      <Text style={styles.podiumXp}>{player.xp.toLocaleString("id-ID")} XP</Text>
      <View style={[styles.podiumBase, { backgroundColor: PODIUM_COLORS[rank - 1] }]}>
        <MaterialIcons name="emoji-events" size={18} color={colors.white} />
        <Text style={styles.podiumLevel}>Level {player.level}</Text>
      </View>
    </View>
  );
};

export const LeaderboardScreen = () => {
  const currentRank = DUMMY_LEADERBOARD.findIndex((player) => player.isCurrentUser) + 1;
  const listData = DUMMY_LEADERBOARD.slice(3);

  return (
    <Screen padded={false}>
      <TopBar />
      <FlatList
        data={listData}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListHeaderComponent={
          <EnterAnimatedView style={styles.content}>
            <View style={styles.headingRow}>
              <View style={styles.headingCopy}>
                <Text style={styles.eyebrow}>MUSIM AGUSTUS</Text>
                <Text style={styles.title}>Liga Nusantara</Text>
                <Text style={styles.subtitle}>Kumpulkan XP dan naik ke puncak liga.</Text>
              </View>
              <View style={styles.leagueIcon}>
                <MaterialIcons name="workspace-premium" size={34} color={colors.gold} />
              </View>
            </View>

            <View style={styles.currentRankCard}>
              <View style={styles.currentRankIcon}>
                <MaterialIcons name="trending-up" size={22} color={colors.accentDark} />
              </View>
              <View style={styles.currentRankCopy}>
                <Text style={styles.currentRankLabel}>Peringkatmu minggu ini</Text>
                <Text style={styles.currentRankHint}>2.420 XP lagi untuk masuk 5 besar</Text>
              </View>
              <Text style={styles.currentRankValue}>#{currentRank}</Text>
            </View>

            <View style={styles.podiumCard}>
              <PodiumPlayer player={DUMMY_LEADERBOARD[1]} rank={2} />
              <PodiumPlayer player={DUMMY_LEADERBOARD[0]} rank={1} />
              <PodiumPlayer player={DUMMY_LEADERBOARD[2]} rank={3} />
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Peringkat liga</Text>
              <Text style={styles.sectionMeta}>Diperbarui hari ini</Text>
            </View>
          </EnterAnimatedView>
        }
        renderItem={({ item, index }) => {
          const rank = index + 4;
          return (
            <View style={[styles.row, item.isCurrentUser && styles.currentUserRow]}>
              <Text style={[styles.rowRank, item.isCurrentUser && styles.currentUserText]}>#{rank}</Text>
              <UserAvatar name={item.name} size={44} />
              <View style={styles.playerCopy}>
                <View style={styles.playerNameRow}>
                  <Text style={styles.playerName} numberOfLines={1}>{item.name}</Text>
                  {item.isCurrentUser && <Text style={styles.youBadge}>KAMU</Text>}
                </View>
                <Text style={styles.playerMeta}>Level {item.level} · {item.stages} stage</Text>
              </View>
              <View style={styles.scoreCopy}>
                <Text style={styles.score}>{item.xp.toLocaleString("id-ID")}</Text>
                <View style={styles.streakRow}>
                  <MaterialIcons name="local-fire-department" size={14} color={UI.streak} />
                  <Text style={styles.streakText}>{item.streak} hari</Text>
                </View>
              </View>
            </View>
          );
        }}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  listContent: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 124, alignSelf: "center", width: "100%", maxWidth: 760 },
  content: { width: "100%" },
  headingRow: { flexDirection: "row", alignItems: "center", marginBottom: 18 },
  headingCopy: { flex: 1 },
  eyebrow: { fontFamily: "Poppins-Bold", fontSize: 11, letterSpacing: 1.4, color: colors.accentDark },
  title: { fontFamily: "Poppins-Bold", fontSize: 28, lineHeight: 36, color: colors.text },
  subtitle: { fontFamily: "Poppins-Regular", fontSize: 14, lineHeight: 20, color: colors.darkGray },
  leagueIcon: { width: 54, height: 54, borderRadius: 18, backgroundColor: UI.warningLight, alignItems: "center", justifyContent: "center" },
  currentRankCard: { flexDirection: "row", alignItems: "center", padding: 14, borderRadius: 18, backgroundColor: UI.accentMuted, borderWidth: 1, borderColor: UI.accentLight, marginBottom: 18 },
  currentRankIcon: { width: 40, height: 40, borderRadius: 14, backgroundColor: colors.white, alignItems: "center", justifyContent: "center", marginRight: 11 },
  currentRankCopy: { flex: 1 },
  currentRankLabel: { fontFamily: "Poppins-SemiBold", fontSize: 14, color: colors.text },
  currentRankHint: { fontFamily: "Poppins-Regular", fontSize: 12, color: colors.darkGray, marginTop: 1 },
  currentRankValue: { fontFamily: "Poppins-Bold", fontSize: 24, color: colors.accentDark },
  podiumCard: { minHeight: 220, borderRadius: 24, paddingHorizontal: 8, paddingTop: 20, backgroundColor: UI.surfaceElevated, borderWidth: 1, borderColor: colors.border, flexDirection: "row", alignItems: "flex-end", overflow: "hidden" },
  podiumPlayer: { flex: 1, alignItems: "center" },
  podiumWinner: { alignSelf: "flex-start" },
  podiumAvatarWrap: { position: "relative" },
  rankBadge: { position: "absolute", right: -4, bottom: -3, width: 23, height: 23, borderRadius: 12, borderWidth: 2, borderColor: UI.surfaceElevated, alignItems: "center", justifyContent: "center" },
  rankBadgeText: { fontFamily: "Poppins-Bold", fontSize: 11, color: colors.white },
  podiumName: { maxWidth: "90%", fontFamily: "Poppins-SemiBold", fontSize: 13, color: colors.text, marginTop: 9 },
  podiumXp: { fontFamily: "Poppins-Regular", fontSize: 11, color: colors.darkGray, marginBottom: 9 },
  podiumBase: { width: "92%", height: 64, borderTopLeftRadius: 14, borderTopRightRadius: 14, alignItems: "center", justifyContent: "center" },
  podiumLevel: { fontFamily: "Poppins-SemiBold", fontSize: 11, color: colors.white, marginTop: 2 },
  sectionHeader: { flexDirection: "row", alignItems: "baseline", justifyContent: "space-between", marginTop: 24, marginBottom: 12 },
  sectionTitle: { fontFamily: "Poppins-Bold", fontSize: 18, color: colors.text },
  sectionMeta: { fontFamily: "Poppins-Regular", fontSize: 11, color: colors.darkGray },
  separator: { height: 9 },
  row: { flexDirection: "row", alignItems: "center", minHeight: 72, borderRadius: 18, paddingHorizontal: 13, paddingVertical: 10, backgroundColor: colors.surface, borderWidth: 1, borderColor: UI.borderLight },
  currentUserRow: { backgroundColor: UI.accentMuted, borderColor: colors.accent },
  rowRank: { width: 36, fontFamily: "Poppins-Bold", fontSize: 14, color: colors.darkGray },
  currentUserText: { color: colors.accentDark },
  playerCopy: { flex: 1, minWidth: 0, marginLeft: 11 },
  playerNameRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  playerName: { flexShrink: 1, fontFamily: "Poppins-SemiBold", fontSize: 14, color: colors.text },
  youBadge: { fontFamily: "Poppins-Bold", fontSize: 9, color: colors.white, backgroundColor: colors.accentDark, borderRadius: 6, paddingHorizontal: 5, paddingVertical: 2 },
  playerMeta: { fontFamily: "Poppins-Regular", fontSize: 11, color: colors.darkGray, marginTop: 2 },
  scoreCopy: { alignItems: "flex-end", marginLeft: 8 },
  score: { fontFamily: "Poppins-Bold", fontSize: 14, color: colors.text },
  streakRow: { flexDirection: "row", alignItems: "center" },
  streakText: { fontFamily: "Poppins-Regular", fontSize: 10, color: colors.darkGray },
});
