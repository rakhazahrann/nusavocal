import React from "react";
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from "react-native";
import { GameText } from "@/components/common/GameText";
import { GameButton } from "@/components/common/GameButton";
import { Panel } from "@/components/common/Panel";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

interface AdminDeleteConfirmModalProps {
  visible: boolean;
  stageLabel: string;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export const AdminDeleteConfirmModal: React.FC<AdminDeleteConfirmModalProps> = ({
  visible,
  stageLabel,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Panel variant="light" innerPadding={24}>
            <View style={styles.header}>
              <MaterialIcons name="warning" size={32} color="#d9534f" />
              <GameText size={14} color="#5D3A1A" style={{ marginTop: 12 }}>
                KONFIRMASI HAPUS
              </GameText>
            </View>

            <View style={styles.body}>
              <GameText size={10} color="#5D3A1A" style={styles.message}>
                Apakah Anda yakin ingin menghapus stage {"\n"}
                <GameText size={11} color="#d9534f">"{stageLabel}"</GameText>?
              </GameText>
              
              <GameText size={8} color="#a1887f" style={styles.subMessage}>
                Tindakan ini juga akan menghapus quiz Vocab dan Skenario terkait secara permanen.
              </GameText>
            </View>

            <View style={styles.footer}>
              <View style={styles.buttonContainer}>
                <GameButton
                  title="BATAL"
                  onPress={onClose}
                  variant="secondary"
                  disabled={isLoading}
                />
              </View>
              <View style={styles.buttonContainer}>
                <GameButton
                  title="HAPUS"
                  onPress={onConfirm}
                  variant="danger"
                  disabled={isLoading}
                  isLoading={isLoading}
                />
              </View>
            </View>
          </Panel>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    width: "100%",
    maxWidth: 400,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  body: {
    marginBottom: 24,
    alignItems: "center",
  },
  message: {
    textAlign: "center",
    lineHeight: 18,
  },
  subMessage: {
    textAlign: "center",
    marginTop: 12,
    lineHeight: 14,
  },
  footer: {
    flexDirection: "row",
    gap: 12,
  },
  buttonContainer: {
    flex: 1,
  },
});
