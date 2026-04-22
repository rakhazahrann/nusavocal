import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';

export interface OptionCardProps {
  label: string;
  text: string;
  isSelected: boolean;
  onPress: () => void;
}

export const OptionCard: React.FC<OptionCardProps> = ({ label, text, isSelected, onPress }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.container,
        isSelected && styles.selectedContainerShadow
      ]}
    >
      {isSelected ? (
        <View style={styles.selectedContainer}>
          <View style={styles.selectedLabelContainer}>
            <Text style={styles.selectedLabelText}>{label}</Text>
          </View>
          <Text style={styles.selectedText}>{text}</Text>
        </View>
      ) : (
        <BlurView intensity={40} tint="light" style={styles.unselectedContainer}>
          <View style={styles.unselectedLabelContainer}>
            <Text style={styles.unselectedLabelText}>{label}</Text>
          </View>
          <Text style={styles.unselectedText}>{text}</Text>
        </BlurView>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 10,
    borderRadius: 18,
  },
  selectedContainerShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
    transform: [{ scale: 1.01 }],
  },
  selectedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 18,
    backgroundColor: '#000000',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#000000',
  },
  unselectedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    overflow: 'hidden',
  },
  selectedLabelContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  unselectedLabelContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  selectedLabelText: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 13,
    color: '#000000',
  },
  unselectedLabelText: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 13,
    color: 'rgba(0, 0, 0, 0.4)',
  },
  selectedText: {
    fontFamily: 'SpaceGrotesk-SemiBold',
    fontSize: 15,
    color: '#ffffff',
  },
  unselectedText: {
    fontFamily: 'SpaceGrotesk-SemiBold',
    fontSize: 15,
    color: '#121212',
  },
});
