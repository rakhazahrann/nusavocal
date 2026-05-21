import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
} from "react-native";
import { GameText } from "./GameText";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { GameInputProps } from "@/types/components";
import { colors } from "@/constants/colors";



export const GameInput: React.FC<GameInputProps> = ({
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
      <GameText
        size={10}
        color={variant === "dark" ? colors.white : colors.parchmentText}
        style={styles.label}
      >
        {label}
      </GameText>

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
            color={variant === "dark" ? colors.white : colors.parchmentText}
            style={styles.icon}
          />
        )}
        {communityIconName && (
          <MaterialCommunityIcons
            name={communityIconName}
            size={24}
            color={variant === "dark" ? colors.white : colors.parchmentText}
            style={styles.icon}
          />
        )}
        <TextInput
          style={[styles.input, variant === "dark" && { color: colors.white }]}
          placeholderTextColor={variant === "dark" ? colors.darkGray : colors.parchmentMuted}
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
              color={variant === "dark" ? colors.white : colors.parchmentText}
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
    backgroundColor: colors.parchmentLight,
    borderWidth: 4,
    borderColor: colors.parchmentText, // Dark brown retro border
    shadowColor: colors.black,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 0,
    elevation: 2,
    padding: 4,
    borderRadius: 2,
  },
  inputWrapperFocused: {
    borderColor: colors.accent, // Organic green focus
  },
  inputWrapperDark: {
    backgroundColor: colors.black,
    borderColor: colors.white,
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
    fontFamily: "Poppins-Regular",
    fontSize: 16, // Slightly larger for better readability
    color: colors.parchmentText,
    backgroundColor: "transparent",
    paddingHorizontal: 12,
  },
});
