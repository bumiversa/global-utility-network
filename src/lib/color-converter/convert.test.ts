import { describe, expect, it } from 'vitest';
import { isValidHex, isValidRgb, isValidHsl } from './validate';
import { hexToRgb, rgbToHex, rgbToHsl, hslToRgb } from './convert';

describe('Color Converter Pure Logic', () => {
  describe('Validation', () => {
    it('1. Valid HEX (6-digit only)', () => {
      expect(isValidHex('#000000')).toBe(true);
      expect(isValidHex('#FF5733')).toBe(true);
      expect(isValidHex('#12AbEf')).toBe(true);
    });

    it('2. Invalid HEX', () => {
      expect(isValidHex('')).toBe(false);
      expect(isValidHex('#')).toBe(false);
      expect(isValidHex('#fff')).toBe(false); // Short hex excluded
      expect(isValidHex('#GGGGGG')).toBe(false);
      expect(isValidHex('#12345')).toBe(false);
      expect(isValidHex('#1234567')).toBe(false);
    });

    it('3. Valid RGB', () => {
      expect(isValidRgb(0, 0, 0)).toBe(true);
      expect(isValidRgb(255, 255, 255)).toBe(true);
    });

    it('4. Invalid RGB', () => {
      expect(isValidRgb(-1, 0, 0)).toBe(false);
      expect(isValidRgb(256, 0, 0)).toBe(false);
      expect(isValidRgb(128.5, 0, 0)).toBe(false); // Decimal excluded
      expect(isValidRgb(NaN, 0, 0)).toBe(false);
    });

    it('5. Valid HSL', () => {
      expect(isValidHsl(0, 0, 0)).toBe(true);
      expect(isValidHsl(360, 100, 100)).toBe(true);
    });

    it('6. Invalid HSL', () => {
      expect(isValidHsl(361, 0, 0)).toBe(false);
      expect(isValidHsl(0, -1, 0)).toBe(false);
      expect(isValidHsl(0, 0, Infinity)).toBe(false);
    });
  });

  describe('Conversion', () => {
    it('7. Known colors: HEX ↔ RGB', () => {
      expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 });
      expect(hexToRgb('#FFFFFF')).toEqual({ r: 255, g: 255, b: 255 });
      expect(hexToRgb('#FF0000')).toEqual({ r: 255, g: 0, b: 0 });
      expect(hexToRgb('#00FF00')).toEqual({ r: 0, g: 255, b: 0 });
      expect(hexToRgb('#0000FF')).toEqual({ r: 0, g: 0, b: 255 });

      expect(rgbToHex(0, 0, 0)).toBe('#000000');
      expect(rgbToHex(255, 255, 255)).toBe('#FFFFFF');
      expect(rgbToHex(255, 0, 0)).toBe('#FF0000');
    });

    it('8. Grayscale & Achromatic Policy (HSL h=0 when s=0)', () => {
      const grayHsl = rgbToHsl(128, 128, 128);
      expect(grayHsl.s).toBe(0);
      expect(grayHsl.h).toBe(0); // Explicit achromatic policy
      expect(grayHsl.l).toBeCloseTo(50.2, 1);
    });

    it('9. Arbitrary colors: RGB ↔ HSL', () => {
      // #FF5733 -> RGB(255, 87, 51)
      const hsl1 = rgbToHsl(255, 87, 51);
      expect(hsl1.h).toBeCloseTo(10.6, 1);
      expect(hsl1.s).toBeCloseTo(100, 1);
      expect(hsl1.l).toBeCloseTo(60, 1);

      const rgb1 = hslToRgb(hsl1.h, hsl1.s, hsl1.l);
      expect(rgb1).toEqual({ r: 255, g: 87, b: 51 });
    });
  });

  describe('Round-Trip Consistency', () => {
    it('10. HEX → RGB → HSL → RGB → HEX', () => {
      const testColors = ['#FF5733', '#3498DB', '#2ECC71', '#9B59B6', '#F1C40F'];

      for (const hex of testColors) {
        const rgb1 = hexToRgb(hex);
        const hsl = rgbToHsl(rgb1.r, rgb1.g, rgb1.b);
        const rgb2 = hslToRgb(hsl.h, hsl.s, hsl.l);
        const finalHex = rgbToHex(rgb2.r, rgb2.g, rgb2.b);

        // Due to rounding in HSL↔RGB, final HEX might differ by 1 unit in extreme cases,
        // but for standard web colors, it should match exactly or be extremely close.
        // We assert the round-trip RGB matches the original RGB.
        expect(rgb2).toEqual(rgb1);
        expect(finalHex).toBe(hex);
      }
    });
  });
});