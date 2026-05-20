import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import { Card } from "@/components/ui/Card";
import { Screen } from "@/components/ui/Screen";
import { Text } from "@/components/ui/Text";
import { EnterAnimatedView } from "@/components/motion/EnterAnimatedView";
import { colors } from "@/constants/colors";
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
        <Text variant="body" tone="muted" className="mt-sm">
          Peringkat global berdasarkan total skor vocab.
        </Text>

        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator color={colors.accent} />
            <Text variant="caption" tone="muted" className="mt-sm">
              Loading...
            </Text>
          </View>
        ) : error ? (
          <Card className="mt-lg">
            <View className="p-lg">
              <Text variant="label" weight="semibold">
                Leaderboard belum tersedia
              </Text>
              <Text variant="caption" tone="muted" className="mt-sm">
                {error}
              </Text>
              <Text variant="caption" tone="muted" className="mt-sm">
                Pastikan fungsi SQL `get_leaderboard` sudah dibuat di Supabase.
              </Text>
            </View>
          </Card>
        ) : (
          <FlatList
            className="mt-lg"
            data={data}
            keyExtractor={(item) => item.user_id}
            ItemSeparatorComponent={() => <View className="h-sm" />}
            renderItem={({ item, index }) => (
              <Card padded={false}>
                <View className="flex-row items-center rounded-md border border-border bg-surface px-lg py-md">
                  <Text variant="label" weight="bold" className="w-8">
                    {index + 1}
                  </Text>
                  <View className="flex-1">
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
