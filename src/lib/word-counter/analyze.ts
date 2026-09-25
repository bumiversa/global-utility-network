export type WordCountResult = {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  lines: number;
};

export function analyzeText(text: string): WordCountResult {
  if (!text) {
    return { characters: 0, charactersNoSpaces: 0, words: 0, lines: 0 };
  }

  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, '').length;
  
  // Word definition: sequences of non-whitespace characters.
  // "hello-world" -> 1 word. "hello   world" -> 2 words.
  const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  
  // Line definition: split by newline characters.
  // "" -> 0 lines. "hello" -> 1 line. "hello\n" -> 2 lines.
  const lines = text === '' ? 0 : text.split(/\r?\n/).length;

  return { characters, charactersNoSpaces, words, lines };
}
