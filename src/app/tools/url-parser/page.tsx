'use client';

import { useState } from 'react';
import { parseUrl, reconstructUrl, encodeComponent, decodeComponent } from '@/lib/url-parser/parser';
import type { QueryParam } from '@/lib/url-parser/types';
import UtilityPage from '@/components/utility/utility-page';
import UtilityHeader from '@/components/utility/utility-header';
import PrivacyNotice from '@/components/utility/privacy-notice';

export default function UrlParserPage() {
  const [inputUrl, setInputUrl] = useState<string>('');
  const [editableQueryParams, setEditableQueryParams] = useState<QueryParam[]>([]);
  const [encodeInput, setEncodeInput] = useState<string>('');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Derived: Parse result (pure, no useEffect)
  const parseResult = inputUrl.trim() ? parseUrl(inputUrl) : null;

  // Derived: Reconstructed URL (single call to prevent narrowing issues)
  const reconstructedResult = parseResult?.ok
    ? reconstructUrl(inputUrl, editableQueryParams)
    : null;

  const reconstructedUrl = reconstructedResult?.ok ? reconstructedResult.url : null;

  // Derived: Visual cue for changes (compare trimmed input with reconstructed)
  const hasQueryChanges = 
    reconstructedUrl !== null && 
    reconstructedUrl !== inputUrl.trim();

  // Derived: Encode/Decode
  const encodedOutput = encodeInput ? encodeComponent(encodeInput) : '';
  const decodedOutput = encodeInput ? decodeComponent(encodeInput) : '';

  // Handlers
  const handleInputUrlChange = (value: string) => {
    setInputUrl(value);
    const result = value.trim() ? parseUrl(value) : null;
    if (result?.ok) {
      setEditableQueryParams(result.data.queryParams);
    } else {
      setEditableQueryParams([]);
    }
  };

  const handleParamChange = (index: number, field: 'key' | 'value', newValue: string) => {
    setEditableQueryParams(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: newValue };
      return updated;
    });
  };

  const handleAddParam = () => {
    setEditableQueryParams(prev => [...prev, { key: '', value: '' }]);
  };

  const handleRemoveParam = (index: number) => {
    setEditableQueryParams(prev => prev.filter((_, i) => i !== index));
  };

  const handleCopy = async (text: string, fieldId: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldId);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      // Silent fail
    }
  };

  const formatValue = (val: string) => (val === '' ? '—' : val);

  return (
    <UtilityPage>
      <UtilityHeader
        title="URL Parser & Query Tool"
        description="Parse, inspect, and manipulate URL structures and query parameters instantly. 100% client-side, no network requests."
      />

      <div className="space-y-8 max-w-4xl mx-auto">
        
        {/* Main Parser Card */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-6">
          
          {/* URL Input */}
          <div>
            <label htmlFor="url-input" className="block text-sm font-medium text-zinc-700 mb-2">
              Absolute URL
            </label>
            <input
              id="url-input"
              type="text"
              value={inputUrl}
              onChange={(e) => handleInputUrlChange(e.target.value)}
              placeholder="https://example.com/path?query=value#hash"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm font-mono focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 outline-none"
              spellCheck={false}
              autoComplete="off"
            />
            <p className="mt-1 text-xs text-zinc-500">
              Must include protocol (e.g., https://). Relative URLs are not supported.
            </p>
          </div>

          {/* Error Display */}
          {inputUrl.trim() !== '' && parseResult && !parseResult.ok && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <strong>Invalid URL:</strong> {parseResult.error}
            </div>
          )}

          {/* Parser Panels (Only visible when valid) */}
          {parseResult?.ok && (
            <>
              {/* URL Components */}
              <div className="space-y-3 pt-4 border-t border-zinc-100">
                <h3 className="text-sm font-semibold text-zinc-900">URL Components</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  <div className="flex justify-between sm:block">
                    <span className="text-zinc-500 sm:inline sm:w-24">Protocol:</span>
                    <span className="font-mono text-zinc-900">{formatValue(parseResult.data.protocol)}</span>
                  </div>
                  <div className="flex justify-between sm:block">
                    <span className="text-zinc-500 sm:inline sm:w-24">Origin:</span>
                    <span className="font-mono text-zinc-900">{formatValue(parseResult.data.origin)}</span>
                  </div>
                  <div className="flex justify-between sm:block">
                    <span className="text-zinc-500 sm:inline sm:w-24">Hostname:</span>
                    <span className="font-mono text-zinc-900">{formatValue(parseResult.data.hostname)}</span>
                  </div>
                  <div className="flex justify-between sm:block">
                    <span className="text-zinc-500 sm:inline sm:w-24">Port:</span>
                    <span className="font-mono text-zinc-900">{formatValue(parseResult.data.port)}</span>
                  </div>
                  <div className="flex justify-between sm:block">
                    <span className="text-zinc-500 sm:inline sm:w-24">Pathname:</span>
                    <span className="font-mono text-zinc-900">{formatValue(parseResult.data.pathname)}</span>
                  </div>
                  <div className="flex justify-between sm:block">
                    <span className="text-zinc-500 sm:inline sm:w-24">Hash:</span>
                    <span className="font-mono text-zinc-900">{formatValue(parseResult.data.hash)}</span>
                  </div>
                  {parseResult.data.username && (
                    <div className="flex justify-between sm:block">
                      <span className="text-zinc-500 sm:inline sm:w-24">Username:</span>
                      <span className="font-mono text-zinc-900">{formatValue(parseResult.data.username)}</span>
                    </div>
                  )}
                  {parseResult.data.password && (
                    <div className="flex justify-between sm:block">
                      <span className="text-zinc-500 sm:inline sm:w-24">Password:</span>
                      <span className="font-mono text-zinc-900">{formatValue(parseResult.data.password)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Query Parameters */}
              <div className="space-y-3 pt-4 border-t border-zinc-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-zinc-900">Query Parameters</h3>
                  <button
                    onClick={handleAddParam}
                    className="text-xs font-medium text-zinc-600 hover:text-zinc-900 flex items-center gap-1"
                  >
                    <span>+</span> Add parameter
                  </button>
                </div>
                
                <div className="space-y-2">
                  {editableQueryParams.map((param, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={param.key}
                        onChange={(e) => handleParamChange(index, 'key', e.target.value)}
                        placeholder="key"
                        className="flex-1 rounded-md border border-zinc-300 px-2 py-1.5 text-sm font-mono focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 outline-none"
                      />
                      <span className="text-zinc-400">=</span>
                      <input
                        type="text"
                        value={param.value}
                        onChange={(e) => handleParamChange(index, 'value', e.target.value)}
                        placeholder="value"
                        className="flex-[2] rounded-md border border-zinc-300 px-2 py-1.5 text-sm font-mono focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 outline-none"
                      />
                      <button
                        onClick={() => handleRemoveParam(index)}
                        className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Remove parameter"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {editableQueryParams.length === 0 && (
                    <p className="text-sm text-zinc-500 italic">No query parameters.</p>
                  )}
                </div>
              </div>

              {/* Reconstructed URL */}
              <div className="space-y-3 pt-4 border-t border-zinc-100">
                <h3 className="text-sm font-semibold text-zinc-900">Reconstructed URL</h3>
                <div className={`rounded-lg border p-3 flex items-start gap-3 transition-colors ${
                  hasQueryChanges ? 'border-amber-300 bg-amber-50/50' : 'border-zinc-200 bg-zinc-50'
                }`}>
                  <code className="flex-1 break-all text-sm font-mono text-zinc-900">
                    {reconstructedUrl}
                  </code>
                  <button
                    onClick={() => handleCopy(reconstructedUrl || '', 'reconstructed')}
                    className="shrink-0 text-xs font-medium text-zinc-600 hover:text-zinc-900 px-2 py-1 rounded hover:bg-zinc-200 transition-colors"
                  >
                    {copiedField === 'reconstructed' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                {hasQueryChanges && (
                  <p className="text-xs text-amber-700">
                    Modified from original URL.
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        {/* Encode/Decode Utility Card */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-4">
          <h3 className="text-sm font-semibold text-zinc-900">Component Encode / Decode</h3>
          <div>
            <label htmlFor="encode-input" className="block text-xs font-medium text-zinc-600 mb-1">
              Input Text
            </label>
            <input
              id="encode-input"
              type="text"
              value={encodeInput}
              onChange={(e) => setEncodeInput(e.target.value)}
              placeholder="Enter text to encode or decode..."
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm font-mono focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 outline-none"
            />
          </div>
          
          {encodeInput && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Encoded</span>
                  <button
                    onClick={() => handleCopy(encodedOutput, 'encoded')}
                    className="text-xs text-zinc-600 hover:text-zinc-900"
                  >
                    {copiedField === 'encoded' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <div className="rounded-md border border-zinc-200 bg-zinc-50 p-2 break-all font-mono text-xs text-zinc-900 min-h-[2.5rem]">
                  {encodedOutput}
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Decoded</span>
                  <button
                    onClick={() => handleCopy(decodedOutput, 'decoded')}
                    className="text-xs text-zinc-600 hover:text-zinc-900"
                  >
                    {copiedField === 'decoded' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <div className="rounded-md border border-zinc-200 bg-zinc-50 p-2 break-all font-mono text-xs text-zinc-900 min-h-[2.5rem]">
                  {decodedOutput}
                </div>
              </div>
            </div>
          )}
        </div>

        <PrivacyNotice />
      </div>
    </UtilityPage>
  );
}