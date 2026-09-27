'use client';

import { useState } from 'react';
import { convertCase } from '@/lib/text-case-converter/convert';
import UtilityPage from '@/components/utility/utility-page';
import UtilityHeader from '@/components/utility/utility-header';
import PrivacyNotice from '@/components/utility/privacy-notice';
import KnowledgeSection from '@/components/utility/knowledge-section';
import { textCaseConverterKnowledge } from '@/content/utilities/text-case-converter';

export default function TextCaseConverterPage() {
  const [inputText, setInputText] = useState<string>('');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Derived state: real-time conversion without useEffect
  const results = convertCase(inputText);

  const handleCopy = async (text: string, fieldName: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const outputCards = [
    { id: 'camel', label: 'camelCase', value: results.camel },
    { id: 'pascal', label: 'PascalCase', value: results.pascal },
    { id: 'snake', label: 'snake_case', value: results.snake },
    { id: 'upperSnake', label: 'UPPER_SNAKE_CASE', value: results.upperSnake },
    { id: 'kebab', label: 'kebab-case', value: results.kebab },
    { id: 'upperKebab', label: 'UPPER-KEBAB-CASE', value: results.upperKebab },
    { id: 'title', label: 'Title Case', value: results.title, fullWidth: true },
  ];

  return (
    <UtilityPage>
      <UtilityHeader
        title="Text Case & Naming Converter"
        description="Instantly convert text between camelCase, snake_case, kebab-case, and other programming naming conventions. 100% client-side."
      />

      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-6">
          
          {/* Input Area */}
          <div>
            <label htmlFor="input-text" className="block text-sm font-medium text-zinc-700 mb-2">
              Input Text
            </label>
            <textarea
              id="input-text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="e.g., helloWorld API_response-kebabCase"
              rows={4}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm font-mono focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 outline-none resize-y"
            />
            <p className="mt-2 text-xs text-zinc-500">
              Special characters and punctuation are automatically stripped to ensure clean naming conventions.
            </p>
          </div>

          {/* Output Grid */}
          {inputText.trim() !== '' && (
            <div className="space-y-4 pt-4 border-t border-zinc-100">
              <label className="block text-sm font-medium text-zinc-700">Converted Outputs</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {outputCards.map((card) => (
                  <div 
                    key={card.id} 
                    className={`rounded-lg border border-zinc-200 bg-zinc-50 p-4 flex flex-col gap-3 ${card.fullWidth ? 'md:col-span-2' : ''}`}
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
                      {card.value || <span className="text-zinc-400 italic">Waiting for input...</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        <PrivacyNotice />
        <KnowledgeSection {...textCaseConverterKnowledge} />
      </div>
    </UtilityPage>
  );
}