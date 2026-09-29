import { describe, expect, it } from 'vitest';
import { computeDiff } from './diff';

describe('Text Diff (Myers Algorithm)', () => {
  const defaultOptions = { caseSensitive: true, ignoreTrailingWhitespace: false };

  it('T1. Exact match', () => {
    const result = computeDiff('A\nB\nC', 'A\nB\nC', defaultOptions);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.diff).toEqual([
        { type: 'unchanged', value: 'A' },
        { type: 'unchanged', value: 'B' },
        { type: 'unchanged', value: 'C' },
      ]);
    }
  });

  it('T2. Simple addition', () => {
    const result = computeDiff('A\nB', 'A\nB\nC', defaultOptions);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.diff).toEqual([
        { type: 'unchanged', value: 'A' },
        { type: 'unchanged', value: 'B' },
        { type: 'added', value: 'C' },
      ]);
    }
  });

  it('T3. Simple removal', () => {
    const result = computeDiff('A\nB\nC', 'A\nC', defaultOptions);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.diff).toEqual([
        { type: 'unchanged', value: 'A' },
        { type: 'removed', value: 'B' },
        { type: 'unchanged', value: 'C' },
      ]);
    }
  });

  it('T4. Case sensitivity toggle', () => {
    const resSensitive = computeDiff('Hello', 'hello', { caseSensitive: true, ignoreTrailingWhitespace: false });
    expect(resSensitive.ok).toBe(true);
    if (resSensitive.ok) {
      expect(resSensitive.diff).toEqual([
        { type: 'removed', value: 'Hello' },
        { type: 'added', value: 'hello' },
      ]);
    }

    const resInsensitive = computeDiff('Hello', 'hello', { caseSensitive: false, ignoreTrailingWhitespace: false });
    expect(resInsensitive.ok).toBe(true);
    if (resInsensitive.ok) {
      expect(resInsensitive.diff).toEqual([
        { type: 'unchanged', value: 'Hello' },
      ]);
    }
  });

  it('T5. Ignore trailing whitespace toggle', () => {
    const resStrict = computeDiff('Hello ', 'Hello', { caseSensitive: true, ignoreTrailingWhitespace: false });
    expect(resStrict.ok).toBe(true);
    if (resStrict.ok) {
      expect(resStrict.diff).toEqual([
        { type: 'removed', value: 'Hello ' },
        { type: 'added', value: 'Hello' },
      ]);
    }

    const resIgnore = computeDiff('Hello \t', 'Hello', { caseSensitive: true, ignoreTrailingWhitespace: true });
    expect(resIgnore.ok).toBe(true);
    if (resIgnore.ok) {
      expect(resIgnore.diff).toEqual([
        { type: 'unchanged', value: 'Hello \t' },
      ]);
    }
  });

  it('T6. Performance boundary (5000 identical lines)', () => {
    const text = Array(5000).fill('line').join('\n');
    const start = performance.now();
    const result = computeDiff(text, text, defaultOptions);
    const duration = performance.now() - start;
    
    expect(result.ok).toBe(true);
    expect(duration).toBeLessThan(100);
  });

  it('T7. Exceed limit (5001 lines)', () => {
    const textA = Array(5001).fill('line').join('\n');
    const textB = 'line';
    const result = computeDiff(textA, textB, defaultOptions);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain('maximum limit of 5000 lines');
    }
  });

  it('T8. Empty input handling', () => {
    const result = computeDiff('', 'A', defaultOptions);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.diff).toEqual([{ type: 'added', value: 'A' }]);
    }
  });

  it('T9. Duplicate lines', () => {
    const result = computeDiff('A\nA\nA', 'A\nA', defaultOptions);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.diff).toEqual([
        { type: 'unchanged', value: 'A' },
        { type: 'unchanged', value: 'A' },
        { type: 'removed', value: 'A' },
      ]);
    }
  });

  it('T10. LF versus CRLF normalization', () => {
    const result = computeDiff('A\r\nB', 'A\nB', defaultOptions);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.diff).toEqual([
        { type: 'unchanged', value: 'A' },
        { type: 'unchanged', value: 'B' },
      ]);
    }
  });

  it('T11. Unicode and emoji preservation', () => {
    const result = computeDiff('Hello 🌍', 'Hello 🌍', defaultOptions);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.diff).toEqual([{ type: 'unchanged', value: 'Hello 🌍' }]);
    }
  });

  it('T12. Complex edit script (multiple changes)', () => {
    const textA = 'Line 1\nLine 2\nLine 3\nLine 4';
    const textB = 'Line 1\nNew Line 2\nLine 3\nLine 5';
    const result = computeDiff(textA, textB, defaultOptions);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.diff).toEqual([
        { type: 'unchanged', value: 'Line 1' },
        { type: 'removed', value: 'Line 2' },
        { type: 'added', value: 'New Line 2' },
        { type: 'unchanged', value: 'Line 3' },
        { type: 'removed', value: 'Line 4' },
        { type: 'added', value: 'Line 5' },
      ]);
    }
  });

  it('T13. Algorithm work limit safeguard', () => {
    // 500 vs 500 gives maxD = 1000, total steps ~ 1,000,000, which is under 2,000,000 limit
    // This verifies the safeguard doesn't falsely trigger on valid large diffs.
    const textA = Array(500).fill('A').join('\n');
    const textB = Array(500).fill('B').join('\n');
    
    const result = computeDiff(textA, textB, defaultOptions);
    expect(result.ok).toBe(true);
  });
});