import { TARGET_SIZES } from './constants';
import { calculateCenteredSquareCrop } from './crop';
import { generateFaviconFilename } from './filenames';
import type { GeneratedFavicon } from './types';

/**
 * Decode a File into an HTMLImageElement.
 * Uses a temporary Object URL that is revoked after loading.
 */
export async function decodeImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(img);
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Unable to decode image file.'));
    };

    img.src = objectUrl;
  });
}

/**
 * Render a single favicon at the target size using centered square crop.
 */
export async function renderFavicon(
  image: HTMLImageElement,
  size: number
): Promise<Blob> {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Unable to create canvas context.');
  }

  const crop = calculateCenteredSquareCrop(image.width, image.height);

  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.size,
    crop.size,
    0,
    0,
    size,
    size
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to generate PNG.'));
        }
      },
      'image/png'
    );
  });
}

/**
 * Render all target favicon sizes and create Object URLs.
 * Caller is responsible for revoking URLs when no longer needed.
 */
export async function renderAllFavicons(
  image: HTMLImageElement
): Promise<GeneratedFavicon[]> {
  const results: GeneratedFavicon[] = [];

  for (const size of TARGET_SIZES) {
    const blob = await renderFavicon(image, size);
    const objectUrl = URL.createObjectURL(blob);
    results.push({
      size,
      filename: generateFaviconFilename(size),
      blob,
      objectUrl,
    });
  }

  return results;
}