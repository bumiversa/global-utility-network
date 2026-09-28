export type UuidVersion = 'v4' | 'v7';

export interface GenerateOptions {
  version: UuidVersion;
  quantity: number;
}

export type ValidationResult =
  | { ok: true }
  | { ok: false; error: string };

export type GenerateResult =
  | { ok: true; uuids: string[] }
  | { ok: false; error: string };

export type RandomBytesSource = (length: number) => Uint8Array;
export type TimestampSource = () => number;