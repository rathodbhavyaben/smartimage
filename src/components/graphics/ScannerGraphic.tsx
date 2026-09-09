import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle2, Sparkles, Camera, Zap, Eye, Maximize2 } from 'lucide-react';

export const ScannerGraphic: React.FC = () => {
  const [scanPos, setScanPos] = useState(20);
  const [activeNode, setActiveNode] = useState(0);

  // Animate laser sweep position
  useEffect(() => {
    const interval = setInterval(() => {
      setScanPos((prev) => (prev >= 82 ? 18 : prev + 0.8));
    }, 30);
    return () => clearInterval(interval);
  }, []);

  // Cycle through active telemetry nodes
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveNode((prev) => (prev + 1) % 4);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-lg mx-auto select-none">
      {/* Outer ambient glow */}
      <div className="absolute -inset-2 bg-gradient-to-tr from-indigo-500/20 via-cyan-500/20 to-emerald-500/20 rounded-3xl blur-2xl opacity-75"></div>

      {/* Main Graphic Card Frame */}
      <div className="relative rounded-3xl bg-slate-950 border border-slate-800/90 shadow-2xl p-5 overflow-hidden text-white">
        {/* Top Telemetry Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-emerald-400 font-bold tracking-wider">AI SPECTRAL SCANNER</span>
          </div>
          <div className="flex items-center gap-2 text-cyan-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>FOV 94° • 60 FPS</span>
          </div>
        </div>

        {/* Viewfinder Canvas Stage */}
        <div className="relative my-4 aspect-[4/3] rounded-2xl bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950/80 overflow-hidden border border-slate-800 flex items-center justify-center">
          {/* Futuristic Background Matrix Grid */}
          <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:20px_20px]" />

          {/* Concentric Calibration Reticle Rings */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
            <circle cx="50%" cy="50%" r="35%" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 6" fill="none" />
            <circle cx="50%" cy="50%" r="48%" stroke="#818cf8" strokeWidth="0.75" fill="none" />
            <line x1="10%" y1="50%" x2="90%" y2="50%" stroke="#38bdf8" strokeWidth="0.5" strokeDasharray="3 3" />
            <line x1="50%" y1="10%" x2="50%" y2="90%" stroke="#38bdf8" strokeWidth="0.5" strokeDasharray="3 3" />
          </svg>

          {/* 3D-Look Document Under Analysis */}
          <div className="relative w-4/5 h-[76%] rounded-xl bg-slate-900/90 border border-slate-700/80 shadow-2xl p-4 flex flex-col justify-between overflow-hidden backdrop-blur-sm">
            {/* Top Document Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-indigo-600 flex items-center justify-center text-[10px] font-bold">
                  ★
                </div>
                <div className="space-y-1">
                  <div className="w-24 h-2 rounded bg-indigo-400"></div>
                  <div className="w-16 h-1.5 rounded bg-slate-600"></div>
                </div>
              </div>
              <div className="text-[10px] font-mono text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800/80">
                PASS: 96%
              </div>
            </div>

            {/* Document Midsection: Photo + Microtext */}
            <div className="flex gap-3 my-2 items-center">
              {/* Identity Photo Cutout */}
              <div className="relative w-16 h-20 rounded-lg bg-gradient-to-tr from-slate-800 to-slate-700 border border-slate-600 flex flex-col items-center justify-center shrink-0 overflow-hidden">
                <div className="w-7 h-7 rounded-full bg-slate-500 mb-1"></div>
                <div className="w-11 h-8 rounded-t-full bg-slate-500"></div>
                {/* Facial recognition wireframe */}
                <div className="absolute inset-1 border border-cyan-400/40 rounded flex items-center justify-center">
                  <div className="w-3 h-3 border-t border-l border-cyan-400"></div>
                </div>
              </div>

              {/* Text Fields Representation */}
              <div className="flex-1 space-y-2">
                <div className="space-y-1">
                  <div className="w-12 h-1 rounded bg-slate-500"></div>
                  <div className="w-32 h-2 rounded bg-slate-300"></div>
                </div>
                <div className="space-y-1">
                  <div className="w-16 h-1 rounded bg-slate-500"></div>
                  <div className="w-24 h-2 rounded bg-slate-300"></div>
                </div>
                <div className="space-y-1">
                  <div className="w-10 h-1 rounded bg-slate-500"></div>
                  <div className="w-20 h-2 rounded bg-slate-300"></div>
                </div>
              </div>
            </div>

            {/* MRZ Barcode Strip at Bottom */}
            <div className="bg-slate-950/80 p-1.5 rounded border border-slate-800 space-y-1 font-mono text-[8px] text-slate-400">
              <div className="tracking-widest truncate">P&lt;UTOALEXANDER&lt;&lt;JORDAN&lt;TAYLOR&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</div>
              <div className="tracking-widest truncate">CK9842100874USA9411142M3411144&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;04</div>
            </div>

            {/* Live Sweeping Laser Beam */}
            <div
              className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_16px_#38bdf8,0_0_32px_#06b6d4] pointer-events-none transition-all duration-75"
              style={{ top: `${scanPos}%` }}
            >
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-cyan-500 text-[8px] font-mono font-bold text-slate-950 shadow-md">
                LAPLACIAN: 254
              </div>
            </div>
          </div>

          {/* High-Precision Corner Alignment Reticles */}
          <div className="absolute inset-4 pointer-events-none flex items-center justify-center">
            <div className="w-full h-full border border-dashed border-cyan-500/20 rounded-2xl relative">
              <div className="absolute -top-1 -left-1 w-8 h-8 border-t-3 border-l-3 border-cyan-400 rounded-tl-lg shadow-[0_0_8px_#22d3ee]"></div>
              <div className="absolute -top-1 -right-1 w-8 h-8 border-t-3 border-r-3 border-cyan-400 rounded-tr-lg shadow-[0_0_8px_#22d3ee]"></div>
              <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-3 border-l-3 border-cyan-400 rounded-bl-lg shadow-[0_0_8px_#22d3ee]"></div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-3 border-r-3 border-cyan-400 rounded-br-lg shadow-[0_0_8px_#22d3ee]"></div>
            </div>
          </div>

          {/* Floating Metric Pill: Node 0 (Sharpness) */}
          <div
            className={`absolute top-4 left-6 px-2.5 py-1 rounded-lg bg-slate-950/85 backdrop-blur-md border text-[10px] font-mono transition-all duration-300 ${
              activeNode === 0
                ? 'border-emerald-500 text-emerald-300 shadow-[0_0_10px_#10b98140]'
                : 'border-slate-800 text-slate-400'
            }`}
          >
            <span className="font-bold">SHARPNESS:</span> 98.4%
          </div>

          {/* Floating Metric Pill: Node 1 (Lighting) */}
          <div
            className={`absolute top-4 right-6 px-2.5 py-1 rounded-lg bg-slate-950/85 backdrop-blur-md border text-[10px] font-mono transition-all duration-300 ${
              activeNode === 1
                ? 'border-cyan-500 text-cyan-300 shadow-[0_0_10px_#06b6d440]'
                : 'border-slate-800 text-slate-400'
            }`}
          >
            <span className="font-bold">LIGHTING:</span> 142 LUX
          </div>

          {/* Floating Metric Pill: Node 2 (Skew) */}
          <div
            className={`absolute bottom-4 left-6 px-2.5 py-1 rounded-lg bg-slate-950/85 backdrop-blur-md border text-[10px] font-mono transition-all duration-300 ${
              activeNode === 2
                ? 'border-indigo-500 text-indigo-300 shadow-[0_0_10px_#6366f140]'
                : 'border-slate-800 text-slate-400'
            }`}
          >
            <span className="font-bold">TILT:</span> 0.4° OK
          </div>

          {/* Floating Metric Pill: Node 3 (Resolution) */}
          <div
            className={`absolute bottom-4 right-6 px-2.5 py-1 rounded-lg bg-slate-950/85 backdrop-blur-md border text-[10px] font-mono transition-all duration-300 ${
              activeNode === 3
                ? 'border-emerald-500 text-emerald-300 shadow-[0_0_10px_#10b98140]'
                : 'border-slate-800 text-slate-400'
            }`}
          >
            <span className="font-bold">RES:</span> 1920×1080
          </div>
        </div>

        {/* Bottom Status Bar with Score & Readiness */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              92
            </div>
            <div>
              <p className="font-bold text-white text-[11px]">Quality Certified</p>
              <p className="text-[10px] text-slate-400">Meets ICAO Doc 9303</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>SUBMISSION READY</span>
          </div>
        </div>
      </div>
    </div>
  );
};
