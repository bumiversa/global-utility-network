'use client';

import { useState } from 'react';
import { generateQrCode } from '@/lib/qr-code-generator/generate';
import UtilityPage from '@/components/utility/utility-page';
import UtilityHeader from '@/components/utility/utility-header';
import UtilityEditor from '@/components/utility/utility-editor';
import UtilityButton from '@/components/utility/utility-button';
import PrivacyNotice from '@/components/utility/privacy-notice';
import KnowledgeSection from '@/components/utility/knowledge-section';
import { qrCodeGeneratorKnowledge } from '@/content/utilities/qr-code-generator';

export default function QrCodeGeneratorPage() {
  const [input, setInput] = useState('');
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    setDataUrl(null);

    const result = await generateQrCode(input);

    if (result.ok) {
      setDataUrl(result.dataUrl);
    } else {
      setError(result.error);
    }
    
    setIsGenerating(false);
  };

  const handleDownload = () => {
    if (!dataUrl) return;
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'qr-code.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClear = () => {
    setInput('');
    setDataUrl(null);
    setError(null);
  };

  return (
    <UtilityPage>
      <UtilityHeader
        title="QR Code Generator"
        description="Generate a high-quality QR code from any text or URL instantly. 100% client-side, no data leaves your browser."
      />

      <div className="space-y-8">
        <UtilityEditor
          label="Text or URL"
          placeholder="Enter text or a URL to generate a QR code..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className="flex justify-center gap-4">
          <UtilityButton 
            onClick={handleGenerate} 
            disabled={isGenerating || !input.trim()}
          >
            {isGenerating ? 'Generating...' : 'Generate QR Code'}
          </UtilityButton>
          {dataUrl && (
            <UtilityButton onClick={handleClear} variant="secondary">
              Clear
            </UtilityButton>
          )}
        </div>

        {dataUrl && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">Result</h3>
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-8 flex flex-col items-center gap-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={dataUrl} 
                alt="Generated QR Code" 
                className="max-w-full h-auto rounded-lg border border-zinc-200 bg-white p-4 shadow-sm"
              />
              <UtilityButton onClick={handleDownload} variant="secondary">
                Download PNG
              </UtilityButton>
            </div>
          </div>
        )}
      </div>

      <PrivacyNotice />
      <KnowledgeSection {...qrCodeGeneratorKnowledge} />
    </UtilityPage>
  );
}