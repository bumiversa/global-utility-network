import { describe, expect, it } from 'vitest';
import { hashText } from './hash';

describe('Hash Generator', () => {
  describe('SHA-256 known vectors', () => {
    it('H1. SHA-256 empty string (NIST verified)', async () => {
      const result = await hashText('', 'SHA-256');
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.hash).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
      }
    });

    it('H2. SHA-256 "hello" (NIST verified)', async () => {
      const result = await hashText('hello', 'SHA-256');
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.hash).toBe('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824');
      }
    });
  });

  describe('SHA-512 known vectors (Node.js crypto verified)', () => {
    it('H3. SHA-512 empty string (independent verification)', async () => {
      const result = await hashText('', 'SHA-512');
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.hash).toBe('cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e');
      }
    });

    it('H4. SHA-512 "hello" (independent verification)', async () => {
      const result = await hashText('hello', 'SHA-512');
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.hash).toBe('9b71d224bd62f3785d96d46ad3ea3d73319bfbc2890caadae2dff72519673ca72323c3d99ba5c11d7c7acc6e14b8c5da0c4663475c2e5c3adef46f73bcdec043');
      }
    });
  });

  describe('SHA-512 properties', () => {
    it('H5. Empty string produces valid 128-char hash', async () => {
      const result = await hashText('', 'SHA-512');
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.hash.length).toBe(128);
        expect(result.hash).toMatch(/^[0-9a-f]{128}$/);
      }
    });

    it('H6. "hello" produces valid 128-char hash', async () => {
      const result = await hashText('hello', 'SHA-512');
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.hash.length).toBe(128);
        expect(result.hash).toMatch(/^[0-9a-f]{128}$/);
      }
    });
  });

  describe('Unicode & Encoding', () => {
    it('U1. Accented character (different from ASCII)', async () => {
      const accented = await hashText('héllo', 'SHA-256');
      const ascii = await hashText('hello', 'SHA-256');
      expect(accented.ok).toBe(true);
      expect(ascii.ok).toBe(true);
      if (accented.ok && ascii.ok) {
        expect(accented.hash.length).toBe(64);
        expect(accented.hash).not.toBe(ascii.hash);
      }
    });

    it('U2. Emoji', async () => {
      const result = await hashText('😀', 'SHA-256');
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.hash.length).toBe(64);
        expect(result.hash).toMatch(/^[0-9a-f]{64}$/);
      }
    });

    it('U3. Japanese characters', async () => {
      const result = await hashText('日本語', 'SHA-256');
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.hash.length).toBe(64);
        expect(result.hash).toMatch(/^[0-9a-f]{64}$/);
      }
    });

    it('U4. LF newline', async () => {
      const result = await hashText('hello\n', 'SHA-256');
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.hash.length).toBe(64);
      }
    });

    it('U5. CRLF newline (different from LF)', async () => {
      const lf = await hashText('hello\n', 'SHA-256');
      const crlf = await hashText('hello\r\n', 'SHA-256');
      expect(lf.ok).toBe(true);
      expect(crlf.ok).toBe(true);
      if (lf.ok && crlf.ok) {
        expect(lf.hash).not.toBe(crlf.hash);
      }
    });
  });

  describe('Determinism', () => {
    it('D1. Same input produces same hash (SHA-256)', async () => {
      const result1 = await hashText('test', 'SHA-256');
      const result2 = await hashText('test', 'SHA-256');
      expect(result1.ok).toBe(true);
      expect(result2.ok).toBe(true);
      if (result1.ok && result2.ok) {
        expect(result1.hash).toBe(result2.hash);
      }
    });

    it('D2. Same input produces same hash (SHA-512)', async () => {
      const result1 = await hashText('test', 'SHA-512');
      const result2 = await hashText('test', 'SHA-512');
      expect(result1.ok).toBe(true);
      expect(result2.ok).toBe(true);
      if (result1.ok && result2.ok) {
        expect(result1.hash).toBe(result2.hash);
      }
    });
  });

  describe('Output format', () => {
    it('F1. SHA-256 length = 64', async () => {
      const result = await hashText('hello', 'SHA-256');
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.hash.length).toBe(64);
      }
    });

    it('F2. SHA-512 length = 128', async () => {
      const result = await hashText('hello', 'SHA-512');
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.hash.length).toBe(128);
      }
    });

    it('F3. SHA-256 all lowercase hex', async () => {
      const result = await hashText('hello', 'SHA-256');
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.hash).toBe(result.hash.toLowerCase());
        expect(result.hash).toMatch(/^[0-9a-f]{64}$/);
      }
    });

    it('F4. SHA-512 all lowercase hex', async () => {
      const result = await hashText('hello', 'SHA-512');
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.hash).toBe(result.hash.toLowerCase());
        expect(result.hash).toMatch(/^[0-9a-f]{128}$/);
      }
    });

    it('F5. No 0x prefix', async () => {
      const result = await hashText('hello', 'SHA-256');
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.hash.startsWith('0x')).toBe(false);
      }
    });
  });

  describe('Edge cases', () => {
    it('E1. Whitespace only', async () => {
      const result = await hashText('   ', 'SHA-256');
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.hash.length).toBe(64);
        expect(result.hash).toMatch(/^[0-9a-f]{64}$/);
      }
    });

    it('E2. Large input (1MB)', async () => {
      const largeInput = 'a'.repeat(1000000);
      const result = await hashText(largeInput, 'SHA-256');
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.hash.length).toBe(64);
        expect(result.hash).toMatch(/^[0-9a-f]{64}$/);
      }
    });

    it('E3. Special characters', async () => {
      const result = await hashText('!@#$%^&*()', 'SHA-256');
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.hash.length).toBe(64);
        expect(result.hash).toMatch(/^[0-9a-f]{64}$/);
      }
    });
  });

  describe('Algorithm differentiation', () => {
    it('A1. SHA-256 and SHA-512 produce different outputs', async () => {
      const sha256 = await hashText('hello', 'SHA-256');
      const sha512 = await hashText('hello', 'SHA-512');
      expect(sha256.ok).toBe(true);
      expect(sha512.ok).toBe(true);
      if (sha256.ok && sha512.ok) {
        expect(sha256.hash).not.toBe(sha512.hash);
        expect(sha256.hash.length).toBe(64);
        expect(sha512.hash.length).toBe(128);
      }
    });
  });
});