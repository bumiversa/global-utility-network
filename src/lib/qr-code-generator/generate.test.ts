import { describe, expect, it } from "vitest";
import { generateQrCode } from "./generate";

describe("generateQrCode", () => {
  it("rejects empty input", async () => {
    const result = await generateQrCode("");

    expect(result).toEqual({
      ok: false,
      error: "Please enter text or a URL.",
    });
  });

  it("rejects whitespace-only input", async () => {
    const result = await generateQrCode("   ");

    expect(result).toEqual({
      ok: false,
      error: "Please enter text or a URL.",
    });
  });

  it("generates a QR code for plain text", async () => {
    const result = await generateQrCode("Hello BUMIVERSA");

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.dataUrl).toMatch(/^data:image\/png;base64,/);
    }
  });

  it("generates a QR code for a URL", async () => {
    const result = await generateQrCode("https://bumiversa.dev");

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.dataUrl).toMatch(/^data:image\/png;base64,/);
    }
  });

  it("trims surrounding whitespace before generation", async () => {
    const trimmed = await generateQrCode("BUMIVERSA");
    const padded = await generateQrCode("  BUMIVERSA  ");

    expect(trimmed).toEqual(padded);
  });
});
