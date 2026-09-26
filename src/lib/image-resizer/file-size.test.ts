import { describe, it, expect } from 'vitest';
import { calculateReductionPercentage, formatBytes } from './file-size';

describe('Image Resizer File Size Logic', () => {
  it('1. Standard 50% reduction', () => {
    const result = calculateReductionPercentage(1048576, 524288);
    expect(result).toBe(50);
  });

  it('2. 0% reduction (same size)', () => {
    const result = calculateReductionPercentage(1000, 1000);
    expect(result).toBe(0);
  });

  it('3. Negative reduction (file became larger)', () => {
    const result = calculateReductionPercentage(1048576, 2097152);
    expect(result).toBe(-100);
  });

  it('4. Invalid inputs return 0', () => {
    expect(calculateReductionPercentage(0, 500)).toBe(0);
    expect(calculateReductionPercentage(-100, 500)).toBe(0);
    expect(calculateReductionPercentage(1000, NaN)).toBe(0);
    expect(calculateReductionPercentage(1000, -50)).toBe(0);
  });

  it('5. Format bytes: KB and MB', () => {
    expect(formatBytes(1024)).toBe('1 KB');
    expect(formatBytes(1536)).toBe('1.5 KB');
    expect(formatBytes(1048576)).toBe('1 MB');
    expect(formatBytes(2840000)).toBe('2.71 MB');
  });

  it('6. Format bytes: Edge cases (0, NaN, Negative)', () => {
    expect(formatBytes(0)).toBe('0 Bytes');
    expect(formatBytes(NaN)).toBe('Unknown');
    expect(formatBytes(-100)).toBe('Unknown');
  });

  it('7. Format bytes: Large sizes (GB and beyond)', () => {
    // 5 GB
    expect(formatBytes(5 * 1024 * 1024 * 1024)).toBe('5 GB');
    // 1000 GB (should safely cap at TB or highest defined unit without undefined)
    expect(formatBytes(1000 * 1024 * 1024 * 1024)).toBe('1000 GB'); 
  });
});
