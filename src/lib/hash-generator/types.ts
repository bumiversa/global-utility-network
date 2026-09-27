export type HashAlgorithm = 'SHA-256' | 'SHA-512';

export type HashResult =
  | { ok: true; hash: string }
  | { ok: false; error: string };