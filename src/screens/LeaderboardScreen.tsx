import React, { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { Screen } from "@/components/ui/Screen";
import { Text } from "@/components/ui/Text";
import { UserAvatar } from "@/components/common/UserAvatar";
import { EnterAnimatedView } from "@/components/motion/EnterAnimatedView";
import { colors } from "@/constants/colors";
import { leaderboardService } from "@/services/leaderboardService";
import { useAuthStore } from "@/store/authStore";
import { LeaderboardEntry } from "@/types/services";

type LeaderboardPlayer = {
  id: string;
  name: string;
  username: string;
  stages: number;
  xp: number;
  isCurrentUser?: boolean;
};

const PODIUM_COLORS = [colors.gold, "#AAB3BD", "#B97850"];
const UI = {
  accentMuted: "rgba(59, 155, 106, 0.12)",
  accentLight: "#7ECFA0",
  borderLight: "rgba(0,0,0,0.06)",
  surfaceElevated: "#FFFCF5",
  warningLight: "#FFF3D6",
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
        <Text style={styles.podiumLevel}>{player.stages} stage</Text>
      </View>
    </View>
  );
};

export const LeaderboardScreen = () => {
  const userId = useAuthStore((state) => state.user?.id);
  const [players, setPlayers] = useState<LeaderboardPlayer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(useCallback(() => {
    setIsLoading(true);
    leaderboardService.getLeaderboard()
      .then((entries: LeaderboardEntry[]) => {
        setPlayers(entries.map((entry) => ({
          id: entry.user_id,
          name: entry.nickname || entry.username,
          username: entry.username,
          stages: entry.completed_stages,
          xp: entry.total_xp,
          isCurrentUser: entry.user_id === userId,
        })));
        setError(null);
      })
      .catch((requestError) => setError(requestError.message || "Gagal memuat leaderboard."))
      .finally(() => setIsLoading(false));
  }, [userId]));

  const currentRankIndex = players.findIndex((player) => player.isCurrentUser);
  const currentRank = currentRankIndex + 1;
  const currentPlayer = players[currentRankIndex];
  const fifthPlayer = players[4];
  const xpToTopFive = currentPlayer && fifthPlayer
    ? Math.max(0, fifthPlayer.xp - currentPlayer.xp + 1)
    : 0;
  const podiumPlayers = players.slice(0, 3);
  const listData = players.slice(3);

  return (
    <Screen padded={false}>
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
                <Text style={styles.currentRankLabel}>Peringkatmu</Text>
                <Text style={styles.currentRankHint}>
                  {!currentPlayer
                    ? "Belum ada peringkat"
                    : currentRank > 5
                      ? `${xpToTopFive.toLocaleString("id-ID")} XP lagi untuk masuk 5 besar`
                      : "Kamu masuk 5 besar"}
                </Text>
              </View>
              <Text style={styles.currentRankValue}>{currentRank ? `#${currentRank}` : "-"}</Text>
            </View>

            {isLoading ? (
              <ActivityIndicator style={styles.loading} size="large" color={colors.accent} />
            ) : error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : podiumPlayers.length ? (
              <View style={styles.podiumCard}>
                {podiumPlayers[1] && <PodiumPlayer player={podiumPlayers[1]} rank={2} />}
                {podiumPlayers[0] && <PodiumPlayer player={podiumPlayers[0]} rank={1} />}
                {podiumPlayers[2] && <PodiumPlayer player={podiumPlayers[2]} rank={3} />}
              </View>
            ) : (
              <Text style={styles.emptyText}>Belum ada data peringkat.</Text>
            )}

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
                <Text style={styles.playerMeta}>{item.stages} stage selesai</Text>
              </View>
              <View style={styles.scoreCopy}>
                <Text style={styles.score}>{item.xp.toLocaleString("id-ID")} XP</Text>
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
  loading: { height: 220 },
  errorText: { marginVertical: 32, textAlign: "center", fontFamily: "Poppins-Regular", fontSize: 13, color: colors.danger },
  emptyText: { marginVertical: 32, textAlign: "center", fontFamily: "Poppins-Regular", fontSize: 13, color: colors.darkGray },
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
});
