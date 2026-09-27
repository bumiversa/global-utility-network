import type { ImageMime } from './validate';

export type ConversionResult =
  | { ok: true; blob: Blob; size: number }
  | { ok: false; error: string };

export async function convertImageFormat(
  file: File,
  targetMime: ImageMime
): Promise<ConversionResult> {
  const objectUrl = URL.createObjectURL(file);

  try {
    // 1. Decode image
    const img = new Image();
    
    const imageLoaded = new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Failed to decode image. The file may be corrupted.'));
    });

    img.src = objectUrl;
    await imageLoaded;

    // 2. Setup Canvas
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return { ok: false, error: 'Browser does not support 2D canvas context.' };
    }

    // 3. Draw image (Browser handles transparency-to-JPEG rendering here)
    ctx.drawImage(img, 0, 0);

    // 4. Encode to target format
    const blobPromise = new Promise<Blob | null>((resolve) => {
      canvas.toBlob((blob) => resolve(blob), targetMime);
    });

    const blob = await blobPromise;

    if (!blob) {
      return { ok: false, error: 'Conversion failed. Please try another image.' };
    }

    // 5. Return actual evidence (Blob and its real size)
    return { ok: true, blob, size: blob.size };

  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred during conversion.';
    return { ok: false, error: message };
  } finally {
    // 6. Cleanup to prevent memory leaks
    URL.revokeObjectURL(objectUrl);
  }
}