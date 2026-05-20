import { TextClassContext } from "@/components/ui/Text";
import { cn } from "@/lib/utils";
import { ButtonProps as LegacyButtonProps, ButtonVariant } from "@/types/components";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { ActivityIndicator, Platform, Pressable } from "react-native";
import { Text } from "./Text";

const buttonVariants = cva(
  cn(
    "group shrink-0 flex-row items-center justify-center gap-2 rounded-md shadow-none",
    Platform.select({
      web: "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 aria-invalid:border-destructive whitespace-nowrap outline-none transition-all focus-visible:ring-[3px] disabled:pointer-events-none",
    })
  ),
  {
    variants: {
      variant: {
        primary: cn("bg-primary active:bg-primary/90 shadow-sm shadow-black/5", Platform.select({ web: "hover:bg-primary/90" })),
        secondary: cn("bg-secondary active:bg-secondary/80 shadow-sm shadow-black/5", Platform.select({ web: "hover:bg-secondary/80" })),
        ghost: cn("active:bg-accent/10", Platform.select({ web: "hover:bg-accent/10" })),
        default: cn("bg-primary active:bg-primary/90 shadow-sm shadow-black/5", Platform.select({ web: "hover:bg-primary/90" })),
        destructive: cn("bg-destructive active:bg-destructive/90 shadow-sm shadow-black/5", Platform.select({ web: "hover:bg-destructive/90" })),
        outline: cn("border-border bg-background active:bg-accent/10 border shadow-sm shadow-black/5", Platform.select({ web: "hover:bg-accent/10" })),
        link: "",
      },
      size: {
        default: "h-12 px-4 py-2",
        sm: "h-9 gap-1.5 rounded-md px-3",
        lg: "h-11 rounded-md px-6",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

const buttonTextVariants = cva("font-body text-sm font-semibold", {
  variants: {
    variant: {
      primary: "text-primary-foreground",
      secondary: "text-secondary-foreground",
      ghost: "text-foreground",
      default: "text-primary-foreground",
      destructive: "text-destructive-foreground",
      outline: "text-foreground",
      link: "text-primary underline-offset-4",
    },
    size: {
      default: "",
      sm: "",
      lg: "",
      icon: "",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "default",
  },
});

type ButtonStyleProps = VariantProps<typeof buttonVariants>;

type ButtonProps = Omit<React.ComponentProps<typeof Pressable>, "children"> &
  Omit<LegacyButtonProps, "variant"> &
  ButtonStyleProps & {
    variant?: ButtonVariant | ButtonStyleProps["variant"];
    children?: React.ReactNode;
  };

function Button({
  className,
  variant = "primary",
  size = "default",
  label,
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <TextClassContext.Provider value={buttonTextVariants({ variant, size })}>
      <Pressable
        className={cn(isDisabled && "opacity-50", buttonVariants({ variant, size }), className)}
        role="button"
        disabled={isDisabled}
        {...props}
      >
        {loading ? <ActivityIndicator color={variant === "primary" || variant === "default" ? "#FFFFFF" : "#0F172A"} /> : children ?? <Text>{label}</Text>}
      </Pressable>
    </TextClassContext.Provider>
  );
}

export { Button, buttonTextVariants, buttonVariants };
export type { ButtonProps };
