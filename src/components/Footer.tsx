import React from 'react';
import { ShieldCheck, Lock, Github, Heart, Cpu, Sparkles } from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-900 text-slate-600 dark:text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Col 1: Brand & Privacy Guarantee */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 p-[2px]">
                <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-indigo-400" />
                </div>
              </div>
              <div>
                <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                  ClearCheck <span className="text-indigo-600 dark:text-indigo-400">AI</span>
                </span>
                <p className="text-xs text-slate-500">Smart Image Quality Checker</p>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4 max-w-sm">
              Instantaneous automated image quality assurance checking blur, lighting, exposure, contrast, resolution, framing, and skew before document submission.
            </p>

            {/* Privacy Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
              <Lock className="w-3.5 h-3.5" />
              <span>100% Client-Side Privacy — Zero Data Uploaded</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Product Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('hero-section')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Home Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('camera-workspace')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Live WebCam Viewfinder
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('how-it-works')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('quality-metrics')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  7 Quality Dimensions
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('opencv-integration')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  OpenCV & ML Architecture
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Tech Stack & Compliance */}
          <div className="md:col-span-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Technology Stack
            </h4>
            <div className="flex flex-wrap gap-1.5 mb-4">
              <span className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                React 19
              </span>
              <span className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                TypeScript
              </span>
              <span className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                Tailwind CSS
              </span>
              <span className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                Web Camera API
              </span>
              <span className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                Canvas 2D API
              </span>
              <span className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                OpenCV.js Ready
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Compliant with ICAO Doc 9303 (Machine Readable Travel Documents) and ISO/IEC 19794 biometric image capture guidelines.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} ClearCheck AI. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Pass Threshold: 80/100</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>All Systems Operational</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
