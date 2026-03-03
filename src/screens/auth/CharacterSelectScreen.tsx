import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Dimensions,
} from "react-native";
import { BackgroundLayer } from "../../components/common/BackgroundLayer";
import { PixelText } from "../../components/common/PixelText";
import { PixelButton } from "../../components/common/PixelButton";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const { width } = Dimensions.get("window");

const CHARACTERS = [
  {
    id: "ira",
    name: "IRA",
    description: "Ira is a master of Central Javanese melodies.",
    image: require("../../assets/images/characters/man-chara.png"),
  },
  {
    id: "sita",
    name: "SITA",
    description: "Sita is a master of Sundanese melodies.",
    image: require("../../assets/images/characters/woman-chara.png"),
  },
];

export const CharacterSelectScreen = ({ navigation }: any) => {
  const [selectedId, setSelectedId] = useState("ira");

  const selectedChar = CHARACTERS.find((c) => c.id === selectedId);

  return (
    <BackgroundLayer>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <MaterialIcons name="arrow-back" size={28} color="#5d3a1a" />
            </TouchableOpacity>
            <PixelText size={10} color="#5d3a1a" style={styles.headerTitle}>
              WHO ARE YOU?
            </PixelText>
          </View>

          {/* Title Section */}
          <View style={styles.titleSection}>
            <PixelText size={24} color="#5d3a1a" style={styles.title}>
              Pick Your Character
            </PixelText>
            <PixelText size={10} color="#a1887f" style={styles.subtitle}>
              A MUSICAL JOURNEY AWAITS
            </PixelText>
          </View>

          {/* Character Cards */}
          <View style={styles.cardsContainer}>
            {CHARACTERS.map((char) => (
              <TouchableOpacity
                key={char.id}
                onPress={() => setSelectedId(char.id)}
                activeOpacity={0.9}
                style={[
                  styles.charCard,
                  selectedId === char.id && styles.selectedCard,
                ]}
              >
                <View style={styles.imageWrapper}>
                  <Image source={char.image} style={styles.charImage} />
                </View>
                <View style={styles.nameBadge}>
                  <PixelText size={10} color="#FFF">
                    {char.name}
                  </PixelText>
                </View>
                {selectedId === char.id && (
                  <View style={styles.checkBadge}>
                    <MaterialIcons name="check" size={16} color="#FFF" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Description Section */}
          <View style={styles.descriptionBox}>
            <PixelText size={12} color="#5d3a1a" style={styles.descriptionText}>
              {selectedChar?.description}
            </PixelText>
          </View>

          {/* Progress Indicator */}
          <View style={styles.progressDots}>
            <View style={styles.dot} />
            <View style={[styles.dot, styles.activeDot]} />
            <View style={styles.dot} />
          </View>

          {/* Continue Button */}
          <PixelButton
            title="CONTINUE"
            onPress={() =>
              navigation.navigate("ProfileCreation", {
                characterId: selectedId,
              })
            }
            style={styles.continueBtn}
          />
        </View>
      </SafeAreaView>
    </BackgroundLayer>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    marginRight: 28, // Offset back button
    color: "#5D3A1A",
  },
  titleSection: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  title: {
    textAlign: "center",
    marginBottom: 8,
    color: "#5D3A1A",
  },
  subtitle: {
    letterSpacing: 1,
    color: "#D1C4B5",
  },
  cardsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 40,
  },
  charCard: {
    flex: 1,
    aspectRatio: 0.8,
    backgroundColor: "#FFFFFF",
    borderWidth: 4,
    borderColor: "#D1C4B5",
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 0,
  },
  selectedCard: {
    borderColor: "#FFB067",
    backgroundColor: "#FFF9F2",
    shadowOpacity: 0.2,
  },
  imageWrapper: {
    flex: 1,
    width: "100%",
  },
  charImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  nameBadge: {
    backgroundColor: "#FFB067",
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginTop: 8,
  },
  checkBadge: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#FFB067",
    width: 24,
    height: 24,
    borderRadius: 2,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  descriptionBox: {
    paddingHorizontal: 32,
    marginBottom: 40,
  },
  descriptionText: {
    textAlign: "center",
    lineHeight: 20,
    color: "#5D3A1A",
  },
  progressDots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 24,
  },
  dot: {
    width: 10,
    height: 10,
    backgroundColor: "#D1C4B5",
    transform: [{ rotate: "45deg" }],
  },
  activeDot: {
    backgroundColor: "#FFB067",
  },
  continueBtn: {
    width: "100%",
  },
});
