import type { MetadataParseResult } from './types';
import { parseJpegContainer } from './jpeg';
import { parseWebpContainer } from './webp';
import { parseTiffPayload } from './tiff';

export async function parseImageMetadata(file: File): Promise<MetadataParseResult> {
  // 1. Validate MIME type
  if (file.type !== 'image/jpeg' && file.type !== 'image/webp') {
    return { 
      ok: false, 
      error: 'Unsupported file type. Only JPEG and WEBP are supported in V1.' 
    };
  }

  try {
    // 2. Read file as ArrayBuffer
    const buffer = await file.arrayBuffer();

    // 3. Route to appropriate container parser
    let containerResult;
    if (file.type === 'image/jpeg') {
      containerResult = parseJpegContainer(buffer);
    } else {
      containerResult = parseWebpContainer(buffer);
    }

    if (!containerResult.ok) {
      return { ok: false, error: containerResult.error };
    }

    const { width, height, tiffPayload } = containerResult.data;

    // 4. Parse TIFF payload if present
    let exifData = undefined;
    if (tiffPayload && tiffPayload.length > 0) {
      const tiffResult = parseTiffPayload(tiffPayload);
      if (tiffResult.ok) {
        // Filter out empty/undefined values for cleaner output
        const data = tiffResult.data;
        exifData = {
          ...(data.make && { make: data.make }),
          ...(data.model && { model: data.model }),
          ...(data.dateTime && { dateTime: data.dateTime }),
          ...(data.gps && { gps: data.gps }),
        };
        
        // If object is empty after filtering, set to undefined
        if (Object.keys(exifData).length === 0) {
          exifData = undefined;
        }
      }
      // Note: If TIFF parsing fails (e.g., malformed EXIF), we do NOT fail the whole operation.
      // We just return the dimensions and omit the EXIF data. This is a graceful degradation.
    }

    // 5. Return normalized result
    return {
      ok: true,
      data: {
        fileInfo: {
          name: file.name,
          size: file.size,
          mimeType: file.type,
        },
        dimensions: { width, height },
        ...(exifData && { exif: exifData }),
      },
    };

  } catch (e) {
    return { 
      ok: false, 
      error: e instanceof Error ? e.message : 'Failed to read file.' 
    };
  }
}