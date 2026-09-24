import { describe, it, expect } from 'vitest';
import { formatJson, minifyJson } from '../../src/lib/json-formatter/transform';

describe('JSON Formatter & Minifier Logic', () => {
  it('1. JSON valid -> pretty format (2 spaces indent)', () => {
    const input = '{"name":"Bumi","version":1}';
    const result = formatJson(input);
    
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toContain('\n');
      expect(result.value).toContain('  "name": "Bumi"');
    }
  });

  it('2. JSON valid -> minify (remove all whitespace)', () => {
    const input = '{\n  "name": "Bumi",\n  "version": 1\n}';
    const result = minifyJson(input);
    
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toBe('{"name":"Bumi","version":1}');
    }
  });

  it('3. JSON invalid -> return error object', () => {
    const input = '{ invalid json string }';
    
    const formatResult = formatJson(input);
    const minifyResult = minifyJson(input);
    
    expect(formatResult.ok).toBe(false);
    expect(minifyResult.ok).toBe(false);
    if (!formatResult.ok) expect(formatResult.error).toBeDefined();
  });

  it('4. Nested values preserved correctly', () => {
    const input = '{"user":{"profile":{"age":30,"active":true}}}';
    const result = formatJson(input);
    
    expect(result.ok).toBe(true);
    if (result.ok) {
      // Memastikan struktur nested tidak rusak saat di-stringify
      expect(result.value).toContain('"age": 30');
      expect(result.value).toContain('"active": true');
    }
  });
});
