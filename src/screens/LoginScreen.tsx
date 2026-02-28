import React from "react";
import { View, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import { BackgroundLayer } from "../components/common/BackgroundLayer";
import { WoodPanel } from "../components/common/WoodPanel";
import { PixelText } from "../components/common/PixelText";
import { PixelInput } from "../components/common/PixelInput";
import { PixelButton } from "../components/common/PixelButton";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export const LoginScreen = ({ navigation }: any) => {
  return (
    <BackgroundLayer>
      <SafeAreaView style={styles.safeArea}>
        {/* Top Bar Area */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back" size={28} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.topRightIcons}>
            <TouchableOpacity style={styles.iconButton}>
              <MaterialIcons name="settings" size={24} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <MaterialIcons name="volume-up" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Main Content Area */}
        <View style={styles.contentContainer}>
          {/* Logo Section */}
          <View style={styles.logoSection}>
            <PixelText size={28} color="#f48c25" shadow style={styles.logoText}>
              NusaVocal
            </PixelText>
            <PixelText
              size={10}
              color="rgba(255,255,255,0.8)"
              style={styles.subtitle}
            >
              LEARN JAVANESE RPG
            </PixelText>
          </View>

          {/* Login Card */}
          <View style={styles.cardContainer}>
            <WoodPanel innerPadding={24}>
              <View style={styles.cardHeader}>
                <PixelText size={14} color="#3e2723" style={styles.cardTitle}>
                  LOGIN PEMAIN
                </PixelText>
                <View style={styles.dashedLine} />
              </View>

              <View style={styles.formContainer}>
                <PixelInput
                  label="Nama Pengguna"
                  iconName="person"
                  placeholder="Username"
                />

                <PixelInput
                  label="Kata Sandi"
                  iconName="lock"
                  placeholder="Password"
                  secureTextEntry
                />

                <PixelButton
                  title="MASUK"
                  icon="sword-cross"
                  onPress={() => navigation.replace("Main")}
                  style={{ marginTop: 8 }}
                />
              </View>

              {/* Links */}
              <View style={styles.linksContainer}>
                <TouchableOpacity>
                  <PixelText size={10} color="#5d3a1a" style={styles.linkText}>
                    Lupa Password?
                  </PixelText>
                </TouchableOpacity>
                <View style={styles.linkDivider} />
                <View style={styles.signupContainer}>
                  <PixelText size={10} color="#5d3a1a">
                    Belum punya akun?{" "}
                  </PixelText>
                  <TouchableOpacity>
                    <PixelText
                      size={10}
                      color="#f48c25"
                      style={styles.signupLink}
                    >
                      Daftar Akun
                    </PixelText>
                  </TouchableOpacity>
                </View>
              </View>
            </WoodPanel>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <PixelText size={8} color="rgba(255,255,255,0.6)">
              v1.0.2 - Beta Build
            </PixelText>
          </View>
        </View>
      </SafeAreaView>
    </BackgroundLayer>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 24,
    opacity: 0.8,
  },
  topRightIcons: {
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {
    padding: 4,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    paddingBottom: 48,
  },
  logoSection: {
    alignItems: "center",
    marginBottom: 32,
    marginTop: 32,
  },
  logoText: {
    textShadowColor: "rgba(0,0,0,1)",
    textShadowOffset: { width: 4, height: 4 },
    textShadowRadius: 0,
  },
  subtitle: {
    marginTop: 8,
    letterSpacing: 2,
  },
  cardContainer: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },
  cardHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  cardTitle: {
    marginBottom: 8,
  },
  dashedLine: {
    width: "100%",
    height: 2,
    borderBottomWidth: 2,
    borderColor: "#3e2723",
    borderStyle: "dashed",
  },
  formContainer: {
    gap: 16,
  },
  linksContainer: {
    marginTop: 24,
    alignItems: "center",
    gap: 12,
  },
  linkText: {
    textDecorationLine: "underline",
    textDecorationStyle: "dotted",
  },
  linkDivider: {
    width: "100%",
    height: 1,
    backgroundColor: "rgba(93, 58, 26, 0.2)",
  },
  signupContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  signupLink: {
    textDecorationLine: "underline",
  },
  footer: {
    marginTop: 32,
    alignItems: "center",
  },
});
