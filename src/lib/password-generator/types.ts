export interface PasswordOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
  excludeAmbiguous: boolean;
}

export type GenerationResult =
  | { ok: true; password: string; length: number }
  | { ok: false; error: string };

export type ValidationResult =
  | { ok: true }
  | { ok: false; error: string };

export type RandomSource = (length: number) => Uint8Array;