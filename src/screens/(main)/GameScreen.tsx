import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  ImageBackground,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { PixelText, PixelNextButton } from "../../components/common";
import { useAuthStore } from "../../stores/authStore";
import { useGameStore, GameScenario } from "../../stores/gameStore";

const { width, height } = Dimensions.get("window");

// Profile images based on gender
const PROFILE_IMAGES = {
  man: require("../../../assets/images/characters/man-profile.png"),
  woman: require("../../../assets/images/characters/woman-profile.png"),
};

// Fallback background for when no scenario image is available
const FALLBACK_BG = require("../../../assets/images/airport-scenario.png");

export const GameScreen = ({ navigation, route }: any) => {
  const { stageId } = route?.params || {};
  const { profile } = useAuthStore();
  const { currentScenarios, fetchGameScenarios, isLoading } = useGameStore();
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);

  useEffect(() => {
    if (stageId) {
      fetchGameScenarios(stageId);
    }
  }, [stageId]);

  const scenario: GameScenario | null = currentScenarios[currentScenarioIndex] || null;

  // Determine profile image based on gender
  const profileImage = profile?.gender === "woman"
    ? PROFILE_IMAGES.woman
    : PROFILE_IMAGES.man;

  // Determine background image
  const backgroundSource = scenario?.background_image_url
    ? { uri: scenario.background_image_url }
    : FALLBACK_BG;

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#f48c25" />
        <PixelText size={10} color="#5D3A1A" style={{ marginTop: 16 }}>
          LOADING SCENARIO...
        </PixelText>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Background Section (Top) */}
      <View style={styles.backgroundContainer}>
        <Image
          source={backgroundSource}
          style={styles.backgroundImage}
        />
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Image
            source={require("../../../assets/images/game/back-button.png")}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* Content Section (Bottom) */}
      <View style={styles.contentContainer}>
        {/* Name Tag */}
        <View style={styles.nameTagContainer}>
          <ImageBackground
            source={require("../../../assets/images/game/name-box.png")}
            style={styles.nameTagBackground}
            resizeMode="stretch"
          >
            <PixelText
              family="pixelify"
              weight="600"
              size={12}
              color="#FFFFFF"
              style={styles.nameText}
              shadow={false}
            >
              {scenario?.npc_name || "NPC"}
            </PixelText>
          </ImageBackground>
        </View>

        {/* NPC Chat Box */}
        <ImageBackground
          source={require("../../../assets/images/game/chat-box.png")}
          style={styles.chatBoxBackground}
          resizeMode="stretch"
        >
          <View style={styles.chatTextContainer}>
            <PixelText
              family="pixelify"
              weight="500"
              size={14}
              color="#000000"
              style={styles.chatText}
            >
              {scenario?.npc_text || "Hello, welcome! Let's practice your language skills."}
            </PixelText>
          </View>
        </ImageBackground>

        {/* User Chat Box */}
        <View style={styles.userChatContainer}>
          <ImageBackground
            source={require("../../../assets/images/game/chat-box-2.png")}
            style={styles.userChatBoxBackground}
            resizeMode="stretch"
          >
            <View style={styles.userChatTextContainer}>
              <PixelText
                family="pixelify"
                weight="500"
                size={12}
                color="#000000"
                style={styles.userChatText}
              >
                {"< User guide Voice >"}
              </PixelText>
            </View>
          </ImageBackground>
          {/* User Profile Picture - gender-based */}
          <Image
            source={profileImage}
            style={styles.userProfileImage}
            resizeMode="contain"
          />
        </View>

        {/* Mic Button Area */}
        <View style={styles.micArea}>
          <TouchableOpacity activeOpacity={0.8} style={styles.micButton}>
            <Image
              source={require("../../../assets/images/game/Mic.png")}
              style={styles.micIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        {/* Footer Area */}
        <View style={styles.footer}>
          <PixelNextButton onPress={() => navigation.replace("Result", { win: true, stageId })} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9E8D1",
  },
  backgroundContainer: {
    height: height * 0.38,
    width: "100%",
    position: "relative",
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 10,
  },
  backIcon: {
    width: 60,
    height: 60,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#C36A4C",
    borderWidth: 4,
    borderColor: "#000000",
    marginTop: -2,
    paddingHorizontal: 20,
    paddingTop: 0,
    zIndex: 2,
  },
  nameTagContainer: {
    alignItems: "center",
    marginTop: -20,
    marginBottom: -10,
    zIndex: 5,
  },
  nameTagBackground: {
    width: 150,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  nameText: {
    textAlign: "center",
    lineHeight: 18,
  },
  chatBoxBackground: {
    width: "100%",
    height: 140,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  chatTextContainer: {
    width: "100%",
    height: "100%",
    paddingTop: 30,
    paddingHorizontal: 10,
  },
  chatText: {
    lineHeight: 20,
    textAlign: "left",
  },
  userChatContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 20,
    position: "relative",
  },
  userChatBoxBackground: {
    width: 280,
    height: 60,
    justifyContent: "center",
    paddingHorizontal: 20,
    marginRight: 10,
  },
  userChatTextContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  userChatText: {
    textAlign: "center",
  },
  userProfileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: "hidden",
    position: "absolute",
    right: 10,
    top: -30,
    zIndex: 3,
  },
  micArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  micButton: {
    width: 150,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  micIcon: {
    width: "100%",
    height: "100%",
  },
  footer: {
    alignItems: "flex-end",
    paddingBottom: 20,
    paddingRight: 10,
  },
});
