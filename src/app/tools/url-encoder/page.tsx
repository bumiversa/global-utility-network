'use client';

import { useState, useCallback } from 'react';
import { encodeUriComponent, decodeUriComponent } from '@/lib/url-encoder/encoder';
import UtilityPage from '@/components/utility/utility-page';
import UtilityHeader from '@/components/utility/utility-header';
import UtilityButton from '@/components/utility/utility-button';
import PrivacyNotice from '@/components/utility/privacy-notice';
import KnowledgeSection from '@/components/utility/knowledge-section';
import { urlEncoderKnowledge } from '@/content/utilities/url-encoder';

export default function UrlEncoderPage() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleProcess = useCallback(() => {
    setError(null);
    setOutput('');
    setCopied(false);

    if (!input.trim() && input !== '') {
      // Allow empty string processing, but if it's literally empty, just clear
      if (input === '') {
        setOutput('');
        return;
      }
    }

    if (mode === 'encode') {
      const result = encodeUriComponent(input);
      if (result.ok) {
        setOutput(result.data.encoded);
      } else {
        setError(result.error);
      }
    } else {
      const result = decodeUriComponent(input);
      if (result.ok) {
        setOutput(result.data.decoded);
      } else {
        setError(result.error);
      }
    }
  }, [input, mode]);

  const handleClear = useCallback(() => {
    setInput('');
    setOutput('');
    setError(null);
    setCopied(false);
  }, []);

  const handleCopy = useCallback(async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Silent fail
    }
  }, [output]);

  return (
    <UtilityPage>
      <UtilityHeader
        title="URL Encoder / Decoder"
        description="Transform text into safe URI components and vice versa. All processing happens locally in your browser."
      />

      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-6">
          
          {/* Mode Toggle */}
          <div className="flex gap-4 border-b border-zinc-200 pb-4">
            <button
              onClick={() => { setMode('encode'); handleClear(); }}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                mode === 'encode' 
                  ? 'bg-zinc-900 text-white' 
                  : 'text-zinc-600 hover:bg-zinc-100'
              }`}
            >
              Encode (Text → URI)
            </button>
            <button
              onClick={() => { setMode('decode'); handleClear(); }}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                mode === 'decode' 
                  ? 'bg-zinc-900 text-white' 
                  : 'text-zinc-600 hover:bg-zinc-100'
              }`}
            >
              Decode (URI → Text)
            </button>
          </div>

          {/* Input / Output Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-zinc-700">
                {mode === 'encode' ? 'Plain Text Input' : 'URI Component Input'}
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={mode === 'encode' ? "Hello World & BUMIVERSA" : "Hello%20World%20%26%20BUMIVERSA"}
                className="w-full h-48 rounded-lg border border-zinc-300 px-3 py-2 text-sm font-mono focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 outline-none resize-y"
                spellCheck={false}
                autoComplete="off"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-zinc-700">
                  {mode === 'encode' ? 'Encoded Output' : 'Decoded Output'}
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
                className="w-full h-48 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-mono text-zinc-700 resize-y"
                spellCheck={false}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <UtilityButton onClick={handleProcess} className="flex-1 py-3 text-base font-semibold">
              {mode === 'encode' ? 'Encode' : 'Decode'}
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
        <KnowledgeSection {...urlEncoderKnowledge} />
      </div>
    </UtilityPage>
  );
}