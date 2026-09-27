export interface ConversionResult {
  camel: string;
  pascal: string;
  snake: string;
  upperSnake: string;
  kebab: string;
  upperKebab: string;
  title: string;
}

// Canonical Tokenizer: Single Source of Truth
export function tokenize(input: string): string[] {
  if (!input || input.trim() === '') return [];
  
  // Matches:
  // 1. [A-Z]+ followed by (uppercase+lowercase OR digit OR word boundary) -> Acronyms (e.g., API, XML, HTTPS)
  // 2. [A-Z]?[a-z]+ -> Normal words (e.g., hello, World, get)
  // 3. \d+ -> Numbers (e.g., 123, 2)
  // Special characters and separators are naturally ignored (not matched).
  const matches = input.match(/[A-Z]+(?=[A-Z][a-z]|\d|\b)|[A-Z]?[a-z]+|\d+/g);
  
  if (!matches) return [];
  
  return matches.map(token => token.toLowerCase());
}

// Formatters: Derived exclusively from canonical tokens
export function toCamelCase(tokens: string[]): string {
  if (tokens.length === 0) return '';
  return tokens[0] + tokens.slice(1).map(t => t.charAt(0).toUpperCase() + t.slice(1)).join('');
}

export function toPascalCase(tokens: string[]): string {
  return tokens.map(t => t.charAt(0).toUpperCase() + t.slice(1)).join('');
}

export function toSnakeCase(tokens: string[]): string {
  return tokens.join('_');
}

export function toUpperSnakeCase(tokens: string[]): string {
  return tokens.map(t => t.toUpperCase()).join('_');
}

export function toKebabCase(tokens: string[]): string {
  return tokens.join('-');
}

export function toUpperKebabCase(tokens: string[]): string {
  return tokens.map(t => t.toUpperCase()).join('-');
}

export function toTitleCase(tokens: string[]): string {
  return tokens.map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(' ');
}

// Main conversion function
export function convertCase(input: string): ConversionResult {
  const tokens = tokenize(input);
  return {
    camel: toCamelCase(tokens),
    pascal: toPascalCase(tokens),
    snake: toSnakeCase(tokens),
    upperSnake: toUpperSnakeCase(tokens),
    kebab: toKebabCase(tokens),
    upperKebab: toUpperKebabCase(tokens),
    title: toTitleCase(tokens),
  };
}