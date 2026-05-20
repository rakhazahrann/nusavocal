import { Slot } from "@rn-primitives/slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { Platform, Text as RNText, type Role } from "react-native";
import { cn } from "@/lib/utils";
import { AppTextProps, TextTone, TextVariant, TextWeight } from "@/types/components";

const textVariants = cva(
  cn(
    "text-foreground font-body text-base",
    Platform.select({
      web: "select-text",
    })
  ),
  {
    variants: {
      variant: {
        default: "",
        hero: "font-heading text-[32px] leading-[40px]",
        title: "font-heading text-2xl leading-8",
        subtitle: "font-heading text-lg leading-[26px]",
        body: "font-body text-base leading-6",
        label: "font-body text-sm leading-5",
        caption: "font-body text-xs leading-4",
        h1: cn("font-heading text-center text-4xl font-extrabold tracking-normal", Platform.select({ web: "scroll-m-20 text-balance" })),
        h2: cn("font-heading border-border border-b pb-2 text-3xl font-semibold tracking-normal", Platform.select({ web: "scroll-m-20 first:mt-0" })),
        h3: cn("font-heading text-2xl font-semibold tracking-normal", Platform.select({ web: "scroll-m-20" })),
        h4: cn("font-heading text-xl font-semibold tracking-normal", Platform.select({ web: "scroll-m-20" })),
        p: "font-body mt-3 leading-7 sm:mt-6",
        blockquote: "font-body mt-4 border-l-2 pl-3 italic sm:mt-6 sm:pl-6",
        code: "bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
        lead: "font-body text-muted-foreground text-xl",
        large: "font-body text-lg font-semibold",
        small: "font-body text-sm font-medium leading-none",
        muted: "font-body text-muted-foreground text-sm",
      },
      tone: {
        default: "text-foreground",
        muted: "text-muted-foreground",
        accent: "text-primary",
        danger: "text-destructive",
        success: "text-success",
      },
      weight: {
        regular: "font-normal",
        medium: "font-medium",
        semibold: "font-semibold",
        bold: "font-bold",
      },
    },
    defaultVariants: {
      variant: "body",
      tone: "default",
      weight: "regular",
    },
  }
);

type TextVariantProps = VariantProps<typeof textVariants>;
type ExtendedVariant = NonNullable<TextVariantProps["variant"]>;

const ROLE: Partial<Record<ExtendedVariant, Role>> = {
  h1: "heading",
  h2: "heading",
  h3: "heading",
  h4: "heading",
  blockquote: Platform.select({ web: "blockquote" as Role }),
  code: Platform.select({ web: "code" as Role }),
};

const ARIA_LEVEL: Partial<Record<ExtendedVariant, string>> = {
  h1: "1",
  h2: "2",
  h3: "3",
  h4: "4",
};

const TextClassContext = React.createContext<string | undefined>(undefined);

type NativeTextProps = React.ComponentProps<typeof RNText> & React.RefAttributes<typeof RNText>;

type TextProps = Omit<NativeTextProps, "children"> &
  Omit<AppTextProps, "variant" | "tone" | "weight"> & {
    asChild?: boolean;
    className?: string;
    variant?: TextVariant | ExtendedVariant;
    tone?: TextTone;
    weight?: TextWeight;
  };

function Text({
  className,
  asChild = false,
  variant = "body",
  tone = "default",
  weight = "regular",
  ...props
}: TextProps) {
  const textClass = React.useContext(TextClassContext);
  const Component = asChild ? Slot : RNText;

  return (
    <Component
      className={cn(textVariants({ variant: variant as ExtendedVariant, tone, weight }), textClass, className)}
      role={ROLE[variant as ExtendedVariant]}
      aria-level={ARIA_LEVEL[variant as ExtendedVariant]}
      {...props}
    />
  );
}

export { Text, TextClassContext, textVariants };
export type { TextProps };
