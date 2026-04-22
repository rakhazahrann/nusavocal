import React from "react";
import { YStack, GetProps } from "tamagui";

export interface CardProps {
  padded?: boolean;
  children?: React.ReactNode;
  style?: any;
  [key: string]: any;
}

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
