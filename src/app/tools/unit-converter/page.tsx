'use client';

import { useState } from 'react';
import { convertUnits, type Category, type LengthUnit, type WeightUnit } from '@/lib/unit-converter/convert';
import UtilityPage from '@/components/utility/utility-page';
import UtilityHeader from '@/components/utility/utility-header';
import PrivacyNotice from '@/components/utility/privacy-notice';
import KnowledgeSection from '@/components/utility/knowledge-section';
import { unitConverterKnowledge } from '@/content/utilities/unit-converter';

const LENGTH_UNITS: { value: LengthUnit; label: string }[] = [
  { value: 'meter', label: 'Meter (m)' },
  { value: 'kilometer', label: 'Kilometer (km)' },
  { value: 'feet', label: 'Feet (ft)' },
  { value: 'inch', label: 'Inch (in)' },
];

const WEIGHT_UNITS: { value: WeightUnit; label: string }[] = [
  { value: 'kilogram', label: 'Kilogram (kg)' },
  { value: 'gram', label: 'Gram (g)' },
  { value: 'pound', label: 'Pound (lb)' },
  { value: 'ounce', label: 'Ounce (oz)' },
];

export default function UnitConverterPage() {
  const [category, setCategory] = useState<Category>('length');
  const [value, setValue] = useState<string>('1');
  const [sourceUnit, setSourceUnit] = useState<LengthUnit | WeightUnit>('meter');
  const [targetUnit, setTargetUnit] = useState<LengthUnit | WeightUnit>('feet');

  const handleCategoryChange = (nextCategory: Category) => {
    setCategory(nextCategory);
    if (nextCategory === 'length') {
      setSourceUnit('meter');
      setTargetUnit('feet');
    } else {
      setSourceUnit('kilogram');
      setTargetUnit('pound');
    }
  };

  // Derived state: no useEffect needed
  const numValue = Number(value);
  const conversion =
    value === '' || !Number.isFinite(numValue)
      ? { ok: false as const, error: 'Please enter a valid number.' }
      : convertUnits(numValue, sourceUnit, targetUnit, category);

  const result = conversion.ok ? Number(conversion.value.toFixed(6)).toString() : '';
  const error = conversion.ok ? null : conversion.error;

  const units = category === 'length' ? LENGTH_UNITS : WEIGHT_UNITS;
  const targetLabel = units.find(u => u.value === targetUnit)?.label.split(' ')[1]?.replace(')', '').replace('(', '') || targetUnit;

  return (
    <UtilityPage>
      <UtilityHeader
        title="Unit Converter"
        description="Convert common length and weight units instantly. Your measurements are processed locally in your browser."
      />

      <div className="space-y-8 max-w-2xl mx-auto">
        <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-6">
          
          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">Category</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  value="length"
                  checked={category === 'length'}
                  onChange={() => handleCategoryChange('length')}
                  className="text-zinc-900 focus:ring-zinc-500"
                />
                <span className="text-sm text-zinc-700">Length</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  value="weight"
                  checked={category === 'weight'}
                  onChange={() => handleCategoryChange('weight')}
                  className="text-zinc-900 focus:ring-zinc-500"
                />
                <span className="text-sm text-zinc-700">Weight</span>
              </label>
            </div>
          </div>

          {/* Value Input */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Value</label>
            <input
              type="number"
              step="any"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 outline-none"
              placeholder="Enter a number"
            />
          </div>

          {/* Unit Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">From</label>
              <select
                value={sourceUnit}
                onChange={(e) => setSourceUnit(e.target.value as LengthUnit | WeightUnit)}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 outline-none bg-white"
              >
                {units.map((u) => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">To</label>
              <select
                value={targetUnit}
                onChange={(e) => setTargetUnit(e.target.value as LengthUnit | WeightUnit)}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 outline-none bg-white"
              >
                {units.map((u) => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Result Display */}
          <div className="pt-4 border-t border-zinc-100">
            <label className="block text-sm font-medium text-zinc-700 mb-1">Result</label>
            {error ? (
              <p className="text-sm text-red-600">{error}</p>
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-semibold text-zinc-900">
                  {result || '0'}
                </span>
                <span className="text-sm text-zinc-500">
                  {targetLabel}
                </span>
              </div>
            )}
          </div>

        </div>

        <PrivacyNotice />
        <KnowledgeSection {...unitConverterKnowledge} />
      </div>
    </UtilityPage>
  );
}