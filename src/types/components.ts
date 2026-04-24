import React from "react";
import { StyleProp, ViewStyle, TextStyle, ViewProps, TextProps, TouchableOpacityProps, TextInputProps } from "react-native";
import { GetProps, YStack } from "tamagui";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";

export interface GameButtonProps extends TouchableOpacityProps {
  title: string;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  communityIconName?: keyof typeof MaterialCommunityIcons.glyphMap;
  variant?: "primary" | "secondary" | "outline" | "adventure" | "danger";
  isLoading?: boolean;
}

export interface GameInputProps extends TextInputProps {
  label: string;
  iconName?: keyof typeof MaterialIcons.glyphMap;
  communityIconName?: keyof typeof MaterialCommunityIcons.glyphMap;
  showPasswordToggle?: boolean;
  variant?: "light" | "dark";
}

export interface GameTextProps extends TextProps {
  color?: string;
  size?: number;
  family?: "pixel" | "display" | "pixelify";
  weight?: "300" | "400" | "500" | "600" | "700";
  shadow?: boolean;
}

export interface NextButtonProps extends TouchableOpacityProps {
  style?: ViewStyle | ViewStyle[];
  hidden?: boolean;
}

export interface PanelProps extends ViewProps {
  children: React.ReactNode;
  innerPadding?: number;
  outerStyle?: ViewStyle;
  variant?: "wood" | "light";
}

export type ScreenWrapperProps = Omit<GetProps<typeof YStack>, "children" | "style"> & {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export interface OptionCardProps {
  label: string;
  text: string;
  isSelected: boolean;
  onPress: () => void;
}

export interface ProgressBarProps {
  progress: number; // 0 to 1
}

export interface EnterAnimatedViewProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export interface EnterAnimatedViewProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export type ButtonVariant = "primary" | "secondary" | "ghost";

export interface ButtonProps extends Omit<GetProps<typeof YStack>, "children" | "style"> {
  label: string;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export interface CardProps {
  padded?: boolean;
  children?: React.ReactNode;
  style?: any;
  [key: string]: any;
}

export interface InputProps extends TextInputProps {
  label?: string;
  helperText?: string;
  errorText?: string;
  containerStyle?: ViewStyle;
}

export interface ScreenProps {
  padded?: boolean;
  children?: React.ReactNode;
  style?: any;
  [key: string]: any;
}

export type TextVariant =
  | "hero"
  | "title"
  | "subtitle"
  | "body"
  | "label"
  | "caption";

export type TextTone = "default" | "muted" | "accent" | "danger" | "success";

export type TextWeight = "regular" | "medium" | "semibold" | "bold";

export interface AppTextProps {
  variant?: TextVariant;
  tone?: TextTone;
  weight?: TextWeight;
  children?: React.ReactNode;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
  [key: string]: any;
}
