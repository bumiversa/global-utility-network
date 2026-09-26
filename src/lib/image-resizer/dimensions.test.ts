import { describe, it, expect } from 'vitest';
import { calculateDimensions } from './dimensions';

describe('Image Resizer Dimensions Logic', () => {
  it('1. Lock aspect ratio: target width provided', () => {
    const result = calculateDimensions(1200, 800, 600, null, true);
    expect(result).toEqual({ width: 600, height: 400 });
  });

  it('2. Lock aspect ratio: target height provided', () => {
    const result = calculateDimensions(1200, 800, null, 400, true);
    expect(result).toEqual({ width: 600, height: 400 });
  });

  it('3. No lock aspect ratio: both targets provided', () => {
    const result = calculateDimensions(1200, 800, 500, 300, false);
    expect(result).toEqual({ width: 500, height: 300 });
  });

  it('4. No lock aspect ratio: only width provided (height falls back to original)', () => {
    const result = calculateDimensions(1200, 800, 600, null, false);
    expect(result).toEqual({ width: 600, height: 800 });
  });

  it('5. Invalid original dimensions (throws error)', () => {
    expect(() => calculateDimensions(0, 800, 600, null, true)).toThrow("Invalid original dimensions");
    expect(() => calculateDimensions(1200, -10, 600, null, true)).toThrow("Invalid original dimensions");
    expect(() => calculateDimensions(NaN, 800, 600, null, true)).toThrow("Invalid original dimensions");
  });

  it('6. Invalid target dimensions (falls back to original)', () => {
    const result = calculateDimensions(1200, 800, -500, null, true);
    expect(result).toEqual({ width: 1200, height: 800 }); // Fallback karena targetWidth <= 0
  });
});
