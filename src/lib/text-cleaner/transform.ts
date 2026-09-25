export type TextCleanerResult = {
  ok: true;
  value: string;
  stats: {
    originalLines: number;
    cleanedLines: number;
    duplicatesRemoved: number;
    emptyLinesRemoved: number;
  };
};

export function cleanText(
  input: string,
  options: {
    removeDuplicates: boolean;
    trimLines: boolean;
    removeEmptyLines: boolean;
    sortLines: boolean;
  }
): TextCleanerResult {
  if (!input || input.trim() === "") {
    return {
      ok: true,
      value: "",
      stats: { originalLines: 0, cleanedLines: 0, duplicatesRemoved: 0, emptyLinesRemoved: 0 },
    };
  }

  const originalLines = input.split(/\r?\n/);
  let lines = [...originalLines];
  let emptyLinesRemoved = 0;
  let duplicatesRemoved = 0;

  if (options.trimLines) {
    lines = lines.map((line) => line.trim());
  }

  if (options.removeEmptyLines) {
    const beforeLength = lines.length;
    lines = lines.filter((line) => line.length > 0);
    emptyLinesRemoved = beforeLength - lines.length;
  }

  if (options.removeDuplicates) {
    const beforeLength = lines.length;
    // Menggunakan Set untuk menghapus duplikat, menjaga urutan pertama kali muncul
    lines = Array.from(new Set(lines));
    duplicatesRemoved = beforeLength - lines.length;
  }

  if (options.sortLines) {
    lines.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
  }

  return {
    ok: true,
    value: lines.join("\n"),
    stats: {
      originalLines: originalLines.length,
      cleanedLines: lines.length,
      duplicatesRemoved,
      emptyLinesRemoved,
    },
  };
}
