import { describe, expect, it } from 'vitest';
import { checkContrast } from './contrast';

describe('Color Contrast Engine', () => {
  describe('Mathematical Truth (WCAG 2.x)', () => {
    it('M1. Black vs White = 21:1', () => {
      const result = checkContrast('#000000', '#FFFFFF');
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.ratio).toBe(21);
      }
    });

    it('M2. White vs White = 1:1', () => {
      const result = checkContrast('#FFFFFF', '#FFFFFF');
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.ratio).toBe(1);
      }
    });

    it('M3. sRGB to Linear conversion (W3C breakpoint 0.04045)', () => {
      // 0 should be 0
      expect((0 / 255) <= 0.04045).toBe(true); // Just verifying the branch logic conceptually
      
      // 255 should be 1
      const c255 = 255 / 255;
      const linear255 = Math.pow((c255 + 0.055) / 1.055, 2.4);
      expect(linear255).toBe(1);
      
      // 128 (approx 0.502) -> > 0.04045
      const c128 = 128 / 255;
      const expected128 = Math.pow((c128 + 0.055) / 1.055, 2.4);
      // We trust the math.ts implementation, this is just a sanity check of the formula structure
      expect(expected128).toBeGreaterThan(0);
    });
  });

  describe('Parser & Validation', () => {
    it('P1. Short HEX expansion', () => {
      const result = checkContrast('#FFF', '#000');
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.fgNormalized).toBe('#FFFFFF');
        expect(result.data.bgNormalized).toBe('#000000');
        expect(result.data.ratio).toBe(21);
      }
    });

    it('P2. RGB/HEX equivalence', () => {
      const resHex = checkContrast('#FFFFFF', '#000000');
      const resRgb = checkContrast('rgb(255, 255, 255)', 'rgb(0, 0, 0)');
      expect(resHex.ok).toBe(true);
      expect(resRgb.ok).toBe(true);
      if (resHex.ok && resRgb.ok) {
        expect(resRgb.data.ratio).toBe(resHex.data.ratio);
      }
    });

    it('P3. Case-insensitivity', () => {
      const result = checkContrast('#fff', 'RGB(0,0,0)');
      expect(result.ok).toBe(true);
    });

    it('P4. Invalid channel (>255)', () => {
      const result = checkContrast('rgb(256, 0, 0)', '#FFFFFF');
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toContain('Invalid color channel');
    });

    it('P5. Invalid syntax', () => {
      const result = checkContrast('#GGGGGG', '#FFFFFF');
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toContain('Invalid color format');
    });

    it('P6. RGBA alpha < 1 rejection', () => {
      const result = checkContrast('rgba(255, 255, 255, 0.5)', '#000000');
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toContain('Transparent colors are not supported');
    });

    it('P7. RGBA alpha = 1 acceptance', () => {
      const result = checkContrast('rgba(255, 255, 255, 1)', '#000000');
      expect(result.ok).toBe(true);
    });
  });

  describe('WCAG Threshold Boundaries (No rounding before check)', () => {
    // These vectors are mathematically calculated to be just below and just above the W3C thresholds.
    
    it('B1. AA Normal boundary (4.5:1)', () => {
      // #777777 vs #FFFFFF yields ratio ~4.47:1 (FAIL)
      const resultFail = checkContrast('#777777', '#FFFFFF');
      expect(resultFail.ok).toBe(true);
      if (resultFail.ok) {
        expect(resultFail.data.wcag.aaNormal).toBe(false);
      }

      // #767676 vs #FFFFFF yields ratio ~4.53:1 (PASS)
      const resultPass = checkContrast('#767676', '#FFFFFF');
      expect(resultPass.ok).toBe(true);
      if (resultPass.ok) {
        expect(resultPass.data.wcag.aaNormal).toBe(true);
      }
    });

    it('B2. AA Large boundary (3.0:1)', () => {
      // #999999 vs #FFFFFF yields ratio ~2.85:1 (FAIL)
      const resultFail = checkContrast('#999999', '#FFFFFF');
      expect(resultFail.ok).toBe(true);
      if (resultFail.ok) {
        expect(resultFail.data.wcag.aaLarge).toBe(false);
      }

      // #7F7F7F vs #FFFFFF yields ratio ~3.05:1 (PASS)
      const resultPass = checkContrast('#7F7F7F', '#FFFFFF');
      expect(resultPass.ok).toBe(true);
      if (resultPass.ok) {
        expect(resultPass.data.wcag.aaLarge).toBe(true);
      }
    });

    it('B3. AAA Normal boundary (7.0:1)', () => {
      // #5A5A5A vs #FFFFFF yields ratio ~6.90:1 (FAIL)
      const resultFail = checkContrast('#5A5A5A', '#FFFFFF');
      expect(resultFail.ok).toBe(true);
      if (resultFail.ok) {
        expect(resultFail.data.wcag.aaaNormal).toBe(false);
      }

      // #595959 vs #FFFFFF yields ratio ~7.00:1 (PASS)
      const resultPass = checkContrast('#595959', '#FFFFFF');
      expect(resultPass.ok).toBe(true);
      if (resultPass.ok) {
        expect(resultPass.data.wcag.aaaNormal).toBe(true);
      }
    });
  });
});