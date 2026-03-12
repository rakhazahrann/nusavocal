import React from "react";
import { TouchableOpacity, Image, StyleSheet, TouchableOpacityProps, ViewStyle } from "react-native";

interface PixelNextButtonProps extends TouchableOpacityProps {
  style?: ViewStyle | ViewStyle[];
  hidden?: boolean;
}

export const PixelNextButton: React.FC<PixelNextButtonProps> = ({ 
  style, 
  hidden = false,
  ...props 
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.container, 
        hidden && styles.hidden,
        style
      ]}
      {...props}
    >
      <Image
        source={require("../../../assets/images/game/next-button.png")}
        style={styles.icon}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  hidden: {
    opacity: 0,
  },
  icon: {
    width: 100,
    height: 45,
  },
});
