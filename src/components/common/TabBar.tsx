import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Pressable, LayoutChangeEvent, Animated, Platform } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import gsap from "gsap";

export const CustomTabBar = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  const [tabPositions, setTabPositions] = useState<{ x: number; width: number }[]>([]);

  const cursorX = useRef(new Animated.Value(0)).current;
  const cursorWidth = useRef(new Animated.Value(0)).current;
  const cursorOpacity = useRef(new Animated.Value(0)).current;
  const activeAnimData = useRef({ x: 0, w: 0, opacity: 0 }).current;

  const iconScales = useRef(state.routes.map(() => new Animated.Value(1))).current;
  const iconScaleData = useRef(state.routes.map(() => ({ s: 1 })));

  useEffect(() => {
    const layout = tabPositions[state.index];
    if (layout) {
      gsap.to(activeAnimData, {
        x: layout.x,
        w: layout.width,
        opacity: 1,
        duration: 0.65,
        ease: "elastic.out(1.1, 0.75)",
        onUpdate: () => {
          cursorX.setValue(activeAnimData.x);
          cursorWidth.setValue(activeAnimData.w);
          cursorOpacity.setValue(activeAnimData.opacity);
        },
      });
    }
  }, [state.index, tabPositions]);

  const onTabLayout = (event: LayoutChangeEvent, index: number) => {
    const { x, width } = event.nativeEvent.layout;
    setTabPositions((prev) => {
      const newLayouts = [...prev];
      newLayouts[index] = { x, width };
      return newLayouts;
    });
  };

  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      <View style={styles.container}>
        <Animated.View style={[styles.activeIndicator, { 
          left: cursorX, 
          width: cursorWidth,
          opacity: cursorOpacity 
        }]} />

        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
             // Let react-navigation handle the switch immediately
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }

            // Animate scale
            iconScaleData.current[index].s = 0.6;
            gsap.to(iconScaleData.current[index], {
              s: 1,
              duration: 0.6,
              ease: "elastic.out(1.5, 0.4)",
              onUpdate: () => {
                iconScales[index].setValue(iconScaleData.current[index].s);
              },
            });
          };

          const color = isFocused ? "#ffffff" : "#a1a1aa";
          const iconSize = 24;

          let iconName: keyof typeof MaterialIcons.glyphMap = "settings";
          if (route.name === "Map") iconName = "map";
          else if (route.name === "Leaderboard") iconName = "leaderboard";
          else if (route.name === "Profile") iconName = "person";

          return (
            <Pressable
              key={route.key}
              onLayout={(e) => onTabLayout(e, index)}
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarButtonTestID}
              onPress={onPress}
              style={styles.tabItem}
            >
              <Animated.View style={[styles.iconContainer, { transform: [{ scale: iconScales[index] }] }]}>
                <MaterialIcons name={iconName} size={iconSize} color={color} />
              </Animated.View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 24,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    // This allows touches to pass through the wrapper to elements behind it, 
    // while still letting its children catch touches
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
    borderRadius: 9999,
    backgroundColor: Platform.OS === "web" ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.9)",
    borderWidth: 1,
    borderColor: "rgba(161,161,170,0.2)",
    ...(Platform.OS === "web" ? { backdropFilter: "blur(10px)" } : {}),
  },
  activeIndicator: {
    position: "absolute",
    height: 48,
    backgroundColor: "#1a1c1c",
    top: "50%",
    marginTop: -24,
    borderRadius: 9999,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    width: 48,
    height: 48,
    zIndex: 10, // Ensure pressable is on top
  },
  iconContainer: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9999,
  },
});

