import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Upload,
  Download,
  Share2,
  Sliders,
  BarChart3,
  FileCheck2,
  Sparkles,
  Info,
  Check,
  Camera,
} from 'lucide-react';
import { AnalysisResult } from '../types';
import { ScoreCard } from './ScoreCard';
import { ResultScreen } from './ResultScreen';
import { InteractiveRadarChart } from './graphics/InteractiveRadarChart';
import { InspectionViewerGraphic } from './graphics/InspectionViewerGraphic';

interface DashboardProps {
  result: AnalysisResult;
  onRetake: () => void;
  onUploadNew: () => void;
  onOpenDeblur?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  result,
  onRetake,
  onUploadNew,
  onOpenDeblur,
}) => {
  const [activeTab, setActiveTab] = useState<'metrics' | 'inspection' | 'histogram' | 'audit'>('metrics');
  const [copiedReport, setCopiedReport] = useState(false);

  const isPass = result.status === 'PASS';
  const isWarning = result.status === 'IMPROVE';
  const isFail = result.status === 'FAIL';

  // Trigger celebration confetti on pass!
  useEffect(() => {
    if (isPass) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#6366f1', '#38bdf8', '#fbbf24'],
        });
      } catch (err) {
        // Safe fallback if confetti blocked
      }
    }
  }, [isPass]);

  // Color constants based on score status
  const scoreColor = isPass
    ? 'text-emerald-500 dark:text-emerald-400'
    : isWarning
    ? 'text-amber-500 dark:text-amber-400'
    : 'text-rose-500 dark:text-rose-400';

  const strokeColor = isPass ? '#10b981' : isWarning ? '#f59e0b' : '#ef4444';

  const statusLabel = isPass
    ? '✓ PASS — Image is submission ready'
    : isWarning
    ? '⚠ IMPROVE — Minor adjustments recommended'
    : '❌ FAIL — Image not submission ready';

  const statusBadgeBg = isPass
    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
    : isWarning
    ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800'
    : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800';

  // Circular gauge calculations
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (result.overallScore / 100) * circumference;

  const handleCopyReport = () => {
    const reportText = `ClearCheck AI Quality Report
Score: ${result.overallScore}/100 [${result.status}]
Timestamp: ${result.timestamp}
Dimensions: ${result.dimensions.width}x${result.dimensions.height} (${result.dimensions.megapixels} MP)
Metrics:
- Blur/Sharpness: ${result.metrics.blur.value} [${result.metrics.blur.status.toUpperCase()}]
- Lighting: ${result.metrics.lighting.value} [${result.metrics.lighting.status.toUpperCase()}]
- Exposure: ${result.metrics.exposure.value} [${result.metrics.exposure.status.toUpperCase()}]
- Contrast: ${result.metrics.contrast.value} [${result.metrics.contrast.status.toUpperCase()}]
- Framing: ${result.metrics.framing.value} [${result.metrics.framing.status.toUpperCase()}]
- Resolution: ${result.metrics.resolution.value} [${result.metrics.resolution.status.toUpperCase()}]
- Skew/Tilt: ${result.metrics.skew.value} [${result.metrics.skew.status.toUpperCase()}]
Verifiable Result ID: CC-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    navigator.clipboard.writeText(reportText);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2500);
  };

  const handleDownloadCertificate = () => {
    const jsonStr = JSON.stringify(result, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ClearCheck-Audit-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div id="quality-dashboard" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* If Fail, show ResultScreen prominently at top, with option to inspect cards */}
      {isFail && (
        <div className="mb-10">
          <ResultScreen
            result={result}
            onRetake={onRetake}
            onViewDetails={() => setActiveTab('metrics')}
            onOpenDeblur={onOpenDeblur}
          />
        </div>
      )}

      {/* Main Score Hero Card */}
      <div className="rounded-3xl p-6 sm:p-8 mb-10 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xl relative overflow-hidden">
        {/* Glow ambient background */}
        <div
          className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none -z-10 ${
            isPass
              ? 'bg-emerald-500/10'
              : isWarning
              ? 'bg-amber-500/10'
              : 'bg-rose-500/10'
          }`}
        />

        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Circular Score Gauge */}
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 text-center sm:text-left">
            <div className="relative w-40 h-40 flex items-center justify-center shrink-0">
              <svg className="w-40 h-40 transform -rotate-90">
                {/* Track */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="10"
                  fill="transparent"
                  className="text-slate-100 dark:text-slate-800"
                />
                {/* Progress */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke={strokeColor}
                  strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-4xl font-black tracking-tight ${scoreColor}`}>
                  {result.overallScore}
                </span>
                <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">
                  / 100
                </span>
              </div>
            </div>

            {/* Score Meta Details */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">
                IMAGE QUALITY SCORE
              </p>
              
              {/* Requested Status display */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold border mb-3 shadow-sm">
                <span className={statusBadgeBg}>{statusLabel}</span>
              </div>

              <p className="text-sm font-medium text-slate-600 dark:text-slate-300 max-w-lg leading-relaxed">
                {result.summaryMessage}
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs font-mono text-slate-500 dark:text-slate-400">
                <span>Resolution: {result.dimensions.width}×{result.dimensions.height} ({result.dimensions.megapixels} MP)</span>
                <span>•</span>
                <span>Analyzed: {result.timestamp}</span>
              </div>
            </div>
          </div>

          {/* Captured Document Preview & Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto justify-end">
            {result.imagePreview && (
              <div className="relative group w-32 h-24 rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-800 shadow-md shrink-0">
                <img
                  src={result.imagePreview}
                  alt="Captured Document Preview"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-mono text-white">
                  Preview
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2.5 w-full sm:w-auto">
              {onOpenDeblur && (
                <button
                  id="dash-btn-deblur"
                  onClick={onOpenDeblur}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 shadow-md shadow-indigo-600/25 active:scale-[0.98] transition-all"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Make Image Clear (AI Deblur)</span>
                </button>
              )}

              <button
                id="dash-btn-retake"
                onClick={onRetake}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-[0.98] transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Retake / Scan Another</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  id="dash-btn-copy"
                  onClick={handleCopyReport}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  {copiedReport ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5 text-slate-500" />
                      <span>Copy Audit</span>
                    </>
                  )}
                </button>

                <button
                  id="dash-btn-export"
                  onClick={handleDownloadCertificate}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>JSON Cert</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 mb-6">
        <div className="flex items-center gap-2 sm:gap-4 text-sm font-semibold">
          <button
            id="tab-metrics"
            onClick={() => setActiveTab('metrics')}
            className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'metrics'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Quality Metrics Cards (7)</span>
          </button>

          <button
            id="tab-inspection"
            onClick={() => setActiveTab('inspection')}
            className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'inspection'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Visual Diagnostics & Radar (Graphics)</span>
          </button>

          <button
            id="tab-histogram"
            onClick={() => setActiveTab('histogram')}
            className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'histogram'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Tonal & Color Histogram</span>
          </button>

          <button
            id="tab-audit"
            onClick={() => setActiveTab('audit')}
            className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'audit'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileCheck2 className="w-4 h-4" />
            <span>Compliance Certificate</span>
          </button>
        </div>
      </div>

      {/* TAB 1: Individual Quality Cards */}
      {activeTab === 'metrics' && (
        <div className="space-y-8">
          {/* Quick Notice if Blur is Below 80 */}
          {result.metrics.blur.rawScore < 80 && onOpenDeblur && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-amber-800 dark:text-amber-200">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500 text-white shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <span className="font-bold">Image Blur Detected ({result.metrics.blur.rawScore}/100):</span>{' '}
                  <span className="opacity-90">
                    Fine text strokes are softened. You can instantly restore crisp character edges without taking a new photo.
                  </span>
                </div>
              </div>
              <button
                onClick={onOpenDeblur}
                className="shrink-0 px-4 py-1.5 rounded-xl font-bold text-xs bg-amber-600 hover:bg-amber-500 text-white shadow-sm transition-all"
              >
                Make Clear Now
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <ScoreCard metric={result.metrics.blur} onDeblur={onOpenDeblur} />
            <ScoreCard metric={result.metrics.lighting} />
            <ScoreCard metric={result.metrics.exposure} />
            <ScoreCard metric={result.metrics.contrast} />
            <ScoreCard metric={result.metrics.framing} />
            <ScoreCard metric={result.metrics.resolution} />
            <ScoreCard metric={result.metrics.skew} />

            {/* Bonus summary card */}
            <div className="p-5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold text-sm mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Overall Verdict</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  {isPass
                    ? 'The document qualifies for immediate robotic process automation (RPA) and automated OCR parsing.'
                    : 'We recommend resolving the highlighted issues to guarantee document verification approval.'}
                </p>
              </div>
              <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 pt-3 border-t border-indigo-200/50 dark:border-indigo-900/40">
                Confidence Score: {result.overallScore}%
              </div>
            </div>
          </div>

          {/* Quality Radar Chart integrated directly below cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <InteractiveRadarChart metrics={result.metrics} overallScore={result.overallScore} />
            <InspectionViewerGraphic result={result} />
          </div>
        </div>
      )}

      {/* TAB 2: Visual Diagnostics & Radar Graphics Dedicated View */}
      {activeTab === 'inspection' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <InspectionViewerGraphic result={result} />
          <InteractiveRadarChart metrics={result.metrics} overallScore={result.overallScore} />
        </div>
      )}

      {/* TAB 2: Dynamic Histogram Analysis */}
      {activeTab === 'histogram' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Pixel Tonal & Color Distribution
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Visualizing luminance spectrum and color balance across 64 discrete bins.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span> Luminance
              </span>
              <span className="flex items-center gap-1.5 text-rose-500">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Red
              </span>
              <span className="flex items-center gap-1.5 text-emerald-500">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Green
              </span>
              <span className="flex items-center gap-1.5 text-cyan-500">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span> Blue
              </span>
            </div>
          </div>

          {/* Histogram Chart Bars Container */}
          <div className="h-56 w-full flex items-end gap-1 px-2 py-4 bg-slate-50 dark:bg-slate-950/70 rounded-2xl border border-slate-200/70 dark:border-slate-800">
            {result.histogram.luminance.map((val, idx) => (
              <div
                key={idx}
                className="flex-1 flex flex-col justify-end h-full group relative"
                title={`Bin ${idx * 4}: ${val}%`}
              >
                <div
                  className="w-full bg-indigo-500 dark:bg-indigo-400 rounded-t-sm group-hover:bg-indigo-300 transition-all duration-300"
                  style={{ height: `${Math.max(4, val)}%` }}
                />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mt-2 px-1">
            <span>0 (Deep Shadow)</span>
            <span>128 (Midtone Balance)</span>
            <span>255 (Specular Highlight)</span>
          </div>
        </div>
      )}

      {/* TAB 3: Compliance & Audit Certificate */}
      {activeTab === 'audit' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 uppercase tracking-widest font-bold">
                OFFICIAL VERIFICATION RECEIPT
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                ClearCheck AI Inspection Certificate
              </h3>
            </div>
            <div className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              HASH: #{Math.random().toString(36).substring(2, 10).toUpperCase()}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6 text-sm">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800/80">
              <span className="text-xs text-slate-400">Submission Verdict</span>
              <p className={`text-lg font-black mt-1 ${scoreColor}`}>{result.status}</p>
              <p className="text-xs text-slate-500 mt-1">{result.summaryMessage}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800/80">
              <span className="text-xs text-slate-400">Aggregated Quality Score</span>
              <p className="text-lg font-black text-slate-900 dark:text-white mt-1">
                {result.overallScore} / 100
              </p>
              <p className="text-xs text-slate-500 mt-1">Weight threshold: 80+ required for pass</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800/80">
              <span className="text-xs text-slate-400">Device Processing Note</span>
              <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">
                100% In-Browser Privacy
              </p>
              <p className="text-xs text-slate-500 mt-1">No pixel data transmitted to external servers</p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
            <button
              onClick={handleDownloadCertificate}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/20"
            >
              <Download className="w-4 h-4" />
              <span>Download JSON Audit Payload</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
