'use client';

import { useState, useRef, useEffect } from 'react';
import { processImage } from '@/lib/image-resizer/process';
import { formatBytes } from '@/lib/image-resizer/file-size';
import UtilityPage from '@/components/utility/utility-page';
import UtilityHeader from '@/components/utility/utility-header';
import UtilityButton from '@/components/utility/utility-button';
import PrivacyNotice from '@/components/utility/privacy-notice';
import KnowledgeSection from '@/components/utility/knowledge-section';
import { imageResizerKnowledge } from '@/content/utilities/image-resizer';

type OutputFormat = 'image/jpeg' | 'image/png' | 'image/webp';

export default function ImageResizerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number } | null>(null);
  const [originalPreviewUrl, setOriginalPreviewUrl] = useState<string | null>(null);
  
  const [targetWidth, setTargetWidth] = useState<string>('');
  const [targetHeight, setTargetHeight] = useState<string>('');
  const [lockAspectRatio, setLockAspectRatio] = useState(true);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('image/jpeg');
  const [quality, setQuality] = useState<number>(0.8);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ blob: Blob; previewUrl: string; width: number; height: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cleanup Object URLs on unmount or state change
  useEffect(() => {
    return () => {
      if (result) URL.revokeObjectURL(result.previewUrl);
      if (originalPreviewUrl) URL.revokeObjectURL(originalPreviewUrl);
    };
  }, [result, originalPreviewUrl]);

  const handleFile = (selectedFile: File) => {
    if (!selectedFile.type.match(/image\/(jpeg|png|webp)/)) {
      setError('Please select a valid JPG, PNG, or WEBP image.');
      setFile(null);
      setOriginalDimensions(null);
      setOriginalPreviewUrl(null);
      setResult(null);
      return;
    }

    setError(null);
    setFile(selectedFile);
    setResult(null);

    const objectUrl = URL.createObjectURL(selectedFile);
    setOriginalPreviewUrl(objectUrl);

    const img = new Image();
    img.onload = () => {
      setOriginalDimensions({ width: img.width, height: img.height });
      setTargetWidth(img.width.toString());
      setTargetHeight(img.height.toString());
    };
    img.onerror = () => {
      setError('Failed to read image dimensions.');
      URL.revokeObjectURL(objectUrl);
      setOriginalPreviewUrl(null);
    };
    img.src = objectUrl;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) handleFile(selectedFile);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) handleFile(droppedFile);
  };

  const handleWidthChange = (val: string) => {
    setTargetWidth(val);
    if (lockAspectRatio && originalDimensions && val) {
      const w = parseInt(val, 10);
      if (w > 0) {
        const h = Math.round((w / originalDimensions.width) * originalDimensions.height);
        setTargetHeight(h.toString());
      }
    }
  };

  const handleHeightChange = (val: string) => {
    setTargetHeight(val);
    if (lockAspectRatio && originalDimensions && val) {
      const h = parseInt(val, 10);
      if (h > 0) {
        const w = Math.round((h / originalDimensions.height) * originalDimensions.width);
        setTargetWidth(w.toString());
      }
    }
  };

  const handleResize = async () => {
    if (!file || !originalDimensions) return;
    
    setIsProcessing(true);
    setError(null);

    const widthVal = targetWidth ? parseInt(targetWidth, 10) : null;
    const heightVal = targetHeight ? parseInt(targetHeight, 10) : null;

    const processResult = await processImage(file, originalDimensions.width, originalDimensions.height, {
      targetWidth: widthVal,
      targetHeight: heightVal,
      lockAspectRatio,
      outputFormat,
      quality,
    });

    if (processResult.ok) {
      setResult({
        blob: processResult.blob,
        previewUrl: processResult.previewUrl,
        width: processResult.width,
        height: processResult.height,
      });
    } else {
      setError(processResult.error);
    }
    
    setIsProcessing(false);
  };

  const handleDownload = () => {
    if (!result) return;
    const url = URL.createObjectURL(result.blob);
    const a = document.createElement('a');
    a.href = url;
    const ext = outputFormat.split('/')[1];
    a.download = `resized-image.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    if (result) URL.revokeObjectURL(result.previewUrl);
    if (originalPreviewUrl) URL.revokeObjectURL(originalPreviewUrl);
    setFile(null);
    setOriginalDimensions(null);
    setOriginalPreviewUrl(null);
    setTargetWidth('');
    setTargetHeight('');
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <UtilityPage>
      <UtilityHeader
        title="Image Resizer & Compressor"
        description="Resize and compress JPG, PNG, and WEBP images directly in your browser. Your image is processed locally and is not uploaded by this tool."
      />

      <div className="space-y-8">
        <div 
          className={`rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
            isDragging ? 'border-zinc-900 bg-zinc-100' : 'border-zinc-300 bg-zinc-50 hover:border-zinc-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            ref={fileInputRef}
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="hidden"
            id="image-input"
          />
          <label htmlFor="image-input" className="cursor-pointer">
            <p className="text-lg font-medium text-zinc-900">Drop image here or click to choose</p>
            <p className="mt-1 text-sm text-zinc-500">Supported: JPG, PNG, WEBP</p>
          </label>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <strong>Error:</strong> {error}
          </div>
        )}

        {file && originalDimensions && (
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Original Info with Preview */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">Original</h3>
              <div className="rounded-xl border border-zinc-200 bg-white p-4 space-y-3">
                {originalPreviewUrl && (
                  <div className="aspect-video w-full overflow-hidden rounded-lg bg-zinc-100 flex items-center justify-center border border-zinc-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={originalPreviewUrl} 
                      alt="Original preview" 
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                )}
                <div>
                  <p className="text-zinc-900 font-medium truncate">{file.name}</p>
                  <p className="text-sm text-zinc-600 mt-1">
                    {originalDimensions.width} ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â {originalDimensions.height} px ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¢ {formatBytes(file.size)}
                  </p>
                </div>
              </div>
            </div>

            {/* Settings */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">Settings</h3>
              <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1">Width (px)</label>
                    <input
                      type="number"
                      value={targetWidth}
                      onChange={(e) => handleWidthChange(e.target.value)}
                      className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1">Height (px)</label>
                    <input
                      type="number"
                      value={targetHeight}
                      onChange={(e) => handleHeightChange(e.target.value)}
                      className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 outline-none"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 text-sm text-zinc-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={lockAspectRatio}
                    onChange={(e) => setLockAspectRatio(e.target.checked)}
                    className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500"
                  />
                  Lock aspect ratio
                </label>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Output Format</label>
                  <select
                    value={outputFormat}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === 'image/jpeg' || value === 'image/png' || value === 'image/webp') {
                        setOutputFormat(value);
                      }
                    }}
                    className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 outline-none bg-white"
                  >
                    <option value="image/jpeg">JPEG</option>
                    <option value="image/png">PNG</option>
                    <option value="image/webp">WEBP</option>
                  </select>
                </div>

                {outputFormat !== 'image/png' && (
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1">
                      Quality: {Math.round(quality * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0.1"
                      max="1"
                      step="0.1"
                      value={quality}
                      onChange={(e) => setQuality(parseFloat(e.target.value))}
                      className="w-full accent-zinc-900"
                    />
                  </div>
                )}

                <div className="pt-2">
                  <UtilityButton 
                    onClick={handleResize} 
                    disabled={isProcessing || !targetWidth || !targetHeight}
                    className="w-full"
                  >
                    {isProcessing ? 'Processing...' : 'Resize & Compress'}
                  </UtilityButton>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">Result</h3>
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-6">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={result.previewUrl} 
                  alt="Resized preview" 
                  className="max-w-full h-auto rounded-lg border border-zinc-200 bg-white shadow-sm max-h-64 object-contain"
                />
                <div className="flex-1 space-y-3 w-full">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-zinc-500">Dimensions</p>
                      <p className="font-medium text-zinc-900">{result.width} ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â {result.height} px</p>
                    </div>
                    <div>
                      <p className="text-zinc-500">File Size</p>
                      <p className="font-medium text-zinc-900">{formatBytes(result.blob.size)}</p>
                    </div>
                  </div>
                  
                  <UtilityButton onClick={handleDownload} variant="secondary" className="w-full md:w-auto">
                    Download Image
                  </UtilityButton>
                </div>
              </div>
            </div>
          </div>
        )}

        {file && (
          <div className="flex justify-center pt-4">
            <UtilityButton onClick={handleClear} variant="secondary">
              Clear & Start Over
            </UtilityButton>
          </div>
        )}
      </div>

      <PrivacyNotice />
      <KnowledgeSection {...imageResizerKnowledge} />
    </UtilityPage>
  );
}
