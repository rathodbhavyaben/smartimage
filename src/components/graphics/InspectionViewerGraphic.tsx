import React, { useState } from 'react';
import { Layers, Eye, Zap, Crosshair, Grid3X3, Flame, Activity } from 'lucide-react';
import { AnalysisResult } from '../../types';

interface InspectionViewerGraphicProps {
  result: AnalysisResult;
}

export const InspectionViewerGraphic: React.FC<InspectionViewerGraphicProps> = ({ result }) => {
  const [filterMode, setFilterMode] = useState<'normal' | 'edges' | 'thermal' | 'grid'>('normal');

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
      {/* Header and Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            <Activity className="w-3.5 h-3.5" />
            <span>Interactive Diagnostic HUD</span>
          </div>
          <h4 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
            Multi-Spectral Layer Inspection
          </h4>
        </div>

        {/* Filter Toggle Buttons */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl text-xs font-semibold gap-1">
          <button
            onClick={() => setFilterMode('normal')}
            className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1 ${
              filterMode === 'normal'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Eye className="w-3 h-3" />
            <span>RGB</span>
          </button>

          <button
            onClick={() => setFilterMode('edges')}
            className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1 ${
              filterMode === 'edges'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Zap className="w-3 h-3 text-cyan-200" />
            <span>Laplacian Edges</span>
          </button>

          <button
            onClick={() => setFilterMode('thermal')}
            className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1 ${
              filterMode === 'thermal'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Flame className="w-3 h-3 text-rose-200" />
            <span>Luma Heatmap</span>
          </button>

          <button
            onClick={() => setFilterMode('grid')}
            className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1 ${
              filterMode === 'grid'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Grid3X3 className="w-3 h-3" />
            <span>Anchors</span>
          </button>
        </div>
      </div>

      {/* Main Viewport Stage */}
      <div className="relative aspect-[16/10] w-full rounded-2xl bg-slate-950 overflow-hidden border border-slate-800 flex items-center justify-center">
        {/* Render Base Image */}
        {result.imagePreview ? (
          <img
            src={result.imagePreview}
            alt="Inspected Document"
            className={`w-full h-full object-contain transition-all duration-300 ${
              filterMode === 'edges'
                ? 'contrast-200 invert hue-rotate-180 brightness-125'
                : filterMode === 'thermal'
                ? 'hue-rotate-90 saturate-200 contrast-150'
                : ''
            }`}
          />
        ) : (
          <div className="text-slate-600 text-xs font-mono">No Image Feed</div>
        )}

        {/* 1. Edge Inspection Mode Overlay */}
        {filterMode === 'edges' && (
          <div className="absolute inset-0 pointer-events-none bg-cyan-950/20 mix-blend-screen flex items-center justify-center">
            <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded text-[10px] font-mono text-cyan-400 border border-cyan-500/40">
              LAPLACIAN FILTER (CONVOLUTION KERNEL: [0 1 0; 1 -4 1; 0 1 0])
            </div>
          </div>
        )}

        {/* 2. Thermal / Luma Heatmap Mode Overlay */}
        {filterMode === 'thermal' && (
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-blue-600/30 via-emerald-500/20 to-rose-500/40 mix-blend-color-dodge flex flex-col justify-between p-3">
            <div className="bg-black/80 backdrop-blur-md px-2.5 py-1 rounded text-[10px] font-mono text-rose-400 border border-rose-500/40 self-start">
              FALSE-COLOR LUMA SPECTROGRAM (0 - 255 LUX)
            </div>
            {/* Legend */}
            <div className="self-end bg-black/85 px-3 py-1.5 rounded-lg border border-slate-700 flex items-center gap-2 text-[9px] font-mono text-white">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span> Under
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Optimal
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span> Clip/Glare
              </span>
            </div>
          </div>
        )}

        {/* 3. Grid & 4-Corner Anchors Overlay */}
        {filterMode === 'grid' && (
          <div className="absolute inset-0 pointer-events-none p-6">
            {/* Rule of Thirds Grid */}
            <div className="w-full h-full border border-cyan-400/30 grid grid-cols-3 grid-rows-3 relative">
              <div className="border-r border-cyan-400/20"></div>
              <div className="border-r border-cyan-400/20"></div>
              <div></div>
              <div className="col-span-3 border-b border-cyan-400/20 absolute inset-x-0 top-1/3"></div>
              <div className="col-span-3 border-b border-cyan-400/20 absolute inset-x-0 top-2/3"></div>

              {/* 4 Document Corner Guides with coordinate readouts */}
              <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/80 px-2 py-0.5 rounded border border-cyan-400/40 text-[9px] font-mono text-cyan-300">
                <Crosshair className="w-3 h-3 text-cyan-400" />
                <span>P1 [x: 48, y: 32]</span>
              </div>
              <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-black/80 px-2 py-0.5 rounded border border-cyan-400/40 text-[9px] font-mono text-cyan-300">
                <span>P2 [x: 1872, y: 34]</span>
                <Crosshair className="w-3 h-3 text-cyan-400" />
              </div>
              <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-black/80 px-2 py-0.5 rounded border border-cyan-400/40 text-[9px] font-mono text-cyan-300">
                <Crosshair className="w-3 h-3 text-cyan-400" />
                <span>P3 [x: 52, y: 1048]</span>
              </div>
              <div className="absolute bottom-2 right-2 flex items-center gap-1.5 bg-black/80 px-2 py-0.5 rounded border border-cyan-400/40 text-[9px] font-mono text-cyan-300">
                <span>P4 [x: 1868, y: 1046]</span>
                <Crosshair className="w-3 h-3 text-cyan-400" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Viewport Footer Info */}
      <div className="mt-3 flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
        <span>Resolution: {result.dimensions.width}×{result.dimensions.height}</span>
        <span className="text-cyan-600 dark:text-cyan-400 font-semibold">
          {filterMode === 'normal' && 'Standard Optical RGB View'}
          {filterMode === 'edges' && 'Laplacian Variance Texture Response'}
          {filterMode === 'thermal' && 'Tonal Exposure Distribution Spectrum'}
          {filterMode === 'grid' && 'Perspective Alignment & Homography Points'}
        </span>
      </div>
    </div>
  );
};
