import React, { useMemo, useState } from "react";
import { Alert, Image, Pressable, StyleSheet, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Button, Card, Screen, Text } from "../../components/ui";
import { EnterAnimatedView } from "../../motion/EnterAnimatedView";
import { colors, radius, spacing } from "../../theme";
import { useAuthStore, Gender } from "../../stores/authStore";

const CHARACTERS = [
  {
    id: "ira",
    name: "IRA",
    gender: "man" as Gender,
    description: "Ira is a master of Central Javanese melodies.",
    image: require("../../../assets/images/characters/man-chara.png"),
  },
  {
    id: "sita",
    name: "SITA",
    gender: "woman" as Gender,
    description: "Sita is a master of Sundanese melodies.",
    image: require("../../../assets/images/characters/woman-chara.png"),
  },
];

export const CharacterSelectScreen = ({ navigation }: any) => {
  const [selectedId, setSelectedId] = useState("ira");
  const { updateProfile, isLoading } = useAuthStore();

  const selectedChar = useMemo(
    () => CHARACTERS.find((c) => c.id === selectedId),
    [selectedId]
  );

  const handleContinue = async () => {
    if (!selectedChar) return;

    const result = await updateProfile({
      gender: selectedChar.gender,
      character_id: selectedChar.id,
    });

    if (result.success) {
      navigation.navigate("ProfileCreation", {
        characterId: selectedId,
      });
    } else {
      Alert.alert("Error", result.error || "Failed to save character selection.");
    }
  };

  return (
    <Screen>
      <EnterAnimatedView style={{ flex: 1 }}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
            <MaterialIcons name="arrow-back" size={24} color={colors.text} />
          </Pressable>
          <Text variant="label" weight="semibold">
            Choose character
          </Text>
          <View style={{ width: 40 }} />
        </View>

        <Text variant="body" tone="muted" style={{ marginTop: spacing.sm }}>
          Pilih karakter untuk memulai perjalanan.
        </Text>

        <View style={styles.cardsRow}>
          {CHARACTERS.map((char) => {
            const selected = selectedId === char.id;
            return (
              <Pressable key={char.id} onPress={() => setSelectedId(char.id)} style={{ flex: 1 }}>
                <Card
                  padded={false}
                  style={[styles.charCard, selected && styles.charCardSelected]}
                >
                  <View style={styles.charTop}>
                    <Text variant="label" weight="bold">
                      {char.name}
                    </Text>
                    <View style={styles.genderBadge}>
                      <Text variant="caption" tone="muted">
                        {char.gender === "man" ? "♂" : "♀"}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.imageWrap}>
                    <Image source={char.image} style={styles.charImage} />
                  </View>

                  {selected ? (
                    <View style={styles.checkBadge}>
                      <MaterialIcons name="check" size={18} color={colors.surface} />
                    </View>
                  ) : null}
                </Card>
              </Pressable>
            );
          })}
        </View>

        <Card style={{ marginTop: spacing.md }}>
          <Text variant="label" weight="semibold">
            About
          </Text>
          <Text variant="body" tone="muted" style={{ marginTop: spacing.sm }}>
            {selectedChar?.description}
          </Text>
        </Card>

        <View style={{ marginTop: spacing.lg }}>
          <Button label={isLoading ? "Saving..." : "Continue"} onPress={handleContinue} loading={isLoading} />
        </View>
      </EnterAnimatedView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
  },
  cardsRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  charCard: {
    height: 220,
    overflow: "hidden",
  },
  charCardSelected: {
    borderColor: colors.accent,
  },
  charTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  genderBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    backgroundColor: colors.background,
  },
  imageWrap: {
    flex: 1,
    padding: spacing.md,
  },
  charImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  checkBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: colors.accent,
    width: 28,
    height: 28,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
});
