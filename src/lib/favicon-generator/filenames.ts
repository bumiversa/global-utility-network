/**
 * Generate standardized filename for favicon output.
 * 
 * @param size - Target dimension (e.g., 16, 32, 48, etc.)
 * @returns Filename in format "favicon-{size}x{size}.png"
 */
export function generateFaviconFilename(size: number): string {
  return `favicon-${size}x${size}.png`;
}