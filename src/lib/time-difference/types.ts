export interface ElapsedTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface TotalTime {
  milliseconds: number;
  seconds: number;
  minutes: number;
  hours: number;
  days: number;
}

export interface TimeDifferenceResult {
  elapsed: ElapsedTime;
  totals: TotalTime;
}

export type ParseResult =
  | { ok: true; timestamp: number }
  | { ok: false; error: string };

export type CalculationResult =
  | { ok: true; result: TimeDifferenceResult }
  | { ok: false; error: string };