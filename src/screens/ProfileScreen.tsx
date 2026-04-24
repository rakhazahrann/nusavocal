import { colors } from "@/constants/colors";
import { spacing, radius } from "@/constants/spacing";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Card } from "@/components/ui/Card";
import { Screen } from "@/components/ui/Screen";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";

import { UserAvatar } from "@/components/common/UserAvatar";
import { useAuthStore } from "@/store/authStore";
import { useGameStore } from "@/store/gameStore";
import { EnterAnimatedView } from "@/components/motion/EnterAnimatedView";

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
        <Text variant="body" tone="muted" style={{ marginTop: spacing.sm }}>
          Info akun dan statistik.
        </Text>

        <Card style={{ marginTop: spacing.lg }}>
          <View style={styles.profileRow}>
            <UserAvatar
              name={profile?.nickname || profile?.username}
              avatarUrl={profile?.avatar_url}
              size={64}
            />
            <View style={{ flex: 1 }}>
              <Text variant="subtitle" weight="bold">
                {profile?.nickname || profile?.username || "User"}
              </Text>
              <Text variant="caption" tone="muted">
                {profile?.email || ""}
              </Text>
            </View>
          </View>
        </Card>

        <Card style={{ marginTop: spacing.md }}>
          <View style={styles.statGrid}>
            <View style={styles.statItem}>
              <Text variant="caption" tone="muted">
                Stages completed
              </Text>
              <Text variant="subtitle" weight="bold">
                {completedStages}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text variant="caption" tone="muted">
                Current stage
              </Text>
              <Text variant="subtitle" weight="bold" numberOfLines={1}>
                {currentStage?.label || "-"}
              </Text>
            </View>
          </View>
        </Card>

        <Card style={{ marginTop: spacing.md }}>
          <View style={styles.focusBox}>
            <Text variant="label" weight="semibold">
              Next Focus
            </Text>
            <Text variant="body" tone="muted" style={{ marginTop: spacing.xs }}>
              {currentStage
                ? `Lanjutkan stage "${currentStage.label}" untuk membuka ${remainingStages} stage berikutnya.`
                : "Belum ada stage aktif. Coba refresh data atau buat stage pertama dari admin panel."}
            </Text>
          </View>
        </Card>

        <View style={{ marginTop: spacing.lg }}>
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

const styles = StyleSheet.create({
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.lg,
    gap: spacing.md },
  statGrid: {
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.lg },
  statItem: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    backgroundColor: colors.surface },
  focusBox: {
    padding: spacing.lg } });
