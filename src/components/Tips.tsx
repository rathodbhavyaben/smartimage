import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Lightbulb, Sparkles } from 'lucide-react';
import { LiveCameraStats } from '../types';

interface TipsProps {
  stats: LiveCameraStats;
  compact?: boolean;
}

export const Tips: React.FC<TipsProps> = ({ stats, compact = false }) => {
  const isOptimalLighting = stats.lightingState === 'optimal';
  const isTooDark = stats.lightingState === 'too_dark';
  const isSharp = stats.blurState === 'sharp';
  const isCentered = stats.framingState === 'centered';
  const isReady = stats.isReady;

  if (compact) {
    // HUD style bar on live camera
    return (
      <div className="flex flex-wrap items-center justify-center gap-2 bg-slate-950/85 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-xs shadow-xl">
        {isReady ? (
          <div className="flex items-center gap-2 text-emerald-400 font-bold tracking-wide">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Ready for capture</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-amber-400 font-bold tracking-wide">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Adjust camera position</span>
          </div>
        )}

        <span className="text-slate-600 dark:text-slate-500">•</span>

        {/* Lighting tip */}
        <div className="flex items-center gap-1.5">
          {isOptimalLighting ? (
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Good lighting</span>
            </span>
          ) : isTooDark ? (
            <span className="flex items-center gap-1 text-rose-400">
              <XCircle className="w-3.5 h-3.5" />
              <span>Too dark — Turn on flashlight</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 text-amber-400">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Reduce direct glare</span>
            </span>
          )}
        </div>

        <span className="text-slate-600 dark:text-slate-500">•</span>

        {/* Blur tip */}
        <div className="flex items-center gap-1.5">
          {isSharp ? (
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Sharp focus</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 text-rose-400">
              <XCircle className="w-3.5 h-3.5" />
              <span>Blurry — Hold camera steady</span>
            </span>
          )}
        </div>
      </div>
    );
  }

  // Expanded cards layout
  return (
    <div className="w-full bg-slate-900/95 dark:bg-slate-900/80 rounded-2xl p-4 border border-slate-800 text-slate-200 shadow-xl">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Real-Time Capture Diagnostics
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
          <span>Luma: {stats.brightness}/255</span>
          <span>•</span>
          <span>Sharpness: {stats.sharpness}%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
        {/* Tip 1: Lighting */}
        <div
          className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${
            isOptimalLighting
              ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300'
              : isTooDark
              ? 'bg-rose-500/10 border-rose-500/25 text-rose-300'
              : 'bg-amber-500/10 border-amber-500/25 text-amber-300'
          }`}
        >
          {isOptimalLighting ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <div>
            <p className="font-semibold">
              {isOptimalLighting
                ? 'Good lighting'
                : isTooDark
                ? 'Too dark — Turn on flashlight'
                : 'Overexposed — Reduce glare'}
            </p>
            <p className="text-[10px] opacity-75">
              {isOptimalLighting ? 'Even ambient brightness' : 'Exposure adjustment needed'}
            </p>
          </div>
        </div>

        {/* Tip 2: Blur / Sharpness */}
        <div
          className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${
            isSharp
              ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/25 text-rose-300'
          }`}
        >
          {isSharp ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <div>
            <p className="font-semibold">
              {isSharp ? 'Sharp focus detected' : 'Blurry — Hold camera steady'}
            </p>
            <p className="text-[10px] opacity-75">
              {isSharp ? 'High edge clarity' : 'Motion or lens defocus detected'}
            </p>
          </div>
        </div>

        {/* Tip 3: Document Tilt */}
        <div
          className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${
            isCentered
              ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300'
              : 'bg-amber-500/10 border-amber-500/25 text-amber-300'
          }`}
        >
          {isCentered ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <XCircle className="w-4 h-4 text-amber-400 shrink-0" />
          )}
          <div>
            <p className="font-semibold">
              {isCentered ? 'Document aligned' : 'Document tilted — Keep straight'}
            </p>
            <p className="text-[10px] opacity-75">Parallel to framing corners</p>
          </div>
        </div>

        {/* Tip 4: Overall Readiness */}
        <div
          className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${
            isReady
              ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300'
              : 'bg-slate-800/80 border-slate-700 text-slate-400'
          }`}
        >
          {isReady ? (
            <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 animate-pulse" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-slate-500 shrink-0" />
          )}
          <div>
            <p className="font-semibold">{isReady ? 'Ready for capture' : 'Calibrating view'}</p>
            <p className="text-[10px] opacity-75">{isReady ? 'Click Shutter button' : 'Hold position'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
