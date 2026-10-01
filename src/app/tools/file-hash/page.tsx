'use client';

import { useState, useCallback, useRef } from 'react';
import { hashFile, V1_MAX_FILE_SIZE } from '@/lib/file-hash/hasher';
import type { HashAlgorithm, FileHashResult } from '@/lib/file-hash/types';
import UtilityPage from '@/components/utility/utility-page';
import UtilityHeader from '@/components/utility/utility-header';
import UtilityButton from '@/components/utility/utility-button';
import PrivacyNotice from '@/components/utility/privacy-notice';
import KnowledgeSection from '@/components/utility/knowledge-section';
import { fileHashKnowledge } from '@/content/utilities/file-hash';

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export default function FileHashPage() {
  const [file, setFile] = useState<File | null>(null);
  const [algorithm, setAlgorithm] = useState<HashAlgorithm>('SHA-256');
  const [result, setResult] = useState<FileHashResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((selectedFile: File | null) => {
    setFile(selectedFile);
    setResult(null);
    setError(null);
    setCopied(false);
  }, []);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    handleFileSelect(selectedFile);
  }, [handleFileSelect]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0] || null;
    handleFileSelect(droppedFile);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleCalculate = useCallback(async () => {
    if (!file) {
      setError('No file selected.');
      return;
    }

    setError(null);
    setResult(null);
    setIsProcessing(true);
    setCopied(false);

    try {
      const hashResult = await hashFile(file, algorithm);
      if (hashResult.ok) {
        setResult(hashResult.data);
      } else {
        setError(hashResult.error);
      }
    } catch {
      setError('Unable to calculate the file hash. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [file, algorithm]);

  const handleCopy = useCallback(async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.hash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Silent fail
    }
  }, [result]);

  const handleClear = useCallback(() => {
    setFile(null);
    setResult(null);
    setError(null);
    setCopied(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  return (
    <UtilityPage>
      <UtilityHeader
        title="File Hash Inspector"
        description="Calculate cryptographic hashes (SHA-256, SHA-384, SHA-512) for any file locally in your browser. Verify file integrity without uploading."
      />

      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-6">
          
          {/* File Drop Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-zinc-300 rounded-lg p-8 text-center cursor-pointer hover:border-zinc-500 hover:bg-zinc-50 transition-colors"
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileInputChange}
              className="hidden"
            />
            {file ? (
              <div className="space-y-2">
                <p className="text-sm font-medium text-zinc-900">{file.name}</p>
                <p className="text-xs text-zinc-500">
                  {formatFileSize(file.size)} • {file.type || 'Unknown type'}
                </p>
                <p className="text-xs text-zinc-400 mt-2">Click or drop to replace</p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm font-medium text-zinc-700">
                  Drop a file here, or click to browse
                </p>
                <p className="text-xs text-zinc-500">
                  Max file size: {formatFileSize(V1_MAX_FILE_SIZE)}
                </p>
              </div>
            )}
          </div>

          {/* Algorithm Selector */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-700">
              Hash Algorithm
            </label>
            <select
              value={algorithm}
              onChange={(e) => {
                setAlgorithm(e.target.value as HashAlgorithm);
                setResult(null);
                setError(null);
                setCopied(false);
              }}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 outline-none"
            >
              <option value="SHA-256">SHA-256 (Recommended)</option>
              <option value="SHA-384">SHA-384</option>
              <option value="SHA-512">SHA-512</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <UtilityButton 
              onClick={handleCalculate} 
              disabled={!file || isProcessing}
              className="flex-1 py-3 text-base font-semibold"
            >
              {isProcessing ? 'Calculating...' : 'Calculate Hash'}
            </UtilityButton>
            <button
              onClick={handleClear}
              disabled={isProcessing}
              className="px-4 py-3 text-sm font-medium text-zinc-600 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Clear
            </button>
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
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider">
                  {result.algorithm} Hash
                </h3>
                <button
                  onClick={handleCopy}
                  className="text-xs font-medium text-zinc-600 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200 px-3 py-1.5 rounded transition-colors"
                >
                  {copied ? 'Copied!' : 'Copy Hash'}
                </button>
              </div>
              
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                <code className="text-xs font-mono text-zinc-900 break-all leading-relaxed">
                  {result.hash}
                </code>
              </div>

              <div className="grid grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-zinc-500 block mb-1">File Name</span>
                  <span className="font-medium text-zinc-900 truncate block">{result.fileName}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block mb-1">File Size</span>
                  <span className="font-medium text-zinc-900">{formatFileSize(result.fileSize)}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block mb-1">File Type</span>
                  <span className="font-medium text-zinc-900 truncate block">{result.fileType || 'Unknown'}</span>
                </div>
              </div>
            </div>
          )}

        </div>

        <PrivacyNotice />
        <KnowledgeSection {...fileHashKnowledge} />
      </div>
    </UtilityPage>
  );
}