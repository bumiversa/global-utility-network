export type JsonParseResult =
  | {
      ok: true;
      value: unknown;
    }
  | {
      ok: false;
      error: string;
    };

export function parseJson(input: string): JsonParseResult {
  try {
    return {
      ok: true,
      value: JSON.parse(input),
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Invalid JSON",
    };
  }
}
