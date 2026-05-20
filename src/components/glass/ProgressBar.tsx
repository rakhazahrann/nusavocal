import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProgressBarProps, GameHeaderProps } from "@/types/components";
import { colors } from '@/constants/colors';
import { Text } from '@/components/ui/Text';

/**
 * A highly-polished, animated progress bar line.
 * Uses a soft translucent brand orange for the track,
 * and a solid brand orange for the animated progress fill.
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, style }) => {
  // Use Animated.Value to smoothly animate the progress change
  const animatedProgress = useRef(new Animated.Value(progress)).current;

  useEffect(() => {
    Animated.timing(animatedProgress, {
      toValue: progress,
      duration: 350,
      useNativeDriver: false, // width interpolation cannot use native driver
    }).start();
  }, [progress]);

  const widthInterpolate = animatedProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={[styles.container, style]}>
      <View style={styles.track}>
        <Animated.View style={[styles.fill, { width: widthInterpolate }]} />
      </View>
    </View>
  );
};

/**
 * A global premium game header component matching the screenshot exactly.
 * Features:
 * - Clean orange back button
 * - Animated center progress bar line
 * - Rounded heart count pill with a dynamic pulse micro-animation when lives change
 */
export const GameHeader: React.FC<GameHeaderProps> = ({
  progress,
  onBack,
  hearts = 5,
  showHearts = true,
}) => {
  // Pulse scale animation for the heart icon when lives change
  const heartScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(heartScale, { toValue: 1.3, duration: 150, useNativeDriver: true }),
      Animated.timing(heartScale, { toValue: 0.9, duration: 100, useNativeDriver: true }),
      Animated.timing(heartScale, { toValue: 1.0, duration: 100, useNativeDriver: true }),
    ]).start();
  }, [hearts]);

  return (
    <View style={headerStyles.headerContainer}>
      {/* Back button */}
      <TouchableOpacity
        onPress={onBack}
        activeOpacity={0.6}
        style={headerStyles.backButton}
      >
        <Ionicons name="arrow-back" size={26} color={colors.accent} />
      </TouchableOpacity>

      {/* Progress Bar in center */}
      <View style={headerStyles.progressWrapper}>
        <ProgressBar progress={progress} />
      </View>

      {/* Hearts badge on right */}
      {showHearts && (
        <View style={headerStyles.heartsPill}>
          <Text style={headerStyles.heartsText}>{hearts}</Text>
          <Animated.View style={{ transform: [{ scale: heartScale }] }}>
            <Ionicons name="heart" size={18} color={colors.accent} />
          </Animated.View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 8,
    width: '100%',
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: 'rgba(244, 140, 37, 0.15)', // light translucent accent orange
  },
  track: {
    flex: 1,
    width: '100%',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.accent, // bright brand-orange
    borderRadius: 999,
  },
});

const headerStyles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: 'transparent',
    width: '100%',
  },
  backButton: {
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressWrapper: {
    flex: 1,
    marginHorizontal: 16,
    justifyContent: 'center',
  },
  heartsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.accent,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 4,
    minWidth: 58,
    height: 34,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(244, 140, 37, 0.2)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  heartsText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: colors.accent,
    marginRight: 6,
    // Align text properly on Android
    lineHeight: Platform.OS === 'android' ? 22 : undefined,
  },
});
