export type ImageMime = 'image/jpeg' | 'image/png' | 'image/webp';

export type ValidationResult =
  | { ok: true; mime: ImageMime }
  | { ok: false; error: string };

const ALLOWED_MIMES: ImageMime[] = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB

const MIME_TO_EXTENSION: Record<ImageMime, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};

const KNOWN_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'svg', 'ico', 'tiff', 'tif'];

export function validateImageFile(file: { type: string; size: number }): ValidationResult {
  if (!ALLOWED_MIMES.includes(file.type as ImageMime)) {
    return { 
      ok: false, 
      error: 'Unsupported format. Please use JPEG, PNG, or WEBP.' 
    };
  }
  
  if (file.size > MAX_FILE_SIZE) {
    return { 
      ok: false, 
      error: 'File too large. Maximum 20MB.' 
    };
  }
  
  return { ok: true, mime: file.type as ImageMime };
}

export function getTargetFormats(sourceMime: ImageMime): ImageMime[] {
  return ALLOWED_MIMES.filter(mime => mime !== sourceMime);
}

export function getDownloadName(originalName: string, targetMime: ImageMime): string {
  const extension = MIME_TO_EXTENSION[targetMime];
  
  // Case 1: Empty filename
  if (!originalName) {
    return extension;
  }

  const lastDotIndex = originalName.lastIndexOf('.');

  // Case 2: No dot at all (e.g., "photo")
  if (lastDotIndex === -1) {
    return originalName + extension;
  }

  // Case 3: Dot is at the very beginning (e.g., ".hidden" or ".jpg")
  if (lastDotIndex === 0) {
    const potentialExt = originalName.slice(1).toLowerCase();
    
    // If it looks like just an image extension, treat basename as empty
    if (KNOWN_IMAGE_EXTENSIONS.includes(potentialExt)) {
      return extension; // e.g., ".jpg" -> ".png"
    }
    
    // Otherwise, treat it as a hidden file without extension
    return originalName + extension; // e.g., ".hidden" -> ".hidden.jpg"
  }

  // Case 4: Normal file or hidden file with extension (e.g., "photo.png" or ".hidden.png")
  const basename = originalName.substring(0, lastDotIndex);
  return basename + extension;
}