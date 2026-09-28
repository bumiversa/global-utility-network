export type ValidationResult =
  | { ok: true }
  | { ok: false; error: string };

export interface CropBox {
  x: number;
  y: number;
  size: number;
}

export interface GeneratedFavicon {
  size: number;
  filename: string;
  blob: Blob;
  objectUrl: string;
}