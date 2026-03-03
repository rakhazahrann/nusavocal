import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { BackgroundLayer } from "../../components/common/BackgroundLayer";
import { WoodPanel } from "../../components/common/WoodPanel";
import { PixelText } from "../../components/common/PixelText";
import { PixelInput } from "../../components/common/PixelInput";
import { PixelButton } from "../../components/common/PixelButton";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const AuthScreen = ({ navigation }: any) => {
  const [isLogin, setIsLogin] = useState(true);
  const insets = useSafeAreaInsets();

  return (
    <BackgroundLayer>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={styles.safeArea}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Logo Section */}
            <View style={styles.logoSection}>
              <PixelText
                size={32}
                color="#5D3A1A"
                shadow={false}
                style={styles.logoText}
              >
                NUSAVOCAL
              </PixelText>
              <View style={styles.pixelLogoDecoration} />
            </View>

            {/* Auth Card */}
            <View style={styles.cardContainer}>
              <WoodPanel variant="light" innerPadding={24}>
                {/* Tabs */}
                <View style={styles.tabContainer}>
                  <TouchableOpacity
                    onPress={() => setIsLogin(true)}
                    style={[styles.tab, isLogin && styles.activeTab]}
                  >
                    <PixelText
                      size={12}
                      color={isLogin ? "#5D3A1A" : "#D1C4B5"}
                    >
                      LOGIN
                    </PixelText>
                    {isLogin && <View style={styles.activeTabIndicator} />}
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setIsLogin(false)}
                    style={[styles.tab, !isLogin && styles.activeTab]}
                  >
                    <PixelText
                      size={12}
                      color={!isLogin ? "#5D3A1A" : "#D1C4B5"}
                    >
                      REGISTER
                    </PixelText>
                    {!isLogin && <View style={styles.activeTabIndicator} />}
                  </TouchableOpacity>
                </View>

                {/* Form */}
                <View style={styles.formContainer}>
                  <PixelInput
                    label="USERNAME"
                    iconName="person"
                    placeholder="Wayang_Singer88"
                  />

                  {!isLogin && (
                    <PixelInput
                      label="EMAIL"
                      iconName="email"
                      placeholder="vocalist@nusavocal.com"
                      keyboardType="email-address"
                    />
                  )}

                  <PixelInput
                    label="SECRET KEY"
                    iconName="lock"
                    placeholder="********"
                    secureTextEntry
                    showPasswordToggle
                  />

                  {isLogin && (
                    <View style={styles.forgotRow}>
                      <TouchableOpacity style={styles.rememberMe}>
                        <MaterialIcons
                          name="check-box-outline-blank"
                          size={18}
                          color="#5D3A1A"
                        />
                        <PixelText
                          size={8}
                          color="#5D3A1A"
                          style={{ marginLeft: 4 }}
                        >
                          REMEMBER ME
                        </PixelText>
                      </TouchableOpacity>
                      <TouchableOpacity>
                        <PixelText size={8} color="#FFB067">
                          FORGOT?
                        </PixelText>
                      </TouchableOpacity>
                    </View>
                  )}

                  <PixelButton
                    title={isLogin ? "START JOURNEY" : "CREATE ACCOUNT"}
                    communityIconName={isLogin ? "sword-cross" : "account-plus"}
                    onPress={() => navigation.navigate("CharacterSelect")}
                    style={{ marginTop: 16 }}
                  />
                </View>

                {/* Quick Entry / Social */}
                <View style={styles.socialSection}>
                  <View style={styles.dividerRow}>
                    <View style={styles.dividerLine} />
                    <PixelText
                      size={8}
                      color="#D1C4B5"
                      style={{ marginHorizontal: 8 }}
                    >
                      OR QUICK ENTRY
                    </PixelText>
                    <View style={styles.dividerLine} />
                  </View>

                  <View style={styles.socialButtons}>
                    <PixelButton
                      title=""
                      communityIconName="google"
                      variant="outline"
                      style={styles.socialBtn}
                    />
                    <PixelButton
                      title=""
                      communityIconName="apple"
                      variant="outline"
                      style={styles.socialBtn}
                    />
                  </View>
                </View>
              </WoodPanel>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <PixelText size={8} color="#5D3A1A" style={styles.footerText}>
                © 2024 NUSAVOCAL STUDIOS
              </PixelText>
              <PixelText size={8} color="#D1C4B5" style={styles.footerText}>
                LEVEL UP YOUR TRADITIONAL VOICE
              </PixelText>
            </View>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </BackgroundLayer>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 40,
  },
  logoSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoText: {
    textShadowColor: "rgba(0,0,0,1)",
    textShadowOffset: { width: 4, height: 4 },
    textShadowRadius: 0,
    letterSpacing: 2,
  },
  pixelLogoDecoration: {
    width: 60,
    height: 4,
    backgroundColor: "#f48c25",
    marginTop: 8,
  },
  cardContainer: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 24,
    borderBottomWidth: 2,
    borderBottomColor: "rgba(93, 58, 26, 0.1)",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    position: "relative",
  },
  activeTabIndicator: {
    position: "absolute",
    bottom: -2,
    width: "100%",
    height: 4,
    backgroundColor: "#f48c25",
  },
  activeTab: {},
  formContainer: {
    width: "100%",
  },
  forgotRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  rememberMe: {
    flexDirection: "row",
    alignItems: "center",
  },
  socialSection: {
    marginTop: 32,
    alignItems: "center",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(93, 58, 26, 0.2)",
  },
  socialButtons: {
    flexDirection: "row",
    gap: 16,
  },
  socialBtn: {
    width: 60,
    height: 56,
  },
  footer: {
    marginTop: 40,
    alignItems: "center",
    gap: 4,
  },
  footerText: {
    letterSpacing: 1,
  },
});
