import type { ContrastCheckResult } from './types';
import { parseColor } from './parser';
import { getRelativeLuminance, getContrastRatio } from './math';
import { WCAG_THRESHOLDS } from './constants';

export function checkContrast(fg: string, bg: string): ContrastCheckResult {
  try {
    const parsedFg = parseColor(fg);
    const parsedBg = parseColor(bg);

    const lFg = getRelativeLuminance(parsedFg.r, parsedFg.g, parsedFg.b);
    const lBg = getRelativeLuminance(parsedBg.r, parsedBg.g, parsedBg.b);

    // DO NOT ROUND before threshold comparison (W3C requirement)
    const ratio = getContrastRatio(lFg, lBg);

    return {
      ok: true,
      data: {
        fgNormalized: parsedFg.normalizedHex,
        bgNormalized: parsedBg.normalizedHex,
        ratio,
        wcag: {
          aaNormal: ratio >= WCAG_THRESHOLDS.AA_NORMAL,
          aaLarge: ratio >= WCAG_THRESHOLDS.AA_LARGE,
          aaaNormal: ratio >= WCAG_THRESHOLDS.AAA_NORMAL,
          aaaLarge: ratio >= WCAG_THRESHOLDS.AAA_LARGE,
        },
      },
    };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : 'Failed to process colors.',
    };
  }
}