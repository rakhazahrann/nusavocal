import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { OptionCardProps } from "@/types/components";
import { colors } from "@/constants/colors";



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
    shadowColor: colors.black,
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
    backgroundColor: colors.accent,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  unselectedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 18,
    backgroundColor: colors.whiteTranslucent,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.whiteSemiTranslucent,
    overflow: 'hidden',
  },
  selectedLabelContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  unselectedLabelContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.blackTranslucent,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  selectedLabelText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 13,
    color: colors.accent,
  },
  unselectedLabelText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 13,
    color: colors.blackMutedText,
  },
  selectedText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 15,
    color: colors.white,
  },
  unselectedText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 15,
    color: colors.text,
  },
});
