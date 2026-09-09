import React from 'react';
import {
  Search,
  Sun,
  Zap,
  Contrast,
  Maximize,
  Frame,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
} from 'lucide-react';
import { QualityMetric } from '../types';
import { Sparkles } from 'lucide-react';

interface ScoreCardProps {
  metric: QualityMetric;
  onDeblur?: () => void;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({ metric, onDeblur }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Search':
        return <Search className="w-5 h-5" />;
      case 'Sun':
        return <Sun className="w-5 h-5" />;
      case 'Zap':
        return <Zap className="w-5 h-5" />;
      case 'Contrast':
        return <Contrast className="w-5 h-5" />;
      case 'Maximize':
        return <Maximize className="w-5 h-5" />;
      case 'Frame':
        return <Frame className="w-5 h-5" />;
      case 'RotateCcw':
        return <RotateCcw className="w-5 h-5" />;
      default:
        return <Search className="w-5 h-5" />;
    }
  };

  const isPass = metric.status === 'pass';
  const isWarning = metric.status === 'warning';

  // Status text label
  const statusLabel = isPass
    ? 'Pass'
    : isWarning
    ? 'Improve'
    : 'Fail';

  // Progress bar color
  const progressBg = isPass
    ? 'bg-emerald-500'
    : isWarning
    ? 'bg-amber-500'
    : 'bg-rose-500';

  const badgeBg = isPass
    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/80'
    : isWarning
    ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/80'
    : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/80';

  return (
    <div
      id={`metric-card-${metric.id}`}
      className="relative flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-200 group"
    >
      {/* Top row: Icon + Metric Name & PASS/FAIL Indicator */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <div
              className={`p-2.5 rounded-xl ${
                isPass
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400'
                  : isWarning
                  ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400'
                  : 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400'
              }`}
            >
              {getIcon(metric.iconName)}
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                {metric.label}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {metric.name}
              </p>
            </div>
          </div>

          {/* PASS/FAIL Indicator Badge */}
          <div
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${badgeBg}`}
          >
            {isPass ? (
              <CheckCircle2 className="w-3.5 h-3.5" />
            ) : isWarning ? (
              <AlertTriangle className="w-3.5 h-3.5" />
            ) : (
              <XCircle className="w-3.5 h-3.5" />
            )}
            <span>{statusLabel}</span>
          </div>
        </div>

        {/* Value Display */}
        <div className="my-2">
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {metric.value}
            </span>
            <span className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400">
              {metric.rawScore}/100
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden mt-2">
            <div
              className={`h-full rounded-full ${progressBg} transition-all duration-1000 ease-out`}
              style={{ width: `${Math.max(5, Math.min(100, metric.rawScore))}%` }}
            />
          </div>
        </div>
      </div>

      {/* Bottom details & feedback */}
      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
          {metric.feedback}
        </p>

        {metric.id === 'blur' && onDeblur && (
          <button
            id="scorecard-btn-deblur"
            onClick={onDeblur}
            className="w-full mt-3 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-sm shadow-indigo-600/20 active:scale-95 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>✨ Make Image Clear (AI Deblur)</span>
          </button>
        )}

        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 font-mono">
          <span>Target: {metric.threshold}</span>
        </div>
      </div>
    </div>
  );
};
