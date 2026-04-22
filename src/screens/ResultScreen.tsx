import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { ScreenWrapper } from "../components/common/ScreenWrapper";
import { GameText } from "../components/common/GameText";
import { useAuthStore } from "../stores/authStore";
import { useGameStore } from "../stores/gameStore";

export const ResultScreen = ({ route, navigation }: any) => {
  const { stageId, vocabScore = 0, gameScore = 0, win } = route.params || {};
  const { user } = useAuthStore();
  const { saveProgress } = useGameStore();

  const [isSaving, setIsSaving] = useState(true);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Simpan progress ke DB saat screen ditampilkan
  useEffect(() => {
    const doSave = async () => {
      if (!user?.id || !stageId) {
        setIsSaving(false);
        return;
      }
      try {
        const result = await saveProgress(user.id, stageId, gameScore, vocabScore);
        if (!result.success) {
          setSaveError(result.error || "Gagal menyimpan progress.");
        }
      } catch (e: any) {
        setSaveError(e.message || "Terjadi kesalahan.");
      } finally {
        setIsSaving(false);
      }
    };
    doSave();
  }, []);

  return (
    <ScreenWrapper style={styles.container}>
      {isSaving ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#f48c25" />
          <GameText size={10} color="#5D3A1A" style={{ marginTop: 12 }}>
            MENYIMPAN PROGRESS...
          </GameText>
        </View>
      ) : (
        <>
          <GameText
            family="pixelify"
            weight="700"
            size={22}
            color={win ? "#f48c25" : "#C0392B"}
            style={styles.title}
          >
            {win ? "✨ STAGE CLEAR! ✨" : "💀 GAME OVER 💀"}
          </GameText>

          {/* Tampilkan skor vocab */}
          <View style={styles.scoreBox}>
            <GameText size={12} color="#5B4434" style={{ marginBottom: 4 }}>
              VOCAB SCORE
            </GameText>
            <GameText family="pixelify" weight="700" size={28} color="#f48c25">
              {vocabScore}
            </GameText>
          </View>

          <View style={styles.scoreBox}>
            <GameText size={12} color="#5B4434" style={{ marginBottom: 4 }}>
              SPEAKING SCORE
            </GameText>
            <GameText family="pixelify" weight="700" size={28} color="#f48c25">
              {gameScore}
            </GameText>
          </View>

          {saveError && (
            <GameText size={9} color="#C0392B" style={styles.errorText}>
              ⚠ {saveError}
            </GameText>
          )}

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.popToTop()}
          >
            <GameText family="pixelify" weight="600" size={14} color="#FFFFFF">
              KEMBALI KE PETA
            </GameText>
          </TouchableOpacity>
        </>
      )}
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  loadingBox: {
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: 24,
  },
  scoreBox: {
    alignItems: "center",
    backgroundColor: "rgba(93, 58, 26, 0.1)",
    borderWidth: 2,
    borderColor: "#5D3A1A",
    paddingHorizontal: 40,
    paddingVertical: 16,
    marginBottom: 24,
  },
  errorText: {
    textAlign: "center",
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#f48c25",
    borderWidth: 3,
    borderColor: "#5D3A1A",
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 4,
    marginTop: 8,
  },
});
