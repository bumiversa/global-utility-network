"use client";

import { useState } from "react";
import { cleanText } from "@/lib/text-cleaner/transform";
import UtilityPage from "@/components/utility/utility-page";
import UtilityHeader from "@/components/utility/utility-header";
import UtilityEditor from "@/components/utility/utility-editor";
import UtilityButton from "@/components/utility/utility-button";
import PrivacyNotice from "@/components/utility/privacy-notice";
import KnowledgeSection from "@/components/utility/knowledge-section";
import { textCleanerKnowledge } from "@/content/utilities/text-cleaner";

export default function TextCleanerPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [stats, setStats] = useState<{ original: number; cleaned: number; duplicates: number; empty: number } | null>(null);
  const [copied, setCopied] = useState(false);

  const [removeDuplicates, setRemoveDuplicates] = useState(true);
  const [trimLines, setTrimLines] = useState(true);
  const [removeEmptyLines, setRemoveEmptyLines] = useState(true);
  const [sortLines, setSortLines] = useState(false);

  const handleClean = () => {
    const result = cleanText(input, {
      removeDuplicates,
      trimLines,
      removeEmptyLines,
      sortLines,
    });

    if (result.ok) {
      setOutput(result.value);
      setStats({
        original: result.stats.originalLines,
        cleaned: result.stats.cleanedLines,
        duplicates: result.stats.duplicatesRemoved,
        empty: result.stats.emptyLinesRemoved,
      });
    }
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setStats(null);
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  return (
    <UtilityPage>
      <UtilityHeader
        title="Text Cleaner & Deduplicator"
        description="Remove duplicate lines, trim whitespace, and sort text lists instantly in your browser."
      />

      <div className="space-y-6">
        <div className="flex flex-wrap justify-center gap-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
          <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 cursor-pointer">
            <input type="checkbox" checked={removeDuplicates} onChange={(e) => setRemoveDuplicates(e.target.checked)} className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500" />
            Remove Duplicates
          </label>
          <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 cursor-pointer">
            <input type="checkbox" checked={trimLines} onChange={(e) => setTrimLines(e.target.checked)} className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500" />
            Trim Whitespace
          </label>
          <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 cursor-pointer">
            <input type="checkbox" checked={removeEmptyLines} onChange={(e) => setRemoveEmptyLines(e.target.checked)} className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500" />
            Remove Empty Lines
          </label>
          <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 cursor-pointer">
            <input type="checkbox" checked={sortLines} onChange={(e) => setSortLines(e.target.checked)} className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500" />
            Sort Alphabetically
          </label>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <UtilityEditor
            label="Input Text"
            placeholder="Paste your list of text, emails, or URLs here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <UtilityEditor
            label="Cleaned Output"
            placeholder="Result will appear here..."
            value={output}
            readOnly
            actionButton={output ? (
              <button onClick={handleCopy} className="text-xs font-medium text-zinc-600 hover:text-zinc-900">
                {copied ? "Copied!" : "Copy to Clipboard"}
              </button>
            ) : null}
          />
        </div>

        {stats && (
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600">
            <div className="flex gap-4">
              <span>Original: <strong className="text-zinc-900">{stats.original}</strong> lines</span>
              <span>Cleaned: <strong className="text-zinc-900">{stats.cleaned}</strong> lines</span>
              {stats.duplicates > 0 && <span className="text-amber-600">-{stats.duplicates} duplicates</span>}
              {stats.empty > 0 && <span className="text-zinc-500">-{stats.empty} empty</span>}
            </div>
            <div className="flex gap-3">
              <UtilityButton onClick={handleClean} disabled={!input}>Clean Text</UtilityButton>
              <UtilityButton onClick={handleClear} variant="secondary">Clear All</UtilityButton>
            </div>
          </div>
        )}

        {!stats && input && (
          <div className="flex justify-center pt-2">
            <UtilityButton onClick={handleClean} disabled={!input}>Clean Text</UtilityButton>
          </div>
        )}
      </div>

      <PrivacyNotice />
      <KnowledgeSection {...textCleanerKnowledge} />
    </UtilityPage>
  );
}
