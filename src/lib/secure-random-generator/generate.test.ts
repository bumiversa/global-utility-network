import { describe, expect, it } from 'vitest';
import { generateUUID, generateSecureRandomString } from './generate';

describe('Secure Random Generator Pure Logic', () => {
  describe('UUID v4 Generation', () => {
    it('1. Generates valid UUID v4 format', () => {
      const result = generateUUID();
      expect(result.ok).toBe(true);
      if (result.ok) {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
        expect(result.value).toMatch(uuidRegex);
      }
    });

    it('2. UUID has correct length (36 characters)', () => {
      const result = generateUUID();
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.length).toBe(36);
      }
    });

    it('3. UUID is lowercase', () => {
      const result = generateUUID();
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toBe(result.value.toLowerCase());
      }
    });

    it('4. UUID version nibble is 4', () => {
      const result = generateUUID();
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value[14]).toBe('4');
      }
    });

    it('5. UUID variant nibble is 8, 9, a, or b', () => {
      const result = generateUUID();
      expect(result.ok).toBe(true);
      if (result.ok) {
        const variant = result.value[19];
        expect(['8', '9', 'a', 'b']).toContain(variant);
      }
    });

    it('6. Multiple UUIDs are different (probabilistic)', () => {
      const uuids = new Set<string>();
      for (let i = 0; i < 100; i++) {
        const result = generateUUID();
        expect(result.ok).toBe(true);
        if (result.ok) {
          uuids.add(result.value);
        }
      }
      expect(uuids.size).toBe(100);
    });

    it('7. Crypto failure is handled gracefully', () => {
      const original = crypto.randomUUID;
      try {
        crypto.randomUUID = () => { throw new Error('Not supported'); };
        const result = generateUUID();
        expect(result.ok).toBe(false);
        if (!result.ok) {
          expect(result.error).toContain('Failed to generate UUID');
        }
      } finally {
        crypto.randomUUID = original;
      }
    });
  });

  describe('Secure Random String Generation', () => {
    it('8. Generates string with correct length', () => {
      const result = generateSecureRandomString(16, { letters: true });
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.length).toBe(16);
      }
    });

    it('9. Letters-only charset contains only A-Z a-z', () => {
      const result = generateSecureRandomString(100, { letters: true });
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toMatch(/^[A-Za-z]+$/);
      }
    });

    it('10. Numbers-only charset contains only 0-9', () => {
      const result = generateSecureRandomString(100, { numbers: true });
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toMatch(/^[0-9]+$/);
      }
    });

    it('11. Symbols-only charset contains only defined symbols', () => {
      const result = generateSecureRandomString(100, { symbols: true });
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toMatch(/^[!@#$%^&*()\-_=+\[\]{};:,.?]+$/);
      }
    });

    it('12. Combined charset output only contains valid characters', () => {
      const result = generateSecureRandomString(128, {
        letters: true,
        numbers: true,
        symbols: true,
      });
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toHaveLength(128);
        // Invariant: output only from union of selected charsets
        expect(result.value).toMatch(/^[A-Za-z0-9!@#$%^&*()\-_=+\[\]{};:,.?]+$/);
      }
    });

    it('13. Minimum length (8) is accepted', () => {
      const result = generateSecureRandomString(8, { letters: true });
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.length).toBe(8);
      }
    });

    it('14. Maximum length (128) is accepted', () => {
      const result = generateSecureRandomString(128, { letters: true });
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.length).toBe(128);
      }
    });

    it('15. Length below 8 is rejected', () => {
      const result = generateSecureRandomString(7, { letters: true });
      expect(result).toEqual({
        ok: false,
        error: 'Length must be an integer between 8 and 128.',
      });
    });

    it('16. Length above 128 is rejected', () => {
      const result = generateSecureRandomString(129, { letters: true });
      expect(result).toEqual({
        ok: false,
        error: 'Length must be an integer between 8 and 128.',
      });
    });

    it('17. Non-integer length is rejected', () => {
      const result = generateSecureRandomString(10.5, { letters: true });
      expect(result).toEqual({
        ok: false,
        error: 'Length must be an integer between 8 and 128.',
      });
    });

    it('18. No charset selected is rejected', () => {
      const result = generateSecureRandomString(16, {});
      expect(result).toEqual({
        ok: false,
        error: 'Please select at least one character set.',
      });
    });

    it('19. Distribution is approximately uniform (statistical smoke test)', () => {
      const digitCounts: Record<string, number> = {};
      for (let i = 0; i <= 9; i++) {
        digitCounts[String(i)] = 0;
      }

      const iterations = 100;
      const lengthPerCall = 128;

      for (let i = 0; i < iterations; i++) {
        const result = generateSecureRandomString(lengthPerCall, { numbers: true });
        expect(result.ok).toBe(true);
        if (result.ok) {
          for (const char of result.value) {
            digitCounts[char]++;
          }
        }
      }

      const totalSamples = iterations * lengthPerCall;
      const expected = totalSamples / 10;

      for (let digit = 0; digit <= 9; digit++) {
        const count = digitCounts[String(digit)];
        expect(count).toBeGreaterThan(expected * 0.8);
        expect(count).toBeLessThan(expected * 1.2);
      }
    });

    it('20. Rejection sampling rejects bytes >= limit (deterministic)', () => {
      // For charset numbers (10 chars), limit = floor(256/10)*10 = 250
      // Bytes 250-255 should be rejected, bytes 0-9 map to '0'-'9'
      const original = crypto.getRandomValues;

      try {
        crypto.getRandomValues = ((buffer: Uint8Array) => {
          const mockBytes = new Uint8Array(buffer.length);
          // First 6 bytes: 250-255 (should be rejected)
          for (let i = 0; i < 6 && i < mockBytes.length; i++) {
            mockBytes[i] = 250 + i;
          }
          // Next bytes: 0,1,2,3,4,5,6,7,8,9 (should be accepted as '0'-'9')
          for (let i = 6; i < mockBytes.length; i++) {
            mockBytes[i] = (i - 6) % 10;
          }
          buffer.set(mockBytes);
          return buffer;
        }) as typeof crypto.getRandomValues;

        const result = generateSecureRandomString(10, { numbers: true });
        expect(result.ok).toBe(true);
        if (result.ok) {
          // First 6 bytes rejected, next 10 bytes (0-9) accepted
          expect(result.value).toBe('0123456789');
        }
      } finally {
        crypto.getRandomValues = original;
      }
    });

    it('21. Crypto failure during random string generation is handled', () => {
      const original = crypto.getRandomValues;
      try {
        crypto.getRandomValues = () => { throw new Error('Crypto unavailable'); };
        const result = generateSecureRandomString(16, { letters: true });
        expect(result.ok).toBe(false);
        if (!result.ok) {
          expect(result.error).toContain('Secure random generation failed');
        }
      } finally {
        crypto.getRandomValues = original;
      }
    });
  });
});