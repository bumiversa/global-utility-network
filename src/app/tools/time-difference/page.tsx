'use client';

import { useState } from 'react';
import { parseIso8601 } from '@/lib/time-difference/parse';
import { calculateDifference } from '@/lib/time-difference/calculate';
import type { TimeDifferenceResult } from '@/lib/time-difference/types';
import UtilityPage from '@/components/utility/utility-page';
import UtilityHeader from '@/components/utility/utility-header';
import UtilityButton from '@/components/utility/utility-button';
import PrivacyNotice from '@/components/utility/privacy-notice';
import KnowledgeSection from '@/components/utility/knowledge-section';
import { timeDifferenceKnowledge } from '@/content/utilities/time-difference';

export default function TimeDifferencePage() {
  const [instantA, setInstantA] = useState<string>('');
  const [instantB, setInstantB] = useState<string>('');
  const [result, setResult] = useState<TimeDifferenceResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = () => {
    setError(null);
    setResult(null);

    const parseA = parseIso8601(instantA);
    if (!parseA.ok) {
      setError(`Instant A: ${parseA.error}`);
      return;
    }

    const parseB = parseIso8601(instantB);
    if (!parseB.ok) {
      setError(`Instant B: ${parseB.error}`);
      return;
    }

    const calcResult = calculateDifference(parseA.timestamp, parseB.timestamp);
    if (!calcResult.ok) {
      setError(calcResult.error);
      return;
    }

    setResult(calcResult.result);
  };

  const handleUseCurrentTime = () => {
    setInstantB(new Date().toISOString());
  };

  const handleClear = () => {
    setInstantA('');
    setInstantB('');
    setResult(null);
    setError(null);
  };

  const formatElapsed = (elapsed: { days: number; hours: number; minutes: number; seconds: number }) => {
    return `${elapsed.days} day${elapsed.days !== 1 ? 's' : ''}, ${elapsed.hours} hour${elapsed.hours !== 1 ? 's' : ''}, ${elapsed.minutes} minute${elapsed.minutes !== 1 ? 's' : ''}, ${elapsed.seconds} second${elapsed.seconds !== 1 ? 's' : ''}`;
  };

  return (
    <UtilityPage>
      <UtilityHeader
        title="Time Difference Calculator"
        description="Calculate the elapsed time between two instants. All processing happens locally in your browser."
      />

      <div className="space-y-8 max-w-2xl mx-auto">
        <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-6">
          
          {/* Instant A Input */}
          <div>
            <label htmlFor="instant-a" className="block text-sm font-medium text-zinc-700 mb-2">
              Instant A
            </label>
            <input
              id="instant-a"
              type="text"
              value={instantA}
              onChange={(e) => setInstantA(e.target.value)}
              placeholder="2026-09-28T10:00:00Z"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm font-mono focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 outline-none"
              spellCheck={false}
              autoComplete="off"
            />
            <p className="mt-1 text-xs text-zinc-500">
              ISO 8601 format with timezone (e.g., 2026-09-28T10:00:00Z or 2026-09-28T10:00:00+07:00)
            </p>
          </div>

          {/* Instant B Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="instant-b" className="block text-sm font-medium text-zinc-700">
                Instant B
              </label>
              <button
                type="button"
                onClick={handleUseCurrentTime}
                className="text-xs font-medium text-zinc-600 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200 px-2 py-1 rounded transition-colors"
              >
                Use current time
              </button>
            </div>
            <input
              id="instant-b"
              type="text"
              value={instantB}
              onChange={(e) => setInstantB(e.target.value)}
              placeholder="2026-09-28T12:30:45Z"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm font-mono focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 outline-none"
              spellCheck={false}
              autoComplete="off"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <UtilityButton onClick={handleCalculate} className="flex-1 py-3 text-base font-semibold">
              Calculate
            </UtilityButton>
            <button
              onClick={handleClear}
              className="px-4 py-3 text-sm font-medium text-zinc-600 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors"
            >
              Clear
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <strong>Error:</strong> {error}
            </div>
          )}

          {/* Result Display */}
          {result && !error && (
            <div className="space-y-6 pt-4 border-t border-zinc-100">
              {/* Primary: Destructured Elapsed Time */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Elapsed Time
                </label>
                <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                  <p className="text-lg font-semibold text-zinc-900">
                    {formatElapsed(result.elapsed)}
                  </p>
                </div>
              </div>

              {/* Secondary: Total Units */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Total in Various Units
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Milliseconds</span>
                    <p className="text-sm font-mono text-zinc-900 mt-1">
                      {result.totals.milliseconds.toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Seconds</span>
                    <p className="text-sm font-mono text-zinc-900 mt-1">
                      {result.totals.seconds.toLocaleString(undefined, { maximumFractionDigits: 3 })}
                    </p>
                  </div>
                  <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Minutes</span>
                    <p className="text-sm font-mono text-zinc-900 mt-1">
                      {result.totals.minutes.toLocaleString(undefined, { maximumFractionDigits: 3 })}
                    </p>
                  </div>
                  <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Hours</span>
                    <p className="text-sm font-mono text-zinc-900 mt-1">
                      {result.totals.hours.toLocaleString(undefined, { maximumFractionDigits: 3 })}
                    </p>
                  </div>
                  <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 sm:col-span-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Days</span>
                    <p className="text-sm font-mono text-zinc-900 mt-1">
                      {result.totals.days.toLocaleString(undefined, { maximumFractionDigits: 3 })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        <PrivacyNotice />
        <KnowledgeSection {...timeDifferenceKnowledge} />
      </div>
    </UtilityPage>
  );
}