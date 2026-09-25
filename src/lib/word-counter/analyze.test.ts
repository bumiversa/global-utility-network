import { describe, it, expect } from 'vitest';
import { analyzeText } from './analyze';

describe('Word & Character Counter Logic (Analysis)', () => {
  it('1. Standard text', () => {
    const result = analyzeText("Hello world");
    expect(result).toEqual({ characters: 11, charactersNoSpaces: 10, words: 2, lines: 1 });
  });

  it('2. Empty string', () => {
    const result = analyzeText("");
    expect(result).toEqual({ characters: 0, charactersNoSpaces: 0, words: 0, lines: 0 });
  });

  it('3. Only spaces', () => {
    const result = analyzeText("   ");
    expect(result).toEqual({ characters: 3, charactersNoSpaces: 0, words: 0, lines: 1 });
  });

  it('4. Multiple spaces between words', () => {
    const result = analyzeText("hello    world");
    expect(result.words).toBe(2);
    expect(result.characters).toBe(14);
  });

  it('5. Newlines', () => {
    const result = analyzeText("hello\nworld");
    expect(result).toEqual({ characters: 11, charactersNoSpaces: 10, words: 2, lines: 2 });
  });

  it('6. Hyphenated words (Explicit Contract: 1 word)', () => {
    const result = analyzeText("hello-world");
    expect(result.words).toBe(1);
  });

  it('7. Trailing newline (Explicit Contract: counts as line break)', () => {
    const result = analyzeText("hello\n");
    expect(result.lines).toBe(2);
    expect(result.words).toBe(1);
  });

  it('8. Complex mixed input', () => {
    const result = analyzeText("  Line 1  \nLine-2\n\nLine 4  ");
    expect(result.characters).toBe(27); 
    expect(result.charactersNoSpaces).toBe(16); // FIXED: 27 total - 11 whitespace chars
    expect(result.words).toBe(5); // "Line", "1", "Line-2", "Line", "4"
    expect(result.lines).toBe(4); // "  Line 1  ", "Line-2", "", "Line 4  "
  });
});
