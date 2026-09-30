'use client';

import { useState, useCallback } from 'react';
import { checkContrast } from '@/lib/color-contrast/contrast';
import type { ContrastResult } from '@/lib/color-contrast/types';
import UtilityPage from '@/components/utility/utility-page';
import UtilityHeader from '@/components/utility/utility-header';
import UtilityButton from '@/components/utility/utility-button';
import PrivacyNotice from '@/components/utility/privacy-notice';
import KnowledgeSection from '@/components/utility/knowledge-section';
import { colorContrastKnowledge } from '@/content/utilities/color-contrast';

function WcagBadge({ label, pass }: { label: string; pass: boolean }) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-3 rounded-lg border ${
        pass
          ? 'bg-green-50 border-green-200'
          : 'bg-red-50 border-red-200'
      }`}
    >
      <span
        className={`text-xs font-semibold uppercase tracking-wider ${
          pass ? 'text-green-700' : 'text-red-700'
        }`}
      >
        {label}
      </span>
      <span
        className={`text-lg font-bold mt-1 ${
          pass ? 'text-green-800' : 'text-red-800'
        }`}
      >
        {pass ? 'PASS' : 'FAIL'}
      </span>
    </div>
  );
}

export default function ColorContrastPage() {
  const [fgColor, setFgColor] = useState<string>('');
  const [bgColor, setBgColor] = useState<string>('');
  const [result, setResult] = useState<ContrastResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheck = useCallback(() => {
    setError(null);
    setResult(null);

    if (!fgColor.trim() || !bgColor.trim()) {
      setError('Please enter both foreground and background colors.');
      return;
    }

    const checkResult = checkContrast(fgColor, bgColor);

    if (checkResult.ok) {
      setResult(checkResult.data);
    } else {
      setError(checkResult.error);
    }
  }, [fgColor, bgColor]);

  const handleClear = useCallback(() => {
    setFgColor('');
    setBgColor('');
    setResult(null);
    setError(null);
  }, []);

  return (
    <UtilityPage>
      <UtilityHeader
        title="Color Contrast Checker"
        description="Calculate the contrast ratio between two colors and verify WCAG 2.x accessibility compliance. 100% client-side."
      />

      <div className="space-y-8 max-w-3xl mx-auto">
        <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-6">

          {/* Color Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="fg-color"
                className="block text-sm font-medium text-zinc-700 mb-2"
              >
                Foreground Color (Text)
              </label>

              <div className="flex gap-2">
                <input
                  type="color"
                  value={fgColor.startsWith('#') ? fgColor : '#000000'}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="h-10 w-10 rounded border border-zinc-300 cursor-pointer p-1"
                  title="Pick a color"
                />

                <input
                  id="fg-color"
                  type="text"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  placeholder="#000000 or rgb(0,0,0)"
                  className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm font-mono focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 outline-none"
                  spellCheck={false}
                  autoComplete="off"
                />
              </div>

              <p className="mt-1 text-xs text-zinc-500">
                Supports #RGB, #RRGGBB, rgb(), rgba(a=1)
              </p>
            </div>

            <div>
              <label
                htmlFor="bg-color"
                className="block text-sm font-medium text-zinc-700 mb-2"
              >
                Background Color
              </label>

              <div className="flex gap-2">
                <input
                  type="color"
                  value={bgColor.startsWith('#') ? bgColor : '#FFFFFF'}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="h-10 w-10 rounded border border-zinc-300 cursor-pointer p-1"
                  title="Pick a color"
                />

                <input
                  id="bg-color"
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  placeholder="#FFFFFF or rgb(255,255,255)"
                  className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm font-mono focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 outline-none"
                  spellCheck={false}
                  autoComplete="off"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <UtilityButton
              onClick={handleCheck}
              className="flex-1 py-3 text-base font-semibold"
            >
              Check Contrast
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

          {/* Result Display */}
          {result && !error && (
            <div className="space-y-6 pt-4 border-t border-zinc-100">

              {/* Ratio Display */}
              <div className="text-center p-6 bg-zinc-50 rounded-lg border border-zinc-200">
                <span className="text-sm font-medium text-zinc-500 uppercase tracking-wider">
                  Contrast Ratio
                </span>

                <div className="text-4xl font-bold text-zinc-900 mt-2">
                  {result.ratio.toFixed(2)} : 1
                </div>

                <div className="text-xs text-zinc-500 mt-2 font-mono">
                  FG: {result.fgNormalized} | BG: {result.bgNormalized}
                </div>
              </div>

              {/* WCAG Badges */}
              <div>
                <h3 className="text-sm font-semibold text-zinc-900 mb-3 uppercase tracking-wider text-center">
                  WCAG 2.x Compliance
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <WcagBadge label="AA Normal" pass={result.wcag.aaNormal} />
                  <WcagBadge label="AA Large" pass={result.wcag.aaLarge} />
                  <WcagBadge label="AAA Normal" pass={result.wcag.aaaNormal} />
                  <WcagBadge label="AAA Large" pass={result.wcag.aaaLarge} />
                </div>

                <p className="text-xs text-zinc-500 text-center mt-4">
                  Large text is defined as ≥ 18pt or ≥ 14pt bold.
                </p>
              </div>

            </div>
          )}

        </div>

        <PrivacyNotice />
        <KnowledgeSection {...colorContrastKnowledge} />
      </div>
    </UtilityPage>
  );
}