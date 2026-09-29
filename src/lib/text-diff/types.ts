export type DiffType = 'added' | 'removed' | 'unchanged';

export interface DiffLine {
  type: DiffType;
  value: string;
}

export interface DiffOptions {
  caseSensitive: boolean;
  ignoreTrailingWhitespace: boolean;
}

export type DiffResult = 
  | { ok: true; diff: DiffLine[] }
  | { ok: false; error: string };