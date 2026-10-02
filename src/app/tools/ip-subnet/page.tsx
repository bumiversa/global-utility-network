'use client';

import { useState, useCallback } from 'react';
import { calculateSubnet } from '@/lib/ip-subnet/calculator';
import type { SubnetResult } from '@/lib/ip-subnet/types';
import UtilityPage from '@/components/utility/utility-page';
import UtilityHeader from '@/components/utility/utility-header';
import UtilityButton from '@/components/utility/utility-button';
import PrivacyNotice from '@/components/utility/privacy-notice';
import KnowledgeSection from '@/components/utility/knowledge-section';
import { ipSubnetKnowledge } from '@/content/utilities/ip-subnet';

type ResultRowProps = {
  label: string;
  value: string | number;
  isBinary?: boolean;
};

function ResultRow({ label, value, isBinary = false }: ResultRowProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center py-3 border-b border-zinc-100 last:border-0">
      <span className="text-sm font-medium text-zinc-500 sm:w-1/3 mb-1 sm:mb-0">
        {label}
      </span>
      <span
        className={`text-sm font-mono text-zinc-900 sm:w-2/3 break-all ${
          isBinary ? 'text-xs text-zinc-600' : ''
        }`}
      >
        {value}
      </span>
    </div>
  );
}

export default function IpSubnetPage() {
  const [cidr, setCidr] = useState<string>('');
  const [result, setResult] = useState<SubnetResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = useCallback(() => {
    setError(null);
    setResult(null);

    if (!cidr.trim()) {
      setError('Please enter a valid IPv4 CIDR (e.g., 192.168.1.0/24).');
      return;
    }

    const calcResult = calculateSubnet(cidr);
    if (calcResult.ok) {
      setResult(calcResult.data);
    } else {
      setError(calcResult.error);
    }
  }, [cidr]);

  const handleClear = useCallback(() => {
    setCidr('');
    setResult(null);
    setError(null);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCalculate();
    }
  }, [handleCalculate]);

  return (
    <UtilityPage>
      <UtilityHeader
        title="IP Subnet Calculator"
        description="Calculate network address, broadcast, and host ranges for IPv4 CIDR blocks. 100% client-side deterministic calculation."
      />

      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-6">

          {/* Input Section */}
          <div className="space-y-2">
            <label htmlFor="cidr-input" className="block text-sm font-medium text-zinc-700">
              IPv4 CIDR Notation
            </label>
            <div className="flex gap-3">
              <input
                id="cidr-input"
                type="text"
                value={cidr}
                onChange={(e) => setCidr(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g., 192.168.1.25/24"
                className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm font-mono focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 outline-none"
                spellCheck={false}
                autoComplete="off"
              />
              <UtilityButton onClick={handleCalculate} className="px-6 py-2 text-sm font-semibold whitespace-nowrap">
                Calculate
              </UtilityButton>
              <button
                onClick={handleClear}
                className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors"
              >
                Clear
              </button>
            </div>
            <p className="text-xs text-zinc-500">
              Host bits are automatically normalized (e.g., 192.168.1.25/24 becomes 192.168.1.0/24).
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <strong>Error:</strong> {error}
            </div>
          )}

          {/* Result Display */}
          {result && !error && (
            <div className="space-y-4 pt-4 border-t border-zinc-100">
              <h3 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider">
                Subnet Analysis: {result.cidr}
              </h3>

              <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 space-y-1">
                <ResultRow label="Network Address" value={result.networkAddress} />
                <ResultRow label="Broadcast Address" value={result.broadcastAddress} />
                <ResultRow label="Subnet Mask" value={result.subnetMask} />
                <ResultRow label="Wildcard Mask" value={result.wildcardMask} />
                <ResultRow label="First Usable Host" value={result.firstHost} />
                <ResultRow label="Last Usable Host" value={result.lastHost} />
                <ResultRow label="Total Addresses" value={result.totalAddresses.toLocaleString()} />
                <ResultRow label="Usable Hosts" value={result.usableHosts.toLocaleString()} />

                <div className="pt-3 mt-3 border-t border-zinc-200">
                  <ResultRow label="Binary IP Address" value={result.binaryIP} isBinary />
                  <ResultRow label="Binary Subnet Mask" value={result.binaryMask} isBinary />
                </div>
              </div>
            </div>
          )}

        </div>

        <PrivacyNotice />
        <KnowledgeSection {...ipSubnetKnowledge} />
      </div>
    </UtilityPage>
  );
}
