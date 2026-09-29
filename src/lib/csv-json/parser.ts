import type { ParseResult } from './types';
import { BOM } from './constants';

export function parseCsv(csv: string): ParseResult {
  let text = csv;
  
  // T16: Strip UTF-8 BOM if present
  if (text.startsWith(BOM)) {
    text = text.slice(1);
  }

  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (inQuotes) {
      if (char === '"' && nextChar === '"') {
        // T6: Escaped double quote
        currentField += '"';
        i++; // skip next quote
      } else if (char === '"') {
        inQuotes = false;
      } else {
        currentField += char; // T4, T5: Comma/newline inside quotes preserved
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        currentRow.push(currentField);
        currentField = '';
      } else if (char === '\r' && nextChar === '\n') {
        currentRow.push(currentField);
        rows.push(currentRow);
        currentRow = [];
        currentField = '';
        i++; // skip \n
      } else if (char === '\n') {
        // T8: LF line ending
        currentRow.push(currentField);
        rows.push(currentRow);
        currentRow = [];
        currentField = '';
      } else {
        currentField += char;
      }
    }
  }

  // Handle EOF
  if (inQuotes) {
    // T14: Unterminated quote
    return { ok: false, error: 'Unterminated quote in CSV.' };
  }
  
  // Push final field/row ONLY if there is pending data
  // This prevents adding an extra empty column if the file ended with a delimiter or newline
  if (currentRow.length > 0 || currentField !== '') {
    currentRow.push(currentField);
    rows.push(currentRow);
  }

  // Validation
  if (rows.length === 0 || (rows.length === 1 && rows[0].length === 1 && rows[0][0] === '')) {
    // T13 / Empty input
    return { ok: false, error: 'CSV is empty or missing header.' };
  }

  const headers = rows[0];
  
  // T13: Empty header
  if (headers.some(h => h === '')) {
    return { ok: false, error: 'Empty header name found.' };
  }

  // T12: Duplicate header
  const uniqueHeaders = new Set(headers);
  if (uniqueHeaders.size !== headers.length) {
    return { ok: false, error: 'Duplicate header names found.' };
  }

  // T11: Inconsistent column count
  const expectedCols = headers.length;
  for (let i = 1; i < rows.length; i++) {
    if (rows[i].length !== expectedCols) {
      return { ok: false, error: `Inconsistent column count at row ${i + 1}. Expected ${expectedCols}, got ${rows[i].length}.` };
    }
  }

  // Map to objects (All values remain strings - No type inference)
  const result: Record<string, string>[] = [];
  for (let i = 1; i < rows.length; i++) {
    const obj: Record<string, string> = {};
    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = rows[i][j];
    }
    result.push(obj);
  }

  return { ok: true, data: result };
}