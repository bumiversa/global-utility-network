export interface ParsedColor {
  r: number;
  g: number;
  b: number;
  normalizedHex: string; // e.g., "#FFFFFF"
}

export interface WcagResults {
  aaNormal: boolean;   // >= 4.5
  aaLarge: boolean;    // >= 3.0
  aaaNormal: boolean;  // >= 7.0
  aaaLarge: boolean;   // >= 4.5
}

export interface ContrastResult {
  fgNormalized: string;
  bgNormalized: string;
  ratio: number;       // Full precision for logic, rounded for display
  wcag: WcagResults;
}

export type ContrastCheckResult = 
  | { ok: true; data: ContrastResult }
  | { ok: false; error: string };