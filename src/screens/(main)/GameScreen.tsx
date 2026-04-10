import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
  Animated,
  Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useAuthStore } from "../../stores/authStore";
import { useGameStore, GameScenario } from "../../stores/gameStore";

const { width, height } = Dimensions.get("window");

// Profile images based on gender
const PROFILE_IMAGES = {
  man: require("../../../assets/images/characters/man-profile.png"),
  woman: require("../../../assets/images/characters/woman-profile.png"),
};

// Placeholder modern background
const FALLBACK_BGURI = "https://lh3.googleusercontent.com/aida-public/AB6AXuC6B-y_wMUpflzCt6Zqj1SFAWjHomIORe0fn6ZXZGP9oDnaUWoiIFpgob0_nUQlHNaEl1LonpH_hp9NMIG0hFvLUf01fTzu6Cg1gHpNJNRAabu_uL_pvvWxZW-D343ki9PGA8sBwVhpt1XkiPluf3qaafV4y15pNZKudSo-RUXuhfyQrqBdtNp6IJJDqfvDMBTvTUagIFRO_V5TraSb40MeqmYZtyPA_Qrcw1kK81TviOinOM8feD0sAY9FUR5Z_jTOrneFokpnjvqI";

export const GameScreen = ({ navigation, route }: any) => {
  const { stageId, vocabScore = 0 } = route?.params || {};
  const { profile } = useAuthStore();
  const { currentScenarios, fetchGameScenarios, isLoading } = useGameStore();
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);

  // Pulse animation for mic
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (stageId) {
      fetchGameScenarios(stageId);
    }
  }, [stageId]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.15, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  }, [pulseAnim]);

  const scenario: GameScenario | null = currentScenarios[currentScenarioIndex] || null;

  const profileImage = profile?.gender === "woman" ? PROFILE_IMAGES.woman : PROFILE_IMAGES.man;
  const backgroundSource = scenario?.background_image_url || FALLBACK_BGURI;

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={styles.loadingText}>Loading scenario...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Dynamic Background Image - Placeholder for actual stage art */}
      <Image source={{ uri: backgroundSource }} style={StyleSheet.absoluteFillObject} blurRadius={Platform.OS === 'android' ? 8 : 12} />
      
      {/* Dimming Overlay */}
      <View style={styles.dimOverlay} />

      <SafeAreaView style={styles.safeArea}>
        {/* Top Navbar */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialIcons name="arrow-back-ios" size={20} color="#ffffff" style={{ marginLeft: 6 }} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.npcTitle}>{scenario?.npc_name || "NPC Placeholder"}</Text>
            <View style={styles.statusIndicator}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Active Dialogue</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.npcAvatarPlaceholder}>
              <MaterialIcons name="person" size={24} color="#ffffff" />
            </View>
          </View>
        </View>

        {/* Chat Area */}
        <View style={styles.chatContainer}>
          
          {/* NPC Bubble */}
          <View style={styles.npcRow}>
            <View style={styles.npcAvatarSmall}>
              <MaterialIcons name="person" size={16} color="#ffffff" />
            </View>
            <BlurView intensity={70} tint="light" style={styles.npcBubble}>
              <Text style={styles.npcText}>
                {scenario?.npc_text || "Hello, welcome! Let's practice your language skills. Please respond clearly."}
              </Text>
            </BlurView>
          </View>

          {/* User Bubble */}
          <View style={styles.userRow}>
             <View style={styles.userBubbleWrapper}>
               <LinearGradient colors={["rgba(26, 28, 28, 0.9)", "rgba(0, 0, 0, 0.95)"]} style={styles.userBubble}>
                 <Text style={styles.userText}>{"< User Guide Voice Placeholder >\n\n(Wait for prompt or speak now)"}</Text>
               </LinearGradient>
             </View>
             {/* User Profile Avatar */}
             <View style={styles.userAvatarContainer}>
               <Image source={profileImage} style={styles.userAvatar} />
             </View>
          </View>

        </View>

        {/* Interaction Footer */}
        <View style={styles.footerContainer}>
          {/* Pulsing Mic System */}
          <View style={styles.micArea}>
            <Animated.View style={[styles.micPulseRing, { transform: [{ scale: pulseAnim }], opacity: pulseAnim.interpolate({ inputRange: [1, 1.15], outputRange: [0.5, 0] }) }]} />
            <TouchableOpacity activeOpacity={0.8} style={styles.micButton}>
              <LinearGradient colors={["#000000", "#1a1c1c"]} style={styles.micGradient}>
                <MaterialIcons name="mic" size={32} color="#ffffff" />
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Action Button */}
          <View style={styles.bottomBar}>
            <TouchableOpacity 
              style={styles.nextButton} 
              activeOpacity={0.8}
              onPress={() => navigation.replace("Result", { win: true, stageId, vocabScore })}
            >
              <Text style={styles.nextButtonText}>CONTINUE</Text>
              <MaterialIcons name="arrow-forward" size={18} color="#000000" />
            </TouchableOpacity>
          </View>
        </View>

      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1c1c",
  },
  dimOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  safeArea: {
    flex: 1,
    justifyContent: "space-between",
  },
  loadingText: {
    fontFamily: "SpaceGrotesk-Medium",
    fontSize: 14,
    color: "#ffffff",
    marginTop: 16,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  headerCenter: {
    alignItems: "center",
  },
  npcTitle: {
    fontFamily: "SpaceGrotesk-Bold",
    fontSize: 16,
    color: "#ffffff",
    letterSpacing: -0.5,
  },
  statusIndicator: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#4cd964",
    marginRight: 6,
  },
  statusText: {
    fontFamily: "SpaceGrotesk-Medium",
    fontSize: 10,
    color: "rgba(255,255,255,0.6)",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  headerRight: {
    width: 44,
    height: 44,
    alignItems: "flex-end",
  },
  npcAvatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  npcRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 24,
  },
  npcAvatarSmall: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    marginBottom: 4,
  },
  npcBubble: {
    maxWidth: width * 0.75,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 24,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
    backgroundColor: "rgba(255,255,255,0.6)",
    overflow: "hidden",
  },
  npcText: {
    fontFamily: "SpaceGrotesk-Medium",
    fontSize: 15,
    color: "#000000",
    lineHeight: 22,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    marginBottom: 24,
  },
  userBubbleWrapper: {
    marginRight: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  userBubble: {
    maxWidth: width * 0.75,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 24,
    borderBottomRightRadius: 4,
  },
  userText: {
    fontFamily: "SpaceGrotesk-Regular",
    fontSize: 14,
    color: "#ffffff",
    lineHeight: 22,
    opacity: 0.8,
  },
  userAvatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#ffffff",
    padding: 2,
    marginBottom: 4,
  },
  userAvatar: {
    width: "100%",
    height: "100%",
    borderRadius: 14,
  },
  footerContainer: {
    paddingBottom: Platform.OS === 'ios' ? 24 : 32,
    alignItems: "center",
  },
  micArea: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
    height: 100,
  },
  micPulseRing: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  micButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  micGradient: {
    width: "100%",
    height: "100%",
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.2)",
  },
  bottomBar: {
    width: "100%",
    paddingHorizontal: 32,
    alignItems: "flex-end",
  },
  nextButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 99,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  nextButtonText: {
    fontFamily: "SpaceGrotesk-Bold",
    fontSize: 12,
    color: "#000000",
    letterSpacing: 2,
    marginRight: 8,
  },
});
