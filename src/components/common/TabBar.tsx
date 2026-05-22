import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Pressable, Dimensions, Platform } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import Animated, {
  useAnimatedStyle,
  withTiming,
  Easing,
  useSharedValue,
  withSequence,
  withDelay,
} from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ROUTES } from "@/constants/routes";
import { colors } from "@/constants/colors";

const { width } = Dimensions.get("window");

// Responsive dimensions - Geometric ratio optimized
const TAB_BAR_WIDTH = Math.min(width * 0.88, 360);
const TAB_BAR_HEIGHT = 68; // Optimized height for concentric pill look
const BORDER_RADIUS = 34; // Exact half of TAB_BAR_HEIGHT for a perfect outer pill
const PADDING_HORIZONTAL = 10; // Uniform gap of 10px all around the green capsule
const CONTAINER_WIDTH = TAB_BAR_WIDTH - PADDING_HORIZONTAL * 2;

// Tab item width constraints - proportional spacing
const W_ACTIVE = 140; 
const W_INACTIVE = (CONTAINER_WIDTH - W_ACTIVE) / 2;

export const CustomTabBar = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  // Shared values to coordinate the multi-phase liquid transition
  const indicatorWidth = useSharedValue(W_ACTIVE);
  const indicatorIndex = useSharedValue(state.index);

  // Track the previous active index to orchestrate sequential visual states
  const prevIndexRef = useRef(state.index);

  useEffect(() => {
    const prev = prevIndexRef.current;
    const next = state.index;
    prevIndexRef.current = next;

    if (prev === next) return;

    // Phase 1: Shrink in place (150ms)
    // Phase 2: Slide across as a perfect 48px circle (250ms delay, slide duration 250ms)
    // Phase 3: Expand to pill capsule upon landing at destination (200ms)
    
    // Coordinated Width Sequence
    indicatorWidth.value = withSequence(
      // Step 1: Shrink active oblong capsule to a circle in place
      withTiming(48, { duration: 150, easing: Easing.bezier(0.25, 1, 0.4, 1) }),
      // Step 2: Remain as a circle for the duration of the translation slide (250ms)
      withDelay(250, withTiming(48, { duration: 0 })),
      // Step 3: Expand back to full capsule width at destination
      withTiming(W_ACTIVE, { duration: 200, easing: Easing.bezier(0.25, 1, 0.4, 1) })
    );

    // Coordinated Index Position Sequence
    indicatorIndex.value = withSequence(
      // Step 1: Wait/hold at starting tab position for 150ms while shrinking in-place
      withDelay(150, withTiming(prev, { duration: 0 })),
      // Step 2: Slide to destination index over 250ms
      withTiming(next, { duration: 250, easing: Easing.bezier(0.25, 1, 0.4, 1) }),
      // Step 3: Hold at next index while expanding at destination
      withTiming(next, { duration: 200 })
    );
  }, [state.index]);

  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      <View style={styles.solidBase}>
        {/* Layer 1: Sliding & Morphing active capsule background */}
        <Animated.View
          style={[
            styles.indicator,
            useAnimatedStyle(() => {
              const indexVal = indicatorIndex.value;

              // Compute layout widths of all three tabs at current visual transition state
              const d0 = Math.max(0, Math.min(1, 1 - Math.abs(0 - indexVal)));
              const w0 = W_INACTIVE + (W_ACTIVE - W_INACTIVE) * d0;
              const d1 = Math.max(0, Math.min(1, 1 - Math.abs(1 - indexVal)));
              const w1 = W_INACTIVE + (W_ACTIVE - W_INACTIVE) * d1;
              const d2 = Math.max(0, Math.min(1, 1 - Math.abs(2 - indexVal)));
              const w2 = W_INACTIVE + (W_ACTIVE - W_INACTIVE) * d2;

              // Calculate active visual center dynamically based on interpolated widths
              let activeCenter = 0;
              if (indexVal <= 1) {
                const c0 = w0 / 2;
                const c1 = w0 + w1 / 2;
                activeCenter = c0 + (c1 - c0) * indexVal;
              } else {
                const c1 = w0 + w1 / 2;
                const c2 = w0 + w1 + w2 / 2;
                activeCenter = c1 + (c2 - c1) * (indexVal - 1);
              }

              return {
                width: indicatorWidth.value,
                left: activeCenter - indicatorWidth.value / 2 + PADDING_HORIZONTAL,
              };
            }),
          ]}
        />

        {/* Layer 2: Tab items */}
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          // Determine Icon and label names dynamically
          let iconNameOutline: keyof typeof MaterialCommunityIcons.glyphMap = "map-outline";
          let iconNameSolid: keyof typeof MaterialCommunityIcons.glyphMap = "map";
          let labelText = "";

          if (route.name === ROUTES.MAP) {
            iconNameOutline = "map-outline";
            iconNameSolid = "map";
            labelText = "Jelajah";
          } else if (route.name === ROUTES.LEADERBOARD) {
            iconNameOutline = "trophy-outline";
            iconNameSolid = "trophy";
            labelText = "Challenge";
          } else if (route.name === ROUTES.PROFILE) {
            iconNameOutline = "account-outline";
            iconNameSolid = "account";
            labelText = "Akun";
          }

          // Animated styles for individual tab container width and left positioning
          const animatedTabStyle = useAnimatedStyle(() => {
            const indexVal = indicatorIndex.value;

            // Interpolate dynamic width based on current indexVal position
            const dist = Math.max(0, Math.min(1, 1 - Math.abs(index - indexVal)));
            const dynamicWidth = W_INACTIVE + (W_ACTIVE - W_INACTIVE) * dist;

            // Calculate dynamic left offset as the sum of preceding tab widths
            let dynamicLeft = 0;
            if (index === 1) {
              const d0_c = Math.max(0, Math.min(1, 1 - Math.abs(0 - indexVal)));
              const w0_c = W_INACTIVE + (W_ACTIVE - W_INACTIVE) * d0_c;
              dynamicLeft = w0_c;
            } else if (index === 2) {
              const d0_c = Math.max(0, Math.min(1, 1 - Math.abs(0 - indexVal)));
              const w0_c = W_INACTIVE + (W_ACTIVE - W_INACTIVE) * d0_c;
              const d1_c = Math.max(0, Math.min(1, 1 - Math.abs(1 - indexVal)));
              const w1_c = W_INACTIVE + (W_ACTIVE - W_INACTIVE) * d1_c;
              dynamicLeft = w0_c + w1_c;
            }

            return {
              width: dynamicWidth,
              left: dynamicLeft + PADDING_HORIZONTAL,
            };
          });

          // Animated styles for the inactive stacked column (dissolves as tab becomes active)
          const animatedInactiveStyle = useAnimatedStyle(() => {
            const opacityVal = isFocused
              ? withTiming(0, { duration: 150 })
              : withDelay(200, withTiming(1, { duration: 250 }));

            const scaleVal = isFocused
              ? withTiming(0.8, { duration: 150 })
              : withDelay(200, withTiming(1, { duration: 250 }));

            return {
              opacity: opacityVal,
              transform: [{ scale: scaleVal }],
            };
          });

          // Animated styles for the active row content (crystallizes inside the green capsule)
          const animatedActiveStyle = useAnimatedStyle(() => {
            const opacityVal = isFocused
              ? withDelay(400, withTiming(1, { duration: 200 }))
              : withTiming(0, { duration: 150 });

            const scaleVal = isFocused
              ? withDelay(400, withTiming(1, { duration: 200 }))
              : withTiming(0.8, { duration: 150 });

            return {
              opacity: opacityVal,
              transform: [{ scale: scaleVal }],
            };
          });

          // Animated styles for active label text container (melebar bersama capsule)
          const animatedActiveTextStyle = useAnimatedStyle(() => {
            const widthVal = isFocused
              ? withDelay(400, withTiming(80, { duration: 200, easing: Easing.bezier(0.25, 1, 0.4, 1) }))
              : withTiming(0, { duration: 150 });

            const marginVal = isFocused
              ? withDelay(400, withTiming(6, { duration: 200, easing: Easing.bezier(0.25, 1, 0.4, 1) }))
              : withTiming(0, { duration: 150 });

            return {
              width: widthVal,
              marginLeft: marginVal,
            };
          });

          return (
            <Animated.View
              key={route.key}
              style={[styles.tabItemContainer, animatedTabStyle]}
            >
              <Pressable
                onPress={onPress}
                style={styles.tabPressable}
                android_ripple={{ color: "rgba(255,255,255,0.1)", borderless: true }}
              >
                <View style={styles.overlayContainer}>
                  {/* Layout A: Stacked Column (Visible when INACTIVE) */}
                  <Animated.View style={[styles.inactiveColumn, animatedInactiveStyle]}>
                    <MaterialCommunityIcons
                      name={iconNameOutline}
                      size={20}
                      color={colors.whiteTranslucent}
                    />
                    <Text style={styles.inactiveLabelText}>
                      {labelText}
                    </Text>
                  </Animated.View>

                  {/* Layout B: Horizontal Row (Visible when ACTIVE inside indicator) */}
                  <Animated.View style={[styles.activeRow, animatedActiveStyle]}>
                    <MaterialCommunityIcons
                      name={iconNameSolid}
                      size={20}
                      color={colors.white}
                    />
                    <Animated.View style={[styles.activeTextWrapper, animatedActiveTextStyle]}>
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="clip"
                        style={styles.activeLabelText}
                      >
                        {labelText}
                      </Text>
                    </Animated.View>
                  </Animated.View>
                </View>
              </Pressable>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 34 : 24,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 99,
  },
  solidBase: {
    flexDirection: "row",
    alignItems: "center",
    height: TAB_BAR_HEIGHT,
    borderRadius: BORDER_RADIUS,
    width: TAB_BAR_WIDTH,
    backgroundColor: colors.navy,
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  indicator: {
    position: "absolute",
    top: 10, // Exact 10px padding from the top edge
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.accent,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 1,
  },
  tabItemContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  tabPressable: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 24,
  },
  overlayContainer: {
    width: "100%",
    height: "100%",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  inactiveColumn: {
    position: "absolute",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  inactiveLabelText: {
    color: colors.whiteTranslucent,
    fontSize: 10,
    fontFamily: "Poppins-Regular",
    marginTop: 4,
  },
  activeRow: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    zIndex: 3,
  },
  activeTextWrapper: {
    overflow: "hidden",
    justifyContent: "center",
  },
  activeLabelText: {
    color: colors.white,
    fontSize: 13,
    fontFamily: "Poppins-Bold",
  },
});
