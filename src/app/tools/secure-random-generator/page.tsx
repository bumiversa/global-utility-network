'use client';

import { useState } from 'react';
import { generateUUID, generateSecureRandomString, type CharsetOptions } from '@/lib/secure-random-generator/generate';
import UtilityPage from '@/components/utility/utility-page';
import UtilityHeader from '@/components/utility/utility-header';
import UtilityButton from '@/components/utility/utility-button';
import PrivacyNotice from '@/components/utility/privacy-notice';
import KnowledgeSection from '@/components/utility/knowledge-section';
import { secureRandomGeneratorKnowledge } from '@/content/utilities/secure-random-generator';

type Mode = 'uuid' | 'random-string';

export default function SecureRandomGeneratorPage() {
  const [mode, setMode] = useState<Mode>('uuid');
  const [length, setLength] = useState<string>('16');
  const [charset, setCharset] = useState<CharsetOptions>({
    letters: true,
    numbers: true,
    symbols: false,
  });
  
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleGenerate = () => {
    setError(null);
    setCopySuccess(false);

    if (mode === 'uuid') {
      const uuidResult = generateUUID();
      if (uuidResult.ok) {
        setResult(uuidResult.value);
      } else {
        setError(uuidResult.error);
      }
    } else {
      const numLength = Number(length);
      const stringResult = generateSecureRandomString(numLength, charset);
      if (stringResult.ok) {
        setResult(stringResult.value);
      } else {
        setError(stringResult.error);
      }
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {
      setError('Failed to copy to clipboard.');
    }
  };

  return (
    <UtilityPage>
      <UtilityHeader
        title="Secure Random Generator"
        description="Generate cryptographically secure random values using your browser's Web Crypto API. Values are generated locally and not stored."
      />

      <div className="space-y-8 max-w-2xl mx-auto">
        <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-6">
          
          {/* Mode Selection */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">Generation Mode</label>
            <div className="flex flex-col sm:flex-row gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="mode"
                  value="uuid"
                  checked={mode === 'uuid'}
                  onChange={() => setMode('uuid')}
                  className="text-zinc-900 focus:ring-zinc-500"
                />
                <span className="text-sm text-zinc-700">UUID v4</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="mode"
                  value="random-string"
                  checked={mode === 'random-string'}
                  onChange={() => setMode('random-string')}
                  className="text-zinc-900 focus:ring-zinc-500"
                />
                <span className="text-sm text-zinc-700">Random String</span>
              </label>
            </div>
          </div>

          {/* Random String Options */}
          {mode === 'random-string' && (
            <div className="space-y-4 pt-4 border-t border-zinc-100">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Length (8-128)</label>
                <input
                  type="number"
                  min="8"
                  max="128"
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 outline-none"
                  placeholder="16"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">Character Sets</label>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={charset.letters || false}
                      onChange={(e) => setCharset({ ...charset, letters: e.target.checked })}
                      className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500"
                    />
                    <span className="text-sm text-zinc-700">Letters (A-Z, a-z)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={charset.numbers || false}
                      onChange={(e) => setCharset({ ...charset, numbers: e.target.checked })}
                      className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500"
                    />
                    <span className="text-sm text-zinc-700">Numbers (0-9)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={charset.symbols || false}
                      onChange={(e) => setCharset({ ...charset, symbols: e.target.checked })}
                      className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500"
                    />
                    <span className="text-sm text-zinc-700">Symbols (!@#$%^&*()-_=+[]{'{'}{'}'};:,.?)</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Generate Button */}
          <div className="pt-4 border-t border-zinc-100">
            <UtilityButton onClick={handleGenerate} className="w-full">
              Generate
            </UtilityButton>
          </div>

          {/* Result Display */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <strong>Error:</strong> {error}
            </div>
          )}

          {result && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-zinc-700">Result</label>
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                <p className="font-mono text-sm text-zinc-900 break-all">
                  {result}
                </p>
              </div>
              <UtilityButton onClick={handleCopy} variant="secondary" className="w-full">
                {copySuccess ? 'Copied!' : 'Copy to Clipboard'}
              </UtilityButton>
            </div>
          )}

        </div>

        <PrivacyNotice />
        <KnowledgeSection {...secureRandomGeneratorKnowledge} />
      </div>
    </UtilityPage>
  );
}