import type { ParsedColor } from './types';

export function parseColor(color: string): ParsedColor {
  const trimmed = color.trim().toLowerCase();

  // 1. HEX #RGB
  const hex3Match = trimmed.match(/^#([0-9a-f]{3})$/);
  if (hex3Match) {
    const r = parseInt(hex3Match[1][0].repeat(2), 16);
    const g = parseInt(hex3Match[1][1].repeat(2), 16);
    const b = parseInt(hex3Match[1][2].repeat(2), 16);
    return { r, g, b, normalizedHex: `#${hex3Match[1][0].repeat(2)}${hex3Match[1][1].repeat(2)}${hex3Match[1][2].repeat(2)}`.toUpperCase() };
  }

  // 2. HEX #RRGGBB
  const hex6Match = trimmed.match(/^#([0-9a-f]{6})$/);
  if (hex6Match) {
    const r = parseInt(hex6Match[1].substring(0, 2), 16);
    const g = parseInt(hex6Match[1].substring(2, 4), 16);
    const b = parseInt(hex6Match[1].substring(4, 6), 16);
    return { r, g, b, normalizedHex: `#${hex6Match[1]}`.toUpperCase() };
  }

  // 3. RGB / RGBA
  const rgbMatch = trimmed.match(/^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*([\d.]+)\s*)?\)$/);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1], 10);
    const g = parseInt(rgbMatch[2], 10);
    const b = parseInt(rgbMatch[3], 10);
    const a = rgbMatch[4] !== undefined ? parseFloat(rgbMatch[4]) : 1;

    if (r > 255 || g > 255 || b > 255) {
      throw new Error('Invalid color channel. Values must be between 0 and 255.');
    }

    if (a < 1) {
      throw new Error('Transparent colors are not supported in V1. Please use opaque RGB/RGBA colors.');
    }

    // Normalize to HEX for consistent output
    const toHex = (n: number) => n.toString(16).padStart(2, '0').toUpperCase();
    const normalizedHex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;

    return { r, g, b, normalizedHex };
  }

  throw new Error('Invalid color format. Please use HEX (#RGB, #RRGGBB) or RGB/RGBA.');
}