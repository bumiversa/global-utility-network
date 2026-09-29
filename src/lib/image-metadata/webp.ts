import { readUint32, BinaryReaderError } from './binary';

export interface WebpContainerResult {
  width: number;
  height: number;
  tiffPayload?: Uint8Array;
}

export type WebpParseResult = 
  | { ok: true; data: WebpContainerResult }
  | { ok: false; error: string };

const CHUNK_VP8 = 0x20385056; // "VP8 "
const CHUNK_VP8L = 0x4C385056; // "VP8L"
const CHUNK_VP8X = 0x58385056; // "VP8X"
const CHUNK_EXIF = 0x46495845; // "EXIF"

function readFourCC(view: DataView, offset: number): number {
  // RIFF is always Little-Endian
  return readUint32(view, offset, true);
}

export function parseWebpContainer(buffer: ArrayBuffer): WebpParseResult {
  const bytes = new Uint8Array(buffer);
  const view = new DataView(buffer);

  // W1. Valid RIFF header
  if (bytes.length < 12) {
    return { ok: false, error: 'Invalid WEBP: File too small for RIFF header.' };
  }

  const riff = readFourCC(view, 0);
  if (riff !== 0x46464952) { // "RIFF"
    return { ok: false, error: 'Invalid WEBP: Missing RIFF header.' };
  }

  const webp = readFourCC(view, 8);
  if (webp !== 0x50424557) { // "WEBP"
    return { ok: false, error: 'Invalid WEBP: Missing WEBP signature.' };
  }

  let offset = 12;
  let width = 0;
  let height = 0;
  let tiffPayload: Uint8Array | undefined;

  try {
    while (offset + 8 <= bytes.length) {
      const fourcc = readFourCC(view, offset);
      const chunkSize = readUint32(view, offset + 4, true);

      // W2. Truncated chunk data
      const payloadStart = offset + 8;
      const payloadEnd = payloadStart + chunkSize;
      
      if (payloadEnd > bytes.length) {
        return { ok: false, error: 'Truncated WEBP chunk data.' };
      }

      if (fourcc === CHUNK_VP8) {
        // Lossy: Frame tag (3 bytes) + Signature (3 bytes: 0x9D 0x01 0x2A) + Width/Height
        if (chunkSize >= 10 && bytes[payloadStart + 3] === 0x9D && bytes[payloadStart + 4] === 0x01 && bytes[payloadStart + 5] === 0x2A) {
          // Width: 14 bits (bits 0-13 of byte 6-7)
          const wLow = bytes[payloadStart + 6];
          const wHigh = bytes[payloadStart + 7];
          width = (wLow | ((wHigh & 0x3F) << 8)) + 1;
          
          // Height: 14 bits (bits 0-13 of byte 8-9)
          const hLow = bytes[payloadStart + 8];
          const hHigh = bytes[payloadStart + 9];
          height = (hLow | ((hHigh & 0x3F) << 8)) + 1;
        }
      } 
      else if (fourcc === CHUNK_VP8L) {
        // Lossless: Signature (1 byte: 0x2F) + Width/Height (14 bits each)
        if (chunkSize >= 5 && bytes[payloadStart] === 0x2F) {
          const b1 = bytes[payloadStart + 1];
          const b2 = bytes[payloadStart + 2];
          const b3 = bytes[payloadStart + 3];
          const b4 = bytes[payloadStart + 4];
          
          width = (b1 | ((b2 & 0x3F) << 8)) + 1;
          height = (((b2 & 0xC0) >> 6) | (b3 << 2) | ((b4 & 0x0F) << 10)) + 1;
        }
      } 
      else if (fourcc === CHUNK_VP8X) {
        // Extended: Flags (1 byte) + Canvas Width (24 bits) + Canvas Height (24 bits)
        if (chunkSize >= 10) {
          const w1 = bytes[payloadStart + 4];
          const w2 = bytes[payloadStart + 5];
          const w3 = bytes[payloadStart + 6];
          width = (w1 | (w2 << 8) | (w3 << 16)) + 1;

          const h1 = bytes[payloadStart + 7];
          const h2 = bytes[payloadStart + 8];
          const h3 = bytes[payloadStart + 9];
          height = (h1 | (h2 << 8) | (h3 << 16)) + 1;
        }
      } 
      else if (fourcc === CHUNK_EXIF) {
        // EXIF chunk payload is directly the TIFF data (no "Exif\0\0" prefix like JPEG)
        if (chunkSize > 0) {
          tiffPayload = bytes.slice(payloadStart, payloadEnd);
        }
      }

      // Advance to next chunk. RIFF requires 1-byte padding if chunk size is odd.
      const nextOffset = payloadEnd + (chunkSize % 2 === 1 ? 1 : 0);
      offset = nextOffset;
    }

    if (width === 0 || height === 0) {
      return { ok: false, error: 'Could not find image dimensions (VP8/VP8L/VP8X chunk missing or invalid).' };
    }

    return { ok: true, data: { width, height, tiffPayload } };

  } catch (e) {
    if (e instanceof BinaryReaderError) {
      return { ok: false, error: e.message };
    }
    throw e;
  }
}