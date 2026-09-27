import type { Base, ValidationResult } from './types';

const DIGITS_BY_BASE: Record<Base, string> = {
  2: '01',
  8: '01234567',
  10: '0123456789',
  16: '0123456789abcdefABCDEF',
};

const BASE_NAMES: Record<Base, string> = {
  2: 'binary',
  8: 'octal',
  10: 'decimal',
  16: 'hexadecimal',
};

const PREFIXES = ['0x', '0b', '0o'];

export function validateInput(value: string, base: Base): ValidationResult {
  const trimmed = value.trim();
  
  // Empty -> handled by orchestrator, return ok
  if (trimmed === '') {
    return { ok: true };
  }
  
  // Plus sign
  if (trimmed.startsWith('+')) {
    return {
      ok: false,
      code: 'PLUS_SIGN_NOT_SUPPORTED',
      message: "Sign '+' is not supported",
    };
  }
  
  // Prefix check: examine magnitude after optional minus sign
  const unsigned = trimmed.startsWith('-') ? trimmed.slice(1) : trimmed;
  const lowerUnsigned = unsigned.toLowerCase();
  
  for (const prefix of PREFIXES) {
    if (lowerUnsigned.startsWith(prefix)) {
      return {
        ok: false,
        code: 'PREFIX_NOT_SUPPORTED',
        message: `Prefix '${prefix}' is not supported`,
      };
    }
  }
  
  // Scientific notation (decimal only)
  if (base === 10 && /[eE]/.test(trimmed)) {
    return {
      ok: false,
      code: 'SCIENTIFIC_NOTATION_NOT_SUPPORTED',
      message: 'Scientific notation is not supported',
    };
  }
  
  // Fraction (universal)
  if (trimmed.includes('.')) {
    return {
      ok: false,
      code: 'FRACTION_NOT_SUPPORTED',
      message: 'Fractional numbers are not supported',
    };
  }
  
  // Internal whitespace
  if (/\s/.test(trimmed)) {
    return {
      ok: false,
      code: 'INVALID_DIGIT',
      message: 'Internal whitespace is not allowed',
    };
  }
  
  // Must have at least one digit after optional minus
  const digits = trimmed.startsWith('-') ? trimmed.slice(1) : trimmed;
  if (digits === '') {
    return {
      ok: false,
      code: 'INVALID_DIGIT',
      message: 'Input must contain at least one digit',
    };
  }
  
  // Invalid digits using explicit allowed set
  const allowedDigits = DIGITS_BY_BASE[base];
  
  for (const char of digits) {
    if (!allowedDigits.includes(char)) {
      return {
        ok: false,
        code: 'INVALID_DIGIT',
        message: `Invalid digit '${char}' for ${BASE_NAMES[base]}`,
      };
    }
  }
  
  return { ok: true };
}