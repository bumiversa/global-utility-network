export type ParseResult = 
  | { ok: true; data: Record<string, string>[] }
  | { ok: false; error: string };

export type SerializeResult = 
  | { ok: true; data: string }
  | { ok: false; error: string };