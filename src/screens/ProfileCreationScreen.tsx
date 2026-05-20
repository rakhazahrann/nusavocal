import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Screen } from "@/components/ui/Screen";
import { Text } from "@/components/ui/Text";
import { EnterAnimatedView } from "@/components/motion/EnterAnimatedView";
import { colors } from "@/constants/colors";
import { useAuthStore } from "@/store/authStore";
import { supabase } from "@/services/supabase";

export const ProfileCreationScreen = ({ navigation }: any) => {
  const [nickname, setNickname] = useState("");
  const { updateProfile, isLoading, user } = useAuthStore();

  const handleFinish = async () => {
    if (!nickname.trim()) {
      Alert.alert("Error", "Please enter a nickname.");
      return;
    }

    const result = await updateProfile({ nickname: nickname.trim() });
    if (result.success) {
      if (user) {
        try {
          const { data: existing } = await supabase
            .from("user_progress")
            .select("id")
            .eq("user_id", user.id)
            .limit(1);

          if (!existing || existing.length === 0) {
            const { data: firstStage } = await supabase
              .from("stages")
              .select("id")
              .eq("is_active", true)
              .order("sort_order", { ascending: true })
              .limit(1)
              .single();

            if (firstStage) {
              await supabase.from("user_progress").insert({
                user_id: user.id,
                stage_id: firstStage.id,
                status: "current",
              });
            }
          }
        } catch (e) {
          console.error("Progress init error:", e);
        }
      }

      navigation.replace("Main");
    } else {
      Alert.alert("Error", result.error || "Failed to save nickname.");
    }
  };

  return (
    <Screen padded={false}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView className="bg-background" contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <EnterAnimatedView>
            <View className="px-lg pb-xxl pt-xxl">
              <View className="flex-row items-center justify-between">
                <Pressable
                  onPress={() => navigation.goBack()}
                  className="h-10 w-10 items-center justify-center rounded-pill border border-border bg-surface"
                >
                  <MaterialIcons name="arrow-back" size={24} color={colors.text} />
                </Pressable>
                <Text variant="label" weight="semibold">
                  Profile setup
                </Text>
                <View className="w-10" />
              </View>

              <Text variant="title" weight="bold" className="mt-lg">
                Choose your nickname
              </Text>
              <Text variant="body" tone="muted" className="mt-sm">
                Ini akan tampil di profil dan leaderboard.
              </Text>

              <Card className="mt-lg">
                <View className="mt-md">
                  <Input
                    label="Nickname"
                    placeholder="BudiVocal"
                    value={nickname}
                    onChangeText={setNickname}
                    maxLength={12}
                    autoCapitalize="none"
                    autoCorrect={false}
                    helperText="Max 12 karakter."
                  />
                </View>

                <View className="mt-lg">
                  <Button label={isLoading ? "Saving..." : "Finish"} onPress={handleFinish} loading={isLoading} />
                </View>
              </Card>

              <Text variant="caption" tone="muted" className="mt-lg text-center">
                Mulai perjalanan belajarmu.
              </Text>
            </View>
          </EnterAnimatedView>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
};
