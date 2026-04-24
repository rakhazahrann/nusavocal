import React from "react";
import { YStack, GetProps } from "tamagui";
import { CardProps } from "@/types/components";



export const Card: React.FC<CardProps> = ({
  padded = true,
  style,
  children,
  ...props
}) => {
  return (
    <YStack
      backgroundColor="$backgroundSurface"
      borderRadius="$lg"
      borderWidth={1}
      borderColor="$borderColor"
      padding={padded ? "$lg" : undefined}
      style={style}
      {...props}
    >
      {children}
    </YStack>
  );
};
