import type { PasswordOptions, GenerationResult, ValidationResult, RandomSource } from './types';
import { MIN_LENGTH, MAX_LENGTH } from './constants';
import { buildCharset } from './charset';
import { uniformRandomIndex } from './random';

export function validateOptions(options: PasswordOptions): ValidationResult {
  if (options.length < MIN_LENGTH) {
    return {
      ok: false,
      error: `Length must be at least ${MIN_LENGTH} characters.`,
    };
  }
  
  if (options.length > MAX_LENGTH) {
    return {
      ok: false,
      error: `Length must be at most ${MAX_LENGTH} characters.`,
    };
  }
  
  if (!options.uppercase && !options.lowercase && !options.numbers && !options.symbols) {
    return {
      ok: false,
      error: 'Please select at least one character set.',
    };
  }
  
  return { ok: true };
}

export function generatePassword(
  options: PasswordOptions,
  getRandomBytes?: RandomSource
): GenerationResult {
  const validation = validateOptions(options);
  if (!validation.ok) {
    return validation;
  }
  
  const charset = buildCharset(options);
  
  if (charset.length === 0) {
    return {
      ok: false,
      error: 'No characters available with current settings.',
    };
  }
  
  let password = '';
  
  for (let i = 0; i < options.length; i++) {
    const randomIndex = uniformRandomIndex(charset.length, getRandomBytes);
    password += charset[randomIndex];
  }
  
  return {
    ok: true,
    password,
    length: password.length,
  };
}