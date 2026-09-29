import { readUint16, BinaryReaderError } from './binary';

export interface JpegContainerResult {
  width: number;
  height: number;
  tiffPayload?: Uint8Array;
}

export type JpegParseResult = 
  | { ok: true; data: JpegContainerResult }
  | { ok: false; error: string };

const MARKER_SOI = 0xD8;
const MARKER_SOF0 = 0xC0;
const MARKER_SOF2 = 0xC2;
const MARKER_APP1 = 0xE1;
const MARKER_SOS = 0xDA;

const EXIF_SIGNATURE = [0x45, 0x78, 0x69, 0x66, 0x00, 0x00]; // "Exif\0\0"

export function parseJpegContainer(buffer: ArrayBuffer): JpegParseResult {
  const bytes = new Uint8Array(buffer);
  const view = new DataView(buffer);

  if (bytes.length < 2 || bytes[0] !== 0xFF || bytes[1] !== MARKER_SOI) {
    return { ok: false, error: 'Invalid JPEG: Missing SOI marker.' };
  }

  let offset = 2;
  let width = 0;
  let height = 0;
  let tiffPayload: Uint8Array | undefined;

  try {
    while (offset < bytes.length) {
      if (bytes[offset] !== 0xFF) {
        return { ok: false, error: `Invalid JPEG marker prefix at offset ${offset}.` };
      }

      // Skip any fill bytes (0xFF)
      let markerOffset = offset;
      while (markerOffset < bytes.length && bytes[markerOffset] === 0xFF) {
        markerOffset++;
      }

      if (markerOffset >= bytes.length) {
        return { ok: false, error: 'Truncated JPEG marker.' };
      }

      const marker = bytes[markerOffset];

      // SOS marks the beginning of compressed image data.
      if (marker === MARKER_SOS) {
        if (markerOffset + 3 > bytes.length) {
          return { ok: false, error: 'Truncated SOS segment length.' };
        }
        const length = readUint16(view, markerOffset + 1, false);
        if (length < 2) {
          return { ok: false, error: `Invalid segment length: ${length}.` };
        }
        if (markerOffset + 1 + length > bytes.length) {
          return { ok: false, error: 'Truncated segment data.' };
        }
        break;
      }

      // Standalone markers (EOI, RST0-RST7, TEM)
      if (marker === 0xD9 || (marker >= 0xD0 && marker <= 0xD7) || marker === 0x01) {
        offset = markerOffset + 1;
        continue;
      }

      // Segments with length
      // We need markerOffset (1 byte) + length field (2 bytes)
      if (markerOffset + 3 > bytes.length) {
        return { ok: false, error: 'Truncated segment length.' };
      }

      const length = readUint16(view, markerOffset + 1, false);

      if (length < 2) {
        return { ok: false, error: `Invalid segment length: ${length}.` };
      }

      // We need markerOffset (1 byte) + length field (2 bytes) + payload (length - 2 bytes)
      // Total = markerOffset + 1 + length
      if (markerOffset + 1 + length > bytes.length) {
        return { ok: false, error: 'Truncated segment data.' };
      }

      if (marker === MARKER_SOF0 || marker === MARKER_SOF2) {
        if (length < 7) {
          return { ok: false, error: 'Invalid SOF segment length.' };
        }
        height = readUint16(view, markerOffset + 4, false);
        width = readUint16(view, markerOffset + 6, false);
      } else if (marker === MARKER_APP1) {
        const payloadStart = markerOffset + 3;
        const payloadLength = length - 2;

        if (payloadLength >= 7) {
          let isExif = true;
          for (let i = 0; i < EXIF_SIGNATURE.length; i++) {
            if (bytes[payloadStart + i] !== EXIF_SIGNATURE[i]) {
              isExif = false;
              break;
            }
          }

          if (isExif) {
            const tiffStart = payloadStart + EXIF_SIGNATURE.length;
            const tiffLength = payloadLength - EXIF_SIGNATURE.length;

            if (tiffLength === 0) {
              return { ok: false, error: 'EXIF APP1 contains no TIFF payload.' };
            }

            tiffPayload = bytes.slice(tiffStart, tiffStart + tiffLength);
          }
        }
      }

      // Advance to the next marker. 
      // The current segment started at `offset` (the first 0xFF).
      // Its total size is 2 (for 0xFF and marker) + length.
      offset = offset + 2 + length;
    }

    if (width === 0 || height === 0) {
      return { ok: false, error: 'Could not find image dimensions (SOF marker missing).' };
    }

    return { ok: true, data: { width, height, tiffPayload } };

  } catch (e) {
    if (e instanceof BinaryReaderError) {
      return { ok: false, error: e.message };
    }
    throw e;
  }
}