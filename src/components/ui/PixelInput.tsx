import React, { useState } from "react";
import { View, TextInput, StyleSheet, TextInputProps } from "react-native";
import { PixelText } from "./PixelText";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

interface PixelInputProps extends TextInputProps {
  label: string;
  iconName?: keyof typeof MaterialIcons.glyphMap;
}

export const PixelInput: React.FC<PixelInputProps> = ({
  label,
  iconName,
  style,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      <PixelText size={10} color="#5d3a1a" style={styles.label}>
        {label}
      </PixelText>

      <View
        style={[
          styles.inputWrapper,
          isFocused ? styles.inputWrapperFocused : null,
          style,
        ]}
      >
        {iconName && (
          <MaterialIcons
            name={iconName}
            size={24}
            color="#5d3a1a"
            style={styles.icon}
          />
        )}
        <TextInput
          style={styles.input}
          placeholderTextColor="#a1887f"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    gap: 8,
    marginBottom: 16,
  },
  label: {
    textTransform: "uppercase",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderWidth: 4,
    borderColor: "#5d3a1a",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 0,
    elevation: 2,
    padding: 4,
  },
  inputWrapperFocused: {
    borderColor: "#f48c25", // primary focus color
  },
  icon: {
    paddingHorizontal: 8,
  },
  input: {
    flex: 1,
    height: 48,
    fontFamily: "PressStart2P-Regular", // Use exact font match
    fontSize: 12,
    color: "#3e2723",
    backgroundColor: "transparent",
    paddingHorizontal: 8,
  },
});
