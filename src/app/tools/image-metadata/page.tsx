'use client';

import { useState, useCallback } from 'react';
import { parseImageMetadata } from '@/lib/image-metadata/metadata';
import type { ImageMetadataResult } from '@/lib/image-metadata/types';
import UtilityPage from '@/components/utility/utility-page';
import UtilityHeader from '@/components/utility/utility-header';
import PrivacyNotice from '@/components/utility/privacy-notice';
import KnowledgeSection from '@/components/utility/knowledge-section';
import { imageMetadataKnowledge } from '@/content/utilities/image-metadata';

export default function ImageMetadataPage() {
  const [result, setResult] = useState<ImageMetadataResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFile = useCallback(async (file: File) => {
    setError(null);
    setResult(null);
    setIsProcessing(true);

    try {
      const parseResult = await parseImageMetadata(file);
      if (parseResult.ok) {
        setResult(parseResult.data);
      } else {
        setError(parseResult.error);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unexpected error occurred.');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    if (e.target) e.target.value = ''; // Reset input
  }, [handleFile]);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <UtilityPage>
      <UtilityHeader
        title="Image Metadata Inspector"
        description="Inspect EXIF and metadata from your images locally. Understand what information your photos carry before sharing them."
      />

      <div className="space-y-8 max-w-3xl mx-auto">
        <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-6">
          
          {/* Upload Area */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-zinc-300 rounded-lg p-8 text-center cursor-pointer hover:border-zinc-500 hover:bg-zinc-50 transition-colors"
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <input
              id="file-upload"
              type="file"
              accept="image/jpeg,image/webp"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="space-y-2">
              <p className="text-sm font-medium text-zinc-700">
                Drop a JPEG or WEBP image here, or click to browse
              </p>
              <p className="text-xs text-zinc-500">
                Supported formats: JPEG, WEBP. Processing is 100% local.
              </p>
            </div>
          </div>

          {/* Processing State */}
          {isProcessing && (
            <div className="text-center py-4">
              <p className="text-sm text-zinc-600">Analyzing image metadata...</p>
            </div>
          )}

          {/* Error State */}
          {error && !isProcessing && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <strong>Error:</strong> {error}
            </div>
          )}

          {/* Results State */}
          {result && !isProcessing && (
            <div className="space-y-6 pt-4 border-t border-zinc-100">
              
              {/* File Info */}
              <div>
                <h3 className="text-sm font-semibold text-zinc-900 mb-3 uppercase tracking-wider">File Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-zinc-50 p-3 rounded border border-zinc-200">
                    <span className="text-zinc-500 block text-xs">Name</span>
                    <span className="font-medium text-zinc-900 truncate">{result.fileInfo.name}</span>
                  </div>
                  <div className="bg-zinc-50 p-3 rounded border border-zinc-200">
                    <span className="text-zinc-500 block text-xs">Size</span>
                    <span className="font-medium text-zinc-900">{formatBytes(result.fileInfo.size)}</span>
                  </div>
                  <div className="bg-zinc-50 p-3 rounded border border-zinc-200">
                    <span className="text-zinc-500 block text-xs">Type</span>
                    <span className="font-medium text-zinc-900">{result.fileInfo.mimeType}</span>
                  </div>
                  <div className="bg-zinc-50 p-3 rounded border border-zinc-200">
                    <span className="text-zinc-500 block text-xs">Dimensions</span>
                    <span className="font-medium text-zinc-900">{result.dimensions.width} × {result.dimensions.height} px</span>
                  </div>
                </div>
              </div>

              {/* EXIF Data */}
              {result.exif ? (
                <div>
                  <h3 className="text-sm font-semibold text-zinc-900 mb-3 uppercase tracking-wider">Camera & Settings</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    {result.exif.make && (
                      <div className="bg-zinc-50 p-3 rounded border border-zinc-200">
                        <span className="text-zinc-500 block text-xs">Make</span>
                        <span className="font-medium text-zinc-900">{result.exif.make}</span>
                      </div>
                    )}
                    {result.exif.model && (
                      <div className="bg-zinc-50 p-3 rounded border border-zinc-200">
                        <span className="text-zinc-500 block text-xs">Model</span>
                        <span className="font-medium text-zinc-900">{result.exif.model}</span>
                      </div>
                    )}
                    {result.exif.dateTime && (
                      <div className="bg-zinc-50 p-3 rounded border border-zinc-200 sm:col-span-2">
                        <span className="text-zinc-500 block text-xs">Date & Time</span>
                        <span className="font-medium text-zinc-900">{result.exif.dateTime}</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-sm text-zinc-500 italic">No detailed camera metadata found in this image.</div>
              )}

              {/* GPS Privacy Warning */}
              {result.exif?.gps && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-amber-800 font-semibold">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    Privacy-Sensitive Metadata Detected
                  </div>
                  <p className="text-sm text-amber-700">
                    This image contains GPS coordinates. Sharing the original file may reveal the exact location where the photo was taken.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm mt-3">
                    <div className="bg-white/50 p-2 rounded border border-amber-200">
                      <span className="text-amber-600 block text-xs">Latitude</span>
                      <span className="font-mono font-medium text-amber-900">
                        {result.exif.gps.latitude.toFixed(6)}° {result.exif.gps.latitudeRef}
                      </span>
                    </div>
                    <div className="bg-white/50 p-2 rounded border border-amber-200">
                      <span className="text-amber-600 block text-xs">Longitude</span>
                      <span className="font-mono font-medium text-amber-900">
                        {result.exif.gps.longitude.toFixed(6)}° {result.exif.gps.longitudeRef}
                      </span>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

        <PrivacyNotice />
        <KnowledgeSection {...imageMetadataKnowledge} />
      </div>
    </UtilityPage>
  );
}