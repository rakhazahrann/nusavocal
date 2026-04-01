import React, { useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";
import { Card, Screen, Text, Button } from "../components/ui";
import { colors, radius, spacing } from "../theme";
import { useAuthStore } from "../stores/authStore";
import { useGameStore } from "../stores/gameStore";
import { EnterAnimatedView } from "../motion/EnterAnimatedView";

const PROFILE_IMAGES = {
  man: require("../../assets/images/characters/man-profile.png"),
  woman: require("../../assets/images/characters/woman-profile.png"),
};

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

  const profileImage = profile?.gender === "woman" ? PROFILE_IMAGES.woman : PROFILE_IMAGES.man;

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
            <Image source={profileImage} style={styles.avatar} />
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
    gap: spacing.md,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: radius.pill,
    backgroundColor: colors.border,
  },
  statGrid: {
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.lg,
  },
  statItem: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
  },
});
