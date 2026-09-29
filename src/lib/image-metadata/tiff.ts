import { readUint16, readUint32, readAscii, readRational, gpsToDecimal, BinaryReaderError } from './binary';
import type { Rational } from './binary';
import { TAGS, GPS_TAGS, TIFF_MAGIC, TIFF_BIG_ENDIAN, TIFF_LITTLE_ENDIAN, TIFF_TYPES } from './constants';
import type { ExifData, GpsData } from './types';

export type TiffParseResult = 
  | { ok: true; data: ExifData }
  | { ok: false; error: string };

export function parseTiffPayload(payload: Uint8Array): TiffParseResult {
  const view = new DataView(payload.buffer, payload.byteOffset, payload.byteLength);
  
  if (payload.length < 8) return { ok: false, error: 'TIFF payload too small.' };

  // 1. Read Byte Order
  const byteOrder = readUint16(view, 0, false); // Read as Big Endian first to check signature
  let isLittleEndian = false;
  
  if (byteOrder === TIFF_LITTLE_ENDIAN) isLittleEndian = true;
  else if (byteOrder === TIFF_BIG_ENDIAN) isLittleEndian = false;
  else return { ok: false, error: 'Invalid TIFF byte order.' };

  // 2. Read Magic Number
  const magic = readUint16(view, 2, isLittleEndian);
  if (magic !== TIFF_MAGIC) return { ok: false, error: 'Invalid TIFF magic number.' };

  // 3. Read Offset to IFD0
  const ifd0Offset = readUint32(view, 4, isLittleEndian);
  if (ifd0Offset === 0 || ifd0Offset >= payload.length) return { ok: false, error: 'Invalid IFD0 offset.' };

  const result: ExifData = {};

  try {
    // 4. Parse IFD0 for standard tags and GPS pointer
    const ifd0Tags = parseIFD(view, ifd0Offset, isLittleEndian, payload.length);
    
    if (ifd0Tags.has(TAGS.MAKE)) result.make = readAsciiValue(view, ifd0Tags.get(TAGS.MAKE)!, isLittleEndian, payload.length);
    if (ifd0Tags.has(TAGS.MODEL)) result.model = readAsciiValue(view, ifd0Tags.get(TAGS.MODEL)!, isLittleEndian, payload.length);
    if (ifd0Tags.has(TAGS.DATE_TIME)) result.dateTime = readAsciiValue(view, ifd0Tags.get(TAGS.DATE_TIME)!, isLittleEndian, payload.length);
    
    const gpsPointerEntry = ifd0Tags.get(TAGS.GPS_INFO_IFD_POINTER);
    if (gpsPointerEntry) {
      const gpsOffset = readUint32(view, gpsPointerEntry.valueOffset, isLittleEndian);
      if (gpsOffset > 0 && gpsOffset < payload.length) {
        const gpsTags = parseIFD(view, gpsOffset, isLittleEndian, payload.length);
        const gpsData = extractGpsData(view, gpsTags, isLittleEndian, payload.length);
        if (gpsData) result.gps = gpsData;
      }
    }

    return { ok: true, data: result };
  } catch (e) {
    if (e instanceof BinaryReaderError) return { ok: false, error: e.message };
    throw e;
  }
}

interface IFDEntry {
  tag: number;
  type: number;
  count: number;
  valueOffset: number; // Offset to the value field within the 12-byte entry
}

function parseIFD(view: DataView, offset: number, isLittleEndian: boolean, limit: number): Map<number, IFDEntry> {
  const tags = new Map<number, IFDEntry>();
  
  if (offset + 2 > limit) return tags;
  
  const count = readUint16(view, offset, isLittleEndian);
  let currentOffset = offset + 2;

  for (let i = 0; i < count; i++) {
    if (currentOffset + 12 > limit) break;

    const tag = readUint16(view, currentOffset, isLittleEndian);
    const type = readUint16(view, currentOffset + 2, isLittleEndian);
    const countVal = readUint32(view, currentOffset + 4, isLittleEndian);

    // We only store entries we care about for V1
    if (
      tag === TAGS.MAKE || tag === TAGS.MODEL || tag === TAGS.DATE_TIME || 
      tag === TAGS.GPS_INFO_IFD_POINTER ||
      tag === GPS_TAGS.LATITUDE_REF || tag === GPS_TAGS.LATITUDE ||
      tag === GPS_TAGS.LONGITUDE_REF || tag === GPS_TAGS.LONGITUDE
    ) {
      tags.set(tag, { tag, type, count: countVal, valueOffset: currentOffset + 8 });
    }

    currentOffset += 12;
  }
  
  return tags;
}

function readAsciiValue(view: DataView, entry: IFDEntry, isLittleEndian: boolean, limit: number): string {
  if (entry.type !== TIFF_TYPES.ASCII) return '';
  
  if (entry.count <= 4) {
    // Value is inline in the entry
    let str = '';
    for (let i = 0; i < entry.count; i++) {
      const byte = view.getUint8(entry.valueOffset + i);
      if (byte === 0) break;
      str += String.fromCharCode(byte);
    }
    return str.trim();
  } else {
    // Value is an offset
    const strOffset = readUint32(view, entry.valueOffset, isLittleEndian);
    if (strOffset < limit) {
      return readAscii(view, strOffset, entry.count);
    }
  }
  return '';
}

function extractGpsData(view: DataView, tags: Map<number, IFDEntry>, isLittleEndian: boolean, limit: number): GpsData | null {
  const latRefEntry = tags.get(GPS_TAGS.LATITUDE_REF);
  const latEntry = tags.get(GPS_TAGS.LATITUDE);
  const longRefEntry = tags.get(GPS_TAGS.LONGITUDE_REF);
  const longEntry = tags.get(GPS_TAGS.LONGITUDE);

  if (!latRefEntry || !latEntry || !longRefEntry || !longEntry) return null;

  const latRef = readAsciiValue(view, latRefEntry, isLittleEndian, limit);
  const longRef = readAsciiValue(view, longRefEntry, isLittleEndian, limit);

  if (latRef !== 'N' && latRef !== 'S') return null;
  if (longRef !== 'E' && longRef !== 'W') return null;

  const latRationals = readRationalArray(view, latEntry, isLittleEndian, limit);
  const longRationals = readRationalArray(view, longEntry, isLittleEndian, limit);

  if (latRationals.length !== 3 || longRationals.length !== 3) return null;

  const latitude = gpsToDecimal(latRationals[0], latRationals[1], latRationals[2], latRef);
  const longitude = gpsToDecimal(longRationals[0], longRationals[1], longRationals[2], longRef);

  return { latitude, longitude, latitudeRef: latRef as 'N' | 'S', longitudeRef: longRef as 'E' | 'W' };
}

function readRationalArray(view: DataView, entry: IFDEntry, isLittleEndian: boolean, limit: number): Rational[] {
  if (entry.type !== TIFF_TYPES.RATIONAL) return [];
  
  const rationals: Rational[] = [];
  // If count <= 1, value is inline (but rational is 8 bytes, so it's always an offset if count >= 1)
  // Actually, if count * 8 <= 4, it's inline. But rational is 8 bytes, so it's always an offset for count >= 1.
  
  const dataOffset = readUint32(view, entry.valueOffset, isLittleEndian);
  
  for (let i = 0; i < entry.count; i++) {
    const offset = dataOffset + (i * 8);
    if (offset + 8 > limit) break;
    rationals.push(readRational(view, offset, isLittleEndian));
  }
  
  return rationals;
}