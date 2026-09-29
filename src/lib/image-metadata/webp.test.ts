import { describe, expect, it } from 'vitest';
import { parseWebpContainer } from './webp';

function buildWebpFixture(options: {
  chunkType?: 'VP8' | 'VP8L' | 'VP8X';
  width?: number;
  height?: number;
  includeExif?: boolean;
  truncateChunk?: boolean;
  invalidRiff?: boolean;
}) {
  const bytes: number[] = [];

  // RIFF Header
  if (options.invalidRiff) {
    bytes.push(0x00, 0x00, 0x00, 0x00); // Invalid
  } else {
    bytes.push(0x52, 0x49, 0x46, 0x46); // "RIFF"
  }
  
  // File size (dummy, 20 + payload)
  bytes.push(0x14, 0x00, 0x00, 0x00); 
  bytes.push(0x57, 0x45, 0x42, 0x50); // "WEBP"

  // Dimension Chunk
  if (options.chunkType === 'VP8' || !options.chunkType) {
    bytes.push(0x56, 0x50, 0x38, 0x20); // "VP8 "
    const w = (options.width ?? 800) - 1;
    const h = (options.height ?? 600) - 1;
    const payload = [
      0x00, 0x00, 0x00, // Frame tag
      0x9D, 0x01, 0x2A, // Signature
      w & 0xFF, (w >> 8) & 0xFF, // Width (14 bits)
      h & 0xFF, (h >> 8) & 0xFF  // Height (14 bits)
    ];
    bytes.push(payload.length & 0xFF, (payload.length >> 8) & 0xFF, 0x00, 0x00); // Size LE
    bytes.push(...payload);
    if (payload.length % 2 !== 0) bytes.push(0x00); // Padding
  } 
  else if (options.chunkType === 'VP8L') {
    bytes.push(0x56, 0x50, 0x38, 0x4C); // "VP8L"
    const w = (options.width ?? 800) - 1;
    const h = (options.height ?? 600) - 1;
    const payload = [
      0x2F, // Signature
      w & 0xFF, 
      ((w >> 8) & 0x3F) | ((h & 0x03) << 6), 
      (h >> 2) & 0xFF, 
      ((h >> 10) & 0x0F)
    ];
    bytes.push(payload.length & 0xFF, (payload.length >> 8) & 0xFF, 0x00, 0x00);
    bytes.push(...payload);
    if (payload.length % 2 !== 0) bytes.push(0x00);
  }
  else if (options.chunkType === 'VP8X') {
    bytes.push(0x56, 0x50, 0x38, 0x58); // "VP8X"
    const w = (options.width ?? 800) - 1;
    const h = (options.height ?? 600) - 1;
    const payload = [
      0x00, // Flags
      0x00, 0x00, 0x00, // Reserved
      w & 0xFF, (w >> 8) & 0xFF, (w >> 16) & 0xFF, // Width (24 bits)
      h & 0xFF, (h >> 8) & 0xFF, (h >> 16) & 0xFF  // Height (24 bits)
    ];
    bytes.push(payload.length & 0xFF, (payload.length >> 8) & 0xFF, 0x00, 0x00);
    bytes.push(...payload);
    if (payload.length % 2 !== 0) bytes.push(0x00);
  }

  // EXIF Chunk
  if (options.includeExif) {
    bytes.push(0x45, 0x58, 0x49, 0x46); // "EXIF"
    const exifPayload = [0x4D, 0x4D, 0x00, 0x2A, 0x00, 0x00, 0x00, 0x08]; // Dummy TIFF
    if (options.truncateChunk) {
      // Declare size 10, but only provide 4 bytes
      bytes.push(0x0A, 0x00, 0x00, 0x00); 
      bytes.push(0x4D, 0x4D, 0x00, 0x2A);
    } else {
      bytes.push(exifPayload.length & 0xFF, (exifPayload.length >> 8) & 0xFF, 0x00, 0x00);
      bytes.push(...exifPayload);
      if (exifPayload.length % 2 !== 0) bytes.push(0x00);
    }
  }

  // Update RIFF file size
  const fileSize = bytes.length - 8;
  bytes[4] = fileSize & 0xFF;
  bytes[5] = (fileSize >> 8) & 0xFF;
  bytes[6] = (fileSize >> 16) & 0xFF;
  bytes[7] = (fileSize >> 24) & 0xFF;

  return new Uint8Array(bytes).buffer;
}

describe('WEBP Container Parser', () => {
  it('W1. Valid WEBP + VP8 (Lossy)', () => {
    const result = parseWebpContainer(buildWebpFixture({}));
    expect(result.ok).toBe(true);
  });

  it('W2. Valid WEBP + VP8L (Lossless)', () => {
    const result = parseWebpContainer(buildWebpFixture({ chunkType: 'VP8L' }));
    expect(result.ok).toBe(true);
  });

  it('W3. Valid WEBP + VP8X (Extended)', () => {
    const result = parseWebpContainer(buildWebpFixture({ chunkType: 'VP8X' }));
    expect(result.ok).toBe(true);
  });

  it('W4. Correct width/height', () => {
    const result = parseWebpContainer(buildWebpFixture({ width: 1024, height: 768 }));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.width).toBe(1024);
      expect(result.data.height).toBe(768);
    }
  });

  it('W5. EXIF chunk found', () => {
    const result = parseWebpContainer(buildWebpFixture({ includeExif: true }));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.tiffPayload).toBeDefined();
      expect(result.data.tiffPayload!.length).toBe(8);
    }
  });

  it('W6. Missing EXIF chunk', () => {
    const result = parseWebpContainer(buildWebpFixture({ includeExif: false }));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.tiffPayload).toBeUndefined();
    }
  });

  it('W7. Invalid RIFF header -> error', () => {
    const result = parseWebpContainer(buildWebpFixture({ invalidRiff: true }));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain('RIFF');
  });

  it('W8. Truncated chunk data -> error', () => {
    const result = parseWebpContainer(buildWebpFixture({ includeExif: true, truncateChunk: true }));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain('Truncated');
  });

  it('W9. Missing dimension chunk -> error', () => {
    // Build a WEBP with only EXIF chunk, no VP8/VP8L/VP8X
    const bytes: number[] = [0x52, 0x49, 0x46, 0x46, 0x14, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42, 0x50];
    // Add dummy EXIF
    bytes.push(0x45, 0x58, 0x49, 0x46, 0x08, 0x00, 0x00, 0x00, 0x4D, 0x4D, 0x00, 0x2A, 0x00, 0x00, 0x00, 0x08);
    const result = parseWebpContainer(new Uint8Array(bytes).buffer);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain('dimensions');
  });
});