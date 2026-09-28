'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { validateFile } from '@/lib/favicon-generator/validate';
import { decodeImage, renderAllFavicons } from '@/lib/favicon-generator/render';
import type { GeneratedFavicon } from '@/lib/favicon-generator/types';
import UtilityPage from '@/components/utility/utility-page';
import UtilityHeader from '@/components/utility/utility-header';
import PrivacyNotice from '@/components/utility/privacy-notice';
import KnowledgeSection from '@/components/utility/knowledge-section';
import { faviconGeneratorKnowledge } from '@/content/utilities/favicon-generator';

export default function FaviconGeneratorPage() {
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourcePreviewUrl, setSourcePreviewUrl] = useState<string | null>(null);
  const [favicons, setFavicons] = useState<GeneratedFavicon[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const processingIdRef = useRef(0);
  
  // Refs to track current URLs for safe cleanup without stale closures
  const currentPreviewRef = useRef<string | null>(null);
  const currentFaviconsRef = useRef<GeneratedFavicon[]>([]);

  // Keep refs in sync with state
  useEffect(() => {
    currentPreviewRef.current = sourcePreviewUrl;
  }, [sourcePreviewUrl]);

  useEffect(() => {
    currentFaviconsRef.current = favicons;
  }, [favicons]);

  // Unmount cleanup only
  useEffect(() => {
    return () => {
      if (currentPreviewRef.current) {
        URL.revokeObjectURL(currentPreviewRef.current);
      }
      currentFaviconsRef.current.forEach((f) => URL.revokeObjectURL(f.objectUrl));
    };
  }, []);

  const processFile = useCallback(async (file: File) => {
    const currentId = ++processingIdRef.current;

    // 1. Revoke old URLs immediately to prevent memory leaks
    if (currentPreviewRef.current) {
      URL.revokeObjectURL(currentPreviewRef.current);
      currentPreviewRef.current = null;
    }
    currentFaviconsRef.current.forEach((f) => URL.revokeObjectURL(f.objectUrl));
    currentFaviconsRef.current = [];

    // 2. Reset UI state
    setSourcePreviewUrl(null);
    setFavicons([]);
    setError(null);

    // 3. Validate
    const validation = validateFile(file);
    if (!validation.ok) {
      setError(validation.error);
      setSourceFile(null);
      return;
    }

    setSourceFile(file);
    const previewUrl = URL.createObjectURL(file);
    currentPreviewRef.current = previewUrl;
    setSourcePreviewUrl(previewUrl);

    // 4. Process asynchronously
    setIsProcessing(true);
    try {
      const image = await decodeImage(file);
      
      // Check if this request was superseded
      if (currentId !== processingIdRef.current) {
        return; 
      }

      const results = await renderAllFavicons(image);
      
      // Check again before committing to state
      if (currentId !== processingIdRef.current) {
        results.forEach((r) => URL.revokeObjectURL(r.objectUrl));
        return;
      }

      currentFaviconsRef.current = results;
      setFavicons(results);
    } catch (err) {
      if (currentId === processingIdRef.current) {
        setError(err instanceof Error ? err.message : 'Failed to process image.');
      }
    } finally {
      if (currentId === processingIdRef.current) {
        setIsProcessing(false);
      }
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDownload = (favicon: GeneratedFavicon) => {
    const link = document.createElement('a');
    link.href = favicon.objectUrl;
    link.download = favicon.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <UtilityPage>
      <UtilityHeader
        title="Favicon & App Icon Generator"
        description="Generate standard favicon and app icon sizes from any image. All processing happens locally in your browser."
      />

      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-6">

          {/* Upload Area */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-zinc-300 rounded-lg p-8 text-center cursor-pointer hover:border-zinc-500 hover:bg-zinc-50 transition-colors"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="space-y-2">
              <p className="text-sm font-medium text-zinc-700">
                Drop an image here or click to upload
              </p>
              <p className="text-xs text-zinc-500">
                Supported: PNG, JPEG, WEBP (max 20 MB)
              </p>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <strong>Error:</strong> {error}
            </div>
          )}

          {/* Source Preview */}
          {sourcePreviewUrl && !error && (
            <div className="space-y-2 pt-4 border-t border-zinc-100">
              <label className="block text-sm font-medium text-zinc-700">
                Source Image
              </label>
              <div className="flex items-center justify-center p-4 bg-zinc-50 rounded-lg border border-zinc-200">
                <img
                  src={sourcePreviewUrl}
                  alt="Source preview"
                  className="max-w-full max-h-64 object-contain"
                />
              </div>
              <p className="text-xs text-zinc-500">
                {sourceFile?.name} ({(sourceFile!.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            </div>
          )}

          {/* Processing Indicator */}
          {isProcessing && (
            <div className="text-center py-4">
              <p className="text-sm text-zinc-600">Generating favicons...</p>
            </div>
          )}

          {/* Generated Favicons */}
          {favicons.length > 0 && !isProcessing && (
            <div className="space-y-4 pt-4 border-t border-zinc-100">
              <label className="block text-sm font-medium text-zinc-700">
                Generated Icons ({favicons.length})
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {favicons.map((favicon) => (
                  <div
                    key={favicon.size}
                    className="flex flex-col items-center gap-2 p-3 rounded-lg border border-zinc-200 bg-zinc-50"
                  >
                    <div className="flex items-center justify-center w-16 h-16 bg-white border border-zinc-300 rounded">
                      <img
                        src={favicon.objectUrl}
                        alt={`${favicon.size}x${favicon.size}`}
                        className="max-w-full max-h-full object-contain"
                        style={{ imageRendering: 'auto' }}
                      />
                    </div>
                    <span className="text-xs font-mono text-zinc-600">
                      {favicon.size}×{favicon.size}
                    </span>
                    <button
                      onClick={() => handleDownload(favicon)}
                      className="text-xs font-medium text-zinc-600 hover:text-zinc-900 bg-white border border-zinc-200 px-2 py-1 rounded transition-colors"
                    >
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        <PrivacyNotice />
        <KnowledgeSection {...faviconGeneratorKnowledge} />
      </div>
    </UtilityPage>
  );
}