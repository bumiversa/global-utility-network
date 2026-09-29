import type { SerializeResult } from './types';
import { CRLF } from './constants';

function escapeCsvField(field: string): string {
  if (field.includes(',') || field.includes('\n') || field.includes('\r') || field.includes('"')) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}

export function serializeCsv(data: unknown): SerializeResult {
  // T30: Root must be array
  if (!Array.isArray(data)) {
    return { ok: false, error: 'Input must be a JSON array.' };
  }

  // T29: Array cannot be empty
  if (data.length === 0) {
    return { ok: false, error: 'JSON array is empty.' };
  }

  const firstRow = data[0];
  // T31, T32: Members must be objects
  if (typeof firstRow !== 'object' || firstRow === null || Array.isArray(firstRow)) {
    return { ok: false, error: 'Array members must be objects.' };
  }

  // T19: Header ordering based on first object
  const headers = Object.keys(firstRow);
  const rows: string[] = [headers.map(escapeCsvField).join(',')];

  for (const row of data) {
    if (typeof row !== 'object' || row === null || Array.isArray(row)) {
      return { ok: false, error: 'Array members must be objects.' };
    }

    const fields = headers.map(header => {
      const val = (row as Record<string, unknown>)[header];
      
      // Handle missing, null, or undefined
      if (val === null || val === undefined) {
        return ''; // T20, T21
      }
      
      // T24, T25: Nested objects/arrays -> JSON.stringify
      if (typeof val === 'object') {
        return escapeCsvField(JSON.stringify(val));
      }
      
      // T22, T23: Numbers/booleans -> string
      return escapeCsvField(String(val));
    });
    
    rows.push(fields.join(','));
  }

  return { ok: true, data: rows.join(CRLF) };
}