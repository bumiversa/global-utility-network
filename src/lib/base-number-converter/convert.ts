import type { Base, ConversionResult } from './types';
import { validateInput } from './validate';

const DIGIT_VALUES: Record<string, number> = {
  '0': 0, '1': 1, '2': 2, '3': 3, '4': 4,
  '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
  'a': 10, 'b': 11, 'c': 12, 'd': 13, 'e': 14, 'f': 15,
};

export function parseBigInt(value: string, base: Base): bigint {
  const trimmed = value.trim();
  const isNegative = trimmed.startsWith('-');
  const digits = isNegative ? trimmed.slice(1) : trimmed;
  
  let result = BigInt(0);
  const baseBigInt = BigInt(base);
  
  for (const char of digits) {
    const digitValue = BigInt(DIGIT_VALUES[char.toLowerCase()]);
    result = result * baseBigInt + digitValue;
  }
  
  return isNegative ? -result : result;
}

export function formatBigInt(value: bigint, base: Base): string {
  const str = value.toString(base);
  return base === 16 ? str.toUpperCase() : str;
}

export function convertAllBases(value: string, sourceBase: Base): ConversionResult {
  const trimmed = value.trim();
  
  // Empty input -> empty outputs (no error)
  if (trimmed === '') {
    return {
      ok: true,
      binary: '',
      octal: '',
      decimal: '',
      hex: '',
    };
  }
  
  // Validate
  const validation = validateInput(trimmed, sourceBase);
  if (!validation.ok) {
    return {
      ok: false,
      code: validation.code,
      message: validation.message,
    };
  }
  
  // Parse to BigInt
  const bigIntValue = parseBigInt(trimmed, sourceBase);
  
  // Format to all bases
  return {
    ok: true,
    binary: formatBigInt(bigIntValue, 2),
    octal: formatBigInt(bigIntValue, 8),
    decimal: formatBigInt(bigIntValue, 10),
    hex: formatBigInt(bigIntValue, 16),
  };
}