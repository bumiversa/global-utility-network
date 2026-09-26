export function calculateReductionPercentage(originalBytes: number, resultBytes: number): number {
  // Validasi ketat: jika salah satu tidak valid, kembalikan 0
  if (!Number.isFinite(originalBytes) || originalBytes <= 0) return 0;
  if (!Number.isFinite(resultBytes) || resultBytes < 0) return 0;

  const reduction = ((originalBytes - resultBytes) / originalBytes) * 100;
  
  // Membulatkan ke 1 desimal agar rapi di UI
  return Math.round(reduction * 10) / 10;
}

export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';
  if (!Number.isFinite(bytes) || bytes < 0) return 'Unknown';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']; // Tambah TB sebagai safety net

  // Math.min memastikan index tidak pernah melebihi panjang array sizes
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(k)), sizes.length - 1);
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
