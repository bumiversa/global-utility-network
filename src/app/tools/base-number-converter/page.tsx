'use client';

import { useState } from 'react';
import { convertAllBases } from '@/lib/base-number-converter/convert';
import type { Base, ValidationErrorCode } from '@/lib/base-number-converter/types';
import UtilityPage from '@/components/utility/utility-page';
import UtilityHeader from '@/components/utility/utility-header';
import PrivacyNotice from '@/components/utility/privacy-notice';
import KnowledgeSection from '@/components/utility/knowledge-section';
import { baseNumberConverterKnowledge } from '@/content/utilities/base-number-converter';

const BASE_OPTIONS: { value: Base; label: string }[] = [
  { value: 2, label: 'Binary (2)' },
  { value: 8, label: 'Octal (8)' },
  { value: 10, label: 'Decimal (10)' },
  { value: 16, label: 'Hexadecimal (16)' },
];

const ERROR_MESSAGES: Record<ValidationErrorCode, string> = {
  INVALID_DIGIT: 'Invalid digit for the selected base.',
  FRACTION_NOT_SUPPORTED: 'Fractional numbers are not supported. Please enter an integer.',
  SCIENTIFIC_NOTATION_NOT_SUPPORTED: 'Scientific notation (e.g., 1e10) is not supported.',
  PREFIX_NOT_SUPPORTED: 'Prefixes like 0x, 0b, 0o are not supported. Enter digits only.',
  PLUS_SIGN_NOT_SUPPORTED: "The '+' sign is not supported. Use digits only or '-' for negative.",
};

export default function BaseNumberConverterPage() {
  const [inputValue, setInputValue] = useState<string>('');
  const [sourceBase, setSourceBase] = useState<Base>(10);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Derived state: real-time conversion without useEffect
  const result = convertAllBases(inputValue, sourceBase);

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

  const outputCards = result.ok
    ? [
        { id: 'binary', label: 'Binary', value: result.binary },
        { id: 'octal', label: 'Octal', value: result.octal },
        { id: 'decimal', label: 'Decimal', value: result.decimal },
        { id: 'hex', label: 'Hexadecimal', value: result.hex },
      ]
    : [];

  const hasInput = inputValue.trim() !== '';

  return (
    <UtilityPage>
      <UtilityHeader
        title="Base Number Converter"
        description="Convert integers between Binary, Octal, Decimal, and Hexadecimal instantly. Supports arbitrary-precision integers. 100% client-side."
      />

      <div className="space-y-8 max-w-2xl mx-auto">
        <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-6">

          {/* Source Base Selector */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">Source Base</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {BASE_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-sm cursor-pointer transition-colors ${
                    sourceBase === opt.value
                      ? 'border-zinc-900 bg-zinc-900 text-white'
                      : 'border-zinc-300 bg-white text-zinc-700 hover:border-zinc-500'
                  }`}
                >
                  <input
                    type="radio"
                    name="sourceBase"
                    value={opt.value}
                    checked={sourceBase === opt.value}
                    onChange={() => setSourceBase(opt.value)}
                    className="sr-only"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          {/* Input */}
          <div>
            <label htmlFor="base-input" className="block text-sm font-medium text-zinc-700 mb-1">
              Value
            </label>
            <input
              id="base-input"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={sourceBase === 16 ? 'e.g., FF or DEADBEEF' : sourceBase === 2 ? 'e.g., 10101010' : sourceBase === 8 ? 'e.g., 377' : 'e.g., 255'}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 font-mono text-sm focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 outline-none"
              autoComplete="off"
              spellCheck={false}
            />
            <p className="mt-1 text-xs text-zinc-500">
              Integer only. No prefixes (0x, 0b). Negative numbers supported with &quot;-&quot;.
            </p>
          </div>

          {/* Error Display */}
          {hasInput && !result.ok && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {ERROR_MESSAGES[result.code] || result.message}
            </div>
          )}

          {/* Output Grid */}
          {hasInput && result.ok && (
            <div className="space-y-4 pt-4 border-t border-zinc-100">
              <label className="block text-sm font-medium text-zinc-700">Converted Outputs</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {outputCards.map((card) => (
                  <div
                    key={card.id}
                    className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 flex flex-col gap-2"
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
                    <div className="min-h-[1.5rem] break-all font-mono text-sm text-zinc-900">
                      {card.value || <span className="text-zinc-400">0</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        <PrivacyNotice />
        <KnowledgeSection {...baseNumberConverterKnowledge} />
      </div>
    </UtilityPage>
  );
}