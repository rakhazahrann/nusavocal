import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { GameText } from "@/components/common/GameText";
import { GameButton } from "@/components/common/GameButton";
import { Panel } from "@/components/common/Panel";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { stageService } from "@/services/stageService";
import { vocabService } from "@/services/vocabService";
import { scenarioService } from "@/services/scenarioService";
import { mediaService } from "@/services/mediaService";

export const AdminStageWizardModal: React.FC<AdminStageWizardModalProps> = ({
  visible,
  onClose,
  onSuccess,
}) => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Step 1: Stage
  const [stageLabel, setStageLabel] = useState("");
  const [stageDesc, setStageDesc] = useState("");
  const [stageImage, setStageImage] = useState("");

  // Step 2: Vocab (1 Question, 3 Options)
  const [vocabQuestion, setVocabQuestion] = useState("");
  const [vocabImage, setVocabImage] = useState("");
  const [opt1, setOpt1] = useState("");
  const [opt2, setOpt2] = useState("");
  const [opt3, setOpt3] = useState("");
  const [correctIdx, setCorrectIdx] = useState(0); // 0, 1, or 2

  // Step 3: Scenario
  const [scenarioBg, setScenarioBg] = useState("");
  const [npcName, setNpcName] = useState("SITA");
  const [npcText, setNpcText] = useState("");
  const [expectedVoice, setExpectedVoice] = useState("");

  const resetForm = () => {
    setStep(1);
    setStageLabel("");
    setStageDesc("");
    setStageImage("");
    setVocabQuestion("");
    setVocabImage("");
    setOpt1("");
    setOpt2("");
    setOpt3("");
    setCorrectIdx(0);
    setScenarioBg("");
    setNpcName("SITA");
    setNpcText("");
    setExpectedVoice("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleNext = () => {
    if (step === 1 && !stageLabel) {
      Alert.alert("Validation", "Stage Label is required.");
      return;
    }
    if (step === 2 && (!vocabQuestion || !opt1 || !opt2)) {
      Alert.alert("Validation", "Question and at least 2 options required.");
      return;
    }
    setStep(step + 1);
  };

  const handlePrev = () => setStep(step - 1);

  const handleSubmit = async () => {
    // Final Validation
    if (!stageLabel) {
      Alert.alert("Error", "Nama Stage (Step 1) harus diisi.");
      setStep(1);
      return;
    }
    if (!vocabQuestion || !opt1 || !opt2) {
      Alert.alert("Error", "Kuis Vocab (Step 2) minimal harus ada 2 pilihan.");
      setStep(2);
      return;
    }
    if (!npcText || !expectedVoice) {
      Alert.alert("Validation", "NPC Text and Expected Voice are required.");
      return;
    }

    try {
      setIsLoading(true);
      console.log("[Wizard] Starting submission...");

      // 0. Upload Images if they are selected
      console.log("[Wizard] Uploading images...");
      const finalStageImage = await mediaService.uploadImage(stageImage, "stages");
      const finalScenarioBg = await mediaService.uploadImage(scenarioBg, "scenarios");

      // 1. Determine next alternating X position
      console.log("[Wizard] Determining position...");
      const lastX = await stageService.getLastStagePosition();
      let nextX = 0.35; // default to left
      if (lastX !== null) {
        nextX = lastX <= 0.5 ? 0.65 : 0.35;
      }

      // 2. Insert Stage
      console.log("[Wizard] Creating stage record...");
      const stageData = await stageService.createStage({
        label: stageLabel,
        description: stageDesc,
        image_url: finalStageImage || null,
        x_position: nextX,
        sort_order: 99, 
      });

      const stageId = stageData.id;
      console.log(`[Wizard] Stage created with ID: ${stageId}`);

      // 3. Insert Vocab Question
      console.log("[Wizard] Uploading vocab image...");
      const finalVocabImage = await mediaService.uploadImage(vocabImage, "vocabs");

      console.log("[Wizard] Creating vocab question...");
      const questionData = await vocabService.createVocabQuestion({
        stage_id: stageId,
        question_text: vocabQuestion,
        image_url: finalVocabImage || null,
      });

      const qId = questionData.id;

      // 4. Insert Vocab Options
      console.log("[Wizard] Creating vocab options...");
      const optionsToInsert = [
        { question_id: qId, option_text: opt1, is_correct: correctIdx === 0, sort_order: 1 },
        { question_id: qId, option_text: opt2, is_correct: correctIdx === 1, sort_order: 2 },
      ];
      if (opt3) {
        optionsToInsert.push({ question_id: qId, option_text: opt3, is_correct: correctIdx === 2, sort_order: 3 });
      }

      await vocabService.createVocabOptions(optionsToInsert);

      // 5. Insert Scenario
      console.log("[Wizard] Creating scenario...");
      await scenarioService.createScenario({
        stage_id: stageId,
        background_image_url: finalScenarioBg || null,
        npc_name: npcName,
        npc_text: npcText,
        expected_voice_text: expectedVoice,
      });

      console.log("[Wizard] All records created successfully!");
      console.log("[Wizard] All records created successfully!");
      Alert.alert(
        "Berhasil! 🎉", 
        `Stage "${stageLabel}" sudah aktif di Peta.\nID Stage: ${stageId}`
      );
      onSuccess();
      handleClose();
    } catch (e: any) {
      console.error("[Wizard] Submit Critical Error:", e);
      // Give more helpful common error messages
      let msg = e.message || "Gagal menyimpan data.";
      if (msg.includes("storage")) {
        msg = "Gagal upload gambar. Pastikan bucket 'assets' sudah dibuat di Supabase Storage.";
      } else if (msg.includes("permission") || msg.includes("row-level security")) {
        msg = "Akses Ditolak. Pastikan role Anda sudah 'admin' di tabel profiles.";
      }
      
      Alert.alert("Gagal Simpan", msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : Platform.OS === "android" ? "height" : undefined}
      >
        <View style={styles.modalContainer}>
          <Panel variant="light" innerPadding={20} style={{ flex: 1 }} outerStyle={{ flex: 1 }}>
            
            {/* Header */}
            <View style={styles.header}>
              <View style={{ flex: 1 }}>
                <GameText size={14} color="#5D3A1A">
                  ADD NEW STAGE
                </GameText>
                <GameText size={8} color="#a1887f">
                  STEP {step} OF 3
                </GameText>
              </View>
              <TouchableOpacity onPress={handleClose} disabled={isLoading}>
                <MaterialIcons name="close" size={28} color="#5D3A1A" />
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={{ flex: 1 }}
              contentContainerStyle={styles.scrollContent} 
              showsVerticalScrollIndicator={true}
              keyboardShouldPersistTaps="handled"
              nestedScrollEnabled={true}
            >
              
              {/* STEP 1: STAGE INFO */}
              {step === 1 && (
                <View>
                  <GameText size={12} color="#f48c25" style={{ marginBottom: 12 }}>
                    1. Map Details
                  </GameText>
                  <AdminInput label="Stage Name *" value={stageLabel} onChangeText={setStageLabel} placeholder="e.g. Pantai Sanur" />
                  <AdminInput label="Description" value={stageDesc} onChangeText={setStageDesc} placeholder="Short description..." />
                  <ImageUploadPlaceholder label="Popup Image (Thumbnail)" value={stageImage} onSelect={setStageImage} />
                </View>
              )}

              {/* STEP 2: VOCAB */}
              {step === 2 && (
                <View>
                  <GameText size={12} color="#f48c25" style={{ marginBottom: 12 }}>
                    2. Vocabulary Quiz
                  </GameText>
                  <AdminInput label="Question *" value={vocabQuestion} onChangeText={setVocabQuestion} placeholder="e.g. What is Hello?" />
                  <ImageUploadPlaceholder label="Question Image (Optional)" value={vocabImage} onSelect={setVocabImage} />
                  
                  <View style={styles.optionsWrapper}>
                    <GameText size={10} color="#5D3A1A" style={{ marginBottom: 8 }}>Options (Select Correct)</GameText>
                    
                    {[ { v: opt1, s: setOpt1, idx: 0 }, { v: opt2, s: setOpt2, idx: 1 }, { v: opt3, s: setOpt3, idx: 2 } ].map((opt, i) => (
                      <View key={i} style={styles.optionRow}>
                        <TouchableOpacity
                          style={correctIdx === opt.idx ? styles.radioSelected : styles.radioUnselected}
                          onPress={() => setCorrectIdx(opt.idx)}
                        >
                          {correctIdx === opt.idx && <View style={styles.radioInner} />}
                        </TouchableOpacity>
                        <TextInput
                          style={[styles.input, { flex: 1, marginBottom: 0 }]}
                          value={opt.v}
                          onChangeText={opt.s}
                          placeholder={`Option ${i + 1}`}
                        />
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* STEP 3: SCENARIO */}
              {step === 3 && (
                <View>
                  <GameText size={12} color="#f48c25" style={{ marginBottom: 12 }}>
                    3. Game Scenario (ASR)
                  </GameText>
                  <ImageUploadPlaceholder label="Background Image" value={scenarioBg} onSelect={setScenarioBg} />
                  <AdminInput label="NPC Name *" value={npcName} onChangeText={setNpcName} placeholder="SITA" />
                  <AdminInput label="NPC Text *" value={npcText} onChangeText={setNpcText} placeholder="Selamat Pagi!" />
                  <AdminInput label="Expected Answer (Voice) *" value={expectedVoice} onChangeText={setExpectedVoice} placeholder="Selamat Pagi" />
                </View>
              )}

            </ScrollView>

            {/* Footer Buttons */}
            <View style={styles.footer}>
              {step > 1 && (
                <GameButton title="BACK" onPress={handlePrev} variant="secondary" style={styles.btnHalf} disabled={isLoading} />
              )}
              {step < 3 ? (
                <GameButton title="NEXT" onPress={handleNext} style={[styles.btnHalf, step === 1 && { width: "100%" }]} />
              ) : (
                <GameButton
                  title={isLoading ? "SAVING..." : "SUBMIT"}
                  onPress={handleSubmit}
                  style={styles.btnHalf}
                  disabled={isLoading}
                />
              )}
            </View>

          </Panel>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

// Moved outside to prevent re-mounting and losing focus
const AdminInput = ({ label, value, onChangeText, placeholder }: any) => (
  <View style={styles.inputContainer}>
    <GameText size={10} color="#5D3A1A" style={{ marginBottom: 4 }}>
      {label}
    </GameText>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#a1887f"
    />
  </View>
);

const ImageUploadPlaceholder = ({ label, value, onSelect }: any) => {
  const handlePickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [2, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        onSelect(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Could not pick image");
    }
  };

  return (
    <View style={styles.inputContainer}>
      <GameText size={10} color="#5D3A1A" style={{ marginBottom: 4 }}>
        {label}
      </GameText>
      <TouchableOpacity 
        style={styles.imageUploadBox} 
        onPress={handlePickImage}
        activeOpacity={0.8}
      >
        {value ? (
          <Image source={{ uri: value }} style={styles.previewImage} />
        ) : (
          <>
            <MaterialIcons name="add-photo-alternate" size={32} color="#a1887f" />
            <GameText size={10} color="#a1887f" style={{ marginTop: 8 }}>
              TAP TO UPLOAD IMAGE (2:1 RATIO)
            </GameText>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

interface AdminStageWizardModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  modalContainer: {
    height: "75%",
    borderRadius: 20,
    paddingTop: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#D1C4B5",
    paddingBottom: 10,
  },
  scrollContent: {
    paddingBottom: 40, // Increased bottom padding to ensure scrollability past the keyboard/footer
    flexGrow: 1,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#FFF9F2",
    borderWidth: 2,
    borderColor: "#D1C4B5",
    padding: 10,
    fontFamily: "SpaceGrotesk-Medium",
    color: "#5D3A1A",
    fontSize: 14,
  },
  imageUploadBox: {
    backgroundColor: "#FFF9F2",
    borderWidth: 2,
    borderColor: "#D1C4B5",
    borderStyle: "dashed",
    aspectRatio: 2, // 2:1 aspect ratio
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    overflow: "hidden",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  optionsWrapper: {
    backgroundColor: "rgba(255,255,255,0.5)",
    padding: 12,
    borderWidth: 2,
    borderColor: "#D1C4B5",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  radioUnselected: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#D1C4B5",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  radioSelected: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#f48c25",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#f48c25",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 2,
    borderTopColor: "#D1C4B5",
  },
  btnHalf: {
    flex: 1,
    marginHorizontal: 4,
  },
});
