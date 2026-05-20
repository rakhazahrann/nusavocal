export const THEME = {
  light: {
    background: "hsl(240 7% 97%)",
    foreground: "hsl(222 47% 11%)",
    card: "hsl(0 0% 100%)",
    cardForeground: "hsl(222 47% 11%)",
    popover: "hsl(0 0% 100%)",
    popoverForeground: "hsl(222 47% 11%)",
    primary: "hsl(29 90% 55%)",
    primaryForeground: "hsl(0 0% 100%)",
    secondary: "hsl(240 24% 96%)",
    secondaryForeground: "hsl(222 47% 11%)",
    muted: "hsl(240 24% 96%)",
    mutedForeground: "hsl(215 16% 47%)",
    accent: "hsl(29 90% 55%)",
    accentForeground: "hsl(222 47% 11%)",
    destructive: "hsl(0 84% 60%)",
    destructiveForeground: "hsl(0 0% 100%)",
    border: "hsl(214 32% 91%)",
    input: "hsl(214 32% 91%)",
    ring: "hsl(29 90% 55%)",
    radius: "16px",
  },
} as const;

export const NAV_THEME = {
  light: {
    dark: false,
    colors: {
      background: THEME.light.background,
      border: THEME.light.border,
      card: THEME.light.card,
      notification: THEME.light.primary,
      primary: THEME.light.primary,
      text: THEME.light.foreground,
    },
  },
} as const;
