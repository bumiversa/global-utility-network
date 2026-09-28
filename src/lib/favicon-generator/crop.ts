import type { CropBox } from './types';

/**
 * Calculate centered square crop box for cover crop behavior.
 * 
 * @param sourceWidth - Original image width
 * @param sourceHeight - Original image height
 * @returns CropBox with x, y, and size (square dimension)
 */
export function calculateCenteredSquareCrop(
  sourceWidth: number,
  sourceHeight: number
): CropBox {
  const squareSize = Math.min(sourceWidth, sourceHeight);
  
  const x = (sourceWidth - squareSize) / 2;
  const y = (sourceHeight - squareSize) / 2;
  
  return {
    x,
    y,
    size: squareSize,
  };
}