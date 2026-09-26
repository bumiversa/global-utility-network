'use client';

import { useState } from 'react';
import { timestampToDate, dateToTimestamp, type TimestampUnit } from '@/lib/timestamp-converter/convert';
import UtilityPage from '@/components/utility/utility-page';
import UtilityHeader from '@/components/utility/utility-header';
import PrivacyNotice from '@/components/utility/privacy-notice';
import KnowledgeSection from '@/components/utility/knowledge-section';
import { timestampConverterKnowledge } from '@/content/utilities/timestamp-converter';

type Mode = 'timestamp-to-date' | 'date-to-timestamp';

export default function TimestampConverterPage() {
  const [mode, setMode] = useState<Mode>('timestamp-to-date');
  const [timestampInput, setTimestampInput] = useState<string>('0');
  const [unit, setUnit] = useState<TimestampUnit>('seconds');
  const [dateInput, setDateInput] = useState<string>('');

  // Derived state for Timestamp ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ Date mode
  const timestampResult = (() => {
    if (mode !== 'timestamp-to-date') return null;
    const numValue = Number(timestampInput);
    if (timestampInput === '' || !Number.isFinite(numValue)) {
      return { ok: false as const, error: 'Please enter a valid finite number.' };
    }
    return timestampToDate(numValue, unit);
  })();

  // Derived state for Date ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ Timestamp mode
  const dateResult = (() => {
    if (mode !== 'date-to-timestamp') return null;
    return dateToTimestamp(dateInput);
  })();

  return (
    <UtilityPage>
      <UtilityHeader
        title="Epoch / Unix Timestamp Converter"
        description="Convert between Unix timestamps and human-readable dates. Your inputs are processed locally in your browser."
      />

      <div className="space-y-8 max-w-2xl mx-auto">
        <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-6">
          
          {/* Mode Selection */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">Conversion Mode</label>
            <div className="flex flex-col sm:flex-row gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="mode"
                  value="timestamp-to-date"
                  checked={mode === 'timestamp-to-date'}
                  onChange={() => setMode('timestamp-to-date')}
                  className="text-zinc-900 focus:ring-zinc-500"
                />
                <span className="text-sm text-zinc-700">Timestamp &rarr; Date</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="mode"
                  value="date-to-timestamp"
                  checked={mode === 'date-to-timestamp'}
                  onChange={() => setMode('date-to-timestamp')}
                  className="text-zinc-900 focus:ring-zinc-500"
                />
                <span className="text-sm text-zinc-700">Date &rarr; Timestamp</span>
              </label>
            </div>
          </div>

          {/* Timestamp ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ Date Mode */}
          {mode === 'timestamp-to-date' && (
            <div className="space-y-4 pt-4 border-t border-zinc-100">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Unix Timestamp</label>
                <input
                  type="number"
                  step="any"
                  value={timestampInput}
                  onChange={(e) => setTimestampInput(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 font-mono text-sm focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 outline-none"
                  placeholder="e.g., 1704067200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">Timestamp Unit</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="unit"
                      value="seconds"
                      checked={unit === 'seconds'}
                      onChange={() => setUnit('seconds')}
                      className="text-zinc-900 focus:ring-zinc-500"
                    />
                    <span className="text-sm text-zinc-700">Seconds</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="unit"
                      value="milliseconds"
                      checked={unit === 'milliseconds'}
                      onChange={() => setUnit('milliseconds')}
                      className="text-zinc-900 focus:ring-zinc-500"
                    />
                    <span className="text-sm text-zinc-700">Milliseconds</span>
                  </label>
                </div>
              </div>

              {/* Result Display */}
              <div className="pt-4 border-t border-zinc-100">
                <label className="block text-sm font-medium text-zinc-700 mb-2">Result</label>
                {timestampResult && !timestampResult.ok ? (
                  <p className="text-sm text-red-600">{timestampResult.error}</p>
                ) : timestampResult && timestampResult.ok ? (
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-zinc-500 mb-1">UTC (ISO 8601)</p>
                      <p className="font-mono text-sm text-zinc-900 bg-zinc-50 px-3 py-2 rounded">
                        {timestampResult.utc}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 mb-1">Local Time (Browser)</p>
                      <p className="font-mono text-sm text-zinc-900 bg-zinc-50 px-3 py-2 rounded">
                        {timestampResult.local}
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          )}

          {/* Date ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ Timestamp Mode */}
          {mode === 'date-to-timestamp' && (
            <div className="space-y-4 pt-4 border-t border-zinc-100">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Date & Time (Local)</label>
                <input
                  type="datetime-local"
                  value={dateInput}
                  onChange={(e) => setDateInput(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 outline-none"
                />
                <p className="text-xs text-zinc-500 mt-1">
                  Input is interpreted as your browser&apos;s local timezone.
                </p>
              </div>

              {/* Result Display */}
              <div className="pt-4 border-t border-zinc-100">
                <label className="block text-sm font-medium text-zinc-700 mb-2">Result</label>
                {dateResult && !dateResult.ok ? (
                  <p className="text-sm text-red-600">{dateResult.error}</p>
                ) : dateResult && dateResult.ok ? (
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-zinc-500 mb-1">Unix Timestamp (Seconds)</p>
                      <p className="font-mono text-sm text-zinc-900 bg-zinc-50 px-3 py-2 rounded">
                        {dateResult.seconds}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 mb-1">Unix Timestamp (Milliseconds)</p>
                      <p className="font-mono text-sm text-zinc-900 bg-zinc-50 px-3 py-2 rounded">
                        {dateResult.milliseconds}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-zinc-500 italic">Enter a date and time to see the timestamp.</p>
                )}
              </div>
            </div>
          )}

        </div>

        <PrivacyNotice />
        <KnowledgeSection {...timestampConverterKnowledge} />
      </div>
    </UtilityPage>
  );
}