import type { DiffLine, DiffOptions, DiffResult } from './types';
import { MAX_LINES, MAX_DIFF_STEPS } from './constants';

function splitLines(text: string): string[] {
  if (text === '') return [];
  return text.split(/\r?\n/);
}

function normalizeLine(line: string, options: DiffOptions): string {
  let normalized = line;

  if (options.ignoreTrailingWhitespace) {
    normalized = normalized.replace(/[ \t]+$/, '');
  }

  if (!options.caseSensitive) {
    normalized = normalized.toLowerCase();
  }

  return normalized;
}

export function computeDiff(
  textA: string,
  textB: string,
  options: DiffOptions,
): DiffResult {
  const linesA = splitLines(textA);
  const linesB = splitLines(textB);

  if (linesA.length > MAX_LINES || linesB.length > MAX_LINES) {
    return {
      ok: false,
      error: `Text exceeds the maximum limit of ${MAX_LINES} lines for performance reasons.`,
    };
  }

  const N = linesA.length;
  const M = linesB.length;
  const maxD = N + M;

  // v[k] = furthest x reached on diagonal k.
  // Array index is k + maxD so negative k values are supported.
  const v = new Int32Array(2 * maxD + 1);
  v.fill(-1);
  v[1 + maxD] = 0;

  // trace[d] stores the completed frontier after edit distance d.
  const trace: Int32Array[] = [];

  let workUnits = 0;

  for (let d = 0; d <= maxD; d++) {
    for (let k = -d; k <= d; k += 2) {
      workUnits++;

      if (workUnits > MAX_DIFF_STEPS) {
        return {
          ok: false,
          error:
            'Text is too complex or large for browser diff. Please reduce the size or differences.',
        };
      }

      const kIdx = k + maxD;

      let x: number;

      if (k === -d || (k !== d && v[kIdx - 1] < v[kIdx + 1])) {
        // Down: insertion from B.
        x = v[kIdx + 1];
      } else {
        // Right: deletion from A.
        x = v[kIdx - 1] + 1;
      }

      let y = x - k;

      // Snake through all matching lines.
      while (x < N && y < M) {
        workUnits++;

        if (workUnits > MAX_DIFF_STEPS) {
          return {
            ok: false,
            error:
              'Text is too complex or large for browser diff. Please reduce the size or differences.',
          };
        }

        const normA = normalizeLine(linesA[x], options);
        const normB = normalizeLine(linesB[y], options);

        if (normA !== normB) {
          break;
        }

        x++;
        y++;
      }

      v[kIdx] = x;

      if (x >= N && y >= M) {
        trace.push(new Int32Array(v));

        return {
          ok: true,
          diff: backtrack(linesA, linesB, trace, maxD, d),
        };
      }
    }

    // Save the completed frontier for this edit distance.
    trace.push(new Int32Array(v));
  }

  return {
    ok: false,
    error: 'Diff calculation failed.',
  };
}

function backtrack(
  linesA: string[],
  linesB: string[],
  trace: Int32Array[],
  maxD: number,
  finalD: number,
): DiffLine[] {
  const diff: DiffLine[] = [];

  let x = linesA.length;
  let y = linesB.length;

  for (let d = finalD; d > 0; d--) {
    // trace[d - 1] is the frontier from which the d-th edit was made.
    const previousV = trace[d - 1];
    const k = x - y;
    const kIdx = k + maxD;

    let previousK: number;

    if (
      k === -d ||
      (k !== d && previousV[kIdx - 1] < previousV[kIdx + 1])
    ) {
      // Current path came from an insertion in B.
      previousK = k + 1;
    } else {
      // Current path came from a deletion in A.
      previousK = k - 1;
    }

    const previousKIdx = previousK + maxD;
    const previousX = previousV[previousKIdx];
    const previousY = previousX - previousK;

    // Walk backwards through the matching "snake".
    while (x > previousX && y > previousY) {
      diff.unshift({
        type: 'unchanged',
        value: linesA[x - 1],
      });

      x--;
      y--;
    }

    // Undo the single edit.
    if (previousK === k + 1) {
      // Insertion: the current B line was added.
      diff.unshift({
        type: 'added',
        value: linesB[y - 1],
      });

      y--;
    } else {
      // Deletion: the current A line was removed.
      diff.unshift({
        type: 'removed',
        value: linesA[x - 1],
      });

      x--;
    }
  }

  // Any remaining prefix consists of unchanged lines.
  while (x > 0 && y > 0) {
    diff.unshift({
      type: 'unchanged',
      value: linesA[x - 1],
    });

    x--;
    y--;
  }

  while (x > 0) {
    diff.unshift({
      type: 'removed',
      value: linesA[x - 1],
    });

    x--;
  }

  while (y > 0) {
    diff.unshift({
      type: 'added',
      value: linesB[y - 1],
    });

    y--;
  }

  return diff;
}