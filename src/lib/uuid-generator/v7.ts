import type { RandomBytesSource, TimestampSource } from './types';

export function generateUuidV7(
  getTimestamp: TimestampSource = () => Date.now(),
  getRandomBytes: RandomBytesSource = (length) => {
    const arr = new Uint8Array(length);
    crypto.getRandomValues(arr);
    return arr;
  }
): string {
  const ts = getTimestamp();
  const bytes = new Uint8Array(16);

  // 48-bit timestamp (big-endian)
  bytes[0] = (ts / 0x10000000000) & 0xFF;
  bytes[1] = (ts / 0x100000000) & 0xFF;
  bytes[2] = (ts / 0x1000000) & 0xFF;
  bytes[3] = (ts / 0x10000) & 0xFF;
  bytes[4] = (ts / 0x100) & 0xFF;
  bytes[5] = ts & 0xFF;

  const randomBytes = getRandomBytes(10);

  // Byte 6: version 7 (0x70) + rand_a high 4 bits
  bytes[6] = 0x70 | (randomBytes[0] & 0x0F);
  // Byte 7: rand_a low 8 bits
  bytes[7] = randomBytes[1];
  // Byte 8: variant 10 (0x80) + rand_b high 6 bits
  bytes[8] = 0x80 | (randomBytes[2] & 0x3F);
  // Bytes 9-15: rand_b remaining 56 bits
  bytes[9] = randomBytes[3];
  bytes[10] = randomBytes[4];
  bytes[11] = randomBytes[5];
  bytes[12] = randomBytes[6];
  bytes[13] = randomBytes[7];
  bytes[14] = randomBytes[8];
  bytes[15] = randomBytes[9];

  const hex = Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export function extractTimestampFromUuidV7(uuid: string): number | null {
  const clean = uuid.replace(/-/g, '');
  if (clean.length !== 32) return null;
  
  const tsHex = clean.slice(0, 12);
  return parseInt(tsHex, 16);
}