import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { BackgroundLayer } from "../../components/common/BackgroundLayer";
import { PixelText } from "../../components/common/PixelText";
import { PixelInput } from "../../components/common/PixelInput";
import { PixelButton } from "../../components/common/PixelButton";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAuthStore } from "../../stores/authStore";
import { supabase } from "../../api/supabase";

const CHARACTERS: any = {
  ira: {
    name: "IRA",
    image: require("../../../assets/images/characters/man-profile.png"),
  },
  sita: {
    name: "SITA",
    image: require("../../../assets/images/characters/woman-profile.png"),
  },
};

export const ProfileCreationScreen = ({ navigation, route }: any) => {
  const { characterId = "ira" } = route.params || {};
  const [nickname, setNickname] = useState("");
  const character = CHARACTERS[characterId];
  const { updateProfile, isLoading, user } = useAuthStore();

  const handleFinish = async () => {
    if (!nickname.trim()) {
      Alert.alert("Error", "Please enter a nickname.");
      return;
    }

    const result = await updateProfile({ nickname: nickname.trim() });
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
    <BackgroundLayer>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <MaterialIcons name="arrow-back" size={28} color="#5d3a1a" />
              </TouchableOpacity>
              <PixelText size={10} color="#5d3a1a" style={styles.headerTitle}>
                STEP 3 OF 3
              </PixelText>
            </View>

            {/* Title Section */}
            <View style={styles.titleSection}>
              <PixelText size={24} color="#5d3a1a" style={styles.title}>
                CHOOSE YOUR NICKNAME
              </PixelText>
              <PixelText size={10} color="#a1887f" style={styles.subtitle}>
                Welcome to Nusavocal, Traveler!
              </PixelText>
            </View>

            {/* Nickname Input Section */}
            <View style={styles.inputContainer}>
              <PixelInput
                label="IDENTITY INPUT"
                iconName="badge"
                placeholder="Budi_Vocalist"
                value={nickname}
                onChangeText={setNickname}
                maxLength={12}
              />
              <PixelText size={8} color="#a1887f" style={styles.inputHint}>
                MAX 12 CHARACTERS. NO SPECIAL CHARACTERS ALLOWED.
              </PixelText>
            </View>

            {/* Hero Preview */}
            <View style={styles.previewSection}>
              <View style={styles.avatarBorder}>
                <Image source={character.image} style={styles.avatar} />
              </View>
              <PixelText size={8} color="#a1887f" style={styles.previewLabel}>
                PREVIEW HERO
              </PixelText>
            </View>

            <View style={{ flex: 1 }} />

            {/* Final Action */}
            <PixelButton
              title={isLoading ? "SAVING..." : "FINISH ADVENTURE"}
              icon="controller-classic"
              onPress={handleFinish}
              style={styles.finishBtn}
              disabled={isLoading}
            />

            {isLoading && (
              <ActivityIndicator
                size="small"
                color="#f48c25"
                style={{ marginTop: 8 }}
              />
            )}

            <PixelText size={8} color="#a1887f" style={styles.footerHint}>
              Press Start to begin your musical journey across the archipelago.
            </PixelText>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </BackgroundLayer>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    marginRight: 28,
    color: "#5D3A1A",
  },
  titleSection: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 60,
  },
  title: {
    textAlign: "center",
    marginBottom: 8,
    color: "#5D3A1A",
  },
  subtitle: {
    letterSpacing: 1,
    color: "#D1C4B5",
  },
  inputContainer: {
    marginBottom: 40,
  },
  inputHint: {
    marginTop: 8,
    textAlign: "center",
    color: "#D1C4B5",
  },
  previewSection: {
    alignItems: "center",
    marginTop: 20,
  },
  avatarBorder: {
    width: 100,
    height: 100,
    backgroundColor: "#FFFFFF",
    borderWidth: 4,
    borderColor: "#5D3A1A",
    padding: 8,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 0,
  },
  avatar: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  previewLabel: {
    letterSpacing: 1,
    color: "#D1C4B5",
  },
  finishBtn: {
    width: "100%",
    marginBottom: 12,
  },
  footerHint: {
    textAlign: "center",
    color: "#D1C4B5",
  },
});
