'use client';

import { useState } from 'react';
import { formatJson, minifyJson } from '@/lib/json-formatter/transform';
import UtilityPage from '@/components/utility/utility-page';
import UtilityHeader from '@/components/utility/utility-header';
import UtilityEditor from '@/components/utility/utility-editor';
import UtilityButton from '@/components/utility/utility-button';
import PrivacyNotice from '@/components/utility/privacy-notice';
import KnowledgeSection from '@/components/utility/knowledge-section';
import { jsonFormatterKnowledge } from '@/content/utilities/json-formatter';

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
    <UtilityPage>
      <UtilityHeader 
        title="JSON Formatter & Minifier" 
        description="Beautify or compress your JSON data instantly and securely." 
      />

      <div className="space-y-6">
        {/* Editors */}
        <div className="grid gap-6 md:grid-cols-2">
          <UtilityEditor 
            label="Input JSON" 
            placeholder="Paste your raw JSON here..." 
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

        {/* Controls - Di Bawah */}
        <div className="flex flex-wrap justify-center gap-3 pt-4">
          <UtilityButton onClick={handleFormat} disabled={!input}>Format JSON</UtilityButton>
          <UtilityButton onClick={handleMinify} disabled={!input} variant="secondary">Minify JSON</UtilityButton>
          <UtilityButton onClick={handleClear} variant="secondary">Clear All</UtilityButton>
        </div>
      </div>

      <PrivacyNotice />
      <KnowledgeSection {...jsonFormatterKnowledge} />
    </UtilityPage>
  );
}
