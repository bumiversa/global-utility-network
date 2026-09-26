import QRCode from "qrcode";

export type GenerateQrResult =
  | {
      ok: true;
      dataUrl: string;
    }
  | {
      ok: false;
      error: string;
    };

export async function generateQrCode(
  input: string
): Promise<GenerateQrResult> {
  const value = input.trim();

  if (!value) {
    return {
      ok: false,
      error: "Please enter text or a URL.",
    };
  }

  try {
    const dataUrl = await QRCode.toDataURL(value, {
      type: "image/png",
    });

    return {
      ok: true,
      dataUrl,
    };
  } catch {
    return {
      ok: false,
      error: "Failed to generate QR code.",
    };
  }
}
