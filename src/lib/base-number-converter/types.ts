export type Base = 2 | 8 | 10 | 16;

export type ValidationErrorCode =
  | 'INVALID_DIGIT'
  | 'FRACTION_NOT_SUPPORTED'
  | 'SCIENTIFIC_NOTATION_NOT_SUPPORTED'
  | 'PREFIX_NOT_SUPPORTED'
  | 'PLUS_SIGN_NOT_SUPPORTED';

export type ValidationResult =
  | { ok: true }
  | { ok: false; code: ValidationErrorCode; message: string };

export type ConversionResult =
  | { ok: true; binary: string; octal: string; decimal: string; hex: string }
  | { ok: false; code: ValidationErrorCode; message: string };