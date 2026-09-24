import { parseJson } from "@/lib/json/parse-json";

export function formatJson(input: string): { ok: true; value: string } | { ok: false; error: string } {
  const parsed = parseJson(input);
  if (!parsed.ok) return parsed;
  return { ok: true, value: JSON.stringify(parsed.value, null, 2) };
}

export function minifyJson(input: string): { ok: true; value: string } | { ok: false; error: string } {
  const parsed = parseJson(input);
  if (!parsed.ok) return parsed;
  return { ok: true, value: JSON.stringify(parsed.value) };
}
