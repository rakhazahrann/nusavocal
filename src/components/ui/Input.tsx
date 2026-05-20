import * as React from "react";
import { Platform, TextInput, View } from "react-native";
import { cn } from "@/lib/utils";
import { InputProps } from "@/types/components";
import { Text } from "./Text";

function Input({
  className,
  label,
  helperText,
  errorText,
  containerStyle,
  style,
  ...props
}: InputProps & React.RefAttributes<TextInput>) {
  const hasError = Boolean(errorText);

  return (
    <View className="w-full" style={containerStyle}>
      {label ? (
        <Text variant="caption" tone="muted" className="mb-xs">
          {label}
        </Text>
      ) : null}

      <TextInput
        placeholderTextColor="#64748B"
        className={cn(
          "border-input bg-background text-foreground font-body flex h-12 w-full min-w-0 flex-row items-center rounded-md border px-md py-1 text-base leading-5 shadow-sm shadow-black/5",
          hasError && "border-destructive",
          props.editable === false &&
            cn("opacity-50", Platform.select({ web: "disabled:pointer-events-none disabled:cursor-not-allowed" })),
          Platform.select({
            web: cn(
              "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground outline-none transition-[color,box-shadow] md:text-sm",
              "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
              "aria-invalid:ring-destructive/20 aria-invalid:border-destructive"
            ),
            native: "placeholder:text-muted-foreground/50",
          }),
          className
        )}
        style={style}
        {...props}
      />

      {hasError ? (
        <Text variant="caption" tone="danger" className="mt-xs">
          {errorText}
        </Text>
      ) : helperText ? (
        <Text variant="caption" tone="muted" className="mt-xs">
          {helperText}
        </Text>
      ) : null}
    </View>
  );
}

export { Input };
