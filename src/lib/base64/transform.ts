export type Base64Result =
  | { ok: true; value: string }
  | { ok: false; error: string };

// Robust UTF-8 Base64 Encode
export function encodeBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  const binString = Array.from(bytes, (byte) => String.fromCodePoint(byte)).join("");
  return btoa(binString);
}

// Robust UTF-8 Base64 Decode
export function decodeBase64(base64: string): Base64Result {
  try {
    const binString = atob(base64);
    const bytes = Uint8Array.from(binString, (m) => m.codePointAt(0)!);
    return { ok: true, value: new TextDecoder().decode(bytes) };
  } catch {
    return { ok: false, error: "Invalid Base64 string" };
  }
}

// Robust UTF-8 Base64URL Encode
export function encodeBase64Url(text: string): string {
  return encodeBase64(text).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// Robust UTF-8 Base64URL Decode
export function decodeBase64Url(base64Url: string): Base64Result {
  // Restore standard Base64 padding and characters
  let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const padLength = (4 - (base64.length % 4)) % 4;
  base64 += "=".repeat(padLength);

  return decodeBase64(base64);
}
