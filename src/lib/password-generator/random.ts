import type { RandomSource } from './types';

/**
 * Generates an unbiased random index using rejection sampling.
 * 
 * @param charsetLength - The length of the character set
 * @param getRandomBytes - Function that returns random bytes (defaults to crypto.getRandomValues)
 * @returns An unbiased index in range [0, charsetLength)
 */
export function uniformRandomIndex(
  charsetLength: number,
  getRandomBytes: RandomSource = (len) => {
    const arr = new Uint8Array(len);
    crypto.getRandomValues(arr);
    return arr;
  }
): number {
  if (charsetLength <= 0) {
    throw new Error('Charset length must be positive');
  }
  
  if (charsetLength === 1) {
    return 0;
  }
  
  // Calculate the maximum value that can be used without bias
  // 256 - (256 % charsetLength) gives us the largest multiple of charsetLength <= 256
  const maxValidValue = 256 - (256 % charsetLength);
  
  // Rejection sampling: keep trying until we get a value in the unbiased range
  while (true) {
    const randomBytes = getRandomBytes(1);
    const randomByte = randomBytes[0];
    
    if (randomByte < maxValidValue) {
      return randomByte % charsetLength;
    }
    // If randomByte >= maxValidValue, reject and try again
  }
}