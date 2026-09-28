import type { ValidationResult } from './types';
import { MAX_FILE_SIZE, SUPPORTED_MIME_TYPES } from './constants';

export function validateFile(file: File): ValidationResult {
  // Check MIME type using type-safe cast to readonly string[]
  if (!(SUPPORTED_MIME_TYPES as readonly string[]).includes(file.type)) {
    return {
      ok: false,
      error: 'Please upload a PNG, JPEG, or WEBP image.',
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      ok: false,
      error: 'File size exceeds 20 MB limit.',
    };
  }

  return { ok: true };
}