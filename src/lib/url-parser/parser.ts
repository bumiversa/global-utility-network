import type { QueryParam, ParseResult, ReconstructResult } from './types';

export function parseUrl(input: string): ParseResult {
  const trimmed = input.trim();
  
  if (trimmed === '') {
    return { ok: false, error: 'URL cannot be empty.' };
  }

  try {
    const url = new URL(trimmed);

    const queryParams: QueryParam[] = [];
    for (const [key, value] of url.searchParams.entries()) {
      queryParams.push({ key, value });
    }

    return {
      ok: true,
      data: {
        protocol: url.protocol,
        username: url.username,
        password: url.password,
        hostname: url.hostname,
        port: url.port,
        pathname: url.pathname,
        search: url.search,
        hash: url.hash,
        origin: url.origin,
        queryParams,
      },
    };
  } catch {
    return {
      ok: false,
      error: 'Invalid URL. Please enter an absolute URL including its protocol (e.g., https://example.com).',
    };
  }
}

export function reconstructUrl(originalUrl: string, updatedParams: QueryParam[]): ReconstructResult {
  try {
    const url = new URL(originalUrl);
    
    // Clear existing query parameters
    url.search = '';
    
    // Append updated parameters
    for (const { key, value } of updatedParams) {
      url.searchParams.append(key, value);
    }
    
    return { ok: true, url: url.href };
  } catch {
    return { ok: false, error: 'Failed to reconstruct URL.' };
  }
}

export function encodeComponent(input: string): string {
  return encodeURIComponent(input);
}

export function decodeComponent(input: string): string {
  try {
    return decodeURIComponent(input);
  } catch {
    return 'Invalid encoded string';
  }
}