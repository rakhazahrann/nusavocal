import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Platform,
  Modal,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

interface StagePopupProps {
  visible: boolean;
  stageId: number | null;
  label: string;
  description?: string;
  onCancel: () => void;
  onStart: (stageId: number) => void;
}

const { width } = Dimensions.get("window");

export const StagePopup: React.FC<StagePopupProps> = ({
  visible,
  stageId,
  label,
  description,
  onCancel,
  onStart,
}) => {
  if (!visible || stageId === null) return null;

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onCancel}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Modal Backdrop */}
          <View style={styles.backdrop}>
            {/* Centered Modal Card */}
            <View style={styles.modalCardWrapper}>
              <View style={styles.modalCard}>
                
                {/* Visual Header Banner - Short & Compact */}
                <View style={styles.heroContainer}>
                  <Image
                    source={{
                      uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuC6B-y_wMUpflzCt6Zqj1SFAWjHomIORe0fn6ZXZGP9oDnaUWoiIFpgob0_nUQlHNaEl1LonpH_hp9NMIG0hFvLUf01fTzu6Cg1gHpNJNRAabu_uL_pvvWxZW-D343ki9PGA8sBwVhpt1XkiPluf3qaafV4y15pNZKudSo-RUXuhfyQrqBdtNp6IJJDqfvDMBTvTUagIFRO_V5TraSb40MeqmYZtyPA_Qrcw1kK81TviOinOM8feD0sAY9FUR5Z_jTOrneFokpnjvqI",
                    }}
                    style={styles.heroImage}
                    resizeMode="cover"
                  />
                  <LinearGradient
                    colors={["transparent", "rgba(0,0,0,0.6)", "rgba(0,0,0,0.95)"]}
                    style={styles.heroGradient}
                  />
                  
                  {/* Close Button */}
                  <TouchableOpacity style={styles.closeButton} onPress={onCancel} activeOpacity={0.7}>
                    <MaterialIcons name="close" size={18} color="#ffffff" />
                  </TouchableOpacity>

                  <View style={styles.heroContent}>
                    <Text style={styles.heroSubtitle}>MODULE 0{stageId}</Text>
                    <View style={styles.titleRow}>
                      <Text style={styles.heroTitle} numberOfLines={1}>{label}</Text>
                      <View style={styles.badgeGlass}>
                        <MaterialIcons name="schedule" size={12} color="#ffffff" />
                        <Text style={styles.badgeText}>5 MINS</Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Content Body - No ScrollView */}
                <View style={styles.bodyContainer}>
                  
                  {/* Learning Objectives Row 1 */}
                  <View style={styles.listItem}>
                    <View style={styles.iconWrapper}>
                      <MaterialIcons name="translate" size={18} color="#1a1c1c" />
                    </View>
                    <View style={styles.listTextContent}>
                      <Text style={styles.listTitle}>Essential Lexicon</Text>
                      <Text style={styles.listDesc} numberOfLines={2}>
                        Master 20 travel-focused words including security & logistics.
                      </Text>
                    </View>
                  </View>

                  {/* Learning Objectives Row 2 */}
                  <View style={styles.listItem}>
                    <View style={styles.iconWrapper}>
                      <MaterialIcons name="settings-voice" size={18} color="#1a1c1c" />
                    </View>
                    <View style={styles.listTextContent}>
                      <Text style={styles.listTitle}>Voice Scenarios</Text>
                      <Text style={styles.listDesc} numberOfLines={2}>
                        Practice real-time dialogue with AI customs & ground crew.
                      </Text>
                    </View>
                  </View>

                  {/* Divider */}
                  <View style={styles.divider} />

                  {/* Stats - Compact Row */}
                  <View style={styles.statsContainer}>
                    <View style={styles.avatarsWrapper}>
                      <Image source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuD_MArNw6qBSwKYtVVdRecGj3LxCgWMTPYDP0ihZAs66mmnuemP6YSYOjlG50NCcC_KHVXcHYl8VkzT27lG5owAZMf8LrOXLpgDpUJYkU6sgUK4eNu-rKAyQmozvxMNDL00ajB9AQjt0PHdB5D_uZIT84MxmS21tc_fJYMeWneSFWA0mIUgEJg40GFRYX4vc4zXCdK3hs7LoODPkf8XMlc2WBDoAV8AvPQMcuuGPPPPMnfarJdCWn7a-x_DXqk6rQt_8bDfPgQe8tAF" }} style={[styles.avatarImg, { zIndex: 3 }]} />
                      <Image source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAF8RBab8hK8ZRpAntrjpF5HW3VXJAhPcoIW-auYdsYR9y6utXxdsRlLclQMH888rurNdS0KFqIrf002zQiH5S37WjQsP0zHlCYaGSAikU4_dVMSvB1ceI-XdmiS9FnEtQQ62vcyIeX9qwey_xJIVCjeP0n-OpSEHEYqj08nmPWO-E1Z9n4sQXo0OU_dhAj_yi1zSk4f-jxEOGNfV1WNOxzIJYI3_erId1Z4C7zZDi1lkKj8L1L9qZBulO8Z-dXyYy3pleqtqQCwvpW" }} style={[styles.avatarImg, { marginLeft: -8, zIndex: 2 }]} />
                      <View style={[styles.avatarPlus, { marginLeft: -8, zIndex: 1 }]}>
                        <Text style={styles.avatarPlusText}>12k</Text>
                      </View>
                    </View>
                    <Text style={styles.statsText} numberOfLines={1}>
                      Linguists completed this.
                    </Text>
                  </View>

                  {/* Fixed Footer Actions */}
                  <TouchableOpacity style={styles.startButton} onPress={() => onStart(stageId)} activeOpacity={0.8}>
                    <Text style={styles.startButtonText}>START LESSON</Text>
                  </TouchableOpacity>
                  
                </View>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "transparent" },
  container: { flex: 1, backgroundColor: "transparent" },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 20,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  modalCardWrapper: {
    width: "100%",
    maxWidth: 380,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.2,
    shadowRadius: 30,
    elevation: 20,
  },
  modalCard: {
    width: "100%",
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#ffffff",
  },
  heroContainer: {
    width: "100%",
    height: 140, // Fixed small height
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  closeButton: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 40,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroContent: {
    position: "absolute",
    bottom: 12,
    left: 16,
    right: 16,
    zIndex: 10,
  },
  heroSubtitle: {
    fontFamily: "SpaceGrotesk-Bold",
    fontSize: 9,
    color: "rgba(255, 255, 255, 0.7)",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heroTitle: {
    fontFamily: "SpaceGrotesk-Bold",
    fontSize: 24,
    color: "#ffffff",
    letterSpacing: -0.5,
    flex: 1,
    marginRight: 8,
  },
  badgeGlass: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  badgeText: {
    fontFamily: "SpaceGrotesk-Bold",
    fontSize: 9,
    color: "#ffffff",
    letterSpacing: 1,
    marginLeft: 4,
  },
  bodyContainer: {
    padding: 20,
    backgroundColor: "#ffffff", // solid white for pristine readability
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 12,
    backgroundColor: "rgba(26, 28, 28, 0.05)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    marginTop: 2,
  },
  listTextContent: {
    flex: 1,
  },
  listTitle: {
    fontFamily: "SpaceGrotesk-Bold",
    fontSize: 13,
    color: "#1a1c1c",
    marginBottom: 2,
  },
  listDesc: {
    fontFamily: "SpaceGrotesk-Regular",
    fontSize: 11,
    color: "rgba(26, 28, 28, 0.6)",
    lineHeight: 16,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.06)",
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  avatarsWrapper: {
    flexDirection: "row",
    marginRight: 10,
  },
  avatarImg: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#ffffff",
  },
  avatarPlus: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#e2e2e2",
    borderWidth: 1.5,
    borderColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarPlusText: {
    fontFamily: "SpaceGrotesk-Bold",
    fontSize: 7,
    color: "#1a1c1c",
  },
  statsText: {
    flex: 1,
    fontFamily: "SpaceGrotesk-Medium",
    fontSize: 11,
    color: "rgba(26, 28, 28, 0.5)",
  },
  startButton: {
    width: "100%",
    backgroundColor: "#000000",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  startButtonText: {
    fontFamily: "SpaceGrotesk-Bold",
    fontSize: 12,
    color: "#ffffff",
    letterSpacing: 2,
  },
});

