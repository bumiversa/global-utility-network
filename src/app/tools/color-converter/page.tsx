'use client';

import { useState } from 'react';
import { isValidHex, isValidRgb, isValidHsl } from '@/lib/color-converter/validate';
import { hexToRgb, rgbToHex, rgbToHsl, hslToRgb } from '@/lib/color-converter/convert';
import UtilityPage from '@/components/utility/utility-page';
import UtilityHeader from '@/components/utility/utility-header';
import UtilityButton from '@/components/utility/utility-button';
import PrivacyNotice from '@/components/utility/privacy-notice';
import KnowledgeSection from '@/components/utility/knowledge-section';
import { colorConverterKnowledge } from '@/content/utilities/color-converter';

export default function ColorConverterPage() {
  const [hex, setHex] = useState('#FF5733');
  const [r, setR] = useState('255');
  const [g, setG] = useState('87');
  const [b, setB] = useState('51');
  const [h, setH] = useState('10.6');
  const [s, setS] = useState('100');
  const [l, setL] = useState('60');
  const [error, setError] = useState<string | null>(null);

  const updateFromHex = (newHex: string) => {
    setHex(newHex);
    if (isValidHex(newHex)) {
      const rgb = hexToRgb(newHex);
      setR(rgb.r.toString());
      setG(rgb.g.toString());
      setB(rgb.b.toString());
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      setH(hsl.h.toString());
      setS(hsl.s.toString());
      setL(hsl.l.toString());
      setError(null);
    } else {
      setError('Invalid HEX format. Use #RRGGBB (6 digits).');
    }
  };

  const updateFromRgb = (newR: string, newG: string, newB: string) => {
    setR(newR);
    setG(newG);
    setB(newB);
    const rNum = parseInt(newR, 10);
    const gNum = parseInt(newG, 10);
    const bNum = parseInt(newB, 10);
    
    if (isValidRgb(rNum, gNum, bNum)) {
      setHex(rgbToHex(rNum, gNum, bNum));
      const hsl = rgbToHsl(rNum, gNum, bNum);
      setH(hsl.h.toString());
      setS(hsl.s.toString());
      setL(hsl.l.toString());
      setError(null);
    } else {
      setError('Invalid RGB values. Must be integers between 0 and 255.');
    }
  };

  const updateFromHsl = (newH: string, newS: string, newL: string) => {
    setH(newH);
    setS(newS);
    setL(newL);
    const hNum = parseFloat(newH);
    const sNum = parseFloat(newS);
    const lNum = parseFloat(newL);

    if (isValidHsl(hNum, sNum, lNum)) {
      const rgb = hslToRgb(hNum, sNum, lNum);
      setR(rgb.r.toString());
      setG(rgb.g.toString());
      setB(rgb.b.toString());
      setHex(rgbToHex(rgb.r, rgb.g, rgb.b));
      setError(null);
    } else {
      setError('Invalid HSL values. H: 0-360, S: 0-100, L: 0-100.');
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  // Determine preview color: use canonical RGB if valid, else fallback
  const rNum = parseInt(r, 10);
  const gNum = parseInt(g, 10);
  const bNum = parseInt(b, 10);
  const previewColor = isValidRgb(rNum, gNum, bNum) ? `rgb(${rNum}, ${gNum}, ${bNum})` : '#ffffff';

  return (
    <UtilityPage>
      <UtilityHeader
        title="Color Converter"
        description="Convert colors between HEX, RGB, and HSL formats instantly. 100% client-side."
      />

      <div className="space-y-8 max-w-2xl mx-auto">
        {/* Color Preview */}
        <div className="flex justify-center">
          <div 
            className="w-32 h-32 rounded-xl border border-zinc-200 shadow-sm transition-colors duration-200"
            style={{ backgroundColor: previewColor }}
            aria-label="Color preview"
          />
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 text-center">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {/* HEX Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-700">HEX</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={hex}
                onChange={(e) => updateFromHex(e.target.value.toUpperCase())}
                className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 font-mono text-sm focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 outline-none uppercase"
                placeholder="#RRGGBB"
              />
              <UtilityButton onClick={() => copyToClipboard(hex)} variant="secondary" className="px-4">
                Copy
              </UtilityButton>
            </div>
          </div>

          {/* RGB Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-700">RGB</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={r}
                onChange={(e) => updateFromRgb(e.target.value, g, b)}
                className="w-1/3 rounded-lg border border-zinc-300 px-3 py-2 font-mono text-sm focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 outline-none"
                placeholder="R"
                min="0"
                max="255"
              />
              <input
                type="number"
                value={g}
                onChange={(e) => updateFromRgb(r, e.target.value, b)}
                className="w-1/3 rounded-lg border border-zinc-300 px-3 py-2 font-mono text-sm focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 outline-none"
                placeholder="G"
                min="0"
                max="255"
              />
              <input
                type="number"
                value={b}
                onChange={(e) => updateFromRgb(r, g, e.target.value)}
                className="w-1/3 rounded-lg border border-zinc-300 px-3 py-2 font-mono text-sm focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 outline-none"
                placeholder="B"
                min="0"
                max="255"
              />
              <UtilityButton onClick={() => copyToClipboard(`rgb(${r}, ${g}, ${b})`)} variant="secondary" className="px-4">
                Copy
              </UtilityButton>
            </div>
          </div>

          {/* HSL Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-700">HSL</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={h}
                onChange={(e) => updateFromHsl(e.target.value, s, l)}
                className="w-1/3 rounded-lg border border-zinc-300 px-3 py-2 font-mono text-sm focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 outline-none"
                placeholder="H"
                min="0"
                max="360"
                step="0.1"
              />
              <input
                type="number"
                value={s}
                onChange={(e) => updateFromHsl(h, e.target.value, l)}
                className="w-1/3 rounded-lg border border-zinc-300 px-3 py-2 font-mono text-sm focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 outline-none"
                placeholder="S"
                min="0"
                max="100"
                step="0.1"
              />
              <input
                type="number"
                value={l}
                onChange={(e) => updateFromHsl(h, s, e.target.value)}
                className="w-1/3 rounded-lg border border-zinc-300 px-3 py-2 font-mono text-sm focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 outline-none"
                placeholder="L"
                min="0"
                max="100"
                step="0.1"
              />
            </div>
          </div>
        </div>

        <PrivacyNotice />
        <KnowledgeSection {...colorConverterKnowledge} />
      </div>
    </UtilityPage>
  );
}