"use client";

import { useState } from "react";
import { inspectJwt, type JwtInspectionResult } from "@/lib/jwt-inspector/inspect";
import UtilityPage from "@/components/utility/utility-page";
import UtilityHeader from "@/components/utility/utility-header";
import UtilityEditor from "@/components/utility/utility-editor";
import UtilityButton from "@/components/utility/utility-button";
import PrivacyNotice from "@/components/utility/privacy-notice";
import KnowledgeSection from "@/components/utility/knowledge-section";
import { jwtInspectorKnowledge } from "@/content/utilities/jwt-inspector";

export default function JwtInspectorPage() {
  const [token, setToken] = useState("");
  const [result, setResult] = useState<JwtInspectionResult | null>(null);

  function handleInspect() {
    setResult(inspectJwt(token));
  }

  return (
    <UtilityPage>
      <UtilityHeader
        title="JWT Inspector"
        description="Inspect a JSON Web Token locally in your browser."
      />

      <div className="space-y-6">
        <UtilityEditor
          label="JWT Token"
          placeholder="Paste your JWT here..."
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />

        <div className="flex justify-center pt-4">
          <UtilityButton onClick={handleInspect} disabled={!token.trim()}>
            Inspect JWT
          </UtilityButton>
        </div>

        {result && (
          <div className="space-y-6">
            {!result.ok ? (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {result.error}
              </div>
            ) : (
              <>
                <JsonSection title="Header" value={result.header} />
                <JsonSection title="Payload" value={result.payload} />
                <ClaimsSection result={result} />
                <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-6">
                  <h2 className="text-base font-semibold text-zinc-900">
                    Signature
                  </h2>
                  <p className="mt-1 text-xs text-zinc-500">
                    Not verified
                  </p>
                  <pre className="mt-4 overflow-x-auto rounded-lg bg-white p-4 font-mono text-xs text-zinc-800">
                    {result.signature || "(empty)"}
                  </pre>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <PrivacyNotice />
      <KnowledgeSection {...jwtInspectorKnowledge} />
    </UtilityPage>
  );
}

function JsonSection({
  title,
  value,
}: {
  title: string;
  value: Record<string, unknown>;
}) {
  return (
    <section className="rounded-xl border border-zinc-200 bg-zinc-50 p-6">
      <h2 className="text-base font-semibold text-zinc-900">{title}</h2>
      <pre className="mt-4 overflow-x-auto rounded-lg bg-white p-4 font-mono text-xs leading-6 text-zinc-800">
        {JSON.stringify(value, null, 2)}
      </pre>
    </section>
  );
}

function ClaimsSection({
  result,
}: {
  result: Extract<JwtInspectionResult, { ok: true }>;
}) {
  const claims = result.claims;
  const rows: Array<[string, string]> = [];

  if (claims.exp) {
    rows.push([
      "exp",
      `${claims.exp.date} (${claims.exp.isExpired ? "expired" : "active"})`,
    ]);
  }

  if (claims.iat) {
    rows.push(["iat", claims.iat.date]);
  }

  if (claims.nbf) {
    rows.push([
      "nbf",
      `${claims.nbf.date} (${claims.nbf.isNotYetValid ? "not yet valid" : "valid"})`,
    ]);
  }

  if (claims.iss !== undefined) rows.push(["iss", claims.iss]);
  if (claims.aud !== undefined) {
    rows.push([
      "aud",
      Array.isArray(claims.aud) ? claims.aud.join(", ") : claims.aud,
    ]);
  }
  if (claims.sub !== undefined) rows.push(["sub", claims.sub]);
  if (claims.jti !== undefined) rows.push(["jti", claims.jti]);

  return (
    <section className="rounded-xl border border-zinc-200 bg-zinc-50 p-6">
      <h2 className="text-base font-semibold text-zinc-900">Claims</h2>
      {rows.length === 0 ? (
        <p className="mt-4 text-sm text-zinc-600">
          No recognized standard claims found.
        </p>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-lg border border-zinc-200 bg-white">
          <table className="w-full text-left text-sm">
            <tbody>
              {rows.map(([name, value]) => (
                <tr key={name} className="border-b border-zinc-100 last:border-0">
                  <th className="w-24 px-4 py-3 font-mono text-xs font-medium text-zinc-600">
                    {name}
                  </th>
                  <td className="px-4 py-3 text-zinc-900">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
