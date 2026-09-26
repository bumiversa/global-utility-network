export function isValidHex(hex: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(hex);
}

export function isValidRgb(r: number, g: number, b: number): boolean {
  return (
    Number.isInteger(r) && r >= 0 && r <= 255 &&
    Number.isInteger(g) && g >= 0 && g <= 255 &&
    Number.isInteger(b) && b >= 0 && b <= 255
  );
}

export function isValidHsl(h: number, s: number, l: number): boolean {
  return (
    Number.isFinite(h) && h >= 0 && h <= 360 &&
    Number.isFinite(s) && s >= 0 && s <= 100 &&
    Number.isFinite(l) && l >= 0 && l <= 100
  );
}