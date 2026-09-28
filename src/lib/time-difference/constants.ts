// Strict ISO 8601 date-time with timezone pattern
// Accepts: 2026-09-28T10:00:00Z, 2026-09-28T10:00:00+07:00, 2026-09-28T10:00:00.123Z
export const ISO_8601_WITH_TIMEZONE_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/;

// Time unit constants in milliseconds
export const MS_PER_SECOND = 1000;
export const MS_PER_MINUTE = 60000;
export const MS_PER_HOUR = 3600000;
export const MS_PER_DAY = 86400000;