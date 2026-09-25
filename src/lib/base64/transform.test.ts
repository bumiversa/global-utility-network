import { describe, it, expect } from 'vitest';
import { encodeBase64, decodeBase64, encodeBase64Url, decodeBase64Url } from './transform';

describe('Base64 Transform Logic (UTF-8 Robust)', () => {
  it('1. Standard ASCII encode/decode', () => {
    const text = "Hello, World!";
    const encoded = encodeBase64(text);
    expect(encoded).toBe("SGVsbG8sIFdvcmxkIQ==");
    
    const decoded = decodeBase64(encoded);
    expect(decoded.ok).toBe(true);
    if (decoded.ok) expect(decoded.value).toBe(text);
  });

  it('2. UTF-8 / Unicode encode/decode (Emoji & Non-Latin)', () => {
    const text = "Bumi versi ?? ?????";
    const encoded = encodeBase64(text);
    
    const decoded = decodeBase64(encoded);
    expect(decoded.ok).toBe(true);
    if (decoded.ok) expect(decoded.value).toBe(text);
  });

  it('3. Invalid Base64 decode returns error', () => {
    const result = decodeBase64("!!!invalid!!!");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe("Invalid Base64 string");
  });

  it('4. Base64URL encode/decode', () => {
    const text = "test?data=true&name=Bumi";
    const encodedUrl = encodeBase64Url(text);
    
    // Base64URL should not have +, /, or =
    expect(encodedUrl).not.toContain("+");
    expect(encodedUrl).not.toContain("/");
    expect(encodedUrl).not.toContain("=");
    
    const decoded = decodeBase64Url(encodedUrl);
    expect(decoded.ok).toBe(true);
    if (decoded.ok) expect(decoded.value).toBe(text);
  });

  it('5. Empty string handling', () => {
    expect(encodeBase64("")).toBe("");
    const decoded = decodeBase64("");
    expect(decoded.ok).toBe(true);
    if (decoded.ok) expect(decoded.value).toBe("");
  });
});
