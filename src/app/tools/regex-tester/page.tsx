'use client';

import { useState, useCallback } from 'react';
import { testRegex } from '@/lib/regex-tester/tester';
import type { RegexMatch } from '@/lib/regex-tester/types';
import UtilityPage from '@/components/utility/utility-page';
import UtilityHeader from '@/components/utility/utility-header';
import UtilityButton from '@/components/utility/utility-button';
import PrivacyNotice from '@/components/utility/privacy-notice';
import KnowledgeSection from '@/components/utility/knowledge-section';
import { regexTesterKnowledge } from '@/content/utilities/regex-tester';

export default function RegexTesterPage() {
  const [pattern, setPattern] = useState<string>('');
  const [flags, setFlags] = useState<string>('g');
  const [testText, setTestText] = useState<string>('');
  const [matches, setMatches] = useState<RegexMatch[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasRun, setHasRun] = useState(false);

  const handleTest = useCallback(() => {
    setError(null);
    setMatches([]);
    setHasRun(true);

    const result = testRegex(pattern, testText, flags);
    if (result.ok) {
      setMatches(result.data.matches);
    } else {
      setError(result.error);
    }
  }, [pattern, testText, flags]);

  const handleClear = useCallback(() => {
    setPattern('');
    setFlags('g');
    setTestText('');
    setMatches([]);
    setError(null);
    setHasRun(false);
  }, []);

  const handleFlagToggle = useCallback((flag: string) => {
    setFlags(prev => prev.includes(flag) ? prev.replace(flag, '') : prev + flag);
  }, []);

  return (
    <UtilityPage>
      <UtilityHeader
        title="Regex Tester"
        description="Test regular expressions and inspect matches with capture groups. All processing happens locally in your browser."
      />

      <div className="space-y-8 max-w-5xl mx-auto">
        <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-6">
          
          {/* Pattern Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-700">
              Regular Expression Pattern
            </label>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="e.g., (\w+)@(\w+\.\w+)"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm font-mono focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 outline-none"
              spellCheck={false}
              autoComplete="off"
            />
          </div>

          {/* Flags */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-700">
              Flags
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={flags.includes('g')}
                  onChange={() => handleFlagToggle('g')}
                  className="rounded border-zinc-300"
                />
                <span className="text-sm font-mono">g <span className="text-zinc-500 text-xs">(global)</span></span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={flags.includes('i')}
                  onChange={() => handleFlagToggle('i')}
                  className="rounded border-zinc-300"
                />
                <span className="text-sm font-mono">i <span className="text-zinc-500 text-xs">(case-insensitive)</span></span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={flags.includes('m')}
                  onChange={() => handleFlagToggle('m')}
                  className="rounded border-zinc-300"
                />
                <span className="text-sm font-mono">m <span className="text-zinc-500 text-xs">(multiline)</span></span>
              </label>
            </div>
          </div>

          {/* Test Text */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-700">
              Test Text
            </label>
            <textarea
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              placeholder="Enter text to test against..."
              className="w-full h-40 rounded-lg border border-zinc-300 px-3 py-2 text-sm font-mono focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 outline-none resize-y"
              spellCheck={false}
              autoComplete="off"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <UtilityButton onClick={handleTest} className="flex-1 py-3 text-base font-semibold">
              Test Regex
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

          {/* Results Display */}
          {hasRun && !error && (
            <div className="space-y-4 pt-4 border-t border-zinc-100">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider">
                  Matches ({matches.length})
                </h3>
              </div>

              {matches.length === 0 ? (
                <p className="text-sm text-zinc-500 italic">No matches found.</p>
              ) : (
                <div className="space-y-3">
                  {matches.map((match, idx) => (
                    <div key={idx} className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-zinc-500 uppercase">
                          Match {idx + 1}
                        </span>
                        <span className="text-xs text-zinc-500 font-mono">
                          Index: {match.index}
                        </span>
                      </div>
                      
                      <div>
                        <span className="text-xs text-zinc-500 block mb-1">Full Match</span>
                        <code className="text-sm font-mono bg-white px-2 py-1 rounded border border-zinc-200 break-all">
                          {match.fullMatch}
                        </code>
                      </div>

                      {match.groups.length > 0 && (
                        <div>
                          <span className="text-xs text-zinc-500 block mb-1">Capture Groups</span>
                          <div className="space-y-1">
                            {match.groups.map((group, gIdx) => (
                              <div key={gIdx} className="flex items-center gap-2">
                                <span className="text-xs text-zinc-500 font-mono w-16">
                                  Group {gIdx + 1}:
                                </span>
                                <code className="text-sm font-mono bg-white px-2 py-1 rounded border border-zinc-200 break-all flex-1">
                                  {group || <span className="text-zinc-400 italic">(empty)</span>}
                                </code>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        <PrivacyNotice />
        <KnowledgeSection {...regexTesterKnowledge} />
      </div>
    </UtilityPage>
  );
}