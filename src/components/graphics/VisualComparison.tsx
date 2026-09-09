import React, { useState } from 'react';
import { CheckCircle2, XCircle, Sparkles, Sun, Search, RotateCcw, Frame } from 'lucide-react';

export const VisualComparison: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'blur' | 'lighting' | 'skew' | 'framing'>('blur');

  return (
    <section className="py-16 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Visual Defect Diagnostics</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Visual Quality Benchmarks
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Understand how our computer vision algorithms distinguish submission-ready captures from rejected defects.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center justify-center gap-2 mb-10 flex-wrap">
          <button
            onClick={() => setActiveTab('blur')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'blur'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Sharp vs. Blurry</span>
          </button>

          <button
            onClick={() => setActiveTab('lighting')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'lighting'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>Optimal vs. Dim Lighting</span>
          </button>

          <button
            onClick={() => setActiveTab('skew')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'skew'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Straight vs. Tilted</span>
          </button>

          <button
            onClick={() => setActiveTab('framing')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'framing'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Frame className="w-3.5 h-3.5" />
            <span>Contained vs. Clipped Edges</span>
          </button>
        </div>

        {/* Comparison Showcase Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Left: PASS Example Card */}
          <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-950/70 border-2 border-emerald-500/40 shadow-xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>PASSING SPECIFICATION</span>
            </div>

            <div>
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Optimal Capture
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1 mb-4">
                {activeTab === 'blur' && 'High-Frequency Text Sharpness'}
                {activeTab === 'lighting' && 'Uniform Ambient Illumination'}
                {activeTab === 'skew' && 'Horizontal Orthogonal Alignment'}
                {activeTab === 'framing' && 'Safe Margin Buffer on All Borders'}
              </h3>

              {/* Graphical Canvas Mockup for PASS */}
              <div className="aspect-[16/10] rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-inner flex flex-col justify-between relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                      ID
                    </div>
                    <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                      PASSPORT &bull; VERIFIED
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-500 font-bold">
                    LAPLACIAN: 248 &bull; LUMA: 142
                  </span>
                </div>

                {/* Simulated Document details with razor-sharp edges */}
                <div className="space-y-2 my-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-14 rounded bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center text-[10px] text-slate-500">
                      PHOTO
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <div className="w-3/4 h-2 rounded bg-slate-900 dark:bg-slate-100"></div>
                      <div className="w-1/2 h-2 rounded bg-slate-700 dark:bg-slate-300"></div>
                      <div className="w-2/3 h-2 rounded bg-slate-500 dark:bg-slate-400"></div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-100 dark:bg-slate-800/80 p-2 rounded text-[9px] font-mono text-slate-700 dark:text-slate-300">
                  P&lt;USA&lt;&lt;DOE&lt;&lt;JOHN&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
                </div>

                {/* Corner guide overlay */}
                <div className="absolute inset-2 border-2 border-emerald-500/30 rounded-xl pointer-events-none"></div>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 mt-4 leading-relaxed">
              {activeTab === 'blur' && 'High pixel edge variance (&gt; 150) ensures automated OCR characters can be extracted with 99.8% machine confidence.'}
              {activeTab === 'lighting' && 'Mean luminance sits comfortably in the 120-170 lux sweet-spot, avoiding shadow clipping or white-out glare spots.'}
              {activeTab === 'skew' && 'Rotational deflection is under 2.0 degrees, aligning line height with standard text tokenizers.'}
              {activeTab === 'framing' && 'A 10% safety buffer surrounds all 4 corners, preventing vital information or barcodes from being truncated.'}
            </p>
          </div>

          {/* Right: FAIL Example Card */}
          <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-950/70 border-2 border-rose-500/40 shadow-xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30">
              <XCircle className="w-3.5 h-3.5" />
              <span>FAILING DEFECT</span>
            </div>

            <div>
              <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                Defective Capture
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1 mb-4">
                {activeTab === 'blur' && 'Motion Smear & Defocus Blur'}
                {activeTab === 'lighting' && 'Severe Underexposure / Shadow'}
                {activeTab === 'skew' && 'Extreme 14° Rotational Slant'}
                {activeTab === 'framing' && 'Clipped Document Margins'}
              </h3>

              {/* Graphical Canvas Mockup for FAIL with visual effects */}
              <div
                className={`aspect-[16/10] rounded-2xl border p-5 shadow-inner flex flex-col justify-between relative overflow-hidden transition-all ${
                  activeTab === 'lighting'
                    ? 'bg-slate-950 border-slate-800 brightness-50'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                }`}
              >
                {/* Apply visual blur or tilt filter to inner elements */}
                <div
                  className={`flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5 ${
                    activeTab === 'blur' ? 'blur-sm' : ''
                  }`}
                  style={activeTab === 'skew' ? { transform: 'rotate(12deg)' } : {}}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-rose-600 flex items-center justify-center text-white text-xs font-bold">
                      ID
                    </div>
                    <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                      PASSPORT &bull; REJECTED
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-rose-500 font-bold">
                    {activeTab === 'blur' ? 'LAPLACIAN: 36 (CRITICAL)' : 'STATUS: DEFECT'}
                  </span>
                </div>

                <div
                  className={`space-y-2 my-2 ${activeTab === 'blur' ? 'blur-sm' : ''}`}
                  style={
                    activeTab === 'skew'
                      ? { transform: 'rotate(12deg) scale(0.95)' }
                      : activeTab === 'framing'
                      ? { transform: 'translateX(30px) scale(1.15)' }
                      : {}
                  }
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-14 rounded bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center text-[10px] text-slate-500">
                      PHOTO
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <div className="w-3/4 h-2 rounded bg-slate-900 dark:bg-slate-100"></div>
                      <div className="w-1/2 h-2 rounded bg-slate-700 dark:bg-slate-300"></div>
                      <div className="w-2/3 h-2 rounded bg-slate-500 dark:bg-slate-400"></div>
                    </div>
                  </div>
                </div>

                <div
                  className={`bg-slate-100 dark:bg-slate-800/80 p-2 rounded text-[9px] font-mono text-slate-700 dark:text-slate-300 ${
                    activeTab === 'blur' ? 'blur-sm' : ''
                  }`}
                  style={activeTab === 'skew' ? { transform: 'rotate(12deg)' } : {}}
                >
                  P&lt;USA&lt;&lt;ILLEGIBLE_MRZ_ZONE&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
                </div>

                {/* Glare effect for lighting */}
                {activeTab === 'lighting' && (
                  <div className="absolute top-2 right-4 w-28 h-28 rounded-full bg-white/30 blur-xl pointer-events-none"></div>
                )}
                {/* Warning border overlay */}
                <div className="absolute inset-2 border-2 border-dashed border-rose-500/40 rounded-xl pointer-events-none"></div>
              </div>
            </div>

            <p className="text-xs text-rose-600 dark:text-rose-400 mt-4 leading-relaxed font-medium">
              {activeTab === 'blur' && 'Result: Text edges bleed into background. OCR failure rate exceeds 65%, causing automated rejection.'}
              {activeTab === 'lighting' && 'Result: Characters merge into black shadow; camera sensor noise masks document watermarks.'}
              {activeTab === 'skew' && 'Result: Rotated text baselines confuse row boundary segmenters, necessitating costly manual review.'}
              {activeTab === 'framing' && 'Result: Important issue dates and machine-readable zones are clipped outside the frame.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
