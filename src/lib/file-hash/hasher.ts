import type { HashAlgorithm, FileHashOutput } from './types';

export const V1_MAX_FILE_SIZE = 100 * 1024 * 1024;

function arrayBufferToHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let hex = '';
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, '0');
  }
  return hex;
}

export async function hashFile(
  file: File,
  algorithm: HashAlgorithm = 'SHA-256'
): Promise<FileHashOutput> {
  if (file.size > V1_MAX_FILE_SIZE) {
    return { 
      ok: false, 
      error: 'File is too large. Please select a file smaller than 100 MB.' 
    };
  }

  let arrayBuffer: ArrayBuffer;
  try {
    arrayBuffer = await file.arrayBuffer();
  } catch {
    return { 
      ok: false, 
      error: 'Unable to read the file. Please try again.' 
    };
  }

  try {
    const hashBuffer = await crypto.subtle.digest(algorithm, arrayBuffer);
    const hash = arrayBufferToHex(hashBuffer);
    
    return {
      ok: true,
      data: {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        algorithm,
        hash,
      },
    };
  } catch {
    return { 
      ok: false, 
      error: 'Unable to calculate the file hash. Please try again.' 
    };
  }
}