import { Dimensions } from "react-native";

export const SCREEN_WIDTH = Dimensions.get("window").width;
export const SCREEN_HEIGHT = Dimensions.get("window").height;

// ── Background strip config ──────────────────────────────────────
const MAP_IMAGE_WIDTH = 816;
const MAP_IMAGE_HEIGHT = 1216;
export const STRIP_HEIGHT = (SCREEN_WIDTH * MAP_IMAGE_HEIGHT) / MAP_IMAGE_WIDTH;
export const NUM_COPIES = 3; // Number of background copies for seamless loop

// ── Stage layout config ──────────────────────────────────────────
export const STAGE_SPACING = 220; // Vertical distance between stages
export const MAP_PADDING_TOP = 160; // Space above the topmost stage
export const MAP_PADDING_BOTTOM = 200; // Space below the bottom-most stage
export const STAGE_NODE_SIZE = 150; // Size of each stage node sprite

// ── Decoration positions (relative to each stage) ────────────────
export type DecoType = "palm" | "bush" | "rumah";
export interface Decoration {
  type: DecoType;
  offsetX: number; // Offset from stage X (fraction of screen width)
  offsetY: number; // Offset from stage Y
  scale?: number;
}

// ── Stage data ───────────────────────────────────────────────────
export type StageStatus = "locked" | "current" | "completed";
export interface StageData {
  id: number;
  x: number; // Fraction of screen width (0=left, 1=right)
  label: string;
  status: StageStatus;
  decorations?: Decoration[];
}

// Pola huruf "S" (Kiri -> Kanan -> Kiri -> Kanan)
export const STAGES: StageData[] = [
  {
    id: 1,
    x: 0.35, // KIRI
    label: "Bandara",
    status: "completed",
    decorations: [
      { type: "palm", offsetX: -0.3, offsetY: -30, scale: 0.8 },
      { type: "bush", offsetX: 0.5, offsetY: 20, scale: 0.7 }, // Pindah ke kanan jalan
    ],
  },
  {
    id: 2,
    x: 0.65, // KANAN
    label: "Salam & Sapaan",
    status: "completed",
    decorations: [
      { type: "palm", offsetX: 0.35, offsetY: -10 },
      { type: "rumah", offsetX: -0.5, offsetY: 30, scale: 0.7 }, // Pindah ke kiri jalan
    ],
  },
  {
    id: 3,
    x: 0.35, // KIRI
    label: "Perkenalan",
    status: "current",
    decorations: [
      { type: "palm", offsetX: -0.35, offsetY: 0 },
      { type: "bush", offsetX: 0.6, offsetY: 40, scale: 0.6 },
    ],
  },
  {
    id: 4,
    x: 0.65, // KANAN
    label: "Keluarga",
    status: "locked",
    decorations: [
      { type: "rumah", offsetX: 0.35, offsetY: -20, scale: 0.65 },
      { type: "palm", offsetX: -0.4, offsetY: 30 },
    ],
  },
  {
    id: 5,
    x: 0.35, // KIRI
    label: "Di Pasar",
    status: "locked",
    decorations: [
      { type: "palm", offsetX: -0.4, offsetY: -10, scale: 0.85 },
      { type: "bush", offsetX: 0.5, offsetY: 60, scale: 0.7 },
    ],
  },
  {
    id: 6,
    x: 0.65, // KANAN
    label: "Transportasi",
    status: "locked",
    decorations: [
      { type: "palm", offsetX: 0.4, offsetY: 0 },
      { type: "rumah", offsetX: -0.5, offsetY: -30, scale: 0.6 },
    ],
  },
  {
    id: 7,
    x: 0.35, // KIRI
    label: "Makanan",
    status: "locked",
    decorations: [
      { type: "palm", offsetX: -0.35, offsetY: 20, scale: 0.9 },
      { type: "bush", offsetX: 0.5, offsetY: 50, scale: 0.6 },
    ],
  },
  {
    id: 8,
    x: 0.65, // KANAN
    label: "Arah & Lokasi",
    status: "locked",
    decorations: [
      { type: "palm", offsetX: 0.3, offsetY: -15 },
      { type: "palm", offsetX: -0.4, offsetY: 25, scale: 0.8 },
    ],
  },
];

// Total height of the scrollable map content
export const TOTAL_MAP_HEIGHT =
  MAP_PADDING_TOP +
  (STAGES.length - 1) * STAGE_SPACING +
  MAP_PADDING_BOTTOM;

/**
 * Get the Y position of a stage in the virtual scroll content.
 * Stage 1 is at the BOTTOM, higher stages go UP (visually).
 * In scroll coordinates: stage 1 has the LARGEST Y, stage N has the smallest.
 */
export const getStageY = (index: number): number => {
  return (
    TOTAL_MAP_HEIGHT -
    MAP_PADDING_BOTTOM -
    index * STAGE_SPACING
  );
};

/**
 * Get the X position of a stage in pixels.
 * Now returns the center position directly.
 */
export const getStageX = (xFraction: number): number => {
  return xFraction * SCREEN_WIDTH;
};

