export type DecoType = "palm" | "bush" | "rumah";

export interface Decoration {
  type: DecoType;
  offsetX: number; // Offset from stage X (fraction of screen width)
  offsetY: number; // Offset from stage Y
  scale?: number;
}

export type StageStatus = "locked" | "current" | "completed";

export interface StageData {
  id: number;
  x: number; // Fraction of screen width (0=left, 1=right)
  label: string;
  status: StageStatus;
  decorations?: Decoration[];
}
