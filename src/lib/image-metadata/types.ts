export interface GpsData {
  latitude: number;
  longitude: number;
  latitudeRef: 'N' | 'S';
  longitudeRef: 'E' | 'W';
}

export interface ExifData {
  make?: string;
  model?: string;
  dateTime?: string;
  gps?: GpsData;
}

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface ImageMetadataResult {
  fileInfo: {
    name: string;
    size: number;
    mimeType: string;
  };
  dimensions: ImageDimensions;
  exif?: ExifData;
}

export type MetadataParseResult = 
  | { ok: true; data: ImageMetadataResult }
  | { ok: false; error: string };