import type { EncodeOutput, DecodeOutput } from './types';

/**
 * Encodes a text string into a URI component.
 * Uses native encodeURIComponent() which handles UTF-8 percent encoding.
 */
export function encodeUriComponent(input: string): EncodeOutput {
  // Empty string is valid and returns empty string
  if (input === '') {
    return { ok: true, data: { encoded: '' } };
  }

  try {
    const encoded = encodeURIComponent(input);
    return { ok: true, data: { encoded } };
  } catch (e) {
    return { 
      ok: false, 
      error: e instanceof Error ? e.message : 'Failed to encode input.' 
    };
  }
}

/**
 * Decodes a URI component string back to its original text.
 * Explicitly rejects malformed percent-encoded sequences.
 */
export function decodeUriComponent(input: string): DecodeOutput {
  // Empty string is valid and returns empty string
  if (input === '') {
    return { ok: true, data: { decoded: '' } };
  }

  try {
    const decoded = decodeURIComponent(input);
    return { ok: true, data: { decoded } };
  } catch {
    return { 
      ok: false, 
      error: 'Unable to decode the input. Please check the percent-encoded text.' 
    };
  }
}