import type { RegexTestOutput, RegexMatch } from './types';

export function testRegex(pattern: string, text: string, flags: string): RegexTestOutput {
  // 1. Validate empty pattern
  if (!pattern) {
    return { ok: false, error: 'Pattern cannot be empty.' };
  }

  // 2. Validate flags (strictly g, i, m only)
  if (!/^[gim]*$/.test(flags)) {
    return { ok: false, error: 'Invalid flags. Only g, i, and m are allowed.' };
  }

  // 3. Compile RegExp safely
  let regex: RegExp;
  try {
    regex = new RegExp(pattern, flags);
  } catch {
    return { ok: false, error: 'Invalid regular expression. Please check your pattern.' };
  }

  const matches: RegexMatch[] = [];

  // 4. Execute deterministically based on 'g' flag
  if (flags.includes('g')) {
    // matchAll requires 'g' flag and returns an iterator of all matches with groups
    const iterator = text.matchAll(regex);
    for (const match of iterator) {
      matches.push({
        fullMatch: match[0],
        index: match.index ?? 0,
        // Map undefined groups to empty strings for consistent UI rendering
        groups: match.slice(1).map(g => g ?? ''),
      });
    }
  } else {
    // Non-global: return only the first match
    const match = regex.exec(text);
    if (match) {
      matches.push({
        fullMatch: match[0],
        index: match.index ?? 0,
        groups: match.slice(1).map(g => g ?? ''),
      });
    }
  }

  return { ok: true, data: { matches } };
}
