/**
 * NusaVocal Design System — Color Palette
 *
 * Warm, Nusantara-inspired palette with rich greens, golden accents,
 * and terracotta undertones. Designed to feel premium and culturally rooted.
 *
 * Usage:
 *   import { colors, darkColors, gradients } from "@/constants/colors";
 */

// ── Light Mode ──────────────────────────────────────────────────
export const colors = {
  // Brand / Core
  background: "#F5F1E8",       // Warm parchment (was #F8FAED — now warmer)
  surface: "#FFFFFF",
  surfaceElevated: "#FFFCF5",  // Slightly warm white for cards with depth
  surfacePressed: "#EDE8DD",   // Active/pressed card state
  text: "#1A1F16",             // Deep forest black
  mutedText: "#7A8575",        // Soft sage muted
  border: "#DDD8CC",           // Warm neutral border
  borderLight: "rgba(0,0,0,0.06)",

  // Primary Accent (enriched green)
  accent: "#3B9B6A",           // Richer tropical green (was #50A65C)
  accentDark: "#2B7A4E",       // Darker shade
  accentLight: "#7ECFA0",      // Light tint
  accentMuted: "rgba(59, 155, 106, 0.12)", // For subtle backgrounds
  accentGlow: "rgba(59, 155, 106, 0.20)",  // For glow effects

  // Semantic
  danger: "#E05252",           // Warmer red (was #EF4444)
  dangerLight: "#FDE8E8",
  success: "#3B9B6A",          // Same as accent
  successLight: "#E6F5ED",
  warning: "#E8A838",          // Golden amber
  warningLight: "#FFF3D6",

  // Gamification & Celebration
  gold: "#F5B731",             // Rich warm gold
  goldGlow: "rgba(245, 183, 49, 0.25)",
  streak: "#E8652B",           // Fiery orange for streaks
  streakGlow: "rgba(232, 101, 43, 0.20)",
  xp: "#7C5CFC",              // Premium purple for XP
  xpGlow: "rgba(124, 92, 252, 0.15)",
  celebration: "#FFD700",      // Bright gold for confetti

  // Neutrals
  navy: "#1A2024",             // Deep dark (was #232323)
  parchment: "#EDE8DD",        // Warm off-white (was #EFF1E6)
  white: "#FFFFFF",
  black: "#000000",
  lightGray: "#F5F3EE",        // Warm light gray (was #F2F2F7)
  gray: "#E0DCD4",             // Warm gray (was #E5E5EA)
  darkGray: "#5C6358",         // Warm dark gray
  mediumGray: "#8A8A8A",
  slate: "#0F172A",

  // Game & Theme specific
  mint: "#A8E8EB",
  adventure: "#3B82C4",
  adventureDark: "#1E5A8C",

  // Parchment wizard palette
  parchmentLight: "#FFF9F2",
  parchmentBorder: "#D1C4B5",
  parchmentText: "#5D3A1A",
  parchmentMuted: "#A1887F",

  // Translucent
  whiteTranslucent: "rgba(255, 255, 255, 0.45)",
  whiteSemiTranslucent: "rgba(255, 255, 255, 0.6)",
  blackTranslucent: "rgba(0, 0, 0, 0.05)",
  blackMutedText: "rgba(0, 0, 0, 0.4)",
  blackOverlay: "rgba(0,0,0,0.5)",
  blackOverlayDark: "rgba(0,0,0,0.65)",
  whiteOverlay: "rgba(255,255,255,0.5)",
} as const;

// ── Dark Mode ───────────────────────────────────────────────────
export const darkColors = {
  background: "#0F1510",
  surface: "#1A2119",
  surfaceElevated: "#212D20",
  surfacePressed: "#2A382A",
  text: "#E4EAE0",
  mutedText: "#8A9585",
  border: "#2D3A2B",
  borderLight: "rgba(255,255,255,0.08)",

  accent: "#4EAD78",
  accentDark: "#3B9B6A",
  accentLight: "#7ECFA0",
  accentMuted: "rgba(78, 173, 120, 0.15)",
  accentGlow: "rgba(78, 173, 120, 0.25)",

  danger: "#F06060",
  dangerLight: "rgba(240, 96, 96, 0.15)",
  success: "#4EAD78",
  successLight: "rgba(78, 173, 120, 0.15)",
  warning: "#F0B840",
  warningLight: "rgba(240, 184, 64, 0.15)",

  gold: "#F5C040",
  goldGlow: "rgba(245, 192, 64, 0.25)",
  streak: "#F07030",
  streakGlow: "rgba(240, 112, 48, 0.20)",
  xp: "#9070FF",
  xpGlow: "rgba(144, 112, 255, 0.20)",
  celebration: "#FFD700",

  navy: "#0D1210",
  parchment: "#1C261B",
  white: "#FFFFFF",
  black: "#000000",
  lightGray: "#1E2A1D",
  gray: "#2A3828",
  darkGray: "#9AA595",
  mediumGray: "#6B7A68",
  slate: "#E2E8F0",

  mint: "#5BB8BC",
  adventure: "#5A9FD8",
  adventureDark: "#3B82C4",

  parchmentLight: "#1C261B",
  parchmentBorder: "#3A4838",
  parchmentText: "#D4C4AA",
  parchmentMuted: "#8A7B6A",

  whiteTranslucent: "rgba(255, 255, 255, 0.15)",
  whiteSemiTranslucent: "rgba(255, 255, 255, 0.25)",
  blackTranslucent: "rgba(0, 0, 0, 0.20)",
  blackMutedText: "rgba(255, 255, 255, 0.4)",
  blackOverlay: "rgba(0,0,0,0.6)",
  blackOverlayDark: "rgba(0,0,0,0.75)",
  whiteOverlay: "rgba(255,255,255,0.1)",
} as const;

// ── Gradient Pairs ──────────────────────────────────────────────
export const gradients = {
  accent: ["#3B9B6A", "#2B7A4E"] as const,
  accentVibrant: ["#4EAD78", "#2B7A4E", "#1D5E3A"] as const,
  gold: ["#F5C040", "#E8A020"] as const,
  goldRich: ["#FFD700", "#F5B731", "#E89A10"] as const,
  hero: ["#3B9B6A", "#2B7A4E", "#1D5E3A"] as const,
  sunset: ["#E8652B", "#F5B731"] as const,
  xp: ["#9070FF", "#7C5CFC"] as const,
  celebration: ["#FFD700", "#FF8C00", "#FF4500"] as const,
  darkCard: ["#1A2024", "#141A1E"] as const,
  warmBg: ["#F5F1E8", "#EDE8DD"] as const,
  coolBg: ["#F5F1E8", "#E8EDE5"] as const,
} as const;
