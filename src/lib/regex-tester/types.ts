export interface RegexMatch {
  fullMatch: string;
  index: number;
  groups: string[];
}

export interface RegexTestResult {
  matches: RegexMatch[];
}

export type RegexTestOutput = 
  | { ok: true; data: RegexTestResult }
  | { ok: false; error: string };