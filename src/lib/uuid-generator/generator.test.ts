import { describe, expect, it } from 'vitest';
import { generateUuids, validateOptions } from './generator';
import { generateUuidV7, extractTimestampFromUuidV7 } from './v7';
import type { RandomBytesSource, TimestampSource } from './types';

describe('UUID Generator', () => {
  describe('UUID v4 Generation', () => {
    it('T1. Length = 36', () => {
      const result = generateUuids({ version: 'v4', quantity: 1 });
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.uuids[0].length).toBe(36);
      }
    });

    it('T2 & T3 & T4. Canonical format, version 4, variant RFC 9562', () => {
      const result = generateUuids({ version: 'v4', quantity: 10 });
      expect(result.ok).toBe(true);
      if (result.ok) {
        const uuidv4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
        for (const uuid of result.uuids) {
          expect(uuid).toMatch(uuidv4Regex);
        }
      }
    });
  });

  describe('UUID v7 Generation & RFC Compliance', () => {
    it('T5 & T6 & T7 & T8. Canonical format, version 7, variant RFC 9562', () => {
      const result = generateUuids({ version: 'v7', quantity: 10 });
      expect(result.ok).toBe(true);
      if (result.ok) {
        const uuidv7Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
        for (const uuid of result.uuids) {
          expect(uuid).toMatch(uuidv7Regex);
        }
      }
    });

    it('T9. RFC 9562 deterministic test vector', () => {
      const mockTimestamp: TimestampSource = () => 1645557742000;
      const mockRandom: RandomBytesSource = () => {
        return new Uint8Array([
          0x0c,
          0xc3,
          0x18,
          0xc4,
          0xdc,
          0x0c,
          0x0c,
          0x07,
          0x39,
          0x8f,
        ]);
      };

      const result = generateUuids(
        { version: 'v7', quantity: 1 },
        mockRandom,
        mockTimestamp
      );

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.uuids[0]).toBe('017f22e2-79b0-7cc3-98c4-dc0c0c07398f');
      }
    });

    it('T10. Timestamp extraction matches generation time', () => {
      const mockTimestamp: TimestampSource = () => 1645557742000;
      const mockRandom: RandomBytesSource = () => new Uint8Array(10);

      const uuid = generateUuidV7(mockTimestamp, mockRandom);
      const extracted = extractTimestampFromUuidV7(uuid);

      expect(extracted).toBe(1645557742000);
    });
  });

  describe('Quantity & Boundaries', () => {
    it('T11. Quantity = 1', () => {
      const result = generateUuids({ version: 'v4', quantity: 1 });
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.uuids.length).toBe(1);
      }
    });

    it('T12. Quantity = 100', () => {
      const result = generateUuids({ version: 'v7', quantity: 100 });
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.uuids.length).toBe(100);
      }
    });

    it('T13. Quantity < 1 rejected', () => {
      const result = validateOptions({ version: 'v4', quantity: 0 });
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('at least 1');
      }
    });

    it('T14. Quantity > 100 rejected', () => {
      const result = validateOptions({ version: 'v4', quantity: 101 });
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('at most 100');
      }
    });

    it('T17. Quantity 1.5 rejected (non-integer)', () => {
      const result = validateOptions({ version: 'v4', quantity: 1.5 });
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('whole number');
      }
    });

    it('T18. Quantity NaN rejected', () => {
      const result = validateOptions({ version: 'v4', quantity: NaN });
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('whole number');
      }
    });
  });

  describe('Uniqueness Sanity Check', () => {
    it('T15. 100 v4 UUIDs are unique', () => {
      const result = generateUuids({ version: 'v4', quantity: 100 });
      expect(result.ok).toBe(true);
      if (result.ok) {
        const uniqueSet = new Set(result.uuids);
        expect(uniqueSet.size).toBe(100);
      }
    });

    it('T16. 100 v7 UUIDs are unique', () => {
      const result = generateUuids({ version: 'v7', quantity: 100 });
      expect(result.ok).toBe(true);
      if (result.ok) {
        const uniqueSet = new Set(result.uuids);
        expect(uniqueSet.size).toBe(100);
      }
    });
  });
});