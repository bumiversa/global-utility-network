import type { JsonDiffEntry } from "./types";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function valueType(value: unknown): string {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
}

function joinPath(base: string, key: string | number): string {
  if (base === "") {
    return typeof key === "number" ? `[${key}]` : key;
  }

  return typeof key === "number"
    ? `${base}[${key}]`
    : `${base}.${key}`;
}

export function diffJson(
  before: unknown,
  after: unknown,
  path = "",
): JsonDiffEntry[] {
  const beforeType = valueType(before);
  const afterType = valueType(after);

  if (beforeType !== afterType) {
    return [
      {
        path: path || "$",
        kind: "type-changed",
        before,
        after,
      },
    ];
  }

  if (isObject(before) && isObject(after)) {
    const entries: JsonDiffEntry[] = [];
    const keys = new Set([...Object.keys(before), ...Object.keys(after)]);

    for (const key of keys) {
      const childPath = joinPath(path, key);

      if (!(key in before)) {
        entries.push({
          path: childPath,
          kind: "added",
          after: after[key],
        });
        continue;
      }

      if (!(key in after)) {
        entries.push({
          path: childPath,
          kind: "removed",
          before: before[key],
        });
        continue;
      }

      entries.push(...diffJson(before[key], after[key], childPath));
    }

    return entries;
  }

  if (Array.isArray(before) && Array.isArray(after)) {
    const entries: JsonDiffEntry[] = [];
    const length = Math.max(before.length, after.length);

    for (let index = 0; index < length; index += 1) {
      const childPath = joinPath(path, index);

      if (index >= before.length) {
        entries.push({
          path: childPath,
          kind: "added",
          after: after[index],
        });
        continue;
      }

      if (index >= after.length) {
        entries.push({
          path: childPath,
          kind: "removed",
          before: before[index],
        });
        continue;
      }

      entries.push(...diffJson(before[index], after[index], childPath));
    }

    return entries;
  }

  if (!Object.is(before, after)) {
    return [
      {
        path: path || "$",
        kind: "changed",
        before,
        after,
      },
    ];
  }

  return [];
}
