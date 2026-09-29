import { describe, expect, it } from 'vitest';
import { 
  readUint16, 
  readUint32, 
  readAscii, 
  readRational, 
  gpsToDecimal,
  BinaryReaderError 
} from './binary';

describe('Binary Primitives', () => {
  it('B1. readUint16 Big Endian', () => {
    const buffer = new ArrayBuffer(2);
    const view = new DataView(buffer);
    view.setUint16(0, 0x4D4D, false);
    expect(readUint16(view, 0, false)).toBe(0x4D4D);
  });

  it('B2. readUint16 Little Endian', () => {
    const buffer = new ArrayBuffer(2);
    const view = new DataView(buffer);
    view.setUint16(0, 0x4949, true);
    expect(readUint16(view, 0, true)).toBe(0x4949);
  });

  it('B3. readUint32 Big Endian', () => {
    const buffer = new ArrayBuffer(4);
    const view = new DataView(buffer);
    view.setUint32(0, 0x0000002A, false);
    expect(readUint32(view, 0, false)).toBe(42);
  });

  it('B4. readAscii with null terminator', () => {
    const buffer = new ArrayBuffer(6);
    const view = new DataView(buffer);
    const str = "Canon";
    for (let i = 0; i < str.length; i++) view.setUint8(i, str.charCodeAt(i));
    view.setUint8(5, 0);
    expect(readAscii(view, 0, 6)).toBe('Canon');
  });

  it('B5. readAscii trimming spaces', () => {
    const buffer = new ArrayBuffer(8);
    const view = new DataView(buffer);
    const str = "Nikon   ";
    for (let i = 0; i < str.length; i++) view.setUint8(i, str.charCodeAt(i));
    expect(readAscii(view, 0, 8)).toBe('Nikon');
  });

  it('B6. readRational', () => {
    const buffer = new ArrayBuffer(8);
    const view = new DataView(buffer);
    view.setUint32(0, 100, true);
    view.setUint32(4, 3, true);
    const rat = readRational(view, 0, true);
    expect(rat.numerator).toBe(100);
    expect(rat.denominator).toBe(3);
  });

  it('B7. gpsToDecimal North/East', () => {
    const lat = gpsToDecimal(
      { numerator: 7, denominator: 1 },
      { numerator: 15, denominator: 1 },
      { numerator: 27, denominator: 1 },
      'N'
    );
    expect(lat).toBeCloseTo(7.2575, 4);
  });

  it('B8. gpsToDecimal South/West (Negative)', () => {
    const lat = gpsToDecimal(
      { numerator: 7, denominator: 1 },
      { numerator: 15, denominator: 1 },
      { numerator: 27, denominator: 1 },
      'S'
    );
    expect(lat).toBeCloseTo(-7.2575, 4);
  });

  it('B9. Bounds checking throws error', () => {
    const buffer = new ArrayBuffer(2);
    const view = new DataView(buffer);
    expect(() => readUint32(view, 0, false)).toThrow(BinaryReaderError);
  });

  it('B10. Offset validation throws error', () => {
    const buffer = new ArrayBuffer(4);
    const view = new DataView(buffer);
    expect(() => readUint16(view, -1, false)).toThrow(BinaryReaderError);
  });

  // --- Audit Edge Cases ---

  it('B11. Invalid GPS Reference throws error', () => {
    const rat = { numerator: 1, denominator: 1 };
    expect(() => gpsToDecimal(rat, rat, rat, 'X')).toThrow(BinaryReaderError);
    expect(() => gpsToDecimal(rat, rat, rat, '')).toThrow(BinaryReaderError);
  });

  it('B12. Negative length throws error', () => {
    const buffer = new ArrayBuffer(4);
    const view = new DataView(buffer);
    expect(() => readAscii(view, 0, -1)).toThrow(BinaryReaderError);
  });

  it('B13. Zero denominator returns 0 safely', () => {
    const lat = gpsToDecimal(
      { numerator: 7, denominator: 0 }, // Zero denominator
      { numerator: 15, denominator: 1 },
      { numerator: 27, denominator: 1 },
      'N'
    );
    // Should not be NaN, should fallback to 0 for that component
    expect(lat).toBe(15/60 + 27/3600); 
  });
});