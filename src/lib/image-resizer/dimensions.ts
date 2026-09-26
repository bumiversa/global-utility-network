export function calculateDimensions(
  originalWidth: number,
  originalHeight: number,
  targetWidth: number | null,
  targetHeight: number | null,
  lockAspectRatio: boolean
): { width: number; height: number } {
  // 1. Validasi input asli
  if (
    originalWidth <= 0 ||
    originalHeight <= 0 ||
    !Number.isFinite(originalWidth) ||
    !Number.isFinite(originalHeight)
  ) {
    throw new Error("Invalid original dimensions");
  }

  // 2. Jika aspect ratio dikunci
  if (lockAspectRatio) {
    const ratio = originalWidth / originalHeight;
    
    // Prioritaskan targetWidth jika ada dan valid
    if (targetWidth !== null && targetWidth > 0 && Number.isFinite(targetWidth)) {
      return {
        width: Math.round(targetWidth),
        height: Math.round(targetWidth / ratio),
      };
    }
    
    // Jika tidak, gunakan targetHeight
    if (targetHeight !== null && targetHeight > 0 && Number.isFinite(targetHeight)) {
      return {
        width: Math.round(targetHeight * ratio),
        height: Math.round(targetHeight),
      };
    }
  }

  // 3. Jika aspect ratio tidak dikunci, gunakan nilai yang diberikan atau fallback ke asli
  const finalWidth =
    targetWidth !== null && targetWidth > 0 && Number.isFinite(targetWidth)
      ? Math.round(targetWidth)
      : originalWidth;

  const finalHeight =
    targetHeight !== null && targetHeight > 0 && Number.isFinite(targetHeight)
      ? Math.round(targetHeight)
      : originalHeight;

  return { width: finalWidth, height: finalHeight };
}
