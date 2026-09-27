import { describe, expect, it } from 'vitest';
import { parseUrl, reconstructUrl, encodeComponent, decodeComponent } from './parser';

describe('URL Parser & Query Tool', () => {
  describe('Parsing Absolute URLs', () => {
    it('U1. Standard HTTPS URL', () => {
      const result = parseUrl('https://example.com/path');
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.protocol).toBe('https:');
        expect(result.data.hostname).toBe('example.com');
      }
    });

    it('U2. HTTP with port', () => {
      const result = parseUrl('http://localhost:3000/api');
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.protocol).toBe('http:');
        expect(result.data.port).toBe('3000');
      }
    });

    it('U3. Username and password', () => {
      const result = parseUrl('https://user:pass@example.com');
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.username).toBe('user');
        expect(result.data.password).toBe('pass');
      }
    });

    it('U4. Pathname extraction', () => {
      const result = parseUrl('https://example.com/products/item/123');
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.pathname).toBe('/products/item/123');
      }
    });

    it('U12. IPv6 hostname', () => {
      const result = parseUrl('https://[::1]:8080/test');
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.hostname).toBe('[::1]');
        expect(result.data.port).toBe('8080');
      }
    });
  });

  describe('Query Parameters', () => {
    it('U5. Basic query parameter', () => {
      const result = parseUrl('https://example.com?search=test');
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.queryParams).toEqual([{ key: 'search', value: 'test' }]);
      }
    });

    it('U6. Duplicate query keys', () => {
      const result = parseUrl('https://example.com?a=1&a=2');
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.queryParams).toHaveLength(2);
        expect(result.data.queryParams[0]).toEqual({ key: 'a', value: '1' });
        expect(result.data.queryParams[1]).toEqual({ key: 'a', value: '2' });
      }
    });

    it('U7. Empty query value', () => {
      const result = parseUrl('https://example.com?key=');
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.queryParams).toEqual([{ key: 'key', value: '' }]);
      }
    });

    it('U8. Encoded query value', () => {
      const result = parseUrl('https://example.com?name=John%20Doe');
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.queryParams).toEqual([{ key: 'name', value: 'John Doe' }]);
      }
    });

    it('U9. Plus sign vs encoded plus in query', () => {
      // '+' in query string is decoded as space by URLSearchParams (form semantics)
      const resultPlus = parseUrl('https://example.com?q=hello+world');
      expect(resultPlus.ok).toBe(true);
      if (resultPlus.ok) {
        expect(resultPlus.data.queryParams).toEqual([{ key: 'q', value: 'hello world' }]);
      }

      // '%2B' is decoded as literal '+'
      const resultEncoded = parseUrl('https://example.com?q=hello%2Bworld');
      expect(resultEncoded.ok).toBe(true);
      if (resultEncoded.ok) {
        expect(resultEncoded.data.queryParams).toEqual([{ key: 'q', value: 'hello+world' }]);
      }
    });
  });

  describe('Edge Cases & Validation', () => {
    it('U10. Unicode URL', () => {
      const result = parseUrl('https://example.com/测试?name=测试');
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.pathname).toBe('/%E6%B5%8B%E8%AF%95');
        expect(result.data.queryParams[0].value).toBe('测试');
      }
    });

    it('U11. IDN (Internationalized Domain Name)', () => {
      const result = parseUrl('https://münchen.de/path');
      expect(result.ok).toBe(true);
      if (result.ok) {
        // URL API automatically punycode-encodes IDN hostnames
        expect(result.data.hostname).toBe('xn--mnchen-3ya.de');
      }
    });

    it('U13. Empty pathname', () => {
      const result = parseUrl('https://example.com');
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.pathname).toBe('/');
      }
    });

    it('U14. Hash fragment', () => {
      const result = parseUrl('https://example.com/page#section-1');
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.hash).toBe('#section-1');
      }
    });

    it('U15. Invalid URL syntax', () => {
      const result = parseUrl('not-a-valid-url');
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('absolute URL');
      }
    });

    it('U16. Empty input', () => {
      const result = parseUrl('');
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe('URL cannot be empty.');
      }
    });

    it('U17. Missing protocol (relative URL)', () => {
      const result = parseUrl('example.com/path');
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('absolute URL');
      }
    });
  });

  describe('Reconstruction', () => {
    it('U18. Query reconstruction (add, edit, remove)', () => {
      const original = 'https://example.com/search?q=bumiversa&page=1';
      const updatedParams = [
        { key: 'q', value: 'bumiversa' },
        { key: 'page', value: '2' },
        { key: 'lang', value: 'id' },
      ];
      
      const result = reconstructUrl(original, updatedParams);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.url).toBe('https://example.com/search?q=bumiversa&page=2&lang=id');
      }
    });

    it('U19. Round-trip: parse -> reconstruct -> parse', () => {
      const original = 'https://example.com/test?a=1&b=2';
      const parsed = parseUrl(original);
      expect(parsed.ok).toBe(true);
      
      if (parsed.ok) {
        const reconstructed = reconstructUrl(original, parsed.data.queryParams);
        expect(reconstructed.ok).toBe(true);
        
        if (reconstructed.ok) {
          const reparsed = parseUrl(reconstructed.url);
          expect(reparsed.ok).toBe(true);
          if (reparsed.ok) {
            expect(reparsed.data.queryParams).toEqual(parsed.data.queryParams);
          }
        }
      }
    });

    it('U21. Empty query reconstruction (no trailing ?)', () => {
      const original = 'https://example.com/path?old=param';
      const result = reconstructUrl(original, []);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.url).toBe('https://example.com/path');
        expect(result.url.endsWith('?')).toBe(false);
      }
    });
  });

  describe('Encode / Decode Utilities', () => {
    it('U20. Special characters encoding/decoding', () => {
      const original = 'hello world & friends!';
      const encoded = encodeComponent(original);
      expect(encoded).toBe('hello%20world%20%26%20friends!');
      
      const decoded = decodeComponent(encoded);
      expect(decoded).toBe(original);
    });

    it('E1. Decode invalid string gracefully', () => {
      const result = decodeComponent('%E0%A4%A'); // Invalid UTF-8 sequence
      expect(result).toBe('Invalid encoded string');
    });
  });
});