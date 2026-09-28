import { describe, expect, it } from 'vitest';
import { parseIso8601 } from './parse';
import { calculateDifference } from './calculate';

describe('Time Difference Calculator', () => {
  describe('ISO 8601 Parsing', () => {
    it('P1. Valid ISO 8601 with Z', () => {
      const result = parseIso8601('2026-09-28T10:00:00Z');
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.timestamp).toBe(Date.parse('2026-09-28T10:00:00Z'));
      }
    });

    it('P2. Valid ISO 8601 with +HH:mm', () => {
      const result = parseIso8601('2026-09-28T10:00:00+07:00');
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.timestamp).toBe(Date.parse('2026-09-28T10:00:00+07:00'));
      }
    });

    it('P3. Valid ISO 8601 with -HH:mm', () => {
      const result = parseIso8601('2026-09-28T10:00:00-05:00');
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.timestamp).toBe(Date.parse('2026-09-28T10:00:00-05:00'));
      }
    });

    it('P4. Valid ISO 8601 with milliseconds', () => {
      const result = parseIso8601('2026-09-28T10:00:00.123Z');
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.timestamp).toBe(Date.parse('2026-09-28T10:00:00.123Z'));
      }
    });

    it('P5. Invalid: date only', () => {
      const result = parseIso8601('2026-09-28');
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('Invalid format');
      }
    });

    it('P6. Invalid: no timezone', () => {
      const result = parseIso8601('2026-09-28T10:00:00');
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('Invalid format');
      }
    });

    it('P7. Invalid: space instead of T', () => {
      const result = parseIso8601('2026-09-28 10:00:00Z');
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('Invalid format');
      }
    });

    it('P8. Invalid: local format', () => {
      const result = parseIso8601('September 28, 2026');
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('Invalid format');
      }
    });

    it('P9. Empty string', () => {
      const result = parseIso8601('');
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('empty');
      }
    });

    it('P10. Invalid month (13)', () => {
      const result = parseIso8601('2026-13-01T10:00:00Z');
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('Invalid date/time');
      }
    });

    it('P11. Invalid day (April 31)', () => {
      const result = parseIso8601('2026-04-31T10:00:00Z');
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('Invalid date/time');
      }
    });

    it('P12. Invalid leap day (2026-02-29)', () => {
      const result = parseIso8601('2026-02-29T10:00:00Z');
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('Invalid date/time');
      }
    });

    it('P13. Valid leap day (2024-02-29)', () => {
      const result = parseIso8601('2024-02-29T10:00:00Z');
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.timestamp).toBe(Date.parse('2024-02-29T10:00:00Z'));
      }
    });

    it('P14. Invalid hour (24)', () => {
      const result = parseIso8601('2026-09-28T24:00:00Z');
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('Invalid date/time');
      }
    });

    it('P15. Invalid minute (60)', () => {
      const result = parseIso8601('2026-09-28T10:60:00Z');
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('Invalid date/time');
      }
    });

    it('P16. Invalid second (60)', () => {
      const result = parseIso8601('2026-09-28T10:00:60Z');
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('Invalid date/time');
      }
    });

    it('P17. Invalid timezone offset (+99:00)', () => {
      const result = parseIso8601('2026-09-28T10:00:00+99:00');
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('timezone');
      }
    });

    it('P18. Valid fractional seconds (.1, .12, .123)', () => {
      expect(parseIso8601('2026-09-28T10:00:00.1Z').ok).toBe(true);
      expect(parseIso8601('2026-09-28T10:00:00.12Z').ok).toBe(true);
      expect(parseIso8601('2026-09-28T10:00:00.123Z').ok).toBe(true);
      expect(parseIso8601('2026-09-28T10:00:00.123456Z').ok).toBe(true);
    });
  });

  describe('Difference Calculation', () => {
    it('C1. Same instant (elapsed = 0)', () => {
      const ts = Date.parse('2026-09-28T10:00:00Z');
      const result = calculateDifference(ts, ts);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.result.elapsed).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        expect(result.result.totals.milliseconds).toBe(0);
      }
    });

    it('C2. A > B (absolute value)', () => {
      const tsA = Date.parse('2026-09-28T12:00:00Z');
      const tsB = Date.parse('2026-09-28T10:00:00Z');
      const result = calculateDifference(tsA, tsB);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.result.elapsed).toEqual({ days: 0, hours: 2, minutes: 0, seconds: 0 });
      }
    });

    it('C3. B > A (absolute value)', () => {
      const tsA = Date.parse('2026-09-28T10:00:00Z');
      const tsB = Date.parse('2026-09-28T12:00:00Z');
      const result = calculateDifference(tsA, tsB);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.result.elapsed).toEqual({ days: 0, hours: 2, minutes: 0, seconds: 0 });
      }
    });

    it('C4. Complex elapsed time', () => {
      const tsA = Date.parse('2026-09-28T10:00:00Z');
      const tsB = Date.parse('2026-09-30T13:14:15Z');
      const result = calculateDifference(tsA, tsB);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.result.elapsed).toEqual({ days: 2, hours: 3, minutes: 14, seconds: 15 });
      }
    });

    it('C5. Totals with precision', () => {
      const tsA = Date.parse('2026-09-28T10:00:00Z');
      const tsB = Date.parse('2026-09-28T12:30:45.500Z');
      const result = calculateDifference(tsA, tsB);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.result.totals.milliseconds).toBe(9045500);
        expect(result.result.totals.seconds).toBe(9045.5);
        expect(result.result.totals.minutes).toBe(150.758);
        expect(result.result.totals.hours).toBe(2.513);
      }
    });

    it('C6. Very large difference', () => {
      const tsA = Date.parse('2000-01-01T00:00:00Z');
      const tsB = Date.parse('2026-09-28T00:00:00Z');
      const result = calculateDifference(tsA, tsB);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.result.elapsed.days).toBeGreaterThan(9000);
      }
    });
  });

  describe('Integration', () => {
    it('I1. Full pipeline: parse + calculate', () => {
      const parseA = parseIso8601('2026-09-28T10:00:00Z');
      const parseB = parseIso8601('2026-09-28T12:30:45Z');
      
      expect(parseA.ok).toBe(true);
      expect(parseB.ok).toBe(true);
      
      if (parseA.ok && parseB.ok) {
        const result = calculateDifference(parseA.timestamp, parseB.timestamp);
        expect(result.ok).toBe(true);
        if (result.ok) {
          expect(result.result.elapsed).toEqual({ days: 0, hours: 2, minutes: 30, seconds: 45 });
        }
      }
    });

    it('I2. Different timezones', () => {
      const parseA = parseIso8601('2026-09-28T10:00:00+07:00');
      const parseB = parseIso8601('2026-09-28T10:00:00-05:00');
      
      expect(parseA.ok).toBe(true);
      expect(parseB.ok).toBe(true);
      
      if (parseA.ok && parseB.ok) {
        const result = calculateDifference(parseA.timestamp, parseB.timestamp);
        expect(result.ok).toBe(true);
        if (result.ok) {
          // 12 hours difference (7 + 5)
          expect(result.result.elapsed.hours).toBe(12);
        }
      }
    });
  });
});