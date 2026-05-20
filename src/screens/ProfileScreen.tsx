import React, { useEffect } from "react";
import { View } from "react-native";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Screen } from "@/components/ui/Screen";
import { Text } from "@/components/ui/Text";
import { UserAvatar } from "@/components/common/UserAvatar";
import { EnterAnimatedView } from "@/components/motion/EnterAnimatedView";
import { useAuthStore } from "@/store/authStore";
import { useGameStore } from "@/store/gameStore";

export const ProfileScreen = () => {
  const { user, profile, fetchProfile } = useAuthStore();
  const { stages, fetchStages } = useGameStore();

  useEffect(() => {
    if (user?.id) {
      fetchProfile();
      fetchStages(user.id);
    }
  }, [user?.id]);

  const completedStages = stages.filter((s) => s.status === "completed").length;
  const currentStage = stages.find((s) => s.status === "current");
  const totalStages = stages.length;
  const remainingStages = Math.max(totalStages - completedStages, 0);

  return (
    <Screen>
      <EnterAnimatedView style={{ flex: 1 }}>
        <Text variant="title" weight="bold">
          Profile
        </Text>
        <Text variant="body" tone="muted" className="mt-sm">
          Info akun dan statistik.
        </Text>

        <Card className="mt-lg">
          <View className="flex-row items-center gap-md p-lg">
            <UserAvatar name={profile?.nickname || profile?.username} avatarUrl={profile?.avatar_url} size={64} />
            <View className="flex-1">
              <Text variant="subtitle" weight="bold">
                {profile?.nickname || profile?.username || "User"}
              </Text>
              <Text variant="caption" tone="muted">
                {profile?.email || ""}
              </Text>
            </View>
          </View>
        </Card>

        <Card className="mt-md">
          <View className="flex-row gap-md p-lg">
            <View className="flex-1 rounded-md border border-border bg-surface p-md">
              <Text variant="caption" tone="muted">
                Stages completed
              </Text>
              <Text variant="subtitle" weight="bold">
                {completedStages}
              </Text>
            </View>
            <View className="flex-1 rounded-md border border-border bg-surface p-md">
              <Text variant="caption" tone="muted">
                Current stage
              </Text>
              <Text variant="subtitle" weight="bold" numberOfLines={1}>
                {currentStage?.label || "-"}
              </Text>
            </View>
          </View>
        </Card>

        <Card className="mt-md">
          <View className="p-lg">
            <Text variant="label" weight="semibold">
              Next Focus
            </Text>
            <Text variant="body" tone="muted" className="mt-xs">
              {currentStage
                ? `Lanjutkan stage "${currentStage.label}" untuk membuka ${remainingStages} stage berikutnya.`
                : "Belum ada stage aktif. Coba refresh data atau buat stage pertama dari admin panel."}
            </Text>
          </View>
        </Card>

        <View className="mt-lg">
          <Button
            label="Refresh"
            variant="secondary"
            onPress={() => {
              if (user?.id) fetchStages(user.id);
              fetchProfile();
            }}
          />
        </View>
      </EnterAnimatedView>
    </Screen>
  );
};
