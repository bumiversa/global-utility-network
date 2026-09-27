import type { HashAlgorithm, HashResult } from './types';

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function hashText(
  input: string,
  algorithm: HashAlgorithm
): Promise<HashResult> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest(algorithm, data);
    const hash = bufferToHex(hashBuffer);
    return { ok: true, hash };
  } catch {
    return {
      ok: false,
      error: 'Hash generation failed. The algorithm may not be supported by your browser.',
    };
  }
}