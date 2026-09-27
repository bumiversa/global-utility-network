export type UUIDResult =
  | { ok: true; value: string }
  | { ok: false; error: string };

export type RandomStringResult =
  | { ok: true; value: string }
  | { ok: false; error: string };

export type CharsetOptions = {
  letters?: boolean;
  numbers?: boolean;
  symbols?: boolean;
};

// Charset definitions (frozen)
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'; // 52
const NUMBERS = '0123456789'; // 10
const SYMBOLS = '!@#$%^&*()-_=+[]{};:,.?'; // 26

// UUID v4 format regex
const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

export function generateUUID(): UUIDResult {
  try {
    const uuid = crypto.randomUUID();
    
    // Validate UUID v4 format invariant
    if (!UUID_V4_REGEX.test(uuid)) {
      return { ok: false, error: 'Generated UUID does not match v4 format.' };
    }
    
    return { ok: true, value: uuid };
  } catch {
    return { ok: false, error: 'Failed to generate UUID. Your browser may not support crypto.randomUUID().' };
  }
}

export function generateSecureRandomString(
  length: number,
  options: CharsetOptions
): RandomStringResult {
  // 1. Validate length
  if (!Number.isInteger(length) || length < 8 || length > 128) {
    return { ok: false, error: 'Length must be an integer between 8 and 128.' };
  }
  
  // 2. Build charset
  let charset = '';
  if (options.letters) charset += LETTERS;
  if (options.numbers) charset += NUMBERS;
  if (options.symbols) charset += SYMBOLS;
  
  if (charset.length === 0) {
    return { ok: false, error: 'Please select at least one character set.' };
  }
  
  // 3. Generate random string with rejection sampling
  try {
    const value = sampleUniform(charset, length);
    return { ok: true, value };
  } catch {
    return { ok: false, error: 'Secure random generation failed. Please try again.' };
  }
}

// Rejection sampling for uniform distribution
function sampleUniform(charset: string, length: number): string {
  const charsetLength = charset.length;
  const limit = Math.floor(256 / charsetLength) * charsetLength;
  
  const result: string[] = [];
  const batchSize = Math.max(length, 32);
  let bytes = new Uint8Array(batchSize);
  let byteIndex = batchSize; // force initial fill
  
  while (result.length < length) {
    // Refill bytes if needed
    if (byteIndex >= bytes.length) {
      bytes = new Uint8Array(batchSize);
      crypto.getRandomValues(bytes);
      byteIndex = 0;
    }
    
    const byte = bytes[byteIndex++];
    
    // Rejection sampling: only accept bytes < limit
    if (byte < limit) {
      const index = byte % charsetLength;
      result.push(charset[index]);
    }
    // else: reject and continue (prevents modulo bias)
  }
  
  return result.join('');
}