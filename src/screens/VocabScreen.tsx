import React from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/Text";
import { Screen } from "@/components/ui/Screen";

export const VocabScreen = () => {
  return (
    <Screen>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text variant="title" weight="bold">
          Vocab
        </Text>
      </View>
    </Screen>
  );
};
