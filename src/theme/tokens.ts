export const colors = {
  background: "#F7F7F8",
  surface: "#FFFFFF",
  text: "#0F172A",
  mutedText: "#64748B",
  border: "#E2E8F0",
  accent: "#F48C25",
  danger: "#EF4444",
  success: "#22C55E",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
} as const;

export const radius = {
  sm: 12,
  md: 16,
  lg: 24,
  pill: 999,
} as const;

export const typography = {
  fontFamily: {
    regular: "SpaceGrotesk-Regular",
    medium: "SpaceGrotesk-Medium",
    semibold: "SpaceGrotesk-SemiBold",
    bold: "SpaceGrotesk-Bold",
  },
  size: {
    caption: 12,
    label: 14,
    body: 16,
    subtitle: 18,
    title: 24,
    hero: 32,
  },
} as const;
