import { describe, it, expect } from 'vitest';
import { cleanText } from './transform';

describe('Text Cleaner Logic', () => {
  it('1. Happy path: remove duplicates and empty lines', () => {
    const input = "apple\n\nbanana\napple\norange\n";
    const result = cleanText(input, { removeDuplicates: true, trimLines: true, removeEmptyLines: true, sortLines: false });
    
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toBe("apple\nbanana\norange");
      expect(result.stats.duplicatesRemoved).toBe(1);
      expect(result.stats.emptyLinesRemoved).toBe(2); // FIXED: split menghasilkan 2 baris kosong
    }
  });

  it('2. Empty input handling', () => {
    const result = cleanText("", { removeDuplicates: true, trimLines: true, removeEmptyLines: true, sortLines: false });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toBe("");
      expect(result.stats.originalLines).toBe(0);
    }
  });

  it('3. Sort lines (numeric and alphabetic)', () => {
    const input = "item 10\nitem 2\napple\nbanana";
    const result = cleanText(input, { removeDuplicates: false, trimLines: false, removeEmptyLines: false, sortLines: true });
    
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toBe("apple\nbanana\nitem 2\nitem 10");
    }
  });

  it('4. Unicode / Emoji support', () => {
    const input = "Bumi ??\nMars ??\nBumi ??";
    const result = cleanText(input, { removeDuplicates: true, trimLines: false, removeEmptyLines: false, sortLines: false });
    
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toBe("Bumi ??\nMars ??");
      expect(result.stats.duplicatesRemoved).toBe(1);
    }
  });

  it('5. Trim lines only', () => {
    const input = "  hello  \n  world  ";
    const result = cleanText(input, { removeDuplicates: false, trimLines: true, removeEmptyLines: false, sortLines: false });
    
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toBe("hello\nworld");
    }
  });

  it('6. Trailing newline is counted as an empty line', () => {
    const input = "apple\nbanana\n";
    const result = cleanText(input, {
      removeDuplicates: false,
      trimLines: false,
      removeEmptyLines: true,
      sortLines: false,
    });

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value).toBe("apple\nbanana");
      expect(result.stats.originalLines).toBe(3);
      expect(result.stats.cleanedLines).toBe(2);
      expect(result.stats.emptyLinesRemoved).toBe(1);
    }
  });
});
