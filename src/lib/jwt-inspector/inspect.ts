export interface JwtClaims {
  exp?: {
    timestamp: number;
    date: string;
    isExpired: boolean;
  };
  iat?: {
    timestamp: number;
    date: string;
  };
  nbf?: {
    timestamp: number;
    date: string;
    isNotYetValid: boolean;
  };
  iss?: string;
  aud?: string | string[];
  sub?: string;
  jti?: string;
}

export type JwtInspectionResult =
  | {
      ok: true;
      header: Record<string, unknown>;
      payload: Record<string, unknown>;
      signature: string;
      claims: JwtClaims;
    }
  | {
      ok: false;
      error: string;
      errorType: 'invalid_structure' | 'invalid_base64url' | 'invalid_json';
    };

function base64UrlDecode(base64Url: string): string {
  try {
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const padLength = (4 - (base64.length % 4)) % 4;
    const padded = base64 + '='.repeat(padLength);

    return atob(padded);
  } catch {
    throw new Error('Invalid Base64URL');
  }
}

function formatTimestamp(timestamp: number): string {
  return new Date(timestamp * 1000).toISOString();
}

export function inspectJwt(token: string): JwtInspectionResult {
  if (typeof token !== 'string' || token.trim() === '') {
    return {
      ok: false,
      error: 'Token is empty',
      errorType: 'invalid_structure',
    };
  }

  const parts = token.trim().split('.');

  if (parts.length !== 3) {
    return {
      ok: false,
      error: 'JWT must have 3 parts (header.payload.signature)',
      errorType: 'invalid_structure',
    };
  }

  const [headerB64, payloadB64, signature] = parts;

  let headerStr: string;
  let payloadStr: string;

  try {
    headerStr = base64UrlDecode(headerB64);
    payloadStr = base64UrlDecode(payloadB64);
  } catch {
    return {
      ok: false,
      error: 'Invalid Base64URL encoding in header or payload',
      errorType: 'invalid_base64url',
    };
  }

  let header: Record<string, unknown>;
  let payload: Record<string, unknown>;

  try {
    const parsedHeader: unknown = JSON.parse(headerStr);
    const parsedPayload: unknown = JSON.parse(payloadStr);

    if (
      typeof parsedHeader !== 'object' ||
      parsedHeader === null ||
      Array.isArray(parsedHeader)
    ) {
      return {
        ok: false,
        error: 'JWT header must be a JSON object',
        errorType: 'invalid_json',
      };
    }

    if (
      typeof parsedPayload !== 'object' ||
      parsedPayload === null ||
      Array.isArray(parsedPayload)
    ) {
      return {
        ok: false,
        error: 'JWT payload must be a JSON object',
        errorType: 'invalid_json',
      };
    }

    header = parsedHeader as Record<string, unknown>;
    payload = parsedPayload as Record<string, unknown>;
  } catch {
    return {
      ok: false,
      error: 'Header or payload is not valid JSON',
      errorType: 'invalid_json',
    };
  }

  const now = Math.floor(Date.now() / 1000);
  const claims: JwtClaims = {};

  if (typeof payload.exp === 'number' && Number.isFinite(payload.exp)) {
    claims.exp = {
      timestamp: payload.exp,
      date: formatTimestamp(payload.exp),
      isExpired: payload.exp < now,
    };
  }

  if (typeof payload.iat === 'number' && Number.isFinite(payload.iat)) {
    claims.iat = {
      timestamp: payload.iat,
      date: formatTimestamp(payload.iat),
    };
  }

  if (typeof payload.nbf === 'number' && Number.isFinite(payload.nbf)) {
    claims.nbf = {
      timestamp: payload.nbf,
      date: formatTimestamp(payload.nbf),
      isNotYetValid: payload.nbf > now,
    };
  }

  if (typeof payload.iss === 'string') {
    claims.iss = payload.iss;
  }

  if (typeof payload.sub === 'string') {
    claims.sub = payload.sub;
  }

  if (typeof payload.jti === 'string') {
    claims.jti = payload.jti;
  }

  if (typeof payload.aud === 'string' || Array.isArray(payload.aud)) {
    claims.aud = payload.aud as string | string[];
  }

  return {
    ok: true,
    header,
    payload,
    signature,
    claims,
  };
}
