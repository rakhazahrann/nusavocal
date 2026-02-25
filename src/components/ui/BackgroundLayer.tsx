import React from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface BackgroundLayerProps {
  children?: React.ReactNode;
}

const BG_URL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBINUjVsQWj2YFi9gU3eT7kE6SqeXf0xd56vVMK2uq0NUxpdexwJFeDRxeYv1PA4UDuwVn4VsPxW2Be10w5FXf9Z0DuXOc0WLhry-4isgdA0Vow5Qczr2fl5on-6ub1iMgOVlpoz5sgyRcBJ4yevGlE9uiBYC-0avRmfCK5MVAuJXrigxrs8EmjxZVs6Z7hZfLl_sUZG49MbWjNPNqS1BRbW32s53pz5HqmFLB5pZ6Q_7gxyzql7pL_vjAuRasC6VKAyxhAzL87sBNN";

export const BackgroundLayer: React.FC<BackgroundLayerProps> = ({
  children,
}) => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: BG_URL }}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      >
        {/* Dark overlay gradient matching HTML from-background-dark via/80 to transparent */}
        <LinearGradient
          colors={["transparent", "rgba(34, 25, 16, 0.8)", "#221910"]}
          locations={[0, 0.5, 1]}
          style={StyleSheet.absoluteFill}
        />
      </ImageBackground>

      {/* Content wrapper */}
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f7f5", // fallback background-light
  },
  content: {
    flex: 1,
    zIndex: 10,
  },
});
