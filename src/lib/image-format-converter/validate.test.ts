import { describe, expect, it } from 'vitest';
import { validateImageFile, getTargetFormats, getDownloadName } from './validate';

describe('Image Format Converter Validation Layer', () => {
  describe('validateImageFile', () => {
    it('1. Valid JPEG under 20MB', () => {
      const result = validateImageFile({ type: 'image/jpeg', size: 1024 });
      expect(result).toEqual({ ok: true, mime: 'image/jpeg' });
    });

    it('2. Valid PNG under 20MB', () => {
      const result = validateImageFile({ type: 'image/png', size: 1024 });
      expect(result).toEqual({ ok: true, mime: 'image/png' });
    });

    it('3. Valid WEBP under 20MB', () => {
      const result = validateImageFile({ type: 'image/webp', size: 1024 });
      expect(result).toEqual({ ok: true, mime: 'image/webp' });
    });

    it('4. Invalid MIME (GIF)', () => {
      const result = validateImageFile({ type: 'image/gif', size: 1024 });
      expect(result).toEqual({ 
        ok: false, 
        error: 'Unsupported format. Please use JPEG, PNG, or WEBP.' 
      });
    });

    it('5. Invalid MIME (text/plain)', () => {
      const result = validateImageFile({ type: 'text/plain', size: 1024 });
      expect(result).toEqual({ 
        ok: false, 
        error: 'Unsupported format. Please use JPEG, PNG, or WEBP.' 
      });
    });

    it('6. Empty MIME', () => {
      const result = validateImageFile({ type: '', size: 1024 });
      expect(result).toEqual({ 
        ok: false, 
        error: 'Unsupported format. Please use JPEG, PNG, or WEBP.' 
      });
    });

    it('7. Exactly 20MB (boundary - should pass)', () => {
      const result = validateImageFile({ type: 'image/jpeg', size: 20 * 1024 * 1024 });
      expect(result).toEqual({ ok: true, mime: 'image/jpeg' });
    });

    it('8. 20MB + 1 byte (should fail)', () => {
      const result = validateImageFile({ type: 'image/jpeg', size: 20 * 1024 * 1024 + 1 });
      expect(result).toEqual({ 
        ok: false, 
        error: 'File too large. Maximum 20MB.' 
      });
    });

    it('9. Zero bytes with valid MIME (edge case)', () => {
      const result = validateImageFile({ type: 'image/png', size: 0 });
      expect(result).toEqual({ ok: true, mime: 'image/png' });
    });
  });

  describe('getTargetFormats', () => {
    it('10. JPEG source → PNG and WEBP', () => {
      const result = getTargetFormats('image/jpeg');
      expect(result).toEqual(['image/png', 'image/webp']);
    });

    it('11. PNG source → JPEG and WEBP', () => {
      const result = getTargetFormats('image/png');
      expect(result).toEqual(['image/jpeg', 'image/webp']);
    });

    it('12. WEBP source → JPEG and PNG', () => {
      const result = getTargetFormats('image/webp');
      expect(result).toEqual(['image/jpeg', 'image/png']);
    });

    it('13. Same format excluded from targets', () => {
      const targets = getTargetFormats('image/jpeg');
      expect(targets).not.toContain('image/jpeg');
    });
  });

  describe('getDownloadName', () => {
    it('14. PNG → JPG', () => {
      expect(getDownloadName('photo.png', 'image/jpeg')).toBe('photo.jpg');
    });

    it('15. WEBP → PNG', () => {
      expect(getDownloadName('holiday.webp', 'image/png')).toBe('holiday.png');
    });

    it('16. Multiple dots: photo.final.webp → photo.final.jpg', () => {
      expect(getDownloadName('photo.final.webp', 'image/jpeg')).toBe('photo.final.jpg');
    });

    it('17. No extension: photo → photo.jpg', () => {
      expect(getDownloadName('photo', 'image/jpeg')).toBe('photo.jpg');
    });

    it('18. Uppercase extension: photo.PNG → photo.jpg', () => {
      expect(getDownloadName('photo.PNG', 'image/jpeg')).toBe('photo.jpg');
    });

    it('19. Hidden file with extension: .hidden.png → .hidden.jpg', () => {
      expect(getDownloadName('.hidden.png', 'image/jpeg')).toBe('.hidden.jpg');
    });

    it('20. Hidden file without extension: .hidden → .hidden.jpg', () => {
      expect(getDownloadName('.hidden', 'image/jpeg')).toBe('.hidden.jpg');
    });

    it('21. Filename is just extension: .jpg → .png', () => {
      expect(getDownloadName('.jpg', 'image/png')).toBe('.png');
    });

    it('22. Empty filename', () => {
      expect(getDownloadName('', 'image/jpeg')).toBe('.jpg');
    });
  });
});