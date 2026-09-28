import type { CalculationResult } from './types';
import { MS_PER_SECOND, MS_PER_MINUTE, MS_PER_HOUR, MS_PER_DAY } from './constants';

/**
 * Round number to maximum 3 decimal places.
 */
function roundTo3Decimals(n: number): number {
  return Math.round(n * 1000) / 1000;
}

/**
 * Calculate elapsed time between two Unix timestamps.
 * 
 * @param timestampA - Unix timestamp in milliseconds
 * @param timestampB - Unix timestamp in milliseconds
 * @returns CalculationResult with destructure and totals
 */
export function calculateDifference(
  timestampA: number,
  timestampB: number
): CalculationResult {
  // Check for finite timestamps
  if (!Number.isFinite(timestampA) || !Number.isFinite(timestampB)) {
    return {
      ok: false,
      error: 'Invalid timestamp value.',
    };
  }

  // Calculate absolute elapsed time
  const elapsedMs = Math.abs(timestampA - timestampB);

  // Destructure into days/hours/minutes/seconds
  const days = Math.floor(elapsedMs / MS_PER_DAY);
  const hours = Math.floor((elapsedMs % MS_PER_DAY) / MS_PER_HOUR);
  const minutes = Math.floor((elapsedMs % MS_PER_HOUR) / MS_PER_MINUTE);
  const seconds = Math.floor((elapsedMs % MS_PER_MINUTE) / MS_PER_SECOND);

  // Calculate totals with precision
  const totals = {
    milliseconds: elapsedMs,
    seconds: roundTo3Decimals(elapsedMs / MS_PER_SECOND),
    minutes: roundTo3Decimals(elapsedMs / MS_PER_MINUTE),
    hours: roundTo3Decimals(elapsedMs / MS_PER_HOUR),
    days: roundTo3Decimals(elapsedMs / MS_PER_DAY),
  };

  return {
    ok: true,
    result: {
      elapsed: { days, hours, minutes, seconds },
      totals,
    },
  };
}