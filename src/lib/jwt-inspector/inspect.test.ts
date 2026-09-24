import { describe, it, expect } from 'vitest';
import { inspectJwt } from './inspect';

// Helper to create valid base64url
const b64 = (obj: unknown) => Buffer.from(JSON.stringify(obj)).toString('base64url');

describe('JWT Inspector Logic', () => {
  it('1. Valid JWT with standard claims', () => {
    const header = { alg: 'HS256', typ: 'JWT' };
    const payload = { sub: '123', iss: 'bumiversa', exp: 9999999999, iat: 1000000000 };
    const token = `${b64(header)}.${b64(payload)}.signature`;

    const result = inspectJwt(token);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.header.alg).toBe('HS256');
      expect(result.claims.sub).toBe('123');
      expect(result.claims.iss).toBe('bumiversa');
      expect(result.claims.exp?.isExpired).toBe(false);
      expect(result.signature).toBe('signature');
    }
  });

  it('2. Invalid structure (less than 3 parts)', () => {
    const result = inspectJwt('header.payload');
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errorType).toBe('invalid_structure');
  });

  it('3. Invalid Base64URL', () => {
    const token = '!!!.!!!.!!!';
    const result = inspectJwt(token);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errorType).toBe('invalid_base64url');
  });

  it('4. Invalid JSON in payload', () => {
    // base64url of "{ invalid json }" is "eyAgaW52YWxpZCBqc29uIH0"
    const token = `eyJhbGciOiJIUzI1NiJ9.eyAgaW52YWxpZCBqc29uIH0.sig`;
    const result = inspectJwt(token);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errorType).toBe('invalid_json');
  });

  it('5. Expired token detection', () => {
    const header = { alg: 'HS256' };
    const payload = { exp: 1000000000 }; // Year 2001
    const token = `${b64(header)}.${b64(payload)}.sig`;

    const result = inspectJwt(token);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.claims.exp?.isExpired).toBe(true);
    }
  });

  it('6. Not-yet-valid (nbf) detection', () => {
    const header = { alg: 'HS256' };
    const payload = { nbf: 9999999999 }; // Year 2286
    const token = `${b64(header)}.${b64(payload)}.sig`;

    const result = inspectJwt(token);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.claims.nbf?.isNotYetValid).toBe(true);
    }
  });

  it('7. Token without exp/iat/nbf', () => {
    const header = { alg: 'HS256' };
    const payload = { sub: 'user123', aud: ['app1', 'app2'] };
    const token = `${b64(header)}.${b64(payload)}.sig`;

    const result = inspectJwt(token);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.claims.exp).toBeUndefined();
      expect(result.claims.sub).toBe('user123');
      expect(result.claims.aud).toEqual(['app1', 'app2']);
    }
  });

  it('8. Unicode payload support', () => {
    const header = { alg: 'HS256' };
    const payload = { name: 'Bumi versi', emoji: '??' };
    const token = `${b64(header)}.${b64(payload)}.sig`;

    const result = inspectJwt(token);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.payload.name).toBe('Bumi versi');
      expect(result.payload.emoji).toBe('??');
    }
  });
});
