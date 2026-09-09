import React from 'react';
import { ShieldCheck, Camera, Sparkles, Moon, SunMedium, FileCheck2 } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onNavigate: (sectionId: string) => void;
  activeSection?: string;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  onToggleDarkMode,
  onNavigate,
}) => {
  return (
    <header
      id="header"
      className="sticky top-0 z-50 backdrop-blur-xl border-b transition-colors duration-300 bg-white/85 dark:bg-slate-950/85 border-slate-200/80 dark:border-slate-800/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo & Subtitle */}
        <div
          id="brand-logo"
          onClick={() => onNavigate('hero-section')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="relative w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[2px] shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
            <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[10px] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                ClearCheck <span className="text-indigo-600 dark:text-indigo-400">AI</span>
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-md bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
                v2.4 Core
              </span>
            </div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 tracking-normal">
              Smart Image Quality Checker
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2 text-sm font-medium">
          <button
            id="nav-home"
            onClick={() => onNavigate('hero-section')}
            className="px-3.5 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
          >
            Home
          </button>
          <button
            id="nav-camera"
            onClick={() => onNavigate('camera-workspace')}
            className="px-3.5 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors flex items-center gap-1.5"
          >
            <Camera className="w-4 h-4 text-indigo-500" />
            <span>Camera & Checker</span>
          </button>
          <button
            id="nav-how-it-works"
            onClick={() => onNavigate('how-it-works')}
            className="px-3.5 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
          >
            How It Works
          </button>
          <button
            id="nav-metrics"
            onClick={() => onNavigate('quality-metrics')}
            className="px-3.5 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
          >
            Quality Metrics
          </button>
          <button
            id="nav-opencv"
            onClick={() => onNavigate('opencv-integration')}
            className="px-3.5 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
            <span>AI Architecture</span>
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Dark/Light mode toggle */}
          <button
            id="theme-toggle"
            onClick={onToggleDarkMode}
            aria-label="Toggle Theme"
            className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-colors"
          >
            {darkMode ? <SunMedium className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
          </button>

          {/* Quick Start Action Button */}
          <button
            id="header-cta-start"
            onClick={() => onNavigate('camera-workspace')}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/20 active:scale-[0.98] transition-all"
          >
            <FileCheck2 className="w-4 h-4" />
            <span>Verify Image</span>
          </button>
        </div>
      </div>
    </header>
  );
};
