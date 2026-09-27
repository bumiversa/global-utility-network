import type { PasswordOptions } from './types';
import { UPPERCASE, LOWERCASE, NUMBERS, SYMBOLS, AMBIGUOUS } from './constants';

export function buildCharset(options: PasswordOptions): string {
  let charset = '';
  
  if (options.uppercase) charset += UPPERCASE;
  if (options.lowercase) charset += LOWERCASE;
  if (options.numbers) charset += NUMBERS;
  if (options.symbols) charset += SYMBOLS;
  
  if (options.excludeAmbiguous) {
    charset = charset
      .split('')
      .filter(c => !AMBIGUOUS.includes(c))
      .join('');
  }
  
  return charset;
}