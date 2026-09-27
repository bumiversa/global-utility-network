import { describe, expect, it } from 'vitest';
import { buildCharset } from './charset';
import { uniformRandomIndex } from './random';
import { validateOptions, generatePassword } from './generator';
import { UPPERCASE, LOWERCASE, NUMBERS, SYMBOLS, AMBIGUOUS } from './constants';
import type { RandomSource } from './types';

describe('Password Generator', () => {
  describe('Charset Construction', () => {
    it('C1. All sets enabled', () => {
      const charset = buildCharset({
        length: 16,
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: true,
        excludeAmbiguous: false,
      });
      
      expect(charset).toBe(UPPERCASE + LOWERCASE + NUMBERS + SYMBOLS);
      expect(charset.length).toBe(UPPERCASE.length + LOWERCASE.length + NUMBERS.length + SYMBOLS.length);
    });

    it('C2. Only uppercase', () => {
      const charset = buildCharset({
        length: 16,
        uppercase: true,
        lowercase: false,
        numbers: false,
        symbols: false,
        excludeAmbiguous: false,
      });
      
      expect(charset).toBe(UPPERCASE);
    });

    it('C3. Only lowercase', () => {
      const charset = buildCharset({
        length: 16,
        uppercase: false,
        lowercase: true,
        numbers: false,
        symbols: false,
        excludeAmbiguous: false,
      });
      
      expect(charset).toBe(LOWERCASE);
    });

    it('C4. Only numbers', () => {
      const charset = buildCharset({
        length: 16,
        uppercase: false,
        lowercase: false,
        numbers: true,
        symbols: false,
        excludeAmbiguous: false,
      });
      
      expect(charset).toBe(NUMBERS);
    });

    it('C5. Only symbols', () => {
      const charset = buildCharset({
        length: 16,
        uppercase: false,
        lowercase: false,
        numbers: false,
        symbols: true,
        excludeAmbiguous: false,
      });
      
      expect(charset).toBe(SYMBOLS);
    });

    it('C6. Exclude ambiguous from all sets', () => {
      const charset = buildCharset({
        length: 16,
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: true,
        excludeAmbiguous: true,
      });
      
      // Should not contain any ambiguous characters
      for (const char of AMBIGUOUS) {
        expect(charset.includes(char)).toBe(false);
      }
      
      // Should still contain non-ambiguous characters
      expect(charset.includes('A')).toBe(true);
      expect(charset.includes('a')).toBe(true);
      expect(charset.includes('2')).toBe(true);
      expect(charset.includes('@')).toBe(true);
    });

    it('C7. Exclude ambiguous from numbers only', () => {
      const charset = buildCharset({
        length: 16,
        uppercase: false,
        lowercase: false,
        numbers: true,
        symbols: false,
        excludeAmbiguous: true,
      });
      
      // Should not contain 0 and 1
      expect(charset.includes('0')).toBe(false);
      expect(charset.includes('1')).toBe(false);
      
      // Should contain 2-9
      expect(charset).toBe('23456789');
    });

    it('C8. Exclude ambiguous from uppercase only', () => {
      const charset = buildCharset({
        length: 16,
        uppercase: true,
        lowercase: false,
        numbers: false,
        symbols: false,
        excludeAmbiguous: true,
      });
      
      // Should not contain I and O
      expect(charset.includes('I')).toBe(false);
      expect(charset.includes('O')).toBe(false);
      
      // Should contain other uppercase
      expect(charset.includes('A')).toBe(true);
      expect(charset.includes('Z')).toBe(true);
    });

    it('C9. Exclude ambiguous from lowercase only', () => {
      const charset = buildCharset({
        length: 16,
        uppercase: false,
        lowercase: true,
        numbers: false,
        symbols: false,
        excludeAmbiguous: true,
      });
      
      // Should not contain l
      expect(charset.includes('l')).toBe(false);
      
      // Should contain other lowercase
      expect(charset.includes('a')).toBe(true);
      expect(charset.includes('z')).toBe(true);
    });

    it('C10. Exclude ambiguous from symbols only', () => {
      const charset = buildCharset({
        length: 16,
        uppercase: false,
        lowercase: false,
        numbers: false,
        symbols: true,
        excludeAmbiguous: true,
      });
      
      // Should not contain |, `, ', "
      expect(charset.includes('|')).toBe(false);
      expect(charset.includes('`')).toBe(false);
      expect(charset.includes("'")).toBe(false);
      expect(charset.includes('"')).toBe(false);
      
      // Should contain other symbols
      expect(charset.includes('@')).toBe(true);
      expect(charset.includes('#')).toBe(true);
    });
  });

  describe('Validation', () => {
    it('V1. Length too short', () => {
      const result = validateOptions({
        length: 7,
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: true,
        excludeAmbiguous: false,
      });
      
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('at least 8');
      }
    });

    it('V2. Length too long', () => {
      const result = validateOptions({
        length: 65,
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: true,
        excludeAmbiguous: false,
      });
      
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('at most 64');
      }
    });

    it('V3. No character sets selected', () => {
      const result = validateOptions({
        length: 16,
        uppercase: false,
        lowercase: false,
        numbers: false,
        symbols: false,
        excludeAmbiguous: false,
      });
      
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('at least one character set');
      }
    });

    it('V4. Valid options', () => {
      const result = validateOptions({
        length: 16,
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: true,
        excludeAmbiguous: false,
      });
      
      expect(result.ok).toBe(true);
    });
  });

  describe('Rejection Sampling', () => {
    it('R1. Uniform distribution with mock random source', () => {
      // Mock random source that returns sequential values
      let counter = 0;
      const mockRandom: RandomSource = (length) => {
        const result = new Uint8Array(length);
        for (let i = 0; i < length; i++) {
          result[i] = counter % 256;
          counter++;
        }
        return result;
      };
      
      // With charset length 10, max valid = 250
      // Values 0-249 should be accepted, 250-255 should be rejected
      const indices: number[] = [];
      for (let i = 0; i < 100; i++) {
        indices.push(uniformRandomIndex(10, mockRandom));
      }
      
      // All indices should be in range [0, 10)
      for (const idx of indices) {
        expect(idx).toBeGreaterThanOrEqual(0);
        expect(idx).toBeLessThan(10);
      }
    });

    it('R2. Rejection sampling with values that would cause bias', () => {
      // Mock random source that returns values 250-255 (would cause bias with modulo)
      let callCount = 0;
      const mockRandom: RandomSource = () => {
        callCount++;
        // First 6 calls return biased values (250-255), then return valid values
        if (callCount <= 6) {
          return new Uint8Array([250 + (callCount - 1)]);
        }
        return new Uint8Array([callCount % 10]);
      };
      
      // Should reject biased values and eventually get a valid one
      const index = uniformRandomIndex(10, mockRandom);
      expect(index).toBeGreaterThanOrEqual(0);
      expect(index).toBeLessThan(10);
      expect(callCount).toBeGreaterThan(6); // Should have rejected at least 6 times
    });

    it('R3. Charset length 1 always returns 0', () => {
      const mockRandom: RandomSource = () => new Uint8Array([255]);
      const index = uniformRandomIndex(1, mockRandom);
      expect(index).toBe(0);
    });

    it('R4. Charset length 256 uses all values', () => {
      const mockRandom: RandomSource = (length) => {
        const result = new Uint8Array(length);
        for (let i = 0; i < length; i++) {
          result[i] = i % 256;
        }
        return result;
      };
      
      // With charset length 256, max valid = 256, so all values 0-255 are valid
      const index = uniformRandomIndex(256, mockRandom);
      expect(index).toBeGreaterThanOrEqual(0);
      expect(index).toBeLessThan(256);
    });
  });

  describe('Password Generation', () => {
    it('G1. Generate password with all sets', () => {
      const mockRandom: RandomSource = (length) => {
        const result = new Uint8Array(length);
        for (let i = 0; i < length; i++) {
          result[i] = i % 256;
        }
        return result;
      };
      
      const result = generatePassword({
        length: 16,
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: true,
        excludeAmbiguous: false,
      }, mockRandom);
      
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.password.length).toBe(16);
        expect(result.length).toBe(16);
      }
    });

    it('G2. Generate password with minimum length', () => {
      const result = generatePassword({
        length: 8,
        uppercase: true,
        lowercase: false,
        numbers: false,
        symbols: false,
        excludeAmbiguous: false,
      });
      
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.password.length).toBe(8);
      }
    });

    it('G3. Generate password with maximum length', () => {
      const result = generatePassword({
        length: 64,
        uppercase: true,
        lowercase: false,
        numbers: false,
        symbols: false,
        excludeAmbiguous: false,
      });
      
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.password.length).toBe(64);
      }
    });

    it('G4. Generate password with only uppercase', () => {
      const result = generatePassword({
        length: 16,
        uppercase: true,
        lowercase: false,
        numbers: false,
        symbols: false,
        excludeAmbiguous: false,
      });
      
      expect(result.ok).toBe(true);
      if (result.ok) {
        // All characters should be uppercase
        expect(result.password).toMatch(/^[A-Z]+$/);
      }
    });

    it('G5. Generate password with exclude ambiguous', () => {
      const result = generatePassword({
        length: 32,
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: true,
        excludeAmbiguous: true,
      });
      
      expect(result.ok).toBe(true);
      if (result.ok) {
        // Should not contain any ambiguous characters
        for (const char of AMBIGUOUS) {
          expect(result.password.includes(char)).toBe(false);
        }
      }
    });

    it('G6. Validation error propagates', () => {
      const result = generatePassword({
        length: 7,
        uppercase: true,
        lowercase: false,
        numbers: false,
        symbols: false,
        excludeAmbiguous: false,
      });
      
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('at least 8');
      }
    });
  });
});
