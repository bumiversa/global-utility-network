import { describe, expect, it } from 'vitest';
import { convertUnits, isLengthUnit, isWeightUnit } from './convert';

describe('Unit Converter Pure Logic (Phase 1.5 Hardened)', () => {
  describe('Type Guards (Independent)', () => {
    it('1. isLengthUnit validates correctly', () => {
      expect(isLengthUnit('meter')).toBe(true);
      expect(isLengthUnit('mile')).toBe(false);
      expect(isLengthUnit('')).toBe(false);
    });

    it('2. isWeightUnit validates correctly', () => {
      expect(isWeightUnit('kilogram')).toBe(true);
      expect(isWeightUnit('stone')).toBe(false);
    });
  });

  describe('Length Conversion', () => {
    it('3. Identity conversion (meter to meter)', () => {
      const result = convertUnits(5, 'meter', 'meter', 'length');
      expect(result).toEqual({ ok: true, value: 5 });
    });

    it('4. Kilometer to Meter', () => {
      const result = convertUnits(1, 'kilometer', 'meter', 'length');
      expect(result).toEqual({ ok: true, value: 1000 });
    });

    it('5. Feet to Inch (Exact ratio)', () => {
      const result = convertUnits(1, 'feet', 'inch', 'length');
      expect(result.ok).toBe(true);
      if (result.ok) expect(result.value).toBeCloseTo(12, 5);
    });
  });

  describe('Weight Conversion', () => {
    it('6. Identity conversion (kilogram to kilogram)', () => {
      const result = convertUnits(10, 'kilogram', 'kilogram', 'weight');
      expect(result).toEqual({ ok: true, value: 10 });
    });

    it('7. Kilogram to Gram', () => {
      const result = convertUnits(1, 'kilogram', 'gram', 'weight');
      expect(result).toEqual({ ok: true, value: 1000 });
    });
  });

  describe('Zero Behavior', () => {
    it('8. Zero length', () => {
      const result = convertUnits(0, 'kilometer', 'feet', 'length');
      expect(result).toEqual({ ok: true, value: 0 });
    });

    it('9. Zero weight', () => {
      const result = convertUnits(0, 'pound', 'ounce', 'weight');
      expect(result).toEqual({ ok: true, value: 0 });
    });
  });

  describe('Validation & Edge Cases', () => {
    it('10. Invalid value (NaN)', () => {
      const result = convertUnits(NaN, 'meter', 'feet', 'length');
      expect(result).toEqual({ ok: false, error: "Value must be a valid finite number." });
    });

    it('11. Invalid value (Infinity)', () => {
      const result = convertUnits(Infinity, 'meter', 'feet', 'length');
      expect(result).toEqual({ ok: false, error: "Value must be a valid finite number." });
    });

    it('12. Invalid length unit', () => {
      const result = convertUnits(1, 'mile', 'meter', 'length');
      expect(result).toEqual({ ok: false, error: "Invalid unit for this category." });
    });

    it('13. Invalid weight unit', () => {
      const result = convertUnits(1, 'stone', 'kilogram', 'weight');
      expect(result).toEqual({ ok: false, error: "Invalid unit for this category." });
    });

    it('14. Invalid category', () => {
      const result = convertUnits(1, 'meter', 'feet', 'temperature');
      expect(result).toEqual({ ok: false, error: "Invalid conversion category." });
    });

    it('15. Huge finite input → finite result', () => {
      const result = convertUnits(1e100, 'meter', 'kilometer', 'length');
      expect(result.ok).toBe(true);
      if (result.ok) expect(Number.isFinite(result.value)).toBe(true);
    });

    it('16. Overflowing calculation → rejected (Finite Result Invariant)', () => {
      // 1e308 km to meter overflows to Infinity in JS (1e308 * 1000 = 1e311)
      const result = convertUnits(1e308, 'kilometer', 'meter', 'length');
      expect(result).toEqual({ ok: false, error: "Result is outside the supported numeric range." });
    });
  });
});