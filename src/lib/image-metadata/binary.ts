export class BinaryReaderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BinaryReaderError';
  }
}

function checkBounds(view: DataView, offset: number, length: number): void {
  if (length < 0) {
    throw new BinaryReaderError(`Negative length: ${length}`);
  }
  if (offset < 0 || offset + length > view.byteLength) {
    throw new BinaryReaderError(
      `Out of bounds read: offset ${offset}, length ${length}, buffer size ${view.byteLength}`
    );
  }
}

export function readUint16(view: DataView, offset: number, isLittleEndian: boolean): number {
  checkBounds(view, offset, 2);
  return view.getUint16(offset, isLittleEndian);
}

export function readUint32(view: DataView, offset: number, isLittleEndian: boolean): number {
  checkBounds(view, offset, 4);
  return view.getUint32(offset, isLittleEndian);
}

export function readAscii(view: DataView, offset: number, length: number): string {
  checkBounds(view, offset, length);
  
  let str = '';
  for (let i = 0; i < length; i++) {
    const byte = view.getUint8(offset + i);
    if (byte === 0) break;
    str += String.fromCharCode(byte);
  }
  return str.trim();
}

export interface Rational {
  numerator: number;
  denominator: number;
}

export function readRational(view: DataView, offset: number, isLittleEndian: boolean): Rational {
  checkBounds(view, offset, 8);
  const numerator = view.getUint32(offset, isLittleEndian);
  const denominator = view.getUint32(offset + 4, isLittleEndian);
  return { numerator, denominator };
}

export function gpsToDecimal(
  degrees: Rational,
  minutes: Rational,
  seconds: Rational,
  ref: string
): number {
  // Strict validation of GPS Reference
  if (ref !== 'N' && ref !== 'S' && ref !== 'E' && ref !== 'W') {
    throw new BinaryReaderError(`Invalid GPS reference: '${ref}'`);
  }

  // Safe division (avoid NaN)
  const d = degrees.denominator !== 0 ? degrees.numerator / degrees.denominator : 0;
  const m = minutes.denominator !== 0 ? minutes.numerator / minutes.denominator : 0;
  const s = seconds.denominator !== 0 ? seconds.numerator / seconds.denominator : 0;
  
  let decimal = d + m / 60 + s / 3600;
  if (ref === 'S' || ref === 'W') {
    decimal = -decimal;
  }
  return decimal;
}