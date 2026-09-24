export type JsonDiffKind =
  | "added"
  | "removed"
  | "changed"
  | "type-changed";

export type JsonDiffEntry = {
  path: string;
  kind: JsonDiffKind;
  before?: unknown;
  after?: unknown;
};
