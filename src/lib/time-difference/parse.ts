import type { ParseResult } from './types';

// Strict ISO 8601 date-time with timezone pattern (capturing groups for validation)
const ISO_8601_REGEX = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\.\d+)?(Z|([+-])(\d{2}):(\d{2}))$/;

/**
 * Check if a year is a leap year.
 */
function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

/**
 * Get the number of days in a given month/year.
 */
function daysInMonth(year: number, month: number): number {
  const days = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return days[month - 1];
}

/**
 * Validate calendar components (month, day, hour, minute, second).
 */
function isValidCalendar(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second: number
): boolean {
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > daysInMonth(year, month)) return false;
  if (hour < 0 || hour > 23) return false;
  if (minute < 0 || minute > 59) return false;
  if (second < 0 || second > 59) return false;
  return true;
}

/**
 * Validate timezone offset components.
 */
function isValidTimezoneOffset(tzHour: number, tzMinute: number): boolean {
  // ISO 8601 allows offsets from -12:00 to +14:00
  // For simplicity, we validate hour 0-14 and minute 0-59
  // Special case: if hour is 14, minute must be 0
  if (tzHour < 0 || tzHour > 14) return false;
  if (tzMinute < 0 || tzMinute > 59) return false;
  if (tzHour === 14 && tzMinute !== 0) return false;
  return true;
}

/**
 * Parse strict ISO 8601 date-time with timezone to Unix timestamp.
 * 
 * Valid formats:
 * - 2026-09-28T10:00:00Z
 * - 2026-09-28T10:00:00+07:00
 * - 2026-09-28T10:00:00-05:00
 * - 2026-09-28T10:00:00.123Z
 * 
 * Invalid formats:
 * - 2026-09-28 (date only)
 * - 2026-09-28T10:00:00 (no timezone)
 * - 2026-09-28 10:00:00 (space instead of T)
 * - 2026-02-30T10:00:00Z (invalid calendar date)
 */
export function parseIso8601(input: string): ParseResult {
  const trimmed = input.trim();

  if (trimmed === '') {
    return { ok: false, error: 'Input cannot be empty.' };
  }

  const match = ISO_8601_REGEX.exec(trimmed);

  if (!match) {
    return {
      ok: false,
      error: 'Invalid format. Please use ISO 8601 with timezone (e.g., 2026-09-28T10:00:00Z or 2026-09-28T10:00:00+07:00).',
    };
  }

  // Extract components from capturing groups
  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const day = parseInt(match[3], 10);
  const hour = parseInt(match[4], 10);
  const minute = parseInt(match[5], 10);
  const second = parseInt(match[6], 10);
  // match[7] is fractional seconds (optional, we don't validate further)
  // match[8] is full timezone (Z or ±HH:mm)
  // match[9] is timezone sign (+ or -), undefined if Z
  const tzHour = match[10] ? parseInt(match[10], 10) : 0;
  const tzMinute = match[11] ? parseInt(match[11], 10) : 0;

  // Validate calendar components
  if (!isValidCalendar(year, month, day, hour, minute, second)) {
    return {
      ok: false,
      error: 'Invalid date/time value. Please check month, day, hour, minute, and second.',
    };
  }

  // Validate timezone offset (only if not Z)
  if (match[9] && !isValidTimezoneOffset(tzHour, tzMinute)) {
    return {
      ok: false,
      error: 'Invalid timezone offset.',
    };
  }

  // Parse to timestamp
  const timestamp = Date.parse(trimmed);

  // Check if parsing succeeded
  if (!Number.isFinite(timestamp)) {
    return {
      ok: false,
      error: 'Invalid date/time value.',
    };
  }

  return { ok: true, timestamp };
}