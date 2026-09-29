import { describe, expect, it } from 'vitest';
import { parseCsv } from './parser';

describe('CSV Parser', () => {
  it('T1. Basic CSV', () => {
    const result = parseCsv('name,age\nBudi,30');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toEqual([{ name: 'Budi', age: '30' }]);
    }
  });

  it('T2. Header extraction', () => {
    const result = parseCsv('col1,col2,col3\na,b,c');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(Object.keys(result.data[0])).toEqual(['col1', 'col2', 'col3']);
    }
  });

  it('T3. Quoted field', () => {
    const result = parseCsv('name,desc\nBudi,"Developer"');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data[0].desc).toBe('Developer');
    }
  });

  it('T4. Comma inside quoted field', () => {
    const result = parseCsv('name,desc\nBudi,"Developer, AI"');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data[0].desc).toBe('Developer, AI');
    }
  });

  it('T5. Newline inside quoted field', () => {
    const result = parseCsv('name,desc\nBudi,"Line 1\nLine 2"');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data[0].desc).toBe('Line 1\nLine 2');
    }
  });

  it('T6. Escaped double quote', () => {
    const result = parseCsv('name,note\nBudi,"He said ""hello"""');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data[0].note).toBe('He said "hello"');
    }
  });

  it('T7. CRLF line endings', () => {
    const result = parseCsv('name,age\r\nBudi,30\r\nSiti,28');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.length).toBe(2);
    }
  });

  it('T8. LF line endings', () => {
    const result = parseCsv('name,age\nBudi,30\nSiti,28');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.length).toBe(2);
    }
  });

  it('T9. Empty field', () => {
    const result = parseCsv('name,age,city\nBudi,,Malang');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data[0].age).toBe('');
    }
  });

    it('T10. Empty final field', () => {
    const result = parseCsv('name,age,city\nBudi,30,');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data[0]).toEqual({ name: 'Budi', age: '30', city: '' });
    }
  });
  it('T11. Inconsistent column count â†’ error', () => {
    const result = parseCsv('name,age\nBudi,30,extra');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain('Inconsistent column count');
    }
  });

  it('T12. Duplicate header â†’ error', () => {
    const result = parseCsv('name,name\nBudi,30');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain('Duplicate header');
    }
  });

  it('T13. Empty header â†’ error', () => {
    const result = parseCsv('name,\nBudi,30');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain('Empty header');
    }
  });

  it('T14. Unterminated quote â†’ error', () => {
    const result = parseCsv('name,desc\nBudi,"Developer');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain('Unterminated quote');
    }
  });

  it('T15. Unicode / emoji', () => {
    const result = parseCsv('name,flag\nBudi,ðŸ‡®ðŸ‡©');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data[0].flag).toBe('ðŸ‡®ðŸ‡©');
    }
  });

  it('T16. BOM handling', () => {
    const result = parseCsv('\uFEFFname,age\nBudi,30');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(Object.keys(result.data[0])[0]).toBe('name'); // Not '\uFEFFname'
    }
  });
});