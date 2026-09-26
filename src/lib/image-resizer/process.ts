import { calculateDimensions } from './dimensions';

export type ProcessImageOptions = {
  targetWidth: number | null;
  targetHeight: number | null;
  lockAspectRatio: boolean;
  outputFormat: 'image/jpeg' | 'image/png' | 'image/webp';
  quality: number;
};

export type ProcessImageResult = 
  | { ok: true; blob: Blob; previewUrl: string; width: number; height: number }
  | { ok: false; error: string };

export async function processImage(
  file: File,
  originalWidth: number,
  originalHeight: number,
  options: ProcessImageOptions
): Promise<ProcessImageResult> {
  const objectUrl = URL.createObjectURL(file);
  
  try {
    const img = new Image();
    
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = objectUrl;
    });

    const { width, height } = calculateDimensions(
      originalWidth,
      originalHeight,
      options.targetWidth,
      options.targetHeight,
      options.lockAspectRatio
    );

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, options.outputFormat, options.quality);
    });

    if (!blob) {
      throw new Error('Failed to generate image blob');
    }

    const previewUrl = URL.createObjectURL(blob);

    return { ok: true, blob, previewUrl, width, height };
  } catch (error) {
    return { 
      ok: false, 
      error: error instanceof Error ? error.message : 'Failed to process image' 
    };
  } finally {
    // Selalu bersihkan URL objek input untuk mencegah memory leak
    URL.revokeObjectURL(objectUrl);
  }
}
