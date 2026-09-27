import { describe, expect, it } from 'vitest';
import {
  tokenize,
  convertCase,
  toCamelCase,
  toPascalCase,
  toSnakeCase,
  toUpperSnakeCase,
  toKebabCase,
  toUpperKebabCase,
  toTitleCase
} from './convert';

describe('Text Case Converter Pure Logic', () => {
  describe('Canonical Tokenizer (Single Source of Truth)', () => {
    it('1. helloWorld -> ["hello", "world"]', () => {
      expect(tokenize('helloWorld')).toEqual(['hello', 'world']);
    });

    it('2. APIResponse -> ["api", "response"]', () => {
      expect(tokenize('APIResponse')).toEqual(['api', 'response']);
    });

    it('3. XMLHttpRequest -> ["xml", "http", "request"]', () => {
      expect(tokenize('XMLHttpRequest')).toEqual(['xml', 'http', 'request']);
    });

    it('4. getHTTPSUrl -> ["get", "https", "url"]', () => {
      expect(tokenize('getHTTPSUrl')).toEqual(['get', 'https', 'url']);
    });

    it('5. hello123world -> ["hello", "123", "world"]', () => {
      expect(tokenize('hello123world')).toEqual(['hello', '123', 'world']);
    });

    it('6. version2API -> ["version", "2", "api"]', () => {
      expect(tokenize('version2API')).toEqual(['version', '2', 'api']);
    });

    it('7. hello-world_test -> ["hello", "world", "test"]', () => {
      expect(tokenize('hello-world_test')).toEqual(['hello', 'world', 'test']);
    });

    it('8. hello!world -> ["hello", "world"] (special chars stripped)', () => {
      expect(tokenize('hello!world')).toEqual(['hello', 'world']);
    });

    it('9. hello@world.com -> ["hello", "world", "com"]', () => {
      expect(tokenize('hello@world.com')).toEqual(['hello', 'world', 'com']);
    });

    it('10. "   hello   world   " -> ["hello", "world"]', () => {
      expect(tokenize('   hello   world   ')).toEqual(['hello', 'world']);
    });

    it('11. "" (empty) -> []', () => {
      expect(tokenize('')).toEqual([]);
    });

    it('12. "     " (whitespace only) -> []', () => {
      expect(tokenize('     ')).toEqual([]);
    });

    it('13. "123" -> ["123"]', () => {
      expect(tokenize('123')).toEqual(['123']);
    });

    it('14. Complex real-world: "user-profile_API-v2.0" -> ["user", "profile", "api", "v", "2", "0"]', () => {
      expect(tokenize('user-profile_API-v2.0')).toEqual(['user', 'profile', 'api', 'v', '2', '0']);
    });
  });

  describe('Formatters (Derived exclusively from tokens)', () => {
    const tokens = ['hello', 'world', 'api', 'response'];

    it('15. toCamelCase', () => {
      expect(toCamelCase(tokens)).toBe('helloWorldApiResponse');
    });

    it('16. toPascalCase', () => {
      expect(toPascalCase(tokens)).toBe('HelloWorldApiResponse');
    });

    it('17. toSnakeCase', () => {
      expect(toSnakeCase(tokens)).toBe('hello_world_api_response');
    });

    it('18. toUpperSnakeCase', () => {
      expect(toUpperSnakeCase(tokens)).toBe('HELLO_WORLD_API_RESPONSE');
    });

    it('19. toKebabCase', () => {
      expect(toKebabCase(tokens)).toBe('hello-world-api-response');
    });

    it('20. toUpperKebabCase', () => {
      expect(toUpperKebabCase(tokens)).toBe('HELLO-WORLD-API-RESPONSE');
    });

    it('21. toTitleCase', () => {
      expect(toTitleCase(tokens)).toBe('Hello World Api Response');
    });

    it('22. Formatters return empty string for empty tokens', () => {
      expect(toCamelCase([])).toBe('');
      expect(toPascalCase([])).toBe('');
      expect(toSnakeCase([])).toBe('');
      expect(toUpperSnakeCase([])).toBe('');
      expect(toKebabCase([])).toBe('');
      expect(toUpperKebabCase([])).toBe('');
      expect(toTitleCase([])).toBe('');
    });
  });

  describe('End-to-End Conversion', () => {
    it('23. convertCase("XMLHttpRequest")', () => {
      const result = convertCase('XMLHttpRequest');
      expect(result.camel).toBe('xmlHttpRequest');
      expect(result.pascal).toBe('XmlHttpRequest');
      expect(result.snake).toBe('xml_http_request');
      expect(result.upperSnake).toBe('XML_HTTP_REQUEST');
      expect(result.kebab).toBe('xml-http-request');
      expect(result.upperKebab).toBe('XML-HTTP-REQUEST');
      expect(result.title).toBe('Xml Http Request');
    });

    it('24. convertCase("") returns all empty strings', () => {
      const result = convertCase('');
      expect(Object.values(result).every(val => val === '')).toBe(true);
    });
  });
});