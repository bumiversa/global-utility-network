'use client';

import { useState, useMemo } from 'react';
import { analyzeText } from '@/lib/word-counter/analyze';
import UtilityPage from '@/components/utility/utility-page';
import UtilityHeader from '@/components/utility/utility-header';
import UtilityEditor from '@/components/utility/utility-editor';
import UtilityButton from '@/components/utility/utility-button';
import PrivacyNotice from '@/components/utility/privacy-notice';
import KnowledgeSection from '@/components/utility/knowledge-section';
import { wordCounterKnowledge } from '@/content/utilities/word-counter';

export default function WordCounterPage() {
  const [input, setInput] = useState('');

  // Real-time analysis (O(N) complexity, sangat ringan untuk teks normal)
  const stats = useMemo(() => analyzeText(input), [input]);

  const handleClear = () => {
    setInput('');
  };

  return (
    <UtilityPage>
      <UtilityHeader
        title="Word & Character Counter"
        description="Analyze your text instantly. Get accurate counts for characters, words, and lines directly in your browser."
      />

      <div className="space-y-6">
        <UtilityEditor
          label="Input Text"
          placeholder="Type or paste your text here to analyze..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Characters" value={stats.characters} />
          <StatCard label="Characters (no spaces)" value={stats.charactersNoSpaces} />
          <StatCard label="Words" value={stats.words} />
          <StatCard label="Lines" value={stats.lines} />
        </div>

        {input && (
          <div className="flex justify-center pt-2">
            <UtilityButton onClick={handleClear} variant="secondary">
              Clear Text
            </UtilityButton>
          </div>
        )}
      </div>

      <PrivacyNotice />
      <KnowledgeSection {...wordCounterKnowledge} />
    </UtilityPage>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-6 text-center transition-shadow hover:shadow-sm">
      <p className="text-sm font-medium text-zinc-600">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-zinc-900">{value}</p>
    </div>
  );
}
