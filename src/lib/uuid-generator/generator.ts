import type { GenerateOptions, GenerateResult, ValidationResult, RandomBytesSource, TimestampSource } from './types';
import { MIN_QUANTITY, MAX_QUANTITY } from './constants';
import { generateUuidV4 } from './v4';
import { generateUuidV7 } from './v7';

export function validateOptions(options: GenerateOptions): ValidationResult {
  if (!Number.isInteger(options.quantity)) {
    return { ok: false, error: 'Quantity must be a whole number.' };
  }
  if (options.quantity < MIN_QUANTITY) {
    return { ok: false, error: `Quantity must be at least ${MIN_QUANTITY}.` };
  }
  if (options.quantity > MAX_QUANTITY) {
    return { ok: false, error: `Quantity must be at most ${MAX_QUANTITY}.` };
  }
  return { ok: true };
}

export function generateUuids(
  options: GenerateOptions,
  getRandomBytes?: RandomBytesSource,
  getTimestamp?: TimestampSource
): GenerateResult {
  const validation = validateOptions(options);
  if (!validation.ok) {
    return { ok: false, error: validation.error };
  }

  const uuids: string[] = [];
  for (let i = 0; i < options.quantity; i++) {
    if (options.version === 'v4') {
      uuids.push(generateUuidV4());
    } else {
      uuids.push(generateUuidV7(getTimestamp, getRandomBytes));
    }
  }

  return { ok: true, uuids };
}