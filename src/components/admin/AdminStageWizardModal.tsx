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
import { PixelText } from "../common/PixelText";
import { PixelButton } from "../common/PixelButton";
import { WoodPanel } from "../common/WoodPanel";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { stageService } from "../../services/stageService";
import { vocabService } from "../../services/vocabService";
import { scenarioService } from "../../services/scenarioService";
import { mediaService } from "../../services/mediaService";

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
    setOpt1("");
    setOpt2("");
    setOpt3("");
    setCorrectIdx(0);
    setScenarioBg("");
    setNpcName("SITA");
    setNpcText("");
    setExpectedVoice("");
  };

  const handeClose = () => {
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
    if (!npcText || !expectedVoice) {
      Alert.alert("Validation", "NPC Text and Expected Voice are required.");
      return;
    }

    try {
      setIsLoading(true);

      // 0. Upload Images if they are selected
      const finalStageImage = await mediaService.uploadImage(stageImage, "stages");
      const finalScenarioBg = await mediaService.uploadImage(scenarioBg, "scenarios");

      // 1. Determine next alternating X position
      const lastX = await stageService.getLastStagePosition();
      let nextX = 0.35; // default to left
      if (lastX !== null) {
        // If last was left (<= 0.5), go right (0.65). If last was right, go left.
        nextX = lastX <= 0.5 ? 0.65 : 0.35;
      }

      // 2. Insert Stage
      const stageData = await stageService.createStage({
        label: stageLabel,
        description: stageDesc,
        image_url: finalStageImage || null,
        x_position: nextX,
        sort_order: 99, // Put it at the end
      });

      const stageId = stageData.id;

      // 3. Insert Vocab Question
      const questionData = await vocabService.createVocabQuestion({
        stage_id: stageId,
        question_text: vocabQuestion,
      });

      const qId = questionData.id;

      // 4. Insert Vocab Options
      const optionsToInsert = [
        { question_id: qId, option_text: opt1, is_correct: correctIdx === 0, sort_order: 1 },
        { question_id: qId, option_text: opt2, is_correct: correctIdx === 1, sort_order: 2 },
      ];
      if (opt3) {
        optionsToInsert.push({ question_id: qId, option_text: opt3, is_correct: correctIdx === 2, sort_order: 3 });
      }

      await vocabService.createVocabOptions(optionsToInsert);

      // 5. Insert Scenario
      await scenarioService.createScenario({
        stage_id: stageId,
        background_image_url: finalScenarioBg || null,
        npc_name: npcName,
        npc_text: npcText,
        expected_voice_text: expectedVoice,
      });

      Alert.alert("Success", "Stage created successfully!");
      onSuccess();
      handeClose();
    } catch (e: any) {
      console.error("Submit error:", e);
      Alert.alert("Error", e.message || "Failed to create stage");
    } finally {
      setIsLoading(false);
    }
  };;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : Platform.OS === "android" ? "height" : undefined}
      >
        <View style={styles.modalContainer}>
          <WoodPanel variant="light" innerPadding={20} style={{ flex: 1 }}>
            
            {/* Header */}
            <View style={styles.header}>
              <View style={{ flex: 1 }}>
                <PixelText size={14} color="#5D3A1A">
                  ADD NEW STAGE
                </PixelText>
                <PixelText size={8} color="#a1887f">
                  STEP {step} OF 3
                </PixelText>
              </View>
              <TouchableOpacity onPress={handeClose} disabled={isLoading}>
                <MaterialIcons name="close" size={28} color="#5D3A1A" />
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={{ flex: 1 }}
              contentContainerStyle={styles.scrollContent} 
              showsVerticalScrollIndicator={true}
              keyboardShouldPersistTaps="handled"
            >
              
              {/* STEP 1: STAGE INFO */}
              {step === 1 && (
                <View>
                  <PixelText size={12} color="#f48c25" style={{ marginBottom: 12 }}>
                    1. Map Details
                  </PixelText>
                  <AdminInput label="Stage Name *" value={stageLabel} onChangeText={setStageLabel} placeholder="e.g. Pantai Sanur" />
                  <AdminInput label="Description" value={stageDesc} onChangeText={setStageDesc} placeholder="Short description..." />
                  <ImageUploadPlaceholder label="Popup Image (Thumbnail)" value={stageImage} onSelect={setStageImage} />
                </View>
              )}

              {/* STEP 2: VOCAB */}
              {step === 2 && (
                <View>
                  <PixelText size={12} color="#f48c25" style={{ marginBottom: 12 }}>
                    2. Vocabulary Quiz
                  </PixelText>
                  <AdminInput label="Question *" value={vocabQuestion} onChangeText={setVocabQuestion} placeholder="e.g. What is Hello?" />
                  
                  <View style={styles.optionsWrapper}>
                    <PixelText size={10} color="#5D3A1A" style={{ marginBottom: 8 }}>Options (Select Correct)</PixelText>
                    
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
                  <PixelText size={12} color="#f48c25" style={{ marginBottom: 12 }}>
                    3. Game Scenario (ASR)
                  </PixelText>
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
                <PixelButton title="BACK" onPress={handlePrev} variant="secondary" style={styles.btnHalf} disabled={isLoading} />
              )}
              {step < 3 ? (
                <PixelButton title="NEXT" onPress={handleNext} style={[styles.btnHalf, step === 1 && { width: "100%" }]} />
              ) : (
                <PixelButton
                  title={isLoading ? "SAVING..." : "SUBMIT"}
                  onPress={handleSubmit}
                  style={styles.btnHalf}
                  disabled={isLoading}
                />
              )}
            </View>

          </WoodPanel>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

// Moved outside to prevent re-mounting and losing focus
const AdminInput = ({ label, value, onChangeText, placeholder }: any) => (
  <View style={styles.inputContainer}>
    <PixelText size={10} color="#5D3A1A" style={{ marginBottom: 4 }}>
      {label}
    </PixelText>
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
      <PixelText size={10} color="#5D3A1A" style={{ marginBottom: 4 }}>
        {label}
      </PixelText>
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
            <PixelText size={10} color="#a1887f" style={{ marginTop: 8 }}>
              TAP TO UPLOAD IMAGE (2:1 RATIO)
            </PixelText>
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
    justifyContent: "flex-end",
  },
  modalContainer: {
    height: "85%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    /* overflow hidden doesn't work well on wood panel if we want to show it fully, 
       but WoodPanel uses its own corners. We'll add some padding */
    paddingTop: 10,
    marginBottom: -10, // Hide bottom wood edge if needed
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
