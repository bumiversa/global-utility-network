export const TARGET_SIZES = [16, 32, 48, 64, 128, 180] as const;

export const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB

export const SUPPORTED_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
] as const;

export type TargetSize = typeof TARGET_SIZES[number];
export type SupportedMimeType = typeof SUPPORTED_MIME_TYPES[number];