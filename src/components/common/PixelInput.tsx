import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
} from "react-native";
import { PixelText } from "./PixelText";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

interface PixelInputProps extends TextInputProps {
  label: string;
  iconName?: keyof typeof MaterialIcons.glyphMap;
  communityIconName?: keyof typeof MaterialCommunityIcons.glyphMap;
  showPasswordToggle?: boolean;
  variant?: "light" | "dark";
}

export const PixelInput: React.FC<PixelInputProps> = ({
  label,
  iconName,
  communityIconName,
  showPasswordToggle,
  secureTextEntry,
  variant = "light",
  style,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);

  return (
    <View style={styles.container}>
      <PixelText
        size={10}
        color={variant === "dark" ? "#FFF" : "#5d3a1a"}
        style={styles.label}
      >
        {label}
      </PixelText>

      <View
        style={[
          styles.inputWrapper,
          variant === "dark" ? styles.inputWrapperDark : null,
          isFocused ? styles.inputWrapperFocused : null,
          style,
        ]}
      >
        {iconName && (
          <MaterialIcons
            name={iconName}
            size={24}
            color={variant === "dark" ? "#FFF" : "#5d3a1a"}
            style={styles.icon}
          />
        )}
        {communityIconName && (
          <MaterialCommunityIcons
            name={communityIconName}
            size={24}
            color={variant === "dark" ? "#FFF" : "#5d3a1a"}
            style={styles.icon}
          />
        )}
        <TextInput
          style={[styles.input, variant === "dark" && { color: "#FFF" }]}
          placeholderTextColor={variant === "dark" ? "#666" : "#a1887f"}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          {...props}
        />
        {showPasswordToggle && secureTextEntry && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={styles.toggleIcon}
          >
            <MaterialIcons
              name={isPasswordVisible ? "visibility" : "visibility-off"}
              size={20}
              color={variant === "dark" ? "#FFF" : "#5d3a1a"}
            />
          </TouchableOpacity>
        )}
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
    backgroundColor: "#FFFCF9", // Lighter cream
    borderWidth: 4,
    borderColor: "#5D3A1A", // Dark brown retro border
    shadowColor: "#000",
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 0,
    elevation: 2,
    padding: 4,
    borderRadius: 2,
  },
  inputWrapperFocused: {
    borderColor: "#FFB067", // Retro orange focus
  },
  inputWrapperDark: {
    backgroundColor: "#111111",
    borderColor: "#FFFFFF",
    borderWidth: 2,
  },
  icon: {
    paddingHorizontal: 8,
  },
  toggleIcon: {
    paddingHorizontal: 8,
  },
  input: {
    flex: 1,
    height: 48,
    fontFamily: "SpaceGrotesk_400Regular",
    fontSize: 16, // Slightly larger for better readability
    color: "#5D3A1A",
    backgroundColor: "transparent",
    paddingHorizontal: 12,
  },
});
