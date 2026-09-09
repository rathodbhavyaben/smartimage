import React, { useState } from 'react';
import {
  X,
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  ExternalLink,
  Info,
  Sparkles,
  FileCheck2,
} from 'lucide-react';

interface GoogleDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageImported: (imageDataUrl: string, fileName?: string) => void;
}

// Preset samples hosted on Google Drive for instant 1-click testing
const DRIVE_SAMPLES = [
  {
    id: '1',
    title: 'Sample Driver License (Drive)',
    description: 'ID card with text glyphs & barcode',
    url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=1600&auto=format&fit=crop&q=80',
    fileName: 'GoogleDrive_Driver_License.jpg',
  },
  {
    id: '2',
    title: 'Sample Business Receipt (Drive)',
    description: 'Paper receipt with tabular ledger numbers',
    url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1600&auto=format&fit=crop&q=80',
    fileName: 'GoogleDrive_Store_Receipt.jpg',
  },
  {
    id: '3',
    title: 'Official Passport Page (Drive)',
    description: 'Document with photo & machine-readable zone',
    url: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1600&auto=format&fit=crop&q=80',
    fileName: 'GoogleDrive_Passport_Scan.jpg',
  },
];

export const GoogleDriveModal: React.FC<GoogleDriveModalProps> = ({
  isOpen,
  onClose,
  onImageImported,
}) => {
  const [driveUrl, setDriveUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewMeta, setPreviewMeta] = useState<{ width: number; height: number; name: string } | null>(null);

  if (!isOpen) return null;

  /**
   * Extract Google Drive file ID from various link formats:
   * - https://drive.google.com/file/d/FILE_ID/view?usp=sharing
   * - https://drive.google.com/open?id=FILE_ID
   * - https://drive.google.com/uc?id=FILE_ID
   * - https://drive.google.com/file/d/FILE_ID
   * - Raw file ID
   */
  const extractDriveFileId = (input: string): string | null => {
    const trimmed = input.trim();
    if (!trimmed) return null;

    // Pattern 1: /file/d/{ID}
    const match1 = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (match1 && match1[1]) return match1[1];

    // Pattern 2: id={ID}
    const match2 = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (match2 && match2[1]) return match2[1];

    // Pattern 3: direct ID string (typically 25 to 45 alphanumeric characters)
    if (/^[a-zA-Z0-9_-]{20,50}$/.test(trimmed)) {
      return trimmed;
    }

    return null;
  };

  /**
   * Loads an image URL into an HTML Canvas to obtain a clean dataUrl (JPEG/PNG)
   */
  const convertUrlToDataUrl = async (imgUrl: string): Promise<{ dataUrl: string; width: number; height: number }> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth || 1200;
          canvas.height = img.naturalHeight || 800;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Canvas context unavailable'));
            return;
          }
          ctx.drawImage(img, 0, 0);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
          resolve({
            dataUrl,
            width: canvas.width,
            height: canvas.height,
          });
        } catch (e: any) {
          // If tainted canvas due to cross-origin restriction, reject with friendly note
          reject(e);
        }
      };

      img.onerror = () => {
        reject(new Error('Unable to load image from this Google Drive URL'));
      };

      img.src = imgUrl;
    });
  };

  const handleFetchDriveImage = async (customUrl?: string, customName?: string) => {
    const targetUrl = customUrl || driveUrl;
    setError(null);
    setPreviewImage(null);
    setPreviewMeta(null);

    if (!targetUrl.trim()) {
      setError('Please enter a Google Drive link or file ID.');
      return;
    }

    setIsLoading(true);

    try {
      // Check if it's one of the preset sample direct URLs
      if (customUrl && !customUrl.includes('drive.google.com')) {
        const res = await convertUrlToDataUrl(customUrl);
        setPreviewImage(res.dataUrl);
        setPreviewMeta({
          width: res.width,
          height: res.height,
          name: customName || 'google_drive_sample.jpg',
        });
        setIsLoading(false);
        return;
      }

      // Extract Drive File ID
      const fileId = extractDriveFileId(targetUrl);
      if (!fileId) {
        throw new Error(
          'Could not detect a valid Google Drive file ID. Please ensure you copied a link like "https://drive.google.com/file/d/.../view?usp=sharing"'
        );
      }

      // Google Drive provides high-resolution CDN endpoints for shared files:
      // 1) lh3.googleusercontent.com/d/{fileId}=w2400 (Google CDN, supports cross-origin image tags)
      // 2) drive.google.com/thumbnail?id={fileId}&sz=w2000
      // 3) drive.google.com/uc?export=view&id={fileId}
      const primaryUrl = `https://lh3.googleusercontent.com/d/${fileId}=w2400`;
      const fallbackUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w2000`;

      let loaded = false;
      try {
        const res = await convertUrlToDataUrl(primaryUrl);
        setPreviewImage(res.dataUrl);
        setPreviewMeta({
          width: res.width,
          height: res.height,
          name: `GoogleDrive_${fileId.substring(0, 8)}.jpg`,
        });
        loaded = true;
      } catch (err1) {
        // Attempt fallback
        try {
          const res2 = await convertUrlToDataUrl(fallbackUrl);
          setPreviewImage(res2.dataUrl);
          setPreviewMeta({
            width: res2.width,
            height: res2.height,
            name: `GoogleDrive_${fileId.substring(0, 8)}.jpg`,
          });
          loaded = true;
        } catch (err2) {
          throw new Error(
            'Google Drive image could not be loaded directly. Please ensure the file permission in Google Drive is set to "Anyone with the link can view".'
          );
        }
      }

      if (!loaded) {
        throw new Error('Failed to load Google Drive image');
      }
    } catch (err: any) {
      console.error('Google Drive fetch error:', err);
      setError(err.message || 'Failed to fetch image from Google Drive.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmImport = () => {
    if (previewImage) {
      onImageImported(previewImage, previewMeta?.name || 'google_drive_document.jpg');
      onClose();
    }
  };

  return (
    <div
      id="google-drive-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        id="google-drive-modal-container"
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/60">
          <div className="flex items-center gap-3">
            {/* Google Drive Authentic Logo Icon */}
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-sm">
              <svg className="w-6 h-6" viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg">
                <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
                <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44c-.8 1.4-1.2 2.95-1.2 4.5h27.5z" fill="#00ac47"/>
                <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.5l5.85 10.15z" fill="#ea4335"/>
                <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.25z" fill="#00832d"/>
                <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.25z" fill="#2684fc"/>
                <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Upload Image from Google Drive
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  Direct Importer
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Paste any shared Google Drive file link or select a sample document.
              </p>
            </div>
          </div>

          <button
            id="close-google-drive-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Link Input Section */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Google Drive Link or File ID</span>
              <span className="text-[11px] font-normal normal-case text-slate-500">
                Public / "Anyone with link" access
              </span>
            </label>

            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-slate-400">
                <LinkIcon className="w-4 h-4" />
              </div>
              <input
                id="google-drive-link-input"
                type="text"
                value={driveUrl}
                onChange={(e) => {
                  setDriveUrl(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="https://drive.google.com/file/d/1BxiMVs0XRA5.../view?usp=sharing"
                className="w-full pl-10 pr-28 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all font-mono"
              />
              <button
                id="btn-fetch-drive-image"
                disabled={isLoading || !driveUrl.trim()}
                onClick={() => handleFetchDriveImage()}
                className="absolute right-2 px-4 py-2 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center gap-1.5"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    <span>Load File</span>
                    <ArrowRight className="w-3 h-3" />
                  </>
                )}
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block">{error}</span>
                  <span className="text-[11px] opacity-90 mt-0.5 block">
                    Tip: In Google Drive, right-click the file &rarr; Share &rarr; Under General access, change to "Anyone with the link".
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Preset Google Drive Samples (1-Click Try) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Or Try 1-Click Drive Demo Files
              </span>
              <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
                No Drive Link Needed
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {DRIVE_SAMPLES.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => {
                    setDriveUrl(sample.url);
                    handleFetchDriveImage(sample.url, sample.fileName);
                  }}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 hover:border-indigo-400 dark:hover:border-indigo-600 text-left transition-all group flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {sample.title}
                    </span>
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    {sample.description}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Preview Box if Image is Loaded */}
          {previewImage && previewMeta && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Google Drive Image Successfully Retrieved</span>
                </span>
                <span className="text-xs font-mono text-slate-500">
                  {previewMeta.width} &times; {previewMeta.height} px
                </span>
              </div>

              <div className="relative aspect-[16/9] w-full bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center">
                <img
                  src={previewImage}
                  alt="Google Drive Document Preview"
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400">
                Ready to pass into the 7-metric ISO/IEC quality validation and AI Deblur pipeline.
              </p>
            </div>
          )}

          {/* Quick Sharing Instructions Callout */}
          <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-800/60 flex items-start gap-3 text-xs text-indigo-950 dark:text-indigo-200">
            <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-bold">How to share any image from your Google Drive:</span>
              <ol className="list-decimal list-inside mt-1 space-y-0.5 text-indigo-900/80 dark:text-indigo-300/80 text-[11px]">
                <li>Open Google Drive and right-click your document image.</li>
                <li>Click <strong>Share</strong> &rarr; change General access to <strong>"Anyone with the link"</strong>.</li>
                <li>Click <strong>Copy link</strong> and paste it directly into the box above.</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>

          <button
            id="btn-confirm-drive-import"
            disabled={!previewImage}
            onClick={handleConfirmImport}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/25 disabled:opacity-40 disabled:pointer-events-none active:scale-95 transition-all"
          >
            <FileCheck2 className="w-4 h-4" />
            <span>Analyze Drive Document</span>
          </button>
        </div>
      </div>
    </div>
  );
};
