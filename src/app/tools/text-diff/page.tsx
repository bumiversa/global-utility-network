'use client';

import { useState } from 'react';
import { computeDiff } from '@/lib/text-diff/diff';
import type { DiffOptions, DiffLine } from '@/lib/text-diff/types';
import UtilityPage from '@/components/utility/utility-page';
import UtilityHeader from '@/components/utility/utility-header';
import UtilityButton from '@/components/utility/utility-button';
import PrivacyNotice from '@/components/utility/privacy-notice';
import KnowledgeSection from '@/components/utility/knowledge-section';
import { textDiffKnowledge } from '@/content/utilities/text-diff';

export default function TextDiffPage() {
  const [textA, setTextA] = useState<string>('');
  const [textB, setTextB] = useState<string>('');
  const [options, setOptions] = useState<DiffOptions>({
    caseSensitive: true,
    ignoreTrailingWhitespace: false,
  });
  
  const [diffResult, setDiffResult] = useState<DiffLine[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCompare = () => {
    setError(null);
    setDiffResult(null);
    setIsProcessing(true);

    // Use setTimeout to allow UI to render the processing state before calculation
    setTimeout(() => {
      const result = computeDiff(textA, textB, options);
      if (result.ok) {
        setDiffResult(result.diff);
      } else {
        setError(result.error);
      }
      setIsProcessing(false);
    }, 50);
  };

  const handleClear = () => {
    setTextA('');
    setTextB('');
    setDiffResult(null);
    setError(null);
  };

  return (
    <UtilityPage>
      <UtilityHeader
        title="Plain Text Diff & Compare"
        description="Compare two blocks of text line-by-line. All processing happens locally in your browser."
      />

      <div className="space-y-8 max-w-5xl mx-auto">
        <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-6">
          
          {/* Options */}
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={options.caseSensitive}
                onChange={(e) => setOptions(prev => ({ ...prev, caseSensitive: e.target.checked }))}
                className="w-4 h-4 text-zinc-900 rounded border-zinc-300 focus:ring-zinc-500"
              />
              <span className="text-sm text-zinc-700">Case Sensitive</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={options.ignoreTrailingWhitespace}
                onChange={(e) => setOptions(prev => ({ ...prev, ignoreTrailingWhitespace: e.target.checked }))}
                className="w-4 h-4 text-zinc-900 rounded border-zinc-300 focus:ring-zinc-500"
              />
              <span className="text-sm text-zinc-700">Ignore Trailing Whitespace</span>
            </label>
          </div>

          {/* Text Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">Original (Text A)</label>
              <textarea
                value={textA}
                onChange={(e) => setTextA(e.target.value)}
                placeholder="Paste original text here..."
                className="w-full h-48 rounded-lg border border-zinc-300 px-3 py-2 text-sm font-mono focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 outline-none resize-y"
                spellCheck={false}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">Modified (Text B)</label>
              <textarea
                value={textB}
                onChange={(e) => setTextB(e.target.value)}
                placeholder="Paste modified text here..."
                className="w-full h-48 rounded-lg border border-zinc-300 px-3 py-2 text-sm font-mono focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 outline-none resize-y"
                spellCheck={false}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <UtilityButton onClick={handleCompare} className="flex-1 py-3 text-base font-semibold" disabled={isProcessing}>
              {isProcessing ? 'Comparing...' : 'Compare'}
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

          {/* Diff Output */}
          {diffResult && !error && (
            <div className="space-y-3 pt-4 border-t border-zinc-100">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-zinc-700">
                  Comparison Result ({diffResult.length} lines)
                </label>
              </div>
              
              <div className="rounded-lg border border-zinc-200 bg-zinc-900 text-zinc-100 p-4 max-h-96 overflow-y-auto font-mono text-sm leading-relaxed">
                {diffResult.map((line, index) => {
                  let bgClass = 'bg-zinc-800';
                  let textClass = 'text-zinc-300';
                  let prefix = '  ';

                  if (line.type === 'added') {
                    bgClass = 'bg-green-900/30';
                    textClass = 'text-green-400';
                    prefix = '+ ';
                  } else if (line.type === 'removed') {
                    bgClass = 'bg-red-900/30';
                    textClass = 'text-red-400';
                    prefix = '- ';
                  }

                  return (
                    <div key={index} className={`flex ${bgClass} px-2 py-0.5 rounded`}>
                      <span className={`select-none w-6 shrink-0 ${line.type === 'unchanged' ? 'text-zinc-600' : textClass}`}>
                        {prefix}
                      </span>
                      <span className={`${textClass} break-all whitespace-pre-wrap`}>
                        {line.value || ' '}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        <PrivacyNotice />
        <KnowledgeSection {...textDiffKnowledge} />
      </div>
    </UtilityPage>
  );
}