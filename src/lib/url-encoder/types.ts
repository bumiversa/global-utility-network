export interface EncodeResult {
  encoded: string;
}

export interface DecodeResult {
  decoded: string;
}

export type EncodeOutput = 
  | { ok: true; data: EncodeResult }
  | { ok: false; error: string };

export type DecodeOutput = 
  | { ok: true; data: DecodeResult }
  | { ok: false; error: string };