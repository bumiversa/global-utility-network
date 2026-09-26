import { describe, expect, it } from 'vitest';
import { timestampToDate, dateToTimestamp } from './convert';

describe('Timestamp Converter Pure Logic (Phase 2 Hardened)', () => {
  describe('Timestamp → Date', () => {
    it('1. Epoch (0 seconds) → 1970-01-01T00:00:00.000Z', () => {
      const result = timestampToDate(0, 'seconds');
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.utc).toBe('1970-01-01T00:00:00.000Z');
      }
    });

    it('2. Epoch (0 milliseconds) → 1970-01-01T00:00:00.000Z', () => {
      const result = timestampToDate(0, 'milliseconds');
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.utc).toBe('1970-01-01T00:00:00.000Z');
      }
    });

    it('3. 1 second after epoch', () => {
      const result = timestampToDate(1, 'seconds');
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.utc).toBe('1970-01-01T00:00:01.000Z');
      }
    });

    it('4. 1000 milliseconds = 1 second', () => {
      const result = timestampToDate(1000, 'milliseconds');
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.utc).toBe('1970-01-01T00:00:01.000Z');
      }
    });

    it('5. Negative timestamp (pre-epoch)', () => {
      const result = timestampToDate(-86400, 'seconds'); // 1 day before epoch
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.utc).toBe('1969-12-31T00:00:00.000Z');
      }
    });

    it('6. Modern timestamp (2024-01-01)', () => {
      // 2024-01-01 00:00:00 UTC = 1704067200 seconds
      const result = timestampToDate(1704067200, 'seconds');
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.utc).toBe('2024-01-01T00:00:00.000Z');
      }
    });

    it('7. Invalid timestamp (NaN)', () => {
      const result = timestampToDate(NaN, 'seconds');
      expect(result).toEqual({ ok: false, error: "Timestamp must be a valid finite number." });
    });

    it('8. Invalid timestamp (Infinity)', () => {
      const result = timestampToDate(Infinity, 'seconds');
      expect(result).toEqual({ ok: false, error: "Timestamp must be a valid finite number." });
    });

    it('9. Invalid timestamp (-Infinity)', () => {
      const result = timestampToDate(-Infinity, 'seconds');
      expect(result).toEqual({ ok: false, error: "Timestamp must be a valid finite number." });
    });

    it('10. Local time formatting (browser-dependent)', () => {
      const result = timestampToDate(0, 'seconds');
      expect(result.ok).toBe(true);
      if (result.ok) {
        // Local time akan bergantung pada timezone browser, tapi format harus "YYYY-MM-DD HH:mm:ss"
        expect(result.local).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
      }
    });
  });

  describe('Date → Timestamp (Explicit datetime-local format)', () => {
    it('11. Valid datetime-local format (no seconds)', () => {
      const result = dateToTimestamp('2024-06-15T14:30');
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(Number.isFinite(result.milliseconds)).toBe(true);
        expect(Number.isFinite(result.seconds)).toBe(true);
      }
    });

    it('12. Valid datetime-local format (with seconds)', () => {
      const result = dateToTimestamp('2024-06-15T14:30:45');
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(Number.isFinite(result.milliseconds)).toBe(true);
        expect(Number.isFinite(result.seconds)).toBe(true);
      }
    });

    it('13. Invalid format (ISO string with Z)', () => {
      // Format ini TIDAK diterima karena kita hanya menerima datetime-local format
      const result = dateToTimestamp('1970-01-01T00:00:00.000Z');
      expect(result).toEqual({ ok: false, error: "Invalid date format. Please use YYYY-MM-DDTHH:mm or YYYY-MM-DDTHH:mm:ss" });
    });

    it('14. Invalid format (arbitrary string)', () => {
      const result = dateToTimestamp('not-a-date');
      expect(result).toEqual({ ok: false, error: "Invalid date format. Please use YYYY-MM-DDTHH:mm or YYYY-MM-DDTHH:mm:ss" });
    });

    it('15. Empty string → error', () => {
      const result = dateToTimestamp('');
      expect(result).toEqual({ ok: false, error: "Please enter a valid date and time." });
    });

    it('16. Whitespace only → error', () => {
      const result = dateToTimestamp('   ');
      expect(result).toEqual({ ok: false, error: "Please enter a valid date and time." });
    });
  });

  describe('Rounding Semantics (Math.floor invariant)', () => {
    it('17. Seconds always equals floor(milliseconds / 1000)', () => {
      const result = dateToTimestamp('2024-01-15T10:30:45');
      expect(result.ok).toBe(true);
      if (result.ok) {
        // Invariant: seconds = Math.floor(milliseconds / 1000)
        expect(result.seconds).toBe(Math.floor(result.milliseconds / 1000));
      }
    });

    it('18. Different times produce different timestamps', () => {
      const result1 = dateToTimestamp('2024-01-15T10:30:45');
      const result2 = dateToTimestamp('2024-01-15T10:30:46');
      
      expect(result1.ok).toBe(true);
      expect(result2.ok).toBe(true);
      
      if (result1.ok && result2.ok) {
        // 1 second difference should produce 1000ms difference
        expect(result2.milliseconds - result1.milliseconds).toBe(1000);
        expect(result2.seconds - result1.seconds).toBe(1);
      }
    });
  });
});