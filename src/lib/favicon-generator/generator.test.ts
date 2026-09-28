import { describe, expect, it } from 'vitest';
import { validateFile } from './validate';
import { calculateCenteredSquareCrop } from './crop';
import { generateFaviconFilename } from './filenames';
import { TARGET_SIZES, MAX_FILE_SIZE } from './constants';

describe('Favicon Generator - Pure Logic', () => {
  describe('File Validation', () => {
    it('V1. Valid PNG file passes validation', () => {
      const file = new File([''], 'test.png', { type: 'image/png' });
      const result = validateFile(file);
      expect(result.ok).toBe(true);
    });

    it('V2. Valid JPEG file passes validation', () => {
      const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
      const result = validateFile(file);
      expect(result.ok).toBe(true);
    });

    it('V3. Valid WEBP file passes validation', () => {
      const file = new File([''], 'test.webp', { type: 'image/webp' });
      const result = validateFile(file);
      expect(result.ok).toBe(true);
    });

    it('V4. Invalid MIME type rejected', () => {
      const file = new File([''], 'test.gif', { type: 'image/gif' });
      const result = validateFile(file);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe('Please upload a PNG, JPEG, or WEBP image.');
      }
    });

    it('V5. File size exceeds 20 MB rejected', () => {
      // Create a file larger than 20 MB
      const largeContent = new Uint8Array(MAX_FILE_SIZE + 1);
      const file = new File([largeContent], 'large.png', { type: 'image/png' });
      const result = validateFile(file);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe('File size exceeds 20 MB limit.');
      }
    });

    it('V6. File size exactly 20 MB passes', () => {
      const exactContent = new Uint8Array(MAX_FILE_SIZE);
      const file = new File([exactContent], 'exact.png', { type: 'image/png' });
      const result = validateFile(file);
      expect(result.ok).toBe(true);
    });
  });

  describe('Crop Calculation', () => {
    it('C1. Square image - no crop needed', () => {
      const crop = calculateCenteredSquareCrop(100, 100);
      expect(crop).toEqual({ x: 0, y: 0, size: 100 });
    });

    it('C2. Landscape image - center crop horizontally', () => {
      const crop = calculateCenteredSquareCrop(200, 100);
      expect(crop).toEqual({ x: 50, y: 0, size: 100 });
    });

    it('C3. Portrait image - center crop vertically', () => {
      const crop = calculateCenteredSquareCrop(100, 200);
      expect(crop).toEqual({ x: 0, y: 50, size: 100 });
    });

    it('C4. Large landscape - correct centering', () => {
      const crop = calculateCenteredSquareCrop(1000, 500);
      expect(crop).toEqual({ x: 250, y: 0, size: 500 });
    });

    it('C5. Large portrait - correct centering', () => {
      const crop = calculateCenteredSquareCrop(500, 1000);
      expect(crop).toEqual({ x: 0, y: 250, size: 500 });
    });

    it('C6. Odd dimensions - fractional coordinates', () => {
      const crop = calculateCenteredSquareCrop(101, 101);
      expect(crop).toEqual({ x: 0, y: 0, size: 101 });
    });

    it('C7. Odd landscape - fractional x', () => {
      const crop = calculateCenteredSquareCrop(201, 101);
      expect(crop).toEqual({ x: 50, y: 0, size: 101 });
    });
  });

  describe('Filename Generation', () => {
    it('F1. 16x16 filename', () => {
      expect(generateFaviconFilename(16)).toBe('favicon-16x16.png');
    });

    it('F2. 32x32 filename', () => {
      expect(generateFaviconFilename(32)).toBe('favicon-32x32.png');
    });

    it('F3. 48x48 filename', () => {
      expect(generateFaviconFilename(48)).toBe('favicon-48x48.png');
    });

    it('F4. 64x64 filename', () => {
      expect(generateFaviconFilename(64)).toBe('favicon-64x64.png');
    });

    it('F5. 128x128 filename', () => {
      expect(generateFaviconFilename(128)).toBe('favicon-128x128.png');
    });

    it('F6. 180x180 filename', () => {
      expect(generateFaviconFilename(180)).toBe('favicon-180x180.png');
    });
  });

  describe('Constants', () => {
    it('T1. Target sizes are correct', () => {
      expect(TARGET_SIZES).toEqual([16, 32, 48, 64, 128, 180]);
    });

    it('T2. Max file size is 20 MB', () => {
      expect(MAX_FILE_SIZE).toBe(20 * 1024 * 1024);
    });
  });
});