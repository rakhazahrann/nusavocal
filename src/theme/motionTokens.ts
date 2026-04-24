export const motionDurations = {
  micro: 160,
  short: 260,
  medium: 380,
  long: 640,
} as const;

export const motionEasings = {
  // Reanimated Easing equivalents
  default: "quad-out", // Easing.out(Easing.quad)
  micro: "linear-out", // Easing.out(Easing.linear)
  hero: "expo-out", // Easing.out(Easing.exp)
  inOut: "quad-inOut", // Easing.inOut(Easing.quad)
} as const;
