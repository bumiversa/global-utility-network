export interface QueryParam {
  key: string;
  value: string;
}

export interface ParsedUrl {
  protocol: string;
  username: string;
  password: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
  origin: string;
  queryParams: QueryParam[];
}

export type ParseResult =
  | { ok: true; data: ParsedUrl }
  | { ok: false; error: string };

export type ReconstructResult =
  | { ok: true; url: string }
  | { ok: false; error: string };