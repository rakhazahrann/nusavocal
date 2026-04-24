import { colors } from "@/constants/colors";
import { spacing } from "@/constants/spacing";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import { Card } from "@/components/ui/Card";
import { Screen } from "@/components/ui/Screen";
import { Text } from "@/components/ui/Text";
import { EnterAnimatedView } from "@/components/motion/EnterAnimatedView";
import { leaderboardService } from "@/services/leaderboardService";
import { LeaderboardEntry } from "@/types/services";

export const LeaderboardScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const run = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await leaderboardService.getLeaderboard(50);
        setData(result);
      } catch (e: any) {
        const message = e?.message || "Failed to load leaderboard.";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };
    run();
  }, []);

  return (
    <Screen>
      <EnterAnimatedView style={{ flex: 1 }}>
        <Text variant="title" weight="bold">
          Leaderboard
        </Text>
        <Text variant="body" tone="muted" style={{ marginTop: spacing.sm }}>
          Peringkat global berdasarkan total skor vocab.
        </Text>

        {isLoading ? (
          <View style={styles.center}>
            <ActivityIndicator color={colors.accent} />
            <Text variant="caption" tone="muted" style={{ marginTop: spacing.sm }}>
              Loading...
            </Text>
          </View>
        ) : error ? (
          <Card style={{ marginTop: spacing.lg }}>
            <View style={{ padding: spacing.lg }}>
              <Text variant="label" weight="semibold">
                Leaderboard belum tersedia
              </Text>
              <Text variant="caption" tone="muted" style={{ marginTop: spacing.sm }}>
                {error}
              </Text>
              <Text variant="caption" tone="muted" style={{ marginTop: spacing.sm }}>
                Pastikan fungsi SQL `get_leaderboard` sudah dibuat di Supabase.
              </Text>
            </View>
          </Card>
        ) : (
          <FlatList
            style={{ marginTop: spacing.lg }}
            data={data}
            keyExtractor={(item) => item.user_id}
            ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
            renderItem={({ item, index }) => (
              <Card padded={false}>
                <View style={styles.row}>
                  <Text variant="label" weight="bold" style={{ width: 32 }}>
                    {index + 1}
                  </Text>
                  <View style={{ flex: 1 }}>
                    <Text variant="label" weight="semibold">
                      {item.nickname || item.username}
                    </Text>
                    <Text variant="caption" tone="muted">
                      Completed: {item.completed_stages}
                    </Text>
                  </View>
                  <Text variant="label" weight="bold" tone="accent">
                    {item.total_vocab_score}
                  </Text>
                </View>
              </Card>
            )}
          />
        )}
      </EnterAnimatedView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    backgroundColor: colors.surface } });
