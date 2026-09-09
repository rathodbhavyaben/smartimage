import React from 'react';
import {
  XCircle,
  AlertTriangle,
  Lightbulb,
  RefreshCw,
  ArrowRight,
  Eye,
  Sliders,
  Sparkles,
  Zap,
} from 'lucide-react';
import { AnalysisResult } from '../types';

interface ResultScreenProps {
  result: AnalysisResult;
  onRetake: () => void;
  onViewDetails?: () => void;
  onOpenDeblur?: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  result,
  onRetake,
  onViewDetails,
  onOpenDeblur,
}) => {
  const isFail = result.status === 'FAIL';
  const hasBlurIssue =
    result.metrics.blur.status === 'fail' ||
    result.metrics.blur.status === 'warning' ||
    result.metrics.blur.rawScore < 80;

  return (
    <div
      id="fail-screen"
      className="max-w-3xl mx-auto rounded-3xl p-6 sm:p-10 bg-white dark:bg-slate-900 border border-rose-200/80 dark:border-rose-900/60 shadow-2xl relative overflow-hidden"
    >
      {/* Background Warning Tint */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 dark:bg-rose-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-8 border-b border-slate-200 dark:border-slate-800">
        <div className="w-16 h-16 rounded-2xl bg-rose-100 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 flex items-center justify-center shrink-0 shadow-lg shadow-rose-500/15">
          {isFail ? (
            <XCircle className="w-10 h-10 text-rose-600 dark:text-rose-400" />
          ) : (
            <AlertTriangle className="w-10 h-10 text-amber-600 dark:text-amber-400" />
          )}
        </div>

        <div className="text-center sm:text-left flex-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 mb-2">
            <span>Score: {result.overallScore} / 100</span>
            <span>•</span>
            <span>Status: {result.status}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {isFail ? 'IMAGE NOT READY' : 'IMPROVEMENTS RECOMMENDED'}
          </h2>

          <p className="text-base font-semibold text-rose-600 dark:text-rose-400 mt-1">
            Your image needs improvement before automated submission.
          </p>

          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            The verification algorithms flagged multiple defects that may prevent optical character recognition (OCR) or official compliance.
          </p>
        </div>

        {/* Thumbnail Preview */}
        {result.imagePreview && (
          <div className="w-24 h-24 rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-800 shrink-0 shadow-md">
            <img
              src={result.imagePreview}
              alt="Captured Document"
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      {/* Two Column Layout: Detected Problems vs Actionable Suggestions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
        {/* Detected Problems List */}
        <div className="p-5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/50">
          <h3 className="text-sm font-bold uppercase tracking-wider text-rose-900 dark:text-rose-200 mb-4 flex items-center gap-2">
            <XCircle className="w-4 h-4 text-rose-500" />
            <span>Detected Problems</span>
          </h3>

          <ul className="space-y-3">
            {result.problems.map((problem, index) => (
              <li
                key={index}
                className="flex items-start gap-2.5 text-sm font-medium text-slate-800 dark:text-slate-200"
              >
                <span className="text-rose-500 font-bold shrink-0 mt-0.5">❌</span>
                <span>{problem}</span>
              </li>
            ))}
            {result.problems.length === 0 && (
              <li className="text-sm text-slate-500">No critical defects detected.</li>
            )}
          </ul>
        </div>

        {/* Actionable Suggestions List */}
        <div className="p-5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50">
          <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-200 mb-4 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span>Actionable Suggestions</span>
          </h3>

          <ul className="space-y-3">
            {result.suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="flex items-start gap-2.5 text-sm font-medium text-slate-800 dark:text-slate-200"
              >
                <span className="text-amber-500 font-bold shrink-0 mt-0.5">💡</span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Prominent AI Deblur & Clarity Feature Card */}
      {onOpenDeblur && (
        <div className="mb-8 p-5 rounded-2xl bg-gradient-to-r from-indigo-500/15 via-cyan-500/10 to-emerald-500/15 border-2 border-indigo-500/40 dark:border-indigo-400/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-600/30">
              <Sparkles className="w-6 h-6 animate-pulse text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-black text-slate-900 dark:text-white">
                  {hasBlurIssue ? 'Blur Detected? Make Image Clear' : 'AI Clarity & Deblur Tool'}
                </h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800">
                  Built-in Fix
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 max-w-xl">
                Don't want to retake the photo? Run our 2D Laplacian Unsharp-Masking algorithm to sharpen text edges, boost contrast, and convert this document to PASS.
              </p>
            </div>
          </div>

          <button
            id="btn-fix-blur-ai"
            onClick={onOpenDeblur}
            className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 shadow-lg shadow-indigo-600/25 active:scale-[0.98] transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Make Image Clear (AI Deblur)</span>
          </button>
        </div>
      )}

      {/* Bottom CTA Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <button
            id="btn-retake-image"
            onClick={onRetake}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3 rounded-xl font-bold text-sm text-white bg-slate-800 hover:bg-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 active:scale-[0.98] transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retake Image</span>
          </button>

          {onOpenDeblur && (
            <button
              id="btn-quick-deblur"
              onClick={onOpenDeblur}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/25 active:scale-[0.98] transition-all"
            >
              <Zap className="w-4 h-4 text-cyan-300" />
              <span>✨ Deblur Image</span>
            </button>
          )}
        </div>

        {onViewDetails && (
          <button
            id="btn-view-detailed-metrics"
            onClick={onViewDetails}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Sliders className="w-4 h-4" />
            <span>Inspect All 7 Metrics</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
