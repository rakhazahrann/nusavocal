export const motionDurations = {
  micro: 160,
  short: 260,
  medium: 380,
  long: 640,
} as const;

export const motionEasings = {
  // GSAP naming; native implementation maps to Easing functions
  default: "power2.out",
  micro: "power1.out",
  hero: "expo.out",
  inOut: "power2.inOut",
} as const;
