import { describe, expect, it } from 'vitest';
import { encodeUriComponent, decodeUriComponent } from './encoder';

describe('URL Encoder/Decoder', () => {
  describe('Encode', () => {
    it('B1. Plain ASCII', () => {
      const result = encodeUriComponent('HelloWorld');
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.encoded).toBe('HelloWorld');
      }
    });

    it('B2. Spaces', () => {
      const result = encodeUriComponent('Hello World');
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.encoded).toBe('Hello%20World');
      }
    });

    it('B3. Special characters (&, ?, =, #, %)', () => {
      const result = encodeUriComponent('a=1&b=2?c=3#hash%done');
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.encoded).toBe('a%3D1%26b%3D2%3Fc%3D3%23hash%25done');
      }
    });

    it('B4. Unicode / UTF-8', () => {
      const result = encodeUriComponent('Halo Dunia 🌍');
      expect(result.ok).toBe(true);
      if (result.ok) {
        // Native encodeURIComponent handles UTF-8 percent encoding
        expect(result.data.encoded).toBe('Halo%20Dunia%20%F0%9F%8C%8D');
      }
    });

    it('B8. Empty string', () => {
      const result = encodeUriComponent('');
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.encoded).toBe('');
      }
    });

    it('B9. encodeURIComponent compatibility', () => {
      const input = 'test@example.com/path?query=value&other=123';
      const result = encodeUriComponent(input);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.encoded).toBe(encodeURIComponent(input));
      }
    });
  });

  describe('Decode', () => {
    it('B5. Round-trip encode → decode', () => {
      const original = 'Hello World! & BUMIVERSA 🚀';
      const encoded = encodeUriComponent(original);
      expect(encoded.ok).toBe(true);
      
      if (encoded.ok) {
        const decoded = decodeUriComponent(encoded.data.encoded);
        expect(decoded.ok).toBe(true);
        if (decoded.ok) {
          expect(decoded.data.decoded).toBe(original);
        }
      }
    });

    it('B6. Already encoded text (decode it)', () => {
      const result = decodeUriComponent('Hello%20World%21%20%26%20BUMIVERSA');
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.decoded).toBe('Hello World! & BUMIVERSA');
      }
    });

    it('B7. Malformed percent sequence → error', () => {
      const result = decodeUriComponent('Hello%ZZWorld');
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe('Unable to decode the input. Please check the percent-encoded text.');
      }
    });

    it('B7b. Truncated percent sequence → error', () => {
      const result = decodeUriComponent('Hello%2');
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('Unable to decode');
      }
    });

    it('B8. Empty string decode', () => {
      const result = decodeUriComponent('');
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.decoded).toBe('');
      }
    });

    it('B10. decodeURIComponent compatibility', () => {
      const input = 'Hello%20World%21';
      const result = decodeUriComponent(input);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.decoded).toBe(decodeURIComponent(input));
      }
    });
  });
});