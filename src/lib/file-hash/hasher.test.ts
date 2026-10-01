import { describe, expect, it } from 'vitest';
import { hashFile } from './hasher';

function createMockFile(name: string, type: string, content: Uint8Array): File {
  // Convert Uint8Array to ArrayBuffer explicitly to avoid BlobPart typing issues
  const buffer = new ArrayBuffer(content.byteLength);
  new Uint8Array(buffer).set(content);
  return new File([buffer], name, { type });
}

describe('File Hash Inspector', () => {
  it('T1. SHA-256 "Hello World"', async () => {
    const content = new TextEncoder().encode('Hello World');
    const file = createMockFile('test.txt', 'text/plain', content);
    const result = await hashFile(file, 'SHA-256');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.hash).toBe('a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e');
    }
  });

  it('T2. SHA-384 "Hello World"', async () => {
    const content = new TextEncoder().encode('Hello World');
    const file = createMockFile('test.txt', 'text/plain', content);
    const result = await hashFile(file, 'SHA-384');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.hash).toBe('99514329186b2f6ae4a1329e7ee6c610a729636335174ac6b740f9028396fcc803d0e93863a7c3d90f86beee782f4f3f');
    }
  });

  it('T3. SHA-512 "Hello World"', async () => {
    const content = new TextEncoder().encode('Hello World');
    const file = createMockFile('test.txt', 'text/plain', content);
    const result = await hashFile(file, 'SHA-512');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.hash).toBe('2c74fd17edafd80e8447b0d46741ee243b7eb74dd2149a0ab1b9246fb30382f27e853d8585719e0e67cbda0daa8f51671064615d645ae27acb15bfb1447f459b');
    }
  });

  it('T4. Empty file', async () => {
    const content = new Uint8Array(0);
    const file = createMockFile('empty.txt', 'text/plain', content);
    const result = await hashFile(file, 'SHA-256');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.hash).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
    }
  });

  it('T5. File > 100 MiB rejected', async () => {
    const content = new Uint8Array(101 * 1024 * 1024);
    const file = createMockFile('large.bin', 'application/octet-stream', content);
    const result = await hashFile(file, 'SHA-256');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe('File is too large. Please select a file smaller than 100 MB.');
    }
  });

  it('T6. Algorithm switching', async () => {
    const content = new TextEncoder().encode('test');
    const file = createMockFile('test.txt', 'text/plain', content);
    
    const result256 = await hashFile(file, 'SHA-256');
    const result512 = await hashFile(file, 'SHA-512');
    
    expect(result256.ok).toBe(true);
    expect(result512.ok).toBe(true);
    
    if (result256.ok && result512.ok) {
      expect(result256.data.hash.length).toBe(64);
      expect(result512.data.hash.length).toBe(128);
      expect(result256.data.hash).not.toBe(result512.data.hash);
    }
  });

  it('T7. Binary fixture hex formatting', async () => {
    const content = new Uint8Array([0x00, 0xff, 0x10, 0xab]);
    const file = createMockFile('binary.bin', 'application/octet-stream', content);
    
    const result256 = await hashFile(file, 'SHA-256');
    const result384 = await hashFile(file, 'SHA-384');
    const result512 = await hashFile(file, 'SHA-512');
    
    expect(result256.ok).toBe(true);
    expect(result384.ok).toBe(true);
    expect(result512.ok).toBe(true);
    
    if (result256.ok && result384.ok && result512.ok) {
      expect(result256.data.hash.length).toBe(64);
      expect(result384.data.hash.length).toBe(96);
      expect(result512.data.hash.length).toBe(128);
      
      expect(result256.data.hash).toMatch(/^[0-9a-f]+$/);
      expect(result384.data.hash).toMatch(/^[0-9a-f]+$/);
      expect(result512.data.hash).toMatch(/^[0-9a-f]+$/);
    }
  });

  it('T8. Unicode filename preserved', async () => {
    const content = new TextEncoder().encode('test');
    const file = createMockFile('data_🚀.txt', 'text/plain', content);
    const result = await hashFile(file, 'SHA-256');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.fileName).toBe('data_🚀.txt');
    }
  });
});