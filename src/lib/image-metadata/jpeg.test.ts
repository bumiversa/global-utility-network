import { describe, expect, it } from 'vitest';
import { parseJpegContainer } from './jpeg';

// Helper to build a minimal valid JPEG buffer for testing
function buildJpegFixture(options: {
  sofMarker?: number;
  width?: number;
  height?: number;
  includeApp1?: boolean;
  app1IsExif?: boolean;
  truncateApp1?: boolean;
  invalidSoi?: boolean;
  truncateMarker?: boolean;
  badLength?: boolean;
}) {
  const bytes: number[] = [0xFF, 0xD8]; // SOI

  const sofMarker = options.sofMarker ?? 0xC0; // SOF0
  const w = options.width ?? 800;
  const h = options.height ?? 600;

  // SOF Segment
  bytes.push(0xFF, sofMarker);
  const sofPayload = [
    8, // Precision
    (h >> 8) & 0xFF, h & 0xFF, // Height
    (w >> 8) & 0xFF, w & 0xFF, // Width
    3, // Components
    1, 0x11, 0, // Y
    2, 0x11, 1, // Cb
    3, 0x11, 1  // Cr
  ];
  const sofLen = sofPayload.length + 2;
  bytes.push((sofLen >> 8) & 0xFF, sofLen & 0xFF);
  bytes.push(...sofPayload);

  // APP1 Segment
  if (options.includeApp1) {
    bytes.push(0xFF, 0xE1);
    if (options.truncateApp1) {
      // Declare 12-byte APP1 segment but provide only 6 bytes of payload.
      // This is a genuinely truncated segment.
      bytes.push(0x00, 0x0C);
      bytes.push(0x45, 0x78, 0x69, 0x66, 0x00, 0x00); // "Exif\0\0"
      return new Uint8Array(bytes).buffer;
    }
    let app1Payload: number[] = [];
    if (options.app1IsExif) {
      app1Payload = [0x45, 0x78, 0x69, 0x66, 0x00, 0x00]; // Exif\0\0
      // Add dummy TIFF header
      app1Payload.push(0x4D, 0x4D, 0x00, 0x2A, 0x00, 0x00, 0x00, 0x08); 
    } else {
      app1Payload = [0x00, 0x00, 0x00, 0x00, 0x00, 0x00]; // Not Exif
    }

    const app1Len = app1Payload.length + 2;
    bytes.push((app1Len >> 8) & 0xFF, app1Len & 0xFF);
    bytes.push(...app1Payload);
  }

  // SOS Segment (End of header)
  bytes.push(0xFF, 0xDA);
  bytes.push(0x00, 0x08); // Dummy length
  bytes.push(...new Array(8).fill(0)); // Dummy data

  return new Uint8Array(bytes).buffer;
}

describe('JPEG Container Parser', () => {
  it('J1. Valid JPEG + SOF0', () => {
    const result = parseJpegContainer(buildJpegFixture({}));
    expect(result.ok).toBe(true);
  });

  it('J2. Valid JPEG + SOF2 (Progressive)', () => {
    const result = parseJpegContainer(buildJpegFixture({ sofMarker: 0xC2 }));
    expect(result.ok).toBe(true);
  });

  it('J3. Correct width/height', () => {
    const result = parseJpegContainer(buildJpegFixture({ width: 1024, height: 768 }));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.width).toBe(1024);
      expect(result.data.height).toBe(768);
    }
  });

  it('J4. APP1 found', () => {
    const result = parseJpegContainer(buildJpegFixture({ includeApp1: true, app1IsExif: true }));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.tiffPayload).toBeDefined();
      expect(result.data.tiffPayload!.length).toBeGreaterThan(0);
    }
  });

  it('J5. Exif signature valid', () => {
    const result = parseJpegContainer(buildJpegFixture({ includeApp1: true, app1IsExif: true }));
    expect(result.ok).toBe(true);
    if (result.ok) {
      // Check first bytes of TIFF payload (Big Endian 'MM' + Magic 42)
      expect(result.data.tiffPayload![0]).toBe(0x4D);
      expect(result.data.tiffPayload![1]).toBe(0x4D);
      expect(result.data.tiffPayload![2]).toBe(0x00);
      expect(result.data.tiffPayload![3]).toBe(0x2A);
    }
  });

  it('J6. APP1 bukan EXIF -> skip', () => {
    const result = parseJpegContainer(buildJpegFixture({ includeApp1: true, app1IsExif: false }));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.tiffPayload).toBeUndefined();
    }
  });

  it('J7. Truncated marker -> error', () => {
    const bytes = new Uint8Array([0xFF, 0xD8, 0xFF]); // SOI + FF (no marker byte)
    const result = parseJpegContainer(bytes.buffer);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain('Truncated');
  });

  it('J8. Truncated segment -> error', () => {
    const bytes = new Uint8Array([0xFF, 0xD8, 0xFF, 0xE1, 0x00]); // APP1 with only 1 byte of length
    const result = parseJpegContainer(bytes.buffer);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain('Truncated');
  });

  it('J9. Invalid SOI -> error', () => {
    const bytes = new Uint8Array([0x00, 0x00, 0xFF, 0xD8]);
    const result = parseJpegContainer(bytes.buffer);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain('Invalid JPEG');
  });

  it('J10. Malformed segment length -> error', () => {
    // SOF with length 1 (invalid, must be >= 2)
    const bytes = new Uint8Array([0xFF, 0xD8, 0xFF, 0xC0, 0x00, 0x01]);
    const result = parseJpegContainer(bytes.buffer);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain('Invalid segment length');
  });

  it('J11. APP1 truncated -> error', () => {
    const result = parseJpegContainer(buildJpegFixture({ includeApp1: true, app1IsExif: true, truncateApp1: true }));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain('Truncated');
  });

  it('J12. Missing SOF marker -> error', () => {
    // Build a JPEG without SOF segment
    const bytes: number[] = [0xFF, 0xD8];
    bytes.push(0xFF, 0xDA); // Jump straight to SOS
    bytes.push(0x00, 0x08);
    bytes.push(...new Array(8).fill(0));
    const result = parseJpegContainer(new Uint8Array(bytes).buffer);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain('dimensions');
  });
});