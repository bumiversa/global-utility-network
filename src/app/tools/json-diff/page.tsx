"use client";

import { useState } from "react";
import { compareJson } from "@/lib/json-diff/compare";
import UtilityPage from "@/components/utility/utility-page";
import UtilityHeader from "@/components/utility/utility-header";
import UtilityEditor from "@/components/utility/utility-editor";
import UtilityButton from "@/components/utility/utility-button";
import PrivacyNotice from "@/components/utility/privacy-notice";
import KnowledgeSection from "@/components/utility/knowledge-section";
import { jsonDiffKnowledge } from "@/content/utilities/json-diff";

export default function JsonDiffPage() {
  const [before, setBefore] = useState('');
  const [after, setAfter] = useState('');
  const [result, setResult] = useState<ReturnType<typeof compareJson> | null>(null);

  function handleCompare() {
    if (!before.trim() || !after.trim()) {
      setResult({
        ok: false,
        side: !before.trim() ? "before" : "after",
        error: "Please enter JSON in both fields before comparing.",
      });
      return;
    }

    setResult(compareJson(before, after));
  }

  return (
    <UtilityPage>
      <UtilityHeader
        title="JSON Diff & Compare"
        description="Compare two JSON documents structurally. Identify added, removed, and changed values instantly."
      />

      <div className="space-y-6">
        {/* Input Editors */}
        <div className="grid gap-6 md:grid-cols-2">
          <UtilityEditor
            label="JSON A (Before)"
            placeholder="Paste first JSON here..."
            value={before}
            onChange={(e) => setBefore(e.target.value)}
          />
          <UtilityEditor
            label="JSON B (After)"
            placeholder="Paste second JSON here..."
            value={after}
            onChange={(e) => setAfter(e.target.value)}
          />
        </div>

        {/* Results */}
        {result && (
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-6">
            {!result.ok ? (
              <p className="text-sm text-red-600">{result.error}</p>
            ) : result.entries.length === 0 ? (
              <p className="text-sm text-zinc-600">No differences found.</p>
            ) : (
              <div className="space-y-4">
                <h2 className="text-base font-semibold text-zinc-900">
                  {result.entries.length} difference{result.entries.length === 1 ? "" : "s"} found
                </h2>

                {result.entries.map((entry, index) => (
                  <div key={`${entry.path}-${entry.kind}-${index}`} className="rounded-lg bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-3 text-sm">
                      <span className="font-mono font-medium text-zinc-900">{entry.path || "root"}</span>
                      <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium uppercase text-zinc-600">
                        {entry.kind}
                      </span>
                    </div>

                    <div className="mt-3 grid gap-4 md:grid-cols-2">
                      <div>
                        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500">Before</p>
                        <pre className="overflow-x-auto rounded-md bg-zinc-50 p-3 text-xs font-mono">
                          {entry.before === undefined ? "-" : JSON.stringify(entry.before, null, 2)}
                        </pre>
                      </div>

                      <div>
                        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500">After</p>
                        <pre className="overflow-x-auto rounded-md bg-zinc-50 p-3 text-xs font-mono">
                          {entry.after === undefined ? "-" : JSON.stringify(entry.after, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Compare Button - Di Bawah */}
        <div className="flex justify-center pt-4">
          <UtilityButton onClick={handleCompare}>Compare JSON</UtilityButton>
        </div>
      </div>

      <PrivacyNotice />
      <KnowledgeSection {...jsonDiffKnowledge} />
    </UtilityPage>
  );
}
