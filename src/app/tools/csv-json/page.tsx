'use client';

import { useState } from 'react';
import { parseCsv } from '@/lib/csv-json/parser';
import { serializeCsv } from '@/lib/csv-json/serializer';
import UtilityPage from '@/components/utility/utility-page';
import UtilityHeader from '@/components/utility/utility-header';
import UtilityButton from '@/components/utility/utility-button';
import PrivacyNotice from '@/components/utility/privacy-notice';
import KnowledgeSection from '@/components/utility/knowledge-section';
import { csvJsonKnowledge } from '@/content/utilities/csv-json';

export default function CsvJsonPage() {
  const [mode, setMode] = useState<'csv-to-json' | 'json-to-csv'>('csv-to-json');
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleConvert = () => {
    setError(null);
    setOutput('');
    setCopied(false);

    if (!input.trim()) {
      setError('Input cannot be empty.');
      return;
    }

    if (mode === 'csv-to-json') {
      const result = parseCsv(input);
      if (result.ok) {
        setOutput(JSON.stringify(result.data, null, 2));
      } else {
        setError(result.error);
      }
    } else {
      let jsonData: unknown;
      try {
        jsonData = JSON.parse(input);
      } catch {
        setError('Invalid JSON format.');
        return;
      }
      const result = serializeCsv(jsonData);
      if (result.ok) {
        setOutput(result.data);
      } else {
        setError(result.error);
      }
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError(null);
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Silent fail
    }
  };

  return (
    <UtilityPage>
      <UtilityHeader
        title="CSV ↔ JSON Converter"
        description="Convert CSV data to JSON and vice versa. All processing happens locally in your browser."
      />

      <div className="space-y-8 max-w-5xl mx-auto">
        <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-6">
          
          {/* Mode Toggle */}
          <div className="flex gap-4 border-b border-zinc-200 pb-4">
            <button
              onClick={() => { setMode('csv-to-json'); handleClear(); }}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                mode === 'csv-to-json' 
                  ? 'bg-zinc-900 text-white' 
                  : 'text-zinc-600 hover:bg-zinc-100'
              }`}
            >
              CSV to JSON
            </button>
            <button
              onClick={() => { setMode('json-to-csv'); handleClear(); }}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                mode === 'json-to-csv' 
                  ? 'bg-zinc-900 text-white' 
                  : 'text-zinc-600 hover:bg-zinc-100'
              }`}
            >
              JSON to CSV
            </button>
          </div>

          {/* Input / Output Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-zinc-700">
                {mode === 'csv-to-json' ? 'CSV Input' : 'JSON Input'}
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={mode === 'csv-to-json' ? "name,age\nBudi,30" : '[\n  {"name": "Budi", "age": "30"}\n]'}
                className="w-full h-64 rounded-lg border border-zinc-300 px-3 py-2 text-sm font-mono focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 outline-none resize-y"
                spellCheck={false}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-zinc-700">
                  {mode === 'csv-to-json' ? 'JSON Output' : 'CSV Output'}
                </label>
                {output && (
                  <button
                    onClick={handleCopy}
                    className="text-xs font-medium text-zinc-600 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200 px-2 py-1 rounded transition-colors"
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                )}
              </div>
              <textarea
                value={output}
                readOnly
                placeholder="Result will appear here..."
                className="w-full h-64 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-mono text-zinc-700 resize-y"
                spellCheck={false}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <UtilityButton onClick={handleConvert} className="flex-1 py-3 text-base font-semibold">
              Convert
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

        </div>

        <PrivacyNotice />
        <KnowledgeSection {...csvJsonKnowledge} />
      </div>
    </UtilityPage>
  );
}