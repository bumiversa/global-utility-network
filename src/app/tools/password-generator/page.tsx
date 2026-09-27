'use client';

import { useState } from 'react';
import { generatePassword, validateOptions } from '@/lib/password-generator/generator';
import { MIN_LENGTH, MAX_LENGTH } from '@/lib/password-generator/constants';
import type { PasswordOptions } from '@/lib/password-generator/types';
import UtilityPage from '@/components/utility/utility-page';
import UtilityHeader from '@/components/utility/utility-header';
import UtilityButton from '@/components/utility/utility-button';
import PrivacyNotice from '@/components/utility/privacy-notice';
import KnowledgeSection from '@/components/utility/knowledge-section';
import { passwordGeneratorKnowledge } from '@/content/utilities/password-generator';

export default function PasswordGeneratorPage() {
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    excludeAmbiguous: false,
  });

  const [generatedPassword, setGeneratedPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleOptionChange = (field: keyof PasswordOptions, value: boolean | number) => {
    setOptions(prev => ({ ...prev, [field]: value }));
    // Clear error when user changes options
    setError(null);
  };

  const handleGenerate = () => {
    const validation = validateOptions(options);
    if (!validation.ok) {
      setError(validation.error);
      setGeneratedPassword('');
      return;
    }

    const result = generatePassword(options);
    if (result.ok) {
      setGeneratedPassword(result.password);
      setError(null);
      setCopied(false);
    } else {
      setError(result.error);
      setGeneratedPassword('');
    }
  };

  const handleCopy = async () => {
    if (!generatedPassword) return;
    try {
      await navigator.clipboard.writeText(generatedPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Silent fail
    }
  };

  return (
    <UtilityPage>
      <UtilityHeader
        title="Password Generator"
        description="Generate cryptographically secure, unbiased passwords entirely in your browser. No storage, no transmission."
      />

      <div className="space-y-8 max-w-2xl mx-auto">
        <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-6">
          
          {/* Length Control */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-zinc-700">Length</label>
              <span className="text-sm font-mono font-semibold text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded">
                {options.length}
              </span>
            </div>
            <input
              type="range"
              min={MIN_LENGTH}
              max={MAX_LENGTH}
              value={options.length}
              onChange={(e) => handleOptionChange('length', parseInt(e.target.value, 10))}
              className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-900"
            />
            <div className="flex justify-between text-xs text-zinc-500 mt-1">
              <span>{MIN_LENGTH}</span>
              <span>{MAX_LENGTH}</span>
            </div>
          </div>

          {/* Character Sets */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-zinc-700">Character Sets</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex items-center gap-2 p-3 rounded-lg border border-zinc-200 cursor-pointer hover:bg-zinc-50 transition-colors">
                <input
                  type="checkbox"
                  checked={options.uppercase}
                  onChange={(e) => handleOptionChange('uppercase', e.target.checked)}
                  className="w-4 h-4 text-zinc-900 rounded border-zinc-300 focus:ring-zinc-500"
                />
                <span className="text-sm text-zinc-700">Uppercase (A-Z)</span>
              </label>
              <label className="flex items-center gap-2 p-3 rounded-lg border border-zinc-200 cursor-pointer hover:bg-zinc-50 transition-colors">
                <input
                  type="checkbox"
                  checked={options.lowercase}
                  onChange={(e) => handleOptionChange('lowercase', e.target.checked)}
                  className="w-4 h-4 text-zinc-900 rounded border-zinc-300 focus:ring-zinc-500"
                />
                <span className="text-sm text-zinc-700">Lowercase (a-z)</span>
              </label>
              <label className="flex items-center gap-2 p-3 rounded-lg border border-zinc-200 cursor-pointer hover:bg-zinc-50 transition-colors">
                <input
                  type="checkbox"
                  checked={options.numbers}
                  onChange={(e) => handleOptionChange('numbers', e.target.checked)}
                  className="w-4 h-4 text-zinc-900 rounded border-zinc-300 focus:ring-zinc-500"
                />
                <span className="text-sm text-zinc-700">Numbers (0-9)</span>
              </label>
              <label className="flex items-center gap-2 p-3 rounded-lg border border-zinc-200 cursor-pointer hover:bg-zinc-50 transition-colors">
                <input
                  type="checkbox"
                  checked={options.symbols}
                  onChange={(e) => handleOptionChange('symbols', e.target.checked)}
                  className="w-4 h-4 text-zinc-900 rounded border-zinc-300 focus:ring-zinc-500"
                />
                <span className="text-sm text-zinc-700">Symbols (!@#$...)</span>
              </label>
            </div>
            
            <label className="flex items-center gap-2 p-3 rounded-lg border border-zinc-200 cursor-pointer hover:bg-zinc-50 transition-colors mt-3">
              <input
                type="checkbox"
                checked={options.excludeAmbiguous}
                onChange={(e) => handleOptionChange('excludeAmbiguous', e.target.checked)}
                className="w-4 h-4 text-zinc-900 rounded border-zinc-300 focus:ring-zinc-500"
              />
              <div className="flex flex-col">
                <span className="text-sm text-zinc-700">Exclude ambiguous characters</span>
                <span className="text-xs text-zinc-500">Removes l, 1, I, O, 0, |, `, &apos;, &quot;</span>
              </div>
            </label>
          </div>

          {/* Generate Button */}
          <UtilityButton onClick={handleGenerate} className="w-full py-3 text-base font-semibold">
            Generate Password
          </UtilityButton>

          {/* Error Display */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <strong>Error:</strong> {error}
            </div>
          )}

          {/* Output Display */}
          {generatedPassword && !error && (
            <div className="space-y-3 pt-4 border-t border-zinc-100">
              <label className="block text-sm font-medium text-zinc-700">Generated Password</label>
              <div className="relative">
                <div className="w-full rounded-lg border border-zinc-300 bg-zinc-50 p-4 font-mono text-lg break-all text-zinc-900 min-h-[3.5rem] flex items-center">
                  {generatedPassword}
                </div>
                <button
                  onClick={handleCopy}
                  className="absolute top-2 right-2 text-xs font-medium text-zinc-600 hover:text-zinc-900 bg-white border border-zinc-200 px-3 py-1.5 rounded-md shadow-sm transition-colors"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <p className="text-xs text-zinc-500 text-right">
                Length: {generatedPassword.length} characters
              </p>
            </div>
          )}

        </div>

        <PrivacyNotice />
        <KnowledgeSection {...passwordGeneratorKnowledge} />
      </div>
    </UtilityPage>
  );
}