/**
 * NusaVocal — Motion Design Tokens
 *
 * Reusable animation configurations for consistent, premium-feeling motion.
 * All spring configs are tuned for React Native Reanimated's `withSpring`.
 */
import { Easing } from "react-native-reanimated";

// ── Duration Tokens ─────────────────────────────────────────────
export const motionDurations = {
  micro: 120,   // Instant feedback (press states)
  short: 220,   // Quick transitions (fade, color change)
  medium: 360,  // Standard transitions (slide, scale)
  long: 560,    // Elaborate animations (entrance sequences)
  hero: 800,    // Grand reveals (splash, celebration)
} as const;

// ── Spring Presets ──────────────────────────────────────────────
// Tuned for React Native Reanimated's withSpring({...})
export const springs = {
  /** Soft, graceful motion — modals, sheets, page elements */
  gentle: { damping: 20, stiffness: 180, mass: 1 },

  /** Responsive, crisp — buttons, tabs, interactive elements */
  snappy: { damping: 15, stiffness: 300, mass: 0.8 },

  /** Playful, overshooty — celebrations, badges, score popups */
  bouncy: { damping: 8, stiffness: 200, mass: 1.2 },

  /** Very stiff, minimal overshoot — layout shifts, progress bars */
  stiff: { damping: 28, stiffness: 400, mass: 0.6 },

  /** Micro press feedback — pressable scale-down/up */
  press: { damping: 12, stiffness: 350, mass: 0.5 },
} as const;

// ── Stagger Delays ──────────────────────────────────────────────
// Millisecond delay between each item in choreographed lists
export const stagger = {
  fast: 40,     // Quick cascading (leaderboard rows)
  normal: 70,   // Standard stagger (form fields, cards)
  slow: 110,    // Deliberate cascade (onboarding steps)
} as const;

// ── Easing Presets ──────────────────────────────────────────────
// Common Reanimated easing functions, pre-built for convenience
export const motionEasings = {
  /** Default exit feel — decelerating */
  default: Easing.out(Easing.quad),

  /** Micro-interactions — nearly linear exit */
  micro: Easing.out(Easing.linear),

  /** Grand reveals — dramatic deceleration */
  hero: Easing.out(Easing.exp),

  /** Bidirectional — smooth in and out */
  inOut: Easing.inOut(Easing.quad),

  /** Cubic ease out — native iOS feel */
  ios: Easing.bezier(0.25, 1, 0.5, 1),

  /** Elastic snap — for bouncy without spring */
  elastic: Easing.bezier(0.68, -0.55, 0.265, 1.55),
} as const;

// ── Enter/Exit Animation Presets ────────────────────────────────
// Used by AnimatedPressable, StaggeredList, and screen transitions
export const enterPresets = {
  fadeSlideUp: { fromOpacity: 0, fromTranslateY: 24 },
  fadeSlideDown: { fromOpacity: 0, fromTranslateY: -16 },
  scaleIn: { fromOpacity: 0, fromScale: 0.85 },
  scaleBounce: { fromOpacity: 0, fromScale: 0.6 },
  slideRight: { fromOpacity: 0, fromTranslateX: -40 },
  slideLeft: { fromOpacity: 0, fromTranslateX: 40 },
  fadeOnly: { fromOpacity: 0, fromTranslateY: 0 },
} as const;

export type EnterPreset = keyof typeof enterPresets;
export type SpringPreset = keyof typeof springs;
