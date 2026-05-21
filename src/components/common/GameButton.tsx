import React, { useState } from "react";
import {
  TouchableOpacity,
  View,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { GameText } from "./GameText";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { GameButtonProps } from "@/types/components";
import { colors } from "@/constants/colors";

export const GameButton: React.FC<GameButtonProps> = ({
  title,
  icon,
  communityIconName,
  variant = "primary",
  isLoading = false,
  style,
  disabled,
  ...props
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const getTheme = () => {
    switch (variant) {
      case "secondary":
        return {
          main: colors.mint,
          shadow: colors.parchmentText,
          text: colors.parchmentText,
        };
      case "outline":
        return {
          main: colors.white,
          shadow: colors.border,
          text: colors.text,
        };
      case "adventure":
        return {
          main: colors.adventure,
          shadow: colors.adventureDark,
          text: colors.white,
        };
      case "danger":
        return {
          main: colors.danger,
          shadow: colors.accentDark,
          text: colors.white,
        };
      default:
        return {
          main: colors.accent,
          shadow: colors.accentDark,
          text: colors.white,
        };
    }
  };

  const theme = getTheme();

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      style={[styles.container, style, (disabled || isLoading) && styles.disabled]}
      disabled={disabled || isLoading}
      {...props}
    >
      {/* Shadow / Bottom layer */}
      <View
        style={[
          styles.shadowLayer,
          { backgroundColor: theme.shadow },
          isPressed && styles.shadowPressed,
        ]}
      />

      {/* Main button layer */}
      <View
        style={[
          styles.mainLayer,
          {
            backgroundColor: theme.main,
            borderColor: variant === "outline" ? theme.shadow : colors.white,
          },
          isPressed ? styles.mainLayerPressed : null,
        ]}
      >
        {isLoading ? (
          <ActivityIndicator color={theme.text} size="small" />
        ) : (
          <>
            <GameText size={12} color={theme.text} shadow={variant !== "outline"}>
              {title}
            </GameText>
            {icon && (
              <MaterialCommunityIcons
                name={icon}
                size={18}
                color={theme.text}
                style={[styles.icon, isPressed ? null : styles.iconPulse]}
              />
            )}
            {communityIconName && (
              <MaterialCommunityIcons
                name={communityIconName}
                size={18}
                color={theme.text}
                style={[styles.icon, isPressed ? null : styles.iconPulse]}
              />
            )}
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    position: "relative",
    height: 56, // Fixed height to handle translate
  },
  shadowLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.accentDark, // primary-dark
    top: 4,
    left: 4,
    borderRadius: 2,
  },
  shadowPressed: {
    top: 0,
    left: 0,
  },
  mainLayer: {
    backgroundColor: colors.accent, // primary
    borderColor: colors.white,
    borderWidth: 2,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    borderRadius: 2, // Minimal for pixel look
  },
  mainLayerPressed: {
    backgroundColor: colors.accentDark, // slightly darker on press
    transform: [{ translateX: 4 }, { translateY: 4 }],
  },
  icon: {
    marginLeft: 12,
  },
  iconPulse: {
    // simplified for react native core, full animation would use Reanimated
    opacity: 0.9,
  },
  disabled: {
    opacity: 0.6,
  },
});
