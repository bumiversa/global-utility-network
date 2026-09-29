import { describe, expect, it } from 'vitest';
import { parseImageMetadata } from './metadata';

// Helper to create a mock File object
function createMockFile(name: string, type: string, bytes: Uint8Array): File {
  const buffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buffer).set(bytes);
  return new File([buffer], name, { type });
}

describe('Metadata Aggregation Layer', () => {
  it('M1. Unsupported file type -> error', async () => {
    const file = createMockFile('test.png', 'image/png', new Uint8Array([0x89, 0x50, 0x4E, 0x47]));
    const result = await parseImageMetadata(file);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain('Unsupported file type');
    }
  });

  it('M2. Valid JPEG without EXIF', async () => {
    // Minimal valid JPEG fixture (SOI + SOF0 + EOI)
    const bytes = new Uint8Array([
      0xFF, 0xD8, // SOI
      0xFF, 0xC0, 0x00, 0x0B, 0x08, 0x02, 0x58, 0x03, 0x20, 0x01, 0x11, 0x00, 0x00, // SOF0 (600x800, 9 bytes payload)
      0xFF, 0xD9  // EOI
    ]);
    const file = createMockFile('test.jpg', 'image/jpeg', bytes);
    const result = await parseImageMetadata(file);
    
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.fileInfo.name).toBe('test.jpg');
      expect(result.data.fileInfo.size).toBe(17);
      expect(result.data.fileInfo.mimeType).toBe('image/jpeg');
      expect(result.data.dimensions).toEqual({ width: 800, height: 600 });
      expect(result.data.exif).toBeUndefined();
    }
  });

  it('M3. Valid WEBP with EXIF', async () => {
    // Minimal valid WEBP fixture with EXIF chunk
    // RIFF + WEBP + VP8 (dummy) + EXIF (dummy TIFF)
    const bytes = new Uint8Array([
      0x52, 0x49, 0x46, 0x46, // RIFF
      0x20, 0x00, 0x00, 0x00, // Size (32)
      0x57, 0x45, 0x42, 0x50, // WEBP
      0x56, 0x50, 0x38, 0x20, // VP8 
      0x0A, 0x00, 0x00, 0x00, // Size (10)
      0x00, 0x00, 0x00, 0x9D, 0x01, 0x2A, 0x1F, 0x03, 0x57, 0x02, // Dummy VP8 payload (800x600)
      0x45, 0x58, 0x49, 0x46, // EXIF
      0x08, 0x00, 0x00, 0x00, // Size (8)
      0x4D, 0x4D, 0x00, 0x2A, 0x00, 0x00, 0x00, 0x08 // Dummy TIFF (Big Endian, Magic 42, IFD0 at 8)
    ]);
    const file = createMockFile('test.webp', 'image/webp', bytes);
    const result = await parseImageMetadata(file);
    
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.fileInfo.mimeType).toBe('image/webp');
      expect(result.data.dimensions).toEqual({ width: 800, height: 600 });
      // EXIF is present but empty (no Make/Model/GPS tags), so it should be undefined
      expect(result.data.exif).toBeUndefined();
    }
  });

  it('M4. File read error handling', async () => {
    const mockFile = {
      name: 'test.jpg',
      type: 'image/jpeg',
      size: 100,
      arrayBuffer: () => Promise.reject(new Error('Disk read failure')),
    } as unknown as File;

    const result = await parseImageMetadata(mockFile);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain('Disk read failure');
    }
  });
});