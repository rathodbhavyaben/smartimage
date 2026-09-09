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
} from 'lucide-react';

export const QualityMetricsInfo: React.FC = () => {
  const metrics = [
    {
      id: 'blur',
      icon: Search,
      name: 'Blur & Sharpness',
      benchmark: 'Score ≥ 150 (Pass)',
      unit: 'Laplacian Variance',
      importance: '25% Weight',
      desc: 'Evaluates high-frequency transitions in text glyphs. Low variance signifies motion blur, lens smudges, or camera defocus.',
    },
    {
      id: 'lighting',
      icon: Sun,
      name: 'Ambient Lighting',
      benchmark: '100 – 195 Luma',
      unit: '0 - 255 Luma Index',
      importance: '18% Weight',
      desc: 'Measures mean pixel illumination. Prevents dark underexposed captures where OCR neural networks fail to discern characters.',
    },
    {
      id: 'contrast',
      icon: Contrast,
      name: 'Text Contrast',
      benchmark: 'Std-Dev ≥ 40',
      unit: 'Dynamic Separation',
      importance: '15% Weight',
      desc: 'Quantifies contrast delta between foreground text ink and background paper. High contrast ensures clean thresholding.',
    },
    {
      id: 'exposure',
      icon: Zap,
      name: 'Tonal Exposure',
      benchmark: '< 15% Clipping',
      unit: 'Highlight / Shadow Ratio',
      importance: '14% Weight',
      desc: 'Checks for specular flash reflections, bleached white spots, and heavy dark corner vignettes that obscure crucial details.',
    },
    {
      id: 'resolution',
      icon: Maximize,
      name: 'Resolution Density',
      benchmark: '≥ 1280 × 720 px',
      unit: 'Pixels & Megapixels',
      importance: '12% Weight',
      desc: 'Verifies the sensor resolution meets official regulatory guidelines for passport and identity document archival.',
    },
    {
      id: 'framing',
      icon: Frame,
      name: 'Document Framing',
      benchmark: '60% – 90% View Area',
      unit: 'View Area Fill Ratio',
      importance: '10% Weight',
      desc: 'Confirms all four document edges and corners remain inside the viewfinder without being cropped or positioned too distant.',
    },
    {
      id: 'skew',
      icon: RotateCcw,
      name: 'Skew & Tilt',
      benchmark: 'Angle ≤ 5.0°',
      unit: 'Rotational Degrees',
      importance: '6% Weight',
      desc: 'Detects camera perspective slant. Excessive tilt distorts text baselines and requires corrective homography transformations.',
    },
  ];

  return (
    <section
      id="quality-metrics"
      className="py-20 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            Algorithmic Specifications
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-2">
            7-Point Document Quality Standards
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400 mt-3">
            Each document undergoes multi-spectral analysis calibrated against international machine-readable travel document (MRTD) criteria.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {metrics.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.id}
                className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between hover:border-indigo-400 dark:hover:border-indigo-600 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                      {m.importance}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                    {m.name}
                  </h3>

                  <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400 mb-3">
                    <span>Target: {m.benchmark}</span>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {m.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-xs text-slate-500">
                  <span className="font-mono">{m.unit}</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
              </div>
            );
          })}

          {/* Aggregate scoring info tile */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-950 text-white border border-indigo-700/50 flex flex-col justify-between shadow-lg">
            <div>
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold">
                Quality Scoring Formula
              </span>
              <h3 className="text-xl font-black mt-2 mb-3">
                Unified 0 - 100 Index
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                The overall score fuses all 7 dimensions through a calibrated non-linear penalty curve. Even if lighting is optimal, critical blur or low resolution will trigger an automatic FAIL.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-indigo-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Threshold: 80+ = PASS</span>
              <span className="text-cyan-400 font-bold">Zero False Approvals</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
