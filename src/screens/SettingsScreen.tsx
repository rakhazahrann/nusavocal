import { colors } from "@/constants/colors";
import { spacing } from "@/constants/spacing";
import React from "react";
import { StyleSheet, Switch, View } from "react-native";
import { Screen } from "@/components/ui/Screen";
import { Text } from "@/components/ui/Text";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

import { useSettingsStore } from "@/store/settingsStore";
import { useAuthStore } from "@/store/authStore";
import { EnterAnimatedView } from "@/components/motion/EnterAnimatedView";

export const SettingsScreen = () => {
  const { signOut } = useAuthStore();
  const {
    sfxEnabled,
    musicEnabled,
    reduceMotion,
    setSfxEnabled,
    setMusicEnabled,
    setReduceMotion } = useSettingsStore();

  return (
    <Screen>
      <EnterAnimatedView style={{ flex: 1 }}>
        <Text variant="title" weight="bold">
          Settings
        </Text>
        <Text variant="body" tone="muted" style={{ marginTop: spacing.sm }}>
          Preferensi aplikasi.
        </Text>

        <Card style={{ marginTop: spacing.lg }}>
          <View style={styles.row}>
            <View style={styles.rowText}>
              <Text variant="label" weight="semibold">
                SFX
              </Text>
              <Text variant="caption" tone="muted">
                Efek suara di aplikasi.
              </Text>
            </View>
            <Switch
              value={sfxEnabled}
              onValueChange={setSfxEnabled}
              trackColor={{ false: colors.border, true: colors.accent }}
              thumbColor={colors.surface}
            />
          </View>

          <View style={[styles.row, styles.rowBorder]}>
            <View style={styles.rowText}>
              <Text variant="label" weight="semibold">
                Music
              </Text>
              <Text variant="caption" tone="muted">
                Musik latar.
              </Text>
            </View>
            <Switch
              value={musicEnabled}
              onValueChange={setMusicEnabled}
              trackColor={{ false: colors.border, true: colors.accent }}
              thumbColor={colors.surface}
            />
          </View>

          <View style={[styles.row, styles.rowBorder]}>
            <View style={styles.rowText}>
              <Text variant="label" weight="semibold">
                Reduce Motion
              </Text>
              <Text variant="caption" tone="muted">
                Kurangi animasi untuk kenyamanan.
              </Text>
            </View>
            <Switch
              value={reduceMotion}
              onValueChange={setReduceMotion}
              trackColor={{ false: colors.border, true: colors.accent }}
              thumbColor={colors.surface}
            />
          </View>
        </Card>

        <View style={{ marginTop: spacing.lg }}>
          <Button label="Logout" variant="secondary" onPress={() => signOut()} />
          <Text variant="caption" tone="muted" style={{ marginTop: spacing.sm }}>
            NusaVocal v1.0
          </Text>
        </View>
      </EnterAnimatedView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg },
  rowBorder: {
    borderTopWidth: 1,
    borderTopColor: colors.border },
  rowText: {
    flex: 1,
    marginRight: spacing.lg } });
