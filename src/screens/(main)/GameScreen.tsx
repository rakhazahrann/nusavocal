import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  ImageBackground,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { PixelText, PixelNextButton } from "../../components/common";

const { width, height } = Dimensions.get("window");

export const GameScreen = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Background Section (Top) */}
      <View style={styles.backgroundContainer}>
        <Image
          source={require("../../../assets/images/airport-scenario.png")}
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
              Airport{"\n"}Receptionist
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
              LOREM IPSUM LOREM IPSUM LOREM IPSUM LOREM IPSUMLOREM IPSUMLOREM IPSUMLOREM IPSUM
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
          {/* User Profile Picture */}
          <Image
            source={require("../../../assets/images/characters/man-profile.png")}
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
          <PixelNextButton onPress={() => navigation.replace("Result", { win: true })} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9E8D1", // Temporarily base color since inner border is on it. Wait, the user asked for #C36A4C background with stroke weight 4 inside
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
    backgroundColor: "#C36A4C", // Base background for bottom part
    borderWidth: 4,
    borderColor: "#000000", // "stroke weight 4 inside" implying a black border
    marginTop: -2, // To avoid gaps
    paddingHorizontal: 20,
    paddingTop: 0, // Padding around the content
    zIndex: 2,
  },
  nameTagContainer: {
    alignItems: "center",
    marginTop: -20, // Overlap the Top Background
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
    paddingBottom: 20, // push text up if necessary
  },
  chatTextContainer: {
    width: "100%",
    height: "100%",
    paddingTop: 30, // account for speech bubble tail
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
