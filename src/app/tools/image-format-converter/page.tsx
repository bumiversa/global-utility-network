'use client';

import { useState, useEffect } from 'react';
import { validateImageFile, getTargetFormats, getDownloadName, type ImageMime } from '@/lib/image-format-converter/validate';
import { convertImageFormat } from '@/lib/image-format-converter/convert';
import UtilityPage from '@/components/utility/utility-page';
import UtilityHeader from '@/components/utility/utility-header';
import UtilityButton from '@/components/utility/utility-button';
import PrivacyNotice from '@/components/utility/privacy-notice';
import KnowledgeSection from '@/components/utility/knowledge-section';
import { imageFormatConverterKnowledge } from '@/content/utilities/image-format-converter';

export default function ImageFormatConverterPage() {
  const [file, setFile] = useState<File | null>(null);
  const [sourceMime, setSourceMime] = useState<ImageMime | ''>('');
  const [targetMime, setTargetMime] = useState<ImageMime | ''>('');
  const [isConverting, setIsConverting] = useState(false);
  const [result, setResult] = useState<{ blob: Blob; size: number; url: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sourcePreviewUrl, setSourcePreviewUrl] = useState<string | null>(null);

  // Cleanup object URLs on unmount or when result changes
  useEffect(() => {
    return () => {
      if (sourcePreviewUrl) URL.revokeObjectURL(sourcePreviewUrl);
      if (result?.url) URL.revokeObjectURL(result.url);
    };
  }, [sourcePreviewUrl, result]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Reset state for new file
    setResult(null);
    setError(null);
    setTargetMime('');
    setSourceMime('');

    const validation = validateImageFile(selectedFile);
    if (!validation.ok) {
      setError(validation.error);
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setSourceMime(validation.mime);
    setSourcePreviewUrl(URL.createObjectURL(selectedFile));

    // Auto-select first valid target format
    const targets = getTargetFormats(validation.mime);
    if (targets.length > 0) {
      setTargetMime(targets[0]);
    }
  };

  // Handle conversion with stale-result guard
  useEffect(() => {
    if (!file || !targetMime) return;
    let isCurrent = true;

    const runConversion = async () => {
      setIsConverting(true);
      setError(null);

      try {
        const conversion = await convertImageFormat(file, targetMime);
        if (!isCurrent) return; // Ignore stale result

        if (conversion.ok) {
          setResult({
            blob: conversion.blob,
            size: conversion.size,
            url: URL.createObjectURL(conversion.blob),
          });
        } else {
          setError(conversion.error);
          setResult(null);
        }
      } catch {
        if (!isCurrent) return;
        setError('An unexpected error occurred during conversion.');
        setResult(null);
      } finally {
        if (isCurrent) {
          setIsConverting(false);
        }
      }
    };

    runConversion();

    return () => {
      isCurrent = false; // Cleanup: mark as stale if dependency changes
    };
  }, [file, targetMime]);

  const handleDownload = () => {
    if (!result || !file || !sourceMime) return;
    const downloadName = getDownloadName(file.name, targetMime as ImageMime);
    const a = document.createElement('a');
    a.href = result.url;
    a.download = downloadName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const targetFormats = sourceMime ? getTargetFormats(sourceMime) : [];

  return (
    <UtilityPage>
      <UtilityHeader
        title="Image Format Converter"
        description="Convert images between JPEG, PNG, and WEBP formats instantly. All processing happens locally in your browser."
      />

      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-6">

          {/* Upload Area */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">Select Image</label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="block w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-zinc-900 file:text-white hover:file:bg-zinc-800 cursor-pointer"
            />
            <p className="mt-2 text-xs text-zinc-500">
              Supported formats: JPEG, PNG, WEBP. Maximum size: 20MB.
            </p>
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <strong>Error:</strong> {error}
            </div>
          )}

          {/* Conversion Controls & Preview */}
          {file && !error && (
            <div className="space-y-6 pt-4 border-t border-zinc-100">

              {/* Target Format Selector */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">Convert To</label>
                <div className="flex gap-4">
                  {targetFormats.map((mime) => {
                    const label = mime === 'image/jpeg' ? 'JPEG' : mime === 'image/png' ? 'PNG' : 'WEBP';
                    return (
                      <label key={mime} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="targetMime"
                          value={mime}
                          checked={targetMime === mime}
                          onChange={(e) => setTargetMime(e.target.value as ImageMime)}
                          className="text-zinc-900 focus:ring-zinc-500"
                        />
                        <span className="text-sm text-zinc-700">{label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Transparency Warning */}
              {targetMime === 'image/jpeg' && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 flex gap-3">
                  <span className="text-lg">⚠️</span>
                  <div>
                    <p className="font-medium">Transparency Note</p>
                    <p>JPEG does not support transparency. If your original image has transparent areas, the browser will composite them (often resulting in a darkened or solid background) to make the image fully opaque.</p>
                  </div>
                </div>
              )}

              {/* Side-by-Side Preview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Original */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-zinc-700">Original ({formatBytes(file.size)})</p>
                  <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 flex items-center justify-center min-h-[200px]">
                    {sourcePreviewUrl && (
                      <img src={sourcePreviewUrl} alt="Original" className="max-w-full max-h-[300px] object-contain" />
                    )}
                  </div>
                </div>

                {/* Converted */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-zinc-700">
                    Converted {isConverting ? '(Processing...)' : result ? `(${formatBytes(result.size)})` : ''}
                  </p>
                  <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 flex items-center justify-center min-h-[200px]">
                    {isConverting ? (
                      <div className="flex flex-col items-center gap-2 text-zinc-500">
                        <div className="w-6 h-6 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" />
                        <span className="text-sm">Converting...</span>
                      </div>
                    ) : result?.url ? (
                      <img src={result.url} alt="Converted" className="max-w-full max-h-[300px] object-contain" />
                    ) : (
                      <span className="text-sm text-zinc-400">Preview will appear here</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Download Button */}
              {result && !isConverting && (
                <UtilityButton onClick={handleDownload} className="w-full">
                  Download {targetMime === 'image/jpeg' ? 'JPEG' : targetMime === 'image/png' ? 'PNG' : 'WEBP'}
                </UtilityButton>
              )}

            </div>
          )}

        </div>

        <PrivacyNotice />
        <KnowledgeSection {...imageFormatConverterKnowledge} />
      </div>
    </UtilityPage>
  );
}
