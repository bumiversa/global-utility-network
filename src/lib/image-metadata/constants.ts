// TIFF Data Types
export const TIFF_TYPES = {
  BYTE: 1,
  ASCII: 2,
  SHORT: 3,
  LONG: 4,
  RATIONAL: 5,
  UNDEFINED: 7,
} as const;

// Important EXIF Tags
export const TAGS = {
  MAKE: 0x010F,
  MODEL: 0x0110,
  ORIENTATION: 0x0112,
  DATE_TIME: 0x0132,
  EXIF_IFD_POINTER: 0x8769,
  GPS_INFO_IFD_POINTER: 0x8825,
  PIXEL_X_DIMENSION: 0xA002,
  PIXEL_Y_DIMENSION: 0xA003,
} as const;

// GPS Tags
export const GPS_TAGS = {
  LATITUDE_REF: 0x0001,
  LATITUDE: 0x0002,
  LONGITUDE_REF: 0x0003,
  LONGITUDE: 0x0004,
} as const;

// TIFF Header Constants
export const TIFF_MAGIC = 0x002A; // 42
export const TIFF_BIG_ENDIAN = 0x4D4D; // 'MM'
export const TIFF_LITTLE_ENDIAN = 0x4949; // 'II'