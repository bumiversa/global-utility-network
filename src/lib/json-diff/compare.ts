import { diffJson } from "./diff";
import { parseJson } from "@/lib/json/parse-json";
import type { JsonDiffEntry } from "./types";

export type JsonCompareResult =
  | {
      ok: true;
      entries: JsonDiffEntry[];
    }
  | {
      ok: false;
      side: "before" | "after";
      error: string;
    };

export function compareJson(
  beforeInput: string,
  afterInput: string,
): JsonCompareResult {
  const before = parseJson(beforeInput);

  if (!before.ok) {
    return {
      ok: false,
      side: "before",
      error: before.error,
    };
  }

  const after = parseJson(afterInput);

  if (!after.ok) {
    return {
      ok: false,
      side: "after",
      error: after.error,
    };
  }

  return {
    ok: true,
    entries: diffJson(before.value, after.value),
  };
}
