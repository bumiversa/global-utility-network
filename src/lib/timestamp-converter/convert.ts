export type TimestampUnit = 'seconds' | 'milliseconds';

export type TimestampToDateResult =
  | { ok: true; utc: string; local: string }
  | { ok: false; error: string };

export type DateToTimestampResult =
  | { ok: true; seconds: number; milliseconds: number }
  | { ok: false; error: string };

// Format Date ke "YYYY-MM-DD HH:mm:ss" menggunakan browser local timezone
function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// Parse format datetime-local (YYYY-MM-DDTHH:mm atau YYYY-MM-DDTHH:mm:ss)
// Menganggap input sebagai browser local timezone
function parseLocalDateTime(dateString: string): Date | null {
  // Validasi format dasar
  const match = dateString.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/);
  if (!match) return null;

  const [, year, month, day, hours, minutes, seconds] = match;
  const date = new Date(
    parseInt(year, 10),
    parseInt(month, 10) - 1,
    parseInt(day, 10),
    parseInt(hours, 10),
    parseInt(minutes, 10),
    seconds ? parseInt(seconds, 10) : 0
  );

  // Validasi Date object
  if (!Number.isFinite(date.getTime())) return null;

  return date;
}

export function timestampToDate(
  timestamp: number,
  unit: TimestampUnit
): TimestampToDateResult {
  // 1. Validasi input
  if (!Number.isFinite(timestamp)) {
    return { ok: false, error: "Timestamp must be a valid finite number." };
  }

  // 2. Konversi ke milliseconds
  const milliseconds = unit === 'seconds' ? timestamp * 1000 : timestamp;

  // 3. Buat Date object
  const date = new Date(milliseconds);

  // 4. Validasi Date object (finite invariant)
  if (!Number.isFinite(date.getTime())) {
    return { ok: false, error: "Timestamp is outside the supported date range." };
  }

  // 5. Format output
  const utc = date.toISOString();
  const local = formatLocalDate(date);

  return { ok: true, utc, local };
}

export function dateToTimestamp(dateString: string): DateToTimestampResult {
  // 1. Validasi input string
  if (!dateString || dateString.trim() === '') {
    return { ok: false, error: "Please enter a valid date and time." };
  }

  // 2. Parse date string (format datetime-local, dianggap sebagai local timezone)
  const date = parseLocalDateTime(dateString);
  if (!date) {
    return { ok: false, error: "Invalid date format. Please use YYYY-MM-DDTHH:mm or YYYY-MM-DDTHH:mm:ss" };
  }

  // 3. Hitung timestamp
  const milliseconds = date.getTime();
  
  // Rounding semantics: Math.floor() untuk negative timestamps
  // Contoh: -500ms → floor(-0.5) → -1 detik (1 detik sebelum epoch)
  // Ini konsisten dengan definisi Unix timestamp sebagai "jumlah detik lengkap sejak epoch"
  const seconds = Math.floor(milliseconds / 1000);

  return { ok: true, seconds, milliseconds };
}