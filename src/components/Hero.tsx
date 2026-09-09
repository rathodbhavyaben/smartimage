import React from 'react';
import { Camera, Upload, ShieldCheck, Sparkles, CheckCircle2, AlertCircle, ArrowDown } from 'lucide-react';
import { SAMPLE_DOCUMENTS } from '../data/sampleImages';
import { SampleDocument } from '../types';
import { ScannerGraphic } from './graphics/ScannerGraphic';

interface HeroProps {
  onStartCamera: () => void;
  onTriggerUpload: () => void;
  onSelectSample: (sample: SampleDocument) => void;
  onOpenGoogleDrive?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onStartCamera,
  onTriggerUpload,
  onSelectSample,
  onOpenGoogleDrive,
}) => {
  return (
    <section
      id="hero-section"
      className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-slate-200/70 dark:border-slate-800/80 bg-gradient-to-b from-slate-50/50 via-white to-slate-50/30 dark:from-slate-950 dark:via-slate-900/60 dark:to-slate-950"
    >
      {/* Subtle Background Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-500/10 dark:bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-1/4 w-[300px] h-[200px] bg-cyan-500/10 dark:bg-cyan-600/10 rounded-full blur-[90px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headings & Actions */}
          <div className="lg:col-span-7 text-center lg:text-left">
            {/* Pill tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-6 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Real-Time WebCam & Canvas Vision Engine</span>
            </div>

            {/* Requested Exact Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.08] mb-6">
              MAKE EVERY IMAGE <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 dark:from-indigo-400 dark:via-indigo-300 dark:to-cyan-400">
                SUBMISSION READY
              </span>
            </h1>

            {/* Requested Exact Subtitle */}
            <p className="text-lg sm:text-xl font-normal text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed mb-10">
              AI-powered image quality checking for clear, professional and submission-ready documents.
            </p>

            {/* Primary & Secondary Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10">
              <button
                id="hero-btn-camera"
                onClick={onStartCamera}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-base text-white bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-600/25 active:scale-[0.98] transition-all duration-200"
              >
                <Camera className="w-5 h-5" />
                <span>Start Camera</span>
              </button>

              <button
                id="hero-btn-upload"
                onClick={onTriggerUpload}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-base text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-md active:scale-[0.98] transition-all duration-200"
              >
                <Upload className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span>Upload Image</span>
              </button>

              {onOpenGoogleDrive && (
                <button
                  id="hero-btn-google-drive"
                  onClick={onOpenGoogleDrive}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-7 py-4 rounded-2xl font-bold text-base text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-md active:scale-[0.98] transition-all duration-200 group"
                >
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg">
                    <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
                    <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44c-.8 1.4-1.2 2.95-1.2 4.5h27.5z" fill="#00ac47"/>
                    <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.5l5.85 10.15z" fill="#ea4335"/>
                    <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.25z" fill="#00832d"/>
                    <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.25z" fill="#2684fc"/>
                    <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
                  </svg>
                  <span>Google Drive</span>
                </button>
              )}
            </div>

            {/* Instant Sample Selectors */}
            <div className="border-t border-slate-200/80 dark:border-slate-800/80 pt-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 flex items-center gap-1.5 justify-center lg:justify-start">
                <span>Instant Demo Samples</span>
                <span className="text-[11px] font-normal normal-case opacity-80">(click to test automated pipeline)</span>
              </p>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                {SAMPLE_DOCUMENTS.map((sample) => (
                  <button
                    key={sample.id}
                    id={`hero-sample-${sample.id}`}
                    onClick={() => onSelectSample(sample)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 text-slate-700 dark:text-slate-300 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm"
                  >
                    {sample.expectedResult === 'PASS' ? (
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    ) : sample.expectedResult === 'IMPROVE' ? (
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                    )}
                    <span>{sample.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Visual Camera / Document Scanner Illustration */}
          <div className="lg:col-span-5 flex justify-center">
            <ScannerGraphic />
          </div>
        </div>
      </div>
    </section>
  );
};
