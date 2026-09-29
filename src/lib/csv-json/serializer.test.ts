import { describe, expect, it } from 'vitest';
import { serializeCsv } from './serializer';
import { parseCsv } from './parser';

describe('CSV Serializer', () => {
  it('T17. Basic array of objects', () => {
    const result = serializeCsv([{ name: 'Budi', age: '30' }]);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toBe('name,age\r\nBudi,30');
    }
  });

  it('T18. Multiple objects', () => {
    const result = serializeCsv([{ name: 'Budi' }, { name: 'Siti' }]);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.split('\r\n').length).toBe(3);
    }
  });

  it('T19. Header ordering', () => {
    const result = serializeCsv([{ z: '1', a: '2' }]);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.startsWith('z,a')).toBe(true);
    }
  });

  it('T20. Missing property', () => {
    const result = serializeCsv([{ name: 'Budi', age: '30' }, { name: 'Siti' }]);
    expect(result.ok).toBe(true);
    if (result.ok) {
      const lines = result.data.split('\r\n');
      expect(lines[2]).toBe('Siti,');
    }
  });

  it('T21. Null value', () => {
    const result = serializeCsv([{ name: 'Budi', age: null }]);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toBe('name,age\r\nBudi,');
    }
  });

  it('T22. Number value', () => {
    const result = serializeCsv([{ val: 123 }]);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toBe('val\r\n123');
    }
  });

  it('T23. Boolean value', () => {
    const result = serializeCsv([{ val: true }]);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toBe('val\r\ntrue');
    }
  });

  it('T24. Nested object', () => {
    const result = serializeCsv([{ name: 'Budi', addr: { city: 'Malang' } }]);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toContain('"{""city"":""Malang""}"');
    }
  });

  it('T25. Nested array', () => {
    const result = serializeCsv([{ name: 'Budi', tags: ['a', 'b'] }]);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toContain('"[""a"",""b""]"');
    }
  });

  it('T26. Quote escaping in output', () => {
    const result = serializeCsv([{ note: 'He said "hello"' }]);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toContain('"He said ""hello"""');
    }
  });

  it('T27. Comma escaping in output', () => {
    const result = serializeCsv([{ desc: 'Dev, AI' }]);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toContain('"Dev, AI"');
    }
  });

  it('T28. Newline escaping in output', () => {
    const result = serializeCsv([{ desc: 'Line 1\nLine 2' }]);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toContain('"Line 1\nLine 2"');
    }
  });

  it('T29. Empty array → error', () => {
    const result = serializeCsv([]);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain('empty');
    }
  });

  it('T30. Root object → error', () => {
    const result = serializeCsv({ name: 'Budi' });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain('must be a JSON array');
    }
  });

  it('T31. Primitive array → error', () => {
    const result = serializeCsv(['a', 'b']);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain('must be objects');
    }
  });

  it('T32. Non-object array member → error', () => {
    const result = serializeCsv([{ name: 'Budi' }, 123]);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain('must be objects');
    }
  });

  it('T33. Round-trip (CSV → JSON → CSV)', () => {
    const originalCsv = 'name,desc\r\nBudi,"Dev, AI"\r\nSiti,"Line 1\nLine 2"';
    const parseResult = parseCsv(originalCsv);
    expect(parseResult.ok).toBe(true);
    
    if (parseResult.ok) {
      const serializeResult = serializeCsv(parseResult.data);
      expect(serializeResult.ok).toBe(true);
      if (serializeResult.ok) {
        expect(serializeResult.data).toBe(originalCsv);
      }
    }
  });
});