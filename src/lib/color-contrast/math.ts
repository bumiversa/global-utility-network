/**
 * Converts an sRGB channel value (0-255) to linear RGB.
 * Uses the W3C WCAG 2.x standard breakpoint of 0.04045.
 */
export function sRGBToLinear(c: number): number {
  const csRGB = c / 255;
  if (csRGB <= 0.04045) {
    return csRGB / 12.92;
  }
  return Math.pow((csRGB + 0.055) / 1.055, 2.4);
}

/**
 * Calculates the relative luminance of an RGB color.
 */
export function getRelativeLuminance(r: number, g: number, b: number): number {
  const rLinear = sRGBToLinear(r);
  const gLinear = sRGBToLinear(g);
  const bLinear = sRGBToLinear(b);
  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

/**
 * Calculates the contrast ratio between two luminance values.
 * L1 is the lighter color, L2 is the darker color.
 */
export function getContrastRatio(l1: number, l2: number): number {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}