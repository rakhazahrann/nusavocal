import React from "react";
import { ActivityIndicator, StyleProp, ViewStyle } from "react-native";
import { GetProps, SizableText, YStack } from "tamagui";
import { ButtonVariant, ButtonProps } from "@/types/components";





const variantConfig: Record<
  ButtonVariant,
  { bg: string; borderColor: string; textColor: string }
> = {
  primary: {
    bg: "$backgroundAccent",
    borderColor: "$backgroundAccent",
    textColor: "#FFFFFF",
  },
  secondary: {
    bg: "$backgroundSurface",
    borderColor: "$borderColor",
    textColor: "$color",
  },
  ghost: {
    bg: "transparent",
    borderColor: "transparent",
    textColor: "$color",
  },
};

export const Button: React.FC<ButtonProps> = ({
  label,
  variant = "primary",
  loading = false,
  disabled,
  onPress,
  style,
  ...props
}) => {
  const isDisabled = disabled || loading;
  const config = variantConfig[variant] || variantConfig.primary;

  return (
    <YStack
      height={48}
      paddingHorizontal="$md"
      borderRadius="$md"
      borderWidth={1}
      backgroundColor={config.bg}
      borderColor={config.borderColor}
      alignItems="center"
      justifyContent="center"
      opacity={isDisabled ? 0.6 : 1}
      pressStyle={!isDisabled ? { scale: 0.98, opacity: 0.8 } : undefined}
      onPress={isDisabled ? undefined : onPress}
      cursor={isDisabled ? "not-allowed" : "pointer"}
      style={style}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "primary" ? "#fff" : "#0F172A"}
        />
      ) : (
        <SizableText
          fontFamily="$body"
          fontWeight="600"
          size="$3"
          color={config.textColor}
        >
          {label}
        </SizableText>
      )}
    </YStack>
  );
};
