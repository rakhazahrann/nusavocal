import React from "react";
import { StyleSheet, Image, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  SharedValue,
} from "react-native-reanimated";
import {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  STRIP_HEIGHT,
  NUM_COPIES,
} from "../../constants/stageLayout";

const MAP_BG = require("../../../assets/images/map/map-bg-strip.png");

interface InfiniteScrollBackgroundProps {
  scrollY: SharedValue<number>;
}

/**
 * Seamless Infinite Roll Background
 *
 * Renders NUM_COPIES (3) copies of the background strip stacked vertically.
 * As the user scrolls, each copy's translateY is adjusted using modular
 * arithmetic so one copy is always covering the viewport — creating
 * the illusion of an infinitely scrolling background.
 *
 * All calculations run on the UI thread via Reanimated worklets for 60fps.
 */
export const InfiniteScrollBackground: React.FC<
  InfiniteScrollBackgroundProps
> = ({ scrollY }) => {
  const totalHeight = STRIP_HEIGHT * NUM_COPIES;

  return (
    <View style={styles.container} pointerEvents="none">
      {Array.from({ length: NUM_COPIES }).map((_, i) => (
        <BackgroundCopy
          key={i}
          index={i}
          scrollY={scrollY}
          totalHeight={totalHeight}
        />
      ))}
    </View>
  );
};

interface BackgroundCopyProps {
  index: number;
  scrollY: SharedValue<number>;
  totalHeight: number;
}

const BackgroundCopy: React.FC<BackgroundCopyProps> = ({
  index,
  scrollY,
  totalHeight,
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    "worklet";
    // Calculate the offset for this copy.
    // We want the background to scroll at the same rate as the content,
    // but wrap around when it goes off-screen.
    const baseOffset = index * STRIP_HEIGHT;

    // The raw position considering scroll. As scrollY increases (user scrolls
    // down in content), we want the background to move UP — hence subtraction.
    const rawY = baseOffset - (scrollY.value % totalHeight);

    // Wrap around: keep the copy within visible range
    let adjustedY = rawY % totalHeight;
    if (adjustedY < -STRIP_HEIGHT) {
      adjustedY += totalHeight;
    }
    if (adjustedY > SCREEN_HEIGHT) {
      adjustedY -= totalHeight;
    }

    return {
      transform: [{ translateY: adjustedY }],
    };
  });

  return (
    <Animated.Image
      source={MAP_BG}
      style={[styles.strip, animatedStyle]}
      resizeMode="cover"
    />
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
    backgroundColor: "#3a7a2e", // Fallback green if image hasn't loaded
  },
  strip: {
    position: "absolute",
    top: 0,
    left: 0,
    width: SCREEN_WIDTH,
    height: STRIP_HEIGHT,
  },
});
