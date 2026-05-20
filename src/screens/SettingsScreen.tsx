import React from "react";
import { Switch, View } from "react-native";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Screen } from "@/components/ui/Screen";
import { Text } from "@/components/ui/Text";
import { EnterAnimatedView } from "@/components/motion/EnterAnimatedView";
import { colors } from "@/constants/colors";
import { useAuthStore } from "@/store/authStore";
import { useSettingsStore } from "@/store/settingsStore";

export const SettingsScreen = () => {
  const { signOut } = useAuthStore();
  const { sfxEnabled, musicEnabled, reduceMotion, setSfxEnabled, setMusicEnabled, setReduceMotion } =
    useSettingsStore();

  return (
    <Screen>
      <EnterAnimatedView style={{ flex: 1 }}>
        <Text variant="title" weight="bold">
          Settings
        </Text>
        <Text variant="body" tone="muted" className="mt-sm">
          Preferensi aplikasi.
        </Text>

        <Card className="mt-lg">
          <View className="flex-row items-center justify-between px-lg py-md">
            <View className="mr-lg flex-1">
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

          <View className="flex-row items-center justify-between border-t border-border px-lg py-md">
            <View className="mr-lg flex-1">
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

          <View className="flex-row items-center justify-between border-t border-border px-lg py-md">
            <View className="mr-lg flex-1">
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

        <View className="mt-lg">
          <Button label="Logout" variant="secondary" onPress={() => signOut()} />
          <Text variant="caption" tone="muted" className="mt-sm">
            NusaVocal v1.0
          </Text>
        </View>
      </EnterAnimatedView>
    </Screen>
  );
};
