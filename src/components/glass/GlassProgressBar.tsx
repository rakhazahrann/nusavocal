import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';

interface GlassProgressBarProps {
  progress: number; // 0 to 1
}

export const GlassProgressBar: React.FC<GlassProgressBarProps> = ({ progress }) => {
  return (
    <View style={styles.container}>
      <BlurView intensity={20} tint="light" style={styles.track}>
        <View style={[styles.fill, { width: `${progress * 100}%` }]} />
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 10,
    width: '100%',
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  track: {
    flex: 1,
    width: '100%',
  },
  fill: {
    height: '100%',
    backgroundColor: '#000000',
    borderRadius: 999,
  },
});
