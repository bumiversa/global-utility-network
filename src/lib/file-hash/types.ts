export type HashAlgorithm = 'SHA-256' | 'SHA-384' | 'SHA-512';

export interface FileHashResult {
  fileName: string;
  fileSize: number;
  fileType: string;
  algorithm: HashAlgorithm;
  hash: string;
}

export type FileHashOutput = 
  | { ok: true; data: FileHashResult }
  | { ok: false; error: string };