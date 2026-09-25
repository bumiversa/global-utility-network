'use client';

import { useState } from 'react';
import { encodeBase64, decodeBase64, encodeBase64Url, decodeBase64Url } from '@/lib/base64/transform';
import UtilityPage from '@/components/utility/utility-page';
import UtilityHeader from '@/components/utility/utility-header';
import UtilityEditor from '@/components/utility/utility-editor';
import UtilityButton from '@/components/utility/utility-button';
import PrivacyNotice from '@/components/utility/privacy-notice';

export default function Base64Page() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<'standard' | 'url'>('standard');

  const handleEncode = () => {
    const result = mode === 'standard' ? encodeBase64(input) : encodeBase64Url(input);
    setOutput(result);
    setError(null);
  };

  const handleDecode = () => {
    const result = mode === 'standard' ? decodeBase64(input) : decodeBase64Url(input);
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
    <UtilityPage>
      <UtilityHeader
        title="Base64 Encoder & Decoder"
        description="Encode and decode text to Base64 or Base64URL instantly with full UTF-8 support."
      />

      <div className="space-y-6">
        {/* Mode Toggle */}
        <div className="flex flex-wrap justify-center gap-3">
          <UtilityButton
            onClick={() => setMode('standard')}
            variant={mode === 'standard' ? 'primary' : 'secondary'}
          >
            Standard Base64
          </UtilityButton>
          <UtilityButton
            onClick={() => setMode('url')}
            variant={mode === 'url' ? 'primary' : 'secondary'}
          >
            Base64URL
          </UtilityButton>
        </div>

        {/* Editors */}
        <div className="grid gap-6 md:grid-cols-2">
          <UtilityEditor
            label="Input"
            placeholder="Paste text to encode, or Base64 to decode..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <UtilityEditor
            label="Output"
            placeholder="Result will appear here..."
            value={output}
            readOnly
            actionButton={output ? (
              <button onClick={handleCopy} className="text-xs font-medium text-zinc-600 hover:text-zinc-900">
                {copied ? 'Copied!' : 'Copy to Clipboard'}
              </button>
            ) : null}
          />
        </div>

        {/* Error State */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-wrap justify-center gap-3 pt-4">
          <UtilityButton onClick={handleEncode} disabled={!input}>Encode</UtilityButton>
          <UtilityButton onClick={handleDecode} disabled={!input} variant="secondary">Decode</UtilityButton>
          <UtilityButton onClick={handleClear} variant="secondary">Clear All</UtilityButton>
        </div>
      </div>

      <PrivacyNotice />
    </UtilityPage>
  );
}
