'use client';

import { useState, useEffect } from 'react';
import { hashText } from '@/lib/hash-generator/hash';
import type { HashResult } from '@/lib/hash-generator/types';
import UtilityPage from '@/components/utility/utility-page';
import UtilityHeader from '@/components/utility/utility-header';
import PrivacyNotice from '@/components/utility/privacy-notice';
import KnowledgeSection from '@/components/utility/knowledge-section';
import { hashGeneratorKnowledge } from '@/content/utilities/hash-generator';

export default function HashGeneratorPage() {
  const [inputText, setInputText] = useState<string>('');
  const [sha256Result, setSha256Result] = useState<HashResult | null>(null);
  const [sha512Result, setSha512Result] = useState<HashResult | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Async hashing with stale-result protection
  useEffect(() => {
    let isCurrent = true;

    const computeHashes = async () => {
      const [sha256, sha512] = await Promise.all([
        hashText(inputText, 'SHA-256'),
        hashText(inputText, 'SHA-512'),
      ]);

      // Stale-result guard: ignore if input changed during async operation
      if (!isCurrent) return;

      setSha256Result(sha256);
      setSha512Result(sha512);
    };

    computeHashes();

    return () => {
      isCurrent = false;
    };
  }, [inputText]);

  const handleCopy = async (text: string, fieldName: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      // Clipboard API may fail in some contexts
    }
  };

  const getDisplayValue = (result: HashResult | null): string => {
    if (!result) return '';
    if (result.ok) return result.hash;
    return '';
  };

  const sha256Value = getDisplayValue(sha256Result);
  const sha512Value = getDisplayValue(sha512Result);

  const outputCards = [
    {
      id: 'sha256',
      label: 'SHA-256',
      value: sha256Value,
      length: 64,
    },
    {
      id: 'sha512',
      label: 'SHA-512',
      value: sha512Value,
      length: 128,
    },
  ];

  return (
    <UtilityPage>
      <UtilityHeader
        title="Hash Generator"
        description="Generate SHA-256 and SHA-512 cryptographic hashes from text instantly. UTF-8 encoded, 100% client-side using Web Crypto API."
      />

      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-6">

          {/* Input Area */}
          <div>
            <label htmlFor="hash-input" className="block text-sm font-medium text-zinc-700 mb-2">
              Text Input
            </label>
            <textarea
              id="hash-input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter text to hash (Unicode, emoji, and newlines are preserved exactly)"
              rows={5}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm font-mono focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 outline-none resize-y"
              spellCheck={false}
              autoComplete="off"
            />
            <p className="mt-1 text-xs text-zinc-500">
              Input is encoded as UTF-8 before hashing. Empty input produces a valid hash.
            </p>
          </div>

          {/* Error Display */}
          {sha256Result && !sha256Result.ok && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <strong>Error:</strong> {sha256Result.error}
            </div>
          )}

          {/* Output Grid */}
          <div className="space-y-4 pt-4 border-t border-zinc-100">
            <label className="block text-sm font-medium text-zinc-700">Hash Output</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {outputCards.map((card) => (
                <div
                  key={card.id}
                  className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      {card.label}
                    </span>
                    {card.value && (
                      <button
                        onClick={() => handleCopy(card.value, card.id)}
                        className="text-xs font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
                      >
                        {copiedField === card.id ? 'Copied!' : 'Copy'}
                      </button>
                    )}
                  </div>
                  <div className="min-h-[2rem] break-all font-mono text-xs text-zinc-900">
                    {card.value || (
                      <span className="text-zinc-400 italic">Computing...</span>
                    )}
                  </div>
                  <div className="text-xs text-zinc-500">
                    {card.value ? `${card.value.length} characters` : `${card.length} characters expected`}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        <PrivacyNotice />
        <KnowledgeSection {...hashGeneratorKnowledge} />
      </div>
    </UtilityPage>
  );
}