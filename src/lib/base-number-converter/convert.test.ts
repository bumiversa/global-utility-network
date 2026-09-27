import { describe, expect, it } from 'vitest';
import { convertAllBases } from './convert';

describe('Base Number Converter', () => {
  describe('Valid conversions (V1-V11)', () => {
    it('V1. Decimal 255 â†’ all bases', () => {
      const result = convertAllBases('255', 10);
      expect(result).toEqual({
        ok: true,
        binary: '11111111',
        octal: '377',
        decimal: '255',
        hex: 'FF',
      });
    });

    it('V2. Hex FF â†’ all bases', () => {
      const result = convertAllBases('FF', 16);
      expect(result).toEqual({
        ok: true,
        binary: '11111111',
        octal: '377',
        decimal: '255',
        hex: 'FF',
      });
    });

    it('V3. Hex ff (lowercase) â†’ all bases', () => {
      const result = convertAllBases('ff', 16);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.hex).toBe('FF');
        expect(result.decimal).toBe('255');
      }
    });

    it('V4. Hex fF (mixed case) â†’ all bases', () => {
      const result = convertAllBases('fF', 16);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.hex).toBe('FF');
      }
    });

    it('V5. Octal 377 â†’ all bases', () => {
      const result = convertAllBases('377', 8);
      expect(result).toEqual({
        ok: true,
        binary: '11111111',
        octal: '377',
        decimal: '255',
        hex: 'FF',
      });
    });

    it('V6. Binary 11111111 â†’ all bases', () => {
      const result = convertAllBases('11111111', 2);
      expect(result).toEqual({
        ok: true,
        binary: '11111111',
        octal: '377',
        decimal: '255',
        hex: 'FF',
      });
    });

    it('V7. Zero â†’ all bases', () => {
      const result = convertAllBases('0', 10);
      expect(result).toEqual({
        ok: true,
        binary: '0',
        octal: '0',
        decimal: '0',
        hex: '0',
      });
    });

    it('V8. Binary 1 â†’ all bases', () => {
      const result = convertAllBases('1', 2);
      expect(result).toEqual({
        ok: true,
        binary: '1',
        octal: '1',
        decimal: '1',
        hex: '1',
      });
    });

    it('V9. Negative decimal -42 â†’ all bases', () => {
      const result = convertAllBases('-42', 10);
      expect(result).toEqual({
        ok: true,
        binary: '-101010',
        octal: '-52',
        decimal: '-42',
        hex: '-2A',
      });
    });

    it('V10. Negative hex -2A â†’ all bases', () => {
      const result = convertAllBases('-2A', 16);
      expect(result).toEqual({
        ok: true,
        binary: '-101010',
        octal: '-52',
        decimal: '-42',
        hex: '-2A',
      });
    });

    it('V11. Negative hex with leading zeros -000FF â†’ all bases', () => {
      const result = convertAllBases('-000FF', 16);
      expect(result).toEqual({
        ok: true,
        binary: '-11111111',
        octal: '-377',
        decimal: '-255',
        hex: '-FF',
      });
    });
  });

  describe('BigInt precision (B1-B4)', () => {
    it('B1. Beyond MAX_SAFE_INTEGER', () => {
      const result = convertAllBases('9007199254740993', 10);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.decimal).toBe('9007199254740993');
      }
    });

    it('B2. Large hex â†’ exact decimal', () => {
      const result = convertAllBases('8000000000000000', 16);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.decimal).toBe('9223372036854775808');
      }
    });

    it('B3. Max uint64 hex â†’ decimal', () => {
      const result = convertAllBases('FFFFFFFFFFFFFFFF', 16);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.decimal).toBe('18446744073709551615');
      }
    });

    it('B4. Negative max uint64', () => {
      const result = convertAllBases('-FFFFFFFFFFFFFFFF', 16);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.decimal).toBe('-18446744073709551615');
      }
    });
  });

  describe('Canonicalization (L1-L4)', () => {
    it('L1. Leading zeros in decimal', () => {
      const result = convertAllBases('000255', 10);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.decimal).toBe('255');
      }
    });

    it('L2. Leading zeros in hex', () => {
      const result = convertAllBases('00FF', 16);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.decimal).toBe('255');
      }
    });

    it('L3. Multiple zeros â†’ single zero', () => {
      const result = convertAllBases('00000', 10);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.decimal).toBe('0');
      }
    });

    it('L4. Negative with leading zeros', () => {
      const result = convertAllBases('-00042', 10);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.decimal).toBe('-42');
      }
    });
  });

  describe('Negative zero (NZ1-NZ2)', () => {
    it('NZ1. -0 â†’ 0', () => {
      const result = convertAllBases('-0', 10);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.decimal).toBe('0');
      }
    });

    it('NZ2. -00 â†’ 0', () => {
      const result = convertAllBases('-00', 10);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.decimal).toBe('0');
      }
    });
  });

  describe('Invalid inputs (I1-I11)', () => {
    it('I1. Invalid digit in binary', () => {
      const result = convertAllBases('10201', 2);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.code).toBe('INVALID_DIGIT');
      }
    });

    it('I2. Invalid digit in hex (G)', () => {
      const result = convertAllBases('12G4', 16);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.code).toBe('INVALID_DIGIT');
      }
    });

    it('I3. Invalid digit in octal (8)', () => {
      const result = convertAllBases('89', 8);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.code).toBe('INVALID_DIGIT');
      }
    });

    it('I4. Fraction in decimal', () => {
      const result = convertAllBases('1.5', 10);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.code).toBe('FRACTION_NOT_SUPPORTED');
      }
    });

    it('I5. Scientific notation in decimal', () => {
      const result = convertAllBases('1e10', 10);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.code).toBe('SCIENTIFIC_NOTATION_NOT_SUPPORTED');
      }
    });

    it('I6. Prefix 0x in hex', () => {
      const result = convertAllBases('0xFF', 16);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.code).toBe('PREFIX_NOT_SUPPORTED');
      }
    });

    it('I7. Prefix 0b in binary', () => {
      const result = convertAllBases('0b101', 2);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.code).toBe('PREFIX_NOT_SUPPORTED');
      }
    });

    it('I8. Invalid digit in decimal (letter)', () => {
      const result = convertAllBases('abc', 10);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.code).toBe('INVALID_DIGIT');
      }
    });

    it('I9. Fraction in decimal (multiple digits)', () => {
      const result = convertAllBases('12.34', 10);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.code).toBe('FRACTION_NOT_SUPPORTED');
      }
    });

    it('I10. Plus sign', () => {
      const result = convertAllBases('+42', 10);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.code).toBe('PLUS_SIGN_NOT_SUPPORTED');
      }
    });

    it('I11. Prefix 0x with negative', () => {
      const result = convertAllBases('-0x0', 16);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.code).toBe('PREFIX_NOT_SUPPORTED');
      }
    });
  });

  describe('Empty and whitespace (E1-E6)', () => {
    it('E1. Empty string â†’ empty outputs', () => {
      const result = convertAllBases('', 10);
      expect(result).toEqual({
        ok: true,
        binary: '',
        octal: '',
        decimal: '',
        hex: '',
      });
    });

    it('E2. Whitespace only â†’ empty outputs', () => {
      const result = convertAllBases('   ', 10);
      expect(result).toEqual({
        ok: true,
        binary: '',
        octal: '',
        decimal: '',
        hex: '',
      });
    });

    it('E3. Trim whitespace around decimal', () => {
      const result = convertAllBases(' 255 ', 10);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.decimal).toBe('255');
      }
    });

    it('E4. Trim whitespace around hex', () => {
      const result = convertAllBases('  FF  ', 16);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.hex).toBe('FF');
      }
    });

    it('E5. Internal whitespace in decimal â†’ error', () => {
      const result = convertAllBases('25 5', 10);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.code).toBe('INVALID_DIGIT');
      }
    });

    it('E6. Internal whitespace in hex â†’ error', () => {
      const result = convertAllBases('FF FF', 16);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.code).toBe('INVALID_DIGIT');
      }
    });
  });

  describe('Edge cases (X1-X6)', () => {
    it('X1. Binary 10 â†’ decimal 2', () => {
      const result = convertAllBases('10', 2);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.decimal).toBe('2');
      }
    });

    it('X2. Octal 10 â†’ decimal 8', () => {
      const result = convertAllBases('10', 8);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.decimal).toBe('8');
      }
    });

    it('X3. Decimal 10 â†’ hex A', () => {
      const result = convertAllBases('10', 10);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.hex).toBe('A');
      }
    });

    it('X4. Hex 10 â†’ decimal 16', () => {
      const result = convertAllBases('10', 16);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.decimal).toBe('16');
      }
    });

    it('X5. Single hex digit A â†’ decimal 10', () => {
      const result = convertAllBases('A', 16);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.decimal).toBe('10');
      }
    });

    it('X6. Single hex digit a (lowercase) â†’ decimal 10', () => {
      const result = convertAllBases('a', 16);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.decimal).toBe('10');
      }
    });
  });

  describe('Hex letters regression test (H1-H2)', () => {
    it('H1. BEEF (contains E) â†’ valid hex', () => {
      const result = convertAllBases('BEEF', 16);
      expect(result).toEqual({
        ok: true,
        binary: '1011111011101111',
        octal: '137357',
        decimal: '48879',
        hex: 'BEEF',
      });
    });

    it('H2. DEAD (contains E and D) â†’ valid hex', () => {
      const result = convertAllBases('DEAD', 16);
      expect(result).toEqual({
        ok: true,
        binary: '1101111010101101',
        octal: '157255',
        decimal: '57005',
        hex: 'DEAD',
      });
    });
  });

  describe('Additional edge case: minus sign only', () => {
    it('Minus sign only â†’ INVALID_DIGIT', () => {
      const result = convertAllBases('-', 10);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.code).toBe('INVALID_DIGIT');
      }
    });
  });
});