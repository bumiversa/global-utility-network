'use client';

import { useState } from 'react';
import { formatJson, minifyJson } from '@/lib/json-formatter/transform';

export default function JsonFormatterPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleFormat = () => {
    const result = formatJson(input);
    if (result.ok) {
      setOutput(result.value);
      setError(null);
    } else {
      setError(result.error);
      setOutput('');
    }
  };

  const handleMinify = () => {
    const result = minifyJson(input);
    if (result.ok) {
      setOutput(result.value);
      setError(null);
    } else {
      setError(result.error);
      setOutput('');
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
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Top Ad Slot (Optional - Uncomment when AdSense ready) */}
        {/* <div className="mb-8 flex justify-center">
          <div className="w-full max-w-[728px] h-[90px] bg-slate-100 border border-slate-200 flex items-center justify-center text-sm text-slate-400">
            Ad Slot - Leaderboard (728x90)
          </div>
        </div> */}

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            JSON Formatter & Minifier
          </h1>
          <p className="mt-2 text-slate-600">
            Beautify or compress your JSON data instantly.
          </p>
        </div>

        {/* Main Content with Sidebar */}
        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          {/* Utility Area */}
          <div className="space-y-6">
            {/* Controls */}
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={handleFormat}
                className="rounded-md bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
                disabled={!input}
              >
                Format
              </button>
              <button
                onClick={handleMinify}
                className="rounded-md bg-slate-700 px-6 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
                disabled={!input}
              >
                Minify
              </button>
              <button
                onClick={handleClear}
                className="rounded-md border border-slate-300 px-6 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Clear
              </button>
            </div>

            {/* Editor Grid */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Input JSON
                </label>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Paste your raw JSON here..."
                  className="w-full h-80 rounded-md border border-slate-300 bg-white p-4 font-mono text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  spellCheck={false}
                />
              </div>

              {/* Output */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-slate-700">
                    Output
                  </label>
                  {output && (
                    <button
                      onClick={handleCopy}
                      className="text-xs font-medium text-blue-600 hover:text-blue-700"
                    >
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  )}
                </div>
                <textarea
                  value={output}
                  readOnly
                  placeholder="Result will appear here..."
                  className="w-full h-80 rounded-md border border-slate-300 bg-slate-50 p-4 font-mono text-sm text-slate-900 outline-none"
                  spellCheck={false}
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-md bg-red-50 border border-red-200 p-4 text-sm text-red-700">
                <strong>Error:</strong> {error}
              </div>
            )}
          </div>

          {/* Sidebar Ad Slot */}
          <aside className="space-y-6">
            {/* <div className="sticky top-8">
              <div className="w-full h-[600px] bg-slate-100 border border-slate-200 flex items-center justify-center text-sm text-slate-400">
                Ad Slot - Skyscraper (300x600)
              </div>
            </div> */}
          </aside>
        </div>

        {/* Bottom Ad Slot (Optional - Uncomment when AdSense ready) */}
        {/* <div className="mt-8 flex justify-center">
          <div className="w-full max-w-[728px] h-[90px] bg-slate-100 border border-slate-200 flex items-center justify-center text-sm text-slate-400">
            Ad Slot - Leaderboard (728x90)
          </div>
        </div> */}

        {/* Privacy Note */}
        <div className="mt-12 text-center text-xs text-slate-500">
          <p>? Processed entirely in your browser. No data is sent to any server.</p>
        </div>
      </div>
    </main>
  );
}
