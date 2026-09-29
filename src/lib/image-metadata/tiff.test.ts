import { describe, expect, it } from 'vitest';
import { parseTiffPayload } from './tiff';
import { TIFF_TYPES, TAGS, GPS_TAGS } from './constants';

// Helper to build a minimal TIFF buffer
function buildTiffFixture(options: {
  isLittleEndian?: boolean;
  includeMakeModel?: boolean;
  includeGps?: boolean;
  invalidMagic?: boolean;
  truncated?: boolean;
}) {
  const isLE = options.isLittleEndian ?? true;
  const bytes: number[] = [];

  function u16(value: number): number[] {
    return isLE
      ? [value & 0xFF, (value >> 8) & 0xFF]
      : [(value >> 8) & 0xFF, value & 0xFF];
  }

  function u32(value: number): number[] {
    return isLE
      ? [
          value & 0xFF,
          (value >> 8) & 0xFF,
          (value >> 16) & 0xFF,
          (value >> 24) & 0xFF,
        ]
      : [
          (value >> 24) & 0xFF,
          (value >> 16) & 0xFF,
          (value >> 8) & 0xFF,
          value & 0xFF,
        ];
  }

  // TIFF header
  bytes.push(...(isLE ? [0x49, 0x49] : [0x4D, 0x4D]));

  if (options.invalidMagic) {
    bytes.push(0x00, 0x00);
  } else {
    bytes.push(...u16(0x002A));
  }

  // Offset to IFD0 = 8
  bytes.push(...u32(8));

  let entryCount = 0;
  if (options.includeMakeModel) entryCount += 2;
  if (options.includeGps) entryCount += 1;

  bytes.push(...u16(entryCount));

  const entries: number[] = [];
  const extraData: number[] = [];
  const extraDataOffset = 10 + (entryCount * 12) + 4;

  function addStringTag(tag: number, str: string) {
    const strBytes = Array.from(str).map((c) => c.charCodeAt(0));
    strBytes.push(0);

    const count = strBytes.length;

    let valueField: number[];

    if (count <= 4) {
      valueField = [
        ...strBytes,
        ...new Array(4 - count).fill(0),
      ];
    } else {
      const offset = extraDataOffset + extraData.length;
      valueField = u32(offset);
      extraData.push(...strBytes);
    }

    entries.push(
      ...u16(tag),
      ...u16(TIFF_TYPES.ASCII),
      ...u32(count),
      ...valueField,
    );
  }

  function addLongTag(tag: number, value: number) {
    entries.push(
      ...u16(tag),
      ...u16(TIFF_TYPES.LONG),
      ...u32(1),
      ...u32(value),
    );
  }

  if (options.includeMakeModel) {
    addStringTag(TAGS.MAKE, "Canon");
    addStringTag(TAGS.MODEL, "EOS R5");
  }

  if (options.includeGps) {
    // GPS pointer is the last IFD0 entry.
    addLongTag(TAGS.GPS_INFO_IFD_POINTER, 0);
  }

  // Next IFD pointer = 0
  entries.push(...u32(0));

  bytes.push(...entries);

  // Patch GPS pointer now that IFD0 + extra data size is known.
  if (options.includeGps) {
    const gpsPointerEntryIndex = entryCount - 1;
    const gpsPointerOffset = 10 + (gpsPointerEntryIndex * 12) + 8;
    const gpsOffsetValue = bytes.length + extraData.length;

    const pointerBytes = u32(gpsOffsetValue);

    bytes[gpsPointerOffset] = pointerBytes[0];
    bytes[gpsPointerOffset + 1] = pointerBytes[1];
    bytes[gpsPointerOffset + 2] = pointerBytes[2];
    bytes[gpsPointerOffset + 3] = pointerBytes[3];
  }

  bytes.push(...extraData);

  if (options.includeGps) {
    const gpsEntryCount = 4;

    // GPS IFD starts here.
    const gpsIfdOffset = bytes.length;

    bytes.push(...u16(gpsEntryCount));

    const gpsEntries: number[] = [];
    const gpsExtraData: number[] = [];

    const gpsExtraDataOffset =
      gpsIfdOffset + 2 + (gpsEntryCount * 12) + 4;

    // LatitudeRef = "N\0"
    gpsEntries.push(
      ...u16(GPS_TAGS.LATITUDE_REF),
      ...u16(TIFF_TYPES.ASCII),
      ...u32(2),
      0x4E, 0x00, 0x00, 0x00,
    );

    // Latitude = 7/1, 15/1, 27/1
    const latDataOffset =
      gpsExtraDataOffset + gpsExtraData.length;

    gpsEntries.push(
      ...u16(GPS_TAGS.LATITUDE),
      ...u16(TIFF_TYPES.RATIONAL),
      ...u32(3),
      ...u32(latDataOffset),
    );

    gpsExtraData.push(
      ...u32(7), ...u32(1),
      ...u32(15), ...u32(1),
      ...u32(27), ...u32(1),
    );

    // LongitudeRef = "E\0"
    gpsEntries.push(
      ...u16(GPS_TAGS.LONGITUDE_REF),
      ...u16(TIFF_TYPES.ASCII),
      ...u32(2),
      0x45, 0x00, 0x00, 0x00,
    );

    // Longitude = 112/1, 43/1, 57/1
    const longDataOffset =
      gpsExtraDataOffset + gpsExtraData.length;

    gpsEntries.push(
      ...u16(GPS_TAGS.LONGITUDE),
      ...u16(TIFF_TYPES.RATIONAL),
      ...u32(3),
      ...u32(longDataOffset),
    );

    gpsExtraData.push(
      ...u32(112), ...u32(1),
      ...u32(43), ...u32(1),
      ...u32(57), ...u32(1),
    );

    // Next IFD pointer = 0
    gpsEntries.push(...u32(0));

    bytes.push(...gpsEntries);
    bytes.push(...gpsExtraData);
  }

  if (options.truncated) {
    return new Uint8Array(
      bytes.slice(0, 6),
    ).buffer;
  }

  return new Uint8Array(bytes).buffer;
}
describe('TIFF/IFD Engine', () => {
  it('T1. Valid TIFF Little Endian + Make/Model', () => {
    const result = parseTiffPayload(new Uint8Array(buildTiffFixture({ includeMakeModel: true })));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.make).toBe('Canon');
      expect(result.data.model).toBe('EOS R5');
    }
  });

  it('T2. Valid TIFF Big Endian', () => {
    const result = parseTiffPayload(new Uint8Array(buildTiffFixture({ isLittleEndian: false, includeMakeModel: true })));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.make).toBe('Canon');
    }
  });

  it('T3. Valid TIFF with GPS data', () => {
    const result = parseTiffPayload(new Uint8Array(buildTiffFixture({ includeGps: true })));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.gps).toBeDefined();
      expect(result.data.gps!.latitudeRef).toBe('N');
      expect(result.data.gps!.longitudeRef).toBe('E');
      expect(result.data.gps!.latitude).toBeCloseTo(7.2575, 4);
      expect(result.data.gps!.longitude).toBeCloseTo(112.7325, 4);
    }
  });

  it('T4. Invalid Magic Number -> error', () => {
    const result = parseTiffPayload(new Uint8Array(buildTiffFixture({ invalidMagic: true })));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain('magic');
  });

  it('T5. Truncated payload -> error', () => {
    const result = parseTiffPayload(new Uint8Array(buildTiffFixture({ truncated: true })));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/small|bounds|offset/i);
  });

  it('T6. Empty TIFF (no tags)', () => {
    const result = parseTiffPayload(new Uint8Array(buildTiffFixture({})));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.make).toBeUndefined();
      expect(result.data.gps).toBeUndefined();
    }
  });
});