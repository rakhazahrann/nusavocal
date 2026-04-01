import React from "react";
import { Modal, View, Text, StyleSheet, ImageBackground, TouchableOpacity, Image } from "react-native";

const BORDER_POPUP = require("../../../assets/images/popup/border-popup.png");
const BORDER_IMAGE = require("../../../assets/images/popup/border-image.png");
const BUTTON_BG = require("../../../assets/images/popup/button.png");

interface StagePopupProps {
  visible: boolean;
  stageId: number | null;
  label: string;
  description?: string;
  imageUrl?: string | null;
  onCancel: () => void;
  onStart: (stageId: number) => void;
}

export const StagePopup: React.FC<StagePopupProps> = ({
  visible,
  stageId,
  label,
  description,
  imageUrl,
  onCancel,
  onStart,
}) => {
  if (!visible || stageId === null) return null;

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <ImageBackground
          source={BORDER_POPUP}
          style={styles.popupContainer}
          imageStyle={styles.popupImage}
        >
          <View style={styles.contentContainer}>
            {/* Top Image Frame Area */}
            <ImageBackground
              source={BORDER_IMAGE}
              style={styles.imageFrame}
              imageStyle={{ resizeMode: "stretch" }}
            >
              {imageUrl ? (
                <View style={styles.imageInner}>
                  <Image 
                    source={{ uri: imageUrl }} 
                    style={styles.actualImage} 
                    resizeMode="cover"
                  />
                </View>
              ) : (
                <Text style={styles.imageText}>IMAGE</Text>
              )}
            </ImageBackground>

            {/* Middle Description Area */}
            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionTitle}>{label}</Text>
              <Text style={styles.descriptionBody}>
                {description || "No description available."}
              </Text>
              <Text style={styles.descriptionSub}>
                ID: {stageId}
              </Text>
            </View>

            {/* Bottom Button Row */}
            <View style={styles.buttonRow}>
              <TouchableOpacity onPress={onCancel} style={styles.buttonWrapper}>
                <ImageBackground 
                  source={BUTTON_BG} 
                  style={styles.buttonBg} 
                  imageStyle={{ resizeMode: "stretch" }}
                >
                  <Text style={styles.buttonText}>CANCEL</Text>
                </ImageBackground>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => onStart(stageId)} style={styles.buttonWrapper}>
                <ImageBackground 
                  source={BUTTON_BG} 
                  style={styles.buttonBg} 
                  imageStyle={{ resizeMode: "stretch" }}
                >
                  <Text style={styles.buttonText}>START</Text>
                </ImageBackground>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  popupContainer: {
    width: 320,
    height: 480, // Approximate portrait layout
    justifyContent: "center",
    alignItems: "center",
  },
  popupImage: {
    resizeMode: "stretch", // Ensures the border scales well
  },
  contentContainer: {
    width: "100%",
    height: "100%",
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 40,
    justifyContent: "space-between",
    alignItems: "center",
  },
  imageFrame: {
    width: "100%",
    height: 140,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  imageInner: {
    width: "84%",
    height: "78%",
    overflow: "hidden",
    borderRadius: 8,
  },
  actualImage: {
    width: "100%",
    height: "100%",
  },
  imageText: {
    fontSize: 20,
    color: "#000",
    letterSpacing: 2,
    fontFamily: "PressStart2P-Regular", 
  },
  descriptionContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  descriptionTitle: {
    fontSize: 16,
    color: "#000",
    marginBottom: 10,
    fontFamily: "PressStart2P-Regular",
    textAlign: "center",
  },
  descriptionBody: {
    fontSize: 10,
    color: "#333",
    textAlign: "center",
    fontFamily: "PressStart2P-Regular",
    lineHeight: 16,
  },
  descriptionSub: {
    fontSize: 8,
    color: "#555",
    marginTop: 10,
    fontFamily: "PressStart2P-Regular",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 5,
    marginBottom: 10,
  },
  buttonWrapper: {
    width: "45%",
    height: 45,
  },
  buttonBg: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 10,
    color: "#fff",
    fontFamily: "PressStart2P-Regular",
    marginTop: 4, // slight adjustment to center pixel font vertically
  },
});
