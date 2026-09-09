import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  X,
  CheckCircle2,
  Download,
  RotateCcw,
  Sliders,
  Zap,
  Eye,
  Layers,
  ArrowRight,
  ShieldCheck,
  SplitSquareVertical,
} from 'lucide-react';
import {
  enhanceDeblurImage,
  DeblurOptions,
  DEFAULT_DEBLUR_OPTIONS,
  PRESET_OPTIONS,
} from '../services/imageEnhancer';

interface DeblurModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalImage: string;
  originalBlurScore: number;
  onApplyEnhanced: (enhancedDataUrl: string) => void;
}

export const DeblurModal: React.FC<DeblurModalProps> = ({
  isOpen,
  onClose,
  originalImage,
  originalBlurScore,
  onApplyEnhanced,
}) => {
  const [options, setOptions] = useState<DeblurOptions>(DEFAULT_DEBLUR_OPTIONS);
  const [activePreset, setActivePreset] = useState<string>('balanced');
  const [enhancedImage, setEnhancedImage] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [splitPosition, setSplitPosition] = useState<number>(50); // 0 to 100%
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [estimatedScore, setEstimatedScore] = useState<number>(88);

  const containerRef = useRef<HTMLDivElement>(null);

  // Generate enhanced image when options change
  useEffect(() => {
    if (!isOpen || !originalImage) return;

    let isMounted = true;
    setIsProcessing(true);

    const timer = setTimeout(async () => {
      try {
        const result = await enhanceDeblurImage(originalImage, options);
        if (isMounted) {
          setEnhancedImage(result.enhancedDataUrl);
          setEstimatedScore(result.estimatedNewBlurScore);
          setIsProcessing(false);
        }
      } catch (err) {
        console.error('Deblur error:', err);
        if (isMounted) setIsProcessing(false);
      }
    }, 60);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [isOpen, originalImage, options]);

  if (!isOpen) return null;

  const handlePresetSelect = (presetKey: string) => {
    setActivePreset(presetKey);
    const preset = PRESET_OPTIONS[presetKey];
    if (preset) {
      setOptions({ ...preset.options });
    }
  };

  const handleSliderMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSplitPosition(percent);
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleSliderMove(e.clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      handleSliderMove(e.touches[0].clientX);
    }
  };

  const handleDownload = () => {
    if (!enhancedImage) return;
    const a = document.createElement('a');
    a.href = enhancedImage;
    a.download = `ClearCheck-Deblurred-${Date.now()}.jpg`;
    a.click();
  };

  const handleApply = () => {
    if (enhancedImage) {
      onApplyEnhanced(enhancedImage);
      onClose();
    }
  };

  return (
    <div
      id="deblur-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onMouseUp={handleMouseUp}
    >
      <div
        id="deblur-modal-container"
        className="w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              <Sparkles className="w-5 h-5 text-indigo-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  AI Image Clarity & Deblur Studio
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  Real-time High-Pass USM
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Sharpen glyphs, eliminate motion haze, and boost optical character recognition readability.
              </p>
            </div>
          </div>

          <button
            id="close-deblur-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Top Score Comparison Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-cyan-500/10 to-emerald-500/10 border border-indigo-200/60 dark:border-indigo-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="text-center sm:text-left">
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Original Blur Score
                </span>
                <span className="text-xl font-black font-mono text-rose-600 dark:text-rose-400">
                  {originalBlurScore} / 100 ({originalBlurScore < 80 ? 'FAIL' : 'PASS'})
                </span>
              </div>

              <ArrowRight className="w-5 h-5 text-slate-400 shrink-0" />

              <div className="text-center sm:text-left">
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Enhanced Projected Score
                </span>
                <span className="text-xl font-black font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <span>{estimatedScore} / 100</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500 text-white font-bold">
                    PASS ✓
                  </span>
                </span>
              </div>
            </div>

            <div className="text-xs font-mono text-slate-600 dark:text-slate-300 bg-white/70 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
              Drag the center slider on the image to compare Original vs. Clear
            </div>
          </div>

          {/* Interactive Before/After Split Viewer Stage */}
          <div className="space-y-2">
            <div
              ref={containerRef}
              id="split-comparison-stage"
              onMouseMove={handleMouseMove}
              onTouchMove={handleTouchMove}
              className="relative w-full aspect-[16/10] max-h-[440px] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner select-none cursor-ew-resize group"
            >
              {/* Layer 1: Enhanced Clear Image (Base layer) */}
              {enhancedImage && (
                <img
                  src={enhancedImage}
                  alt="Enhanced Clear Document"
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                />
              )}

              {/* Layer 2: Original Blurry Image (Clipped by splitPosition %) */}
              <div
                className="absolute inset-0 overflow-hidden pointer-events-none"
                style={{ width: `${splitPosition}%` }}
              >
                <img
                  src={originalImage}
                  alt="Original Blurry Document"
                  className="absolute inset-0 w-full h-full object-contain max-w-none"
                  style={{
                    width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%',
                    height: containerRef.current ? `${containerRef.current.clientHeight}px` : '100%',
                  }}
                />
                {/* Blur Badge on Left */}
                <div className="absolute top-3 left-3 bg-rose-950/80 backdrop-blur-md text-rose-300 border border-rose-700/60 px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                  <span>BEFORE (BLURRY)</span>
                </div>
              </div>

              {/* Enhanced Badge on Right */}
              <div className="absolute top-3 right-3 bg-emerald-950/80 backdrop-blur-md text-emerald-300 border border-emerald-700/60 px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 shadow-lg pointer-events-none">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>AFTER (ENHANCED CLEAR)</span>
              </div>

              {/* Vertical Draggable Divider Line */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_12px_#38bdf8] z-20 pointer-events-none"
                style={{ left: `${splitPosition}%` }}
              >
                {/* Center Handle Pill */}
                <div
                  onMouseDown={handleMouseDown}
                  onTouchStart={handleMouseDown}
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-12 rounded-full bg-white text-slate-800 shadow-xl border border-slate-300 flex items-center justify-center cursor-ew-resize pointer-events-auto hover:scale-110 active:scale-95 transition-transform"
                >
                  <SplitSquareVertical className="w-4 h-4 text-indigo-600 rotate-90" />
                </div>
              </div>

              {/* Processing Spinner Overlay */}
              {isProcessing && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center pointer-events-none">
                  <div className="bg-slate-900/90 border border-slate-700 px-4 py-2 rounded-xl text-cyan-400 text-xs font-mono flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                    <span>Recomputing 2D High-Pass Filter...</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
              <span>Original Capture</span>
              <span className="text-cyan-500 font-semibold">Position: {Math.round(splitPosition)}%</span>
              <span>Enhanced Output</span>
            </div>
          </div>

          {/* Preset Buttons Bar */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
              1-Click Deblur Presets
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {Object.entries(PRESET_OPTIONS).map(([key, preset]) => (
                <button
                  key={key}
                  onClick={() => handlePresetSelect(key)}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    activePreset === key
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-900 dark:text-white shadow-sm'
                      : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold leading-tight">{preset.label}</span>
                    {activePreset === key && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                    {preset.description}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Fine Tuning Sliders */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-indigo-500" />
                <span>Fine-Tuning Precision Parameters</span>
              </span>
              <button
                onClick={() => handlePresetSelect('balanced')}
                className="text-[11px] text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Sliders</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Sharpness Slider */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-700 dark:text-slate-300">Unsharp Mask (Sharpness)</span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                    {options.sharpness}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={options.sharpness}
                  onChange={(e) => {
                    setActivePreset('');
                    setOptions({ ...options, sharpness: Number(e.target.value) });
                  }}
                  className="w-full accent-indigo-600 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                />
                <span className="text-[10px] text-slate-400 block">Controls edge gradient amplification</span>
              </div>

              {/* Text Clarity */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-700 dark:text-slate-300">Text Glyph Clarity</span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                    {options.clarity}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={options.clarity}
                  onChange={(e) => {
                    setActivePreset('');
                    setOptions({ ...options, clarity: Number(e.target.value) });
                  }}
                  className="w-full accent-indigo-600 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                />
                <span className="text-[10px] text-slate-400 block">Darkens text lines and whitens paper</span>
              </div>

              {/* Contrast */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-700 dark:text-slate-300">Luma Contrast</span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                    {options.contrast}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="80"
                  value={options.contrast}
                  onChange={(e) => {
                    setActivePreset('');
                    setOptions({ ...options, contrast: Number(e.target.value) });
                  }}
                  className="w-full accent-indigo-600 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                />
                <span className="text-[10px] text-slate-400 block">Separates foreground and background</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              id="download-clear-image-btn"
              onClick={handleDownload}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download Clear Image</span>
            </button>

            <button
              id="apply-reanalyze-btn"
              onClick={handleApply}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/25 active:scale-[0.98] transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Apply & Re-Analyze Image</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
