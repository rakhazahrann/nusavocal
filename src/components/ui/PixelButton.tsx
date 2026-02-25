import React, { useState } from "react";
import {
  TouchableOpacity,
  View,
  StyleSheet,
  TouchableOpacityProps,
} from "react-native";
import { PixelText } from "./PixelText";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

interface PixelButtonProps extends TouchableOpacityProps {
  title: string;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
}

export const PixelButton: React.FC<PixelButtonProps> = ({
  title,
  icon,
  style,
  ...props
}) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      style={[styles.container, style]}
      {...props}
    >
      {/* Shadow / Bottom layer */}
      <View style={[styles.shadowLayer, isPressed && styles.shadowPressed]} />

      {/* Main button layer */}
      <View
        style={[styles.mainLayer, isPressed ? styles.mainLayerPressed : null]}
      >
        <PixelText size={14} color="#FFF" shadow>
          {title}
        </PixelText>
        {icon && (
          <MaterialCommunityIcons
            name={icon}
            size={20}
            color="#FFF"
            style={[styles.icon, isPressed ? null : styles.iconPulse]}
          />
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
});
