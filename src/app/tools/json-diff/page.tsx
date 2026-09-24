"use client";

import { useState } from "react";
import { compareJson } from "@/lib/json-diff/compare";

export default function Home() {
  const [before, setBefore] = useState('{"name":"Budi","age":30}');
  const [after, setAfter] = useState('{"name":"Budi","age":31}');
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
    <main className="min-h-screen bg-white px-6 py-12 text-zinc-900">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <p className="mb-2 text-sm font-medium text-zinc-500">
            Developer Utility
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            JSON Diff
          </h1>
          <p className="mt-2 max-w-2xl text-zinc-600">
            Compare two JSON documents locally in your browser.
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-medium">JSON A</span>
            <textarea
              value={before}
              onChange={(event) => setBefore(event.target.value)}
              className="min-h-72 w-full rounded-lg border border-zinc-300 p-4 font-mono text-sm outline-none focus:border-zinc-500"
              spellCheck={false}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium">JSON B</span>
            <textarea
              value={after}
              onChange={(event) => setAfter(event.target.value)}
              className="min-h-72 w-full rounded-lg border border-zinc-300 p-4 font-mono text-sm outline-none focus:border-zinc-500"
              spellCheck={false}
            />
          </label>
        </section>

        <button
          type="button"
          onClick={handleCompare}
          className="mt-6 rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-700"
        >
          Compare JSON
        </button>

        <div className="mt-6 rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600">
          <p>
            <span className="font-medium text-zinc-900">Privacy:</span>{" "}
            Your JSON is processed locally in your browser. This utility does not
            upload or store the JSON you compare.
          </p>
          <p className="mt-2">
            <span className="font-medium text-zinc-900">Analytics:</span>{" "}
            We use Google Analytics to understand visits and improve this utility.
            JSON content is not sent to Google Analytics.
          </p>
        </div>

        {result && (
          <section className="mt-8 rounded-lg border border-zinc-200 p-6">
            {result.ok ? (
              result.entries.length === 0 ? (
                <p className="text-zinc-600">No differences found.</p>
              ) : (
                <div className="space-y-3">
                  <h2 className="font-semibold">
                    {result.entries.length} difference
                    {result.entries.length === 1 ? "" : "s"}
                  </h2>

                  {result.entries.map((entry, index) => (
                    <div
                      key={`${entry.path}-${entry.kind}-${index}`}
                      className="rounded-md bg-zinc-50 p-4"
                    >
                      <div className="flex flex-wrap items-center gap-3 text-sm">
                        <span className="font-mono">{entry.path}</span>
                        <span className="text-zinc-500">{entry.kind}</span>
                      </div>

                      <div className="mt-3 grid gap-3 md:grid-cols-2">
                        <div>
                          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-zinc-500">
                            Before
                          </p>
                          <pre className="overflow-x-auto rounded-md bg-zinc-100 p-3 text-sm">
                            {entry.before === undefined
                              ? "-"
                              : JSON.stringify(entry.before, null, 2)}
                          </pre>
                        </div>

                        <div>
                          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-zinc-500">
                            After
                          </p>
                          <pre className="overflow-x-auto rounded-md bg-zinc-100 p-3 text-sm">
                            {entry.after === undefined
                              ? "-"
                              : JSON.stringify(entry.after, null, 2)}
                          </pre>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <p className="text-red-600">
                {result.error}
              </p>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
