import React, { useState } from "react";
import {
  TouchableOpacity,
  View,
  StyleSheet,
  TouchableOpacityProps,
  ActivityIndicator,
} from "react-native";
import { GameText } from "./GameText";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { GameButtonProps } from "@/types/components";



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
          main: "#AEECEF", // Retro Mint
          shadow: "#5D3A1A",
          text: "#5D3A1A",
        };
      case "outline":
        return {
          main: "#FFFFFF",
          shadow: "#D1C4B5",
          text: "#5D3A1A",
        };
      case "adventure":
        return {
          main: "#1E88E5", // Bright Adventure Blue
          shadow: "#0D47A1", // Dark Navy Shadow
          text: "#FFFFFF",
        };
      case "danger":
        return {
          main: "#d9534f", // Retro Red
          shadow: "#5D3A1A",
          text: "#FFFFFF",
        };
      default:
        return {
          main: "#FFB067", // Retro Peach/Orange
          shadow: "#5D3A1A",
          text: "#5D3A1A",
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
            borderColor: variant === "outline" ? theme.shadow : "#FFF",
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
    backgroundColor: "#c0630b", // primary-dark
    top: 4,
    left: 4,
    borderRadius: 2,
  },
  shadowPressed: {
    top: 0,
    left: 0,
  },
  mainLayer: {
    backgroundColor: "#f48c25", // primary
    borderColor: "#FFF",
    borderWidth: 2,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    borderRadius: 2, // Minimal for pixel look
  },
  mainLayerPressed: {
    backgroundColor: "#e37a15", // slightly darker on press
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
