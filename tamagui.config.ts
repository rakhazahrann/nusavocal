import { createTamagui, createTokens } from "tamagui";
import { createAnimations } from "@tamagui/animations-css";

// ─── Animation Config ──────────────────────────────────────────
const animations = createAnimations({
  fast: "ease-in 150ms",
  medium: "ease-in 300ms",
  slow: "ease-in 450ms",
  bouncy: "ease-in 200ms",
  lazy: "ease-in 600ms",
});

// ─── Design Tokens ─────────────────────────────────────────────
// Aligned with src/theme/tokens.ts
const tokens = createTokens({
  color: {
    background: "#F7F7F8",
    surface: "#FFFFFF",
    text: "#0F172A",
    mutedText: "#64748B",
    border: "#E2E8F0",
    accent: "#F48C25",
    accentDark: "#c0630b",
    danger: "#EF4444",
    success: "#22C55E",
    white: "#FFFFFF",
    black: "#000000",
    transparent: "transparent",
    // Game-specific colors
    woodBrown: "#5d3a1a",
    parchment: "#e6dcc3",
    gold: "#ffc947",
    navy: "#0f3460",
  },
  space: {
    0: 0,
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
    true: 16, // default
  },
  size: {
    0: 0,
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
    true: 16,
  },
  radius: {
    0: 0,
    sm: 12,
    md: 16,
    lg: 24,
    pill: 999,
    true: 16,
  },
  zIndex: {
    0: 0,
    1: 100,
    2: 200,
    3: 300,
    4: 400,
    5: 500,
  },
});

// ─── Themes ────────────────────────────────────────────────────
const lightTheme = {
  background: tokens.color.background,
  color: tokens.color.text,
  borderColor: tokens.color.border,
  // Semantic
  colorMuted: tokens.color.mutedText,
  colorAccent: tokens.color.accent,
  colorDanger: tokens.color.danger,
  colorSuccess: tokens.color.success,
  // Surfaces
  backgroundSurface: tokens.color.surface,
  backgroundAccent: tokens.color.accent,
  backgroundDanger: tokens.color.danger,
  backgroundTransparent: tokens.color.transparent,
};

// ─── Tamagui Config ────────────────────────────────────────────
export const tamaguiConfig = createTamagui({
  animations,
  tokens,
  themes: {
    light: lightTheme,
  },
  fonts: {
    heading: {
      family: "SpaceGrotesk-Bold",
      size: {
        1: 12,
        2: 14,
        3: 16,
        4: 18,
        5: 24,
        6: 32,
        true: 24,
      },
      lineHeight: {
        1: 16,
        2: 20,
        3: 24,
        4: 26,
        5: 32,
        6: 40,
      },
      weight: {
        4: "700",
      },
    },
    body: {
      family: "SpaceGrotesk-Regular",
      size: {
        1: 12,
        2: 14,
        3: 16,
        4: 18,
        5: 24,
        6: 32,
        true: 16,
      },
      lineHeight: {
        1: 16,
        2: 20,
        3: 24,
        4: 26,
        5: 32,
        6: 40,
      },
      weight: {
        1: "300",
        2: "400",
        3: "500",
        4: "600",
        5: "700",
      },
    },
    game: {
      family: "PixelifySans-Regular",
      size: {
        1: 8,
        2: 10,
        3: 12,
        4: 14,
        5: 18,
        6: 24,
        true: 12,
      },
      lineHeight: {
        1: 12,
        2: 14,
        3: 16,
        4: 18,
        5: 24,
        6: 32,
      },
      weight: {
        2: "400",
        3: "500",
        4: "600",
        5: "700",
      },
    },
  },
});

export default tamaguiConfig;

// Type augmentation for TypeScript
type Conf = typeof tamaguiConfig;
declare module "tamagui" {
  interface TamaguiCustomConfig extends Conf {}
}
