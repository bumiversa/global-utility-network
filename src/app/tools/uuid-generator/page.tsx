'use client';

import { useState } from 'react';
import { generateUuids } from '@/lib/uuid-generator/generator';
import { MIN_QUANTITY, MAX_QUANTITY } from '@/lib/uuid-generator/constants';
import type { UuidVersion } from '@/lib/uuid-generator/types';
import UtilityPage from '@/components/utility/utility-page';
import UtilityHeader from '@/components/utility/utility-header';
import UtilityButton from '@/components/utility/utility-button';
import PrivacyNotice from '@/components/utility/privacy-notice';
import KnowledgeSection from '@/components/utility/knowledge-section';
import { uuidGeneratorKnowledge } from '@/content/utilities/uuid-generator';

export default function UuidGeneratorPage() {
  const [version, setVersion] = useState<UuidVersion>('v4');
  const [quantity, setQuantity] = useState<number>(1);
  const [generatedUuids, setGeneratedUuids] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const handleQuantityChange = (value: string) => {
    const parsed = parseInt(value, 10);
    if (isNaN(parsed)) {
      setQuantity(1);
    } else {
      setQuantity(Math.max(MIN_QUANTITY, Math.min(MAX_QUANTITY, parsed)));
    }
  };

  const handleGenerate = () => {
    const result = generateUuids({ version, quantity });
    if (result.ok) {
      setGeneratedUuids(result.uuids);
      setError(null);
      setCopiedIndex(null);
      setCopiedAll(false);
    } else {
      setError(result.error);
      setGeneratedUuids([]);
    }
  };

  const handleCopySingle = async (uuid: string, index: number) => {
    try {
      await navigator.clipboard.writeText(uuid);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      // Silent fail
    }
  };

  const handleCopyAll = async () => {
    try {
      await navigator.clipboard.writeText(generatedUuids.join('\n'));
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch {
      // Silent fail
    }
  };

  return (
    <UtilityPage>
      <UtilityHeader
        title="UUID Generator"
        description="Generate standard UUID v4 and v7 identifiers locally in your browser. No storage, no transmission."
      />

      <div className="space-y-8 max-w-2xl mx-auto">
        <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-6">
          
          {/* Version Selector */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">Version</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="version"
                  value="v4"
                  checked={version === 'v4'}
                  onChange={() => setVersion('v4')}
                  className="text-zinc-900 focus:ring-zinc-500"
                />
                <span className="text-sm text-zinc-700">UUID v4 (Random)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="version"
                  value="v7"
                  checked={version === 'v7'}
                  onChange={() => setVersion('v7')}
                  className="text-zinc-900 focus:ring-zinc-500"
                />
                <span className="text-sm text-zinc-700">UUID v7 (Time-ordered)</span>
              </label>
            </div>
          </div>

          {/* Quantity Control */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-zinc-700">Quantity</label>
              <span className="text-sm font-mono font-semibold text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded">
                {quantity}
              </span>
            </div>
            <input
              type="range"
              min={MIN_QUANTITY}
              max={MAX_QUANTITY}
              value={quantity}
              onChange={(e) => handleQuantityChange(e.target.value)}
              className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-900"
            />
            <div className="flex justify-between text-xs text-zinc-500 mt-1">
              <span>{MIN_QUANTITY}</span>
              <span>{MAX_QUANTITY}</span>
            </div>
            <input
              type="number"
              min={MIN_QUANTITY}
              max={MAX_QUANTITY}
              value={quantity}
              onChange={(e) => handleQuantityChange(e.target.value)}
              className="mt-2 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm font-mono focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 outline-none"
            />
          </div>

          {/* Generate Button */}
          <UtilityButton onClick={handleGenerate} className="w-full py-3 text-base font-semibold">
            Generate UUIDs
          </UtilityButton>

          {/* Error Display */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <strong>Error:</strong> {error}
            </div>
          )}

          {/* Output Display */}
          {generatedUuids.length > 0 && !error && (
            <div className="space-y-3 pt-4 border-t border-zinc-100">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-zinc-700">
                  Generated UUIDs ({generatedUuids.length})
                </label>
                <button
                  onClick={handleCopyAll}
                  className="text-xs font-medium text-zinc-600 hover:text-zinc-900 bg-white border border-zinc-200 px-3 py-1.5 rounded-md shadow-sm transition-colors"
                >
                  {copiedAll ? 'Copied All!' : 'Copy All'}
                </button>
              </div>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {generatedUuids.map((uuid, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 p-3"
                  >
                    <code className="flex-1 break-all font-mono text-sm text-zinc-900">
                      {uuid}
                    </code>
                    <button
                      onClick={() => handleCopySingle(uuid, index)}
                      className="shrink-0 text-xs font-medium text-zinc-600 hover:text-zinc-900 bg-white border border-zinc-200 px-2 py-1 rounded transition-colors"
                    >
                      {copiedIndex === index ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        <PrivacyNotice />
        <KnowledgeSection {...uuidGeneratorKnowledge} />
      </div>
    </UtilityPage>
  );
}