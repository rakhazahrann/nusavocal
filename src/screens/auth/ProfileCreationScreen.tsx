import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Button, Card, Input, Screen, Text } from "../../components/ui";
import { EnterAnimatedView } from "../../motion/EnterAnimatedView";
import { colors, radius, spacing } from "../../theme";
import { useAuthStore } from "../../stores/authStore";
import { supabase } from "../../api/supabase";


export const ProfileCreationScreen = ({ navigation }: any) => {
  const [nickname, setNickname] = useState("");
  const { updateProfile, isLoading, user } = useAuthStore();

  const handleFinish = async () => {
    if (!nickname.trim()) {
      Alert.alert("Error", "Please enter a nickname.");
      return;
    }

    const result = await updateProfile({ 
      nickname: nickname.trim(),
    });
    if (result.success) {
      // Initialize first stage progress
      if (user) {
        try {
          // Check if user already has progress
          const { data: existing } = await supabase
            .from('user_progress')
            .select('id')
            .eq('user_id', user.id)
            .limit(1);

          if (!existing || existing.length === 0) {
            // Get first stage
            const { data: firstStage } = await supabase
              .from('stages')
              .select('id')
              .eq('is_active', true)
              .order('sort_order', { ascending: true })
              .limit(1)
              .single();

            if (firstStage) {
              await supabase
                .from('user_progress')
                .insert({
                  user_id: user.id,
                  stage_id: firstStage.id,
                  status: 'current',
                });
            }
          }
        } catch (e) {
          console.error('Progress init error:', e);
        }
      }

      navigation.replace("Main");
    } else {
      Alert.alert("Error", result.error || "Failed to save nickname.");
    }
  };

  return (
    <Screen padded={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <EnterAnimatedView>
            <View style={styles.headerRow}>
              <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
                <MaterialIcons name="arrow-back" size={24} color={colors.text} />
              </Pressable>
              <Text variant="label" weight="semibold">
                Profile setup
              </Text>
              <View style={{ width: 40 }} />
            </View>

            <Text variant="title" weight="bold" style={{ marginTop: spacing.lg }}>
              Choose your nickname
            </Text>
            <Text variant="body" tone="muted" style={{ marginTop: spacing.sm }}>
              Ini akan tampil di profil dan leaderboard.
            </Text>

            <Card style={{ marginTop: spacing.lg }}>

              <View style={{ marginTop: spacing.md }}>
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

              <View style={{ marginTop: spacing.lg }}>
                <Button label={isLoading ? "Saving..." : "Finish"} onPress={handleFinish} loading={isLoading} />
              </View>
            </Card>

            <Text variant="caption" tone="muted" style={{ marginTop: spacing.lg, textAlign: "center" }}>
              Mulai perjalanan belajarmu.
            </Text>
          </EnterAnimatedView>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxl,
    backgroundColor: colors.background,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
  },
});
