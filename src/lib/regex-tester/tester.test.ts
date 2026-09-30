import { describe, expect, it } from 'vitest';
import { testRegex } from './tester';

describe('Regex Tester Engine', () => {
  it('T1. Basic match (no flags)', () => {
    const result = testRegex('cat', 'the cat in the hat', '');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.matches.length).toBe(1);
      expect(result.data.matches[0]).toEqual({ fullMatch: 'cat', index: 4, groups: [] });
    }
  });

  it('T2. Global match (g flag)', () => {
    const result = testRegex('cat', 'the cat in the hat has another cat', 'g');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.matches.length).toBe(2);
      expect(result.data.matches[0].index).toBe(4);
      expect(result.data.matches[1].index).toBe(31);
    }
  });

  it('T3. Case insensitive (i flag)', () => {
    const result = testRegex('CAT', 'the cat in the hat', 'i');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.matches.length).toBe(1);
      expect(result.data.matches[0].fullMatch).toBe('cat');
    }
  });

  it('T4. Multiline (m flag)', () => {
    const text = 'first line\nsecond line\nthird line';
    const result = testRegex('^second', text, 'm');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.matches.length).toBe(1);
      expect(result.data.matches[0].fullMatch).toBe('second');
    }
  });

  it('T5. Capture groups extraction', () => {
    const text = 'Contact alice@example.com or bob@test.org';
    const result = testRegex('(\\w+)@(\\w+\\.\\w+)', text, 'g');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.matches.length).toBe(2);
      expect(result.data.matches[0]).toEqual({
        fullMatch: 'alice@example.com',
        index: 8,
        groups: ['alice', 'example.com'],
      });
      expect(result.data.matches[1]).toEqual({
        fullMatch: 'bob@test.org',
        index: 29,
        groups: ['bob', 'test.org'],
      });
    }
  });

  it('T6. Invalid regex pattern -> error', () => {
    const result = testRegex('[a-z', 'test', '');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe('Invalid regular expression. Please check your pattern.');
    }
  });

  it('T7. Invalid flags -> error', () => {
    const result = testRegex('test', 'test', 'gx'); // 'x' is invalid for our V1 scope
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe('Invalid flags. Only g, i, and m are allowed.');
    }
  });

  it('T8. Empty pattern -> error', () => {
    const result = testRegex('', 'test', '');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe('Pattern cannot be empty.');
    }
  });

  it('T9. Empty text -> valid, 0 matches', () => {
    const result = testRegex('test', '', 'g');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.matches.length).toBe(0);
    }
  });

  it('T10. No matches found -> valid, 0 matches', () => {
    const result = testRegex('xyz', 'hello world', 'g');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.matches.length).toBe(0);
    }
  });

  it('T11. Optional capture group (undefined handling)', () => {
    const result = testRegex('(a)(b)?', 'a', '');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.matches.length).toBe(1);
      // Group 2 is undefined in native JS, our logic should map it to ''
      expect(result.data.matches[0].groups).toEqual(['a', '']);
    }
  });
});
