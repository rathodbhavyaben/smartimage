import React from 'react';
import {
  Camera,
  Search,
  Sun,
  Frame,
  BarChart3,
  Bot,
  Zap,
  FileCheck,
} from 'lucide-react';

export const Features: React.FC = () => {
  const features = [
    {
      id: 'smart-camera',
      icon: Camera,
      title: 'Smart Camera',
      description:
        'Live WebCam API integration with active alignment guides, resolution checks, and front/rear sensor switching.',
      tag: 'Hardware Accelerated',
    },
    {
      id: 'blur-detection',
      icon: Search,
      title: 'Blur Detection',
      description:
        'Calculates discrete 2D Laplacian variance across character glyphs to detect camera shake and defocus blur.',
      tag: 'Kernel Analysis',
    },
    {
      id: 'lighting-detection',
      icon: Sun,
      title: 'Lighting Detection',
      description:
        'Evaluates ambient luminance and dynamic lux distributions to prevent severe underexposure and dark shadows.',
      tag: 'Luma Mapping',
    },
    {
      id: 'framing-detection',
      icon: Frame,
      title: 'Framing Detection',
      description:
        'Analyzes viewport margin buffers to verify that all 4 document borders are contained without edge truncation.',
      tag: 'Margin Safety',
    },
    {
      id: 'quality-score',
      icon: BarChart3,
      title: 'Quality Score',
      description:
        'Weighted mathematical scoring algorithm (0 to 100) aggregating 7 key dimensions into a transparent index.',
      tag: 'Weighted Metric',
    },
    {
      id: 'ai-analysis',
      icon: Bot,
      title: 'AI Analysis',
      description:
        'Modular computer vision architecture built for instantaneous WebAssembly, OpenCV.js, or deep learning model drop-in.',
      tag: 'OpenCV Ready',
    },
    {
      id: 'real-time-feedback',
      icon: Zap,
      title: 'Real-time Feedback',
      description:
        'Instantaneous HUD suggestions update as you position the camera: lighting warnings, tilt indicators, and readiness.',
      tag: 'Zero Latency',
    },
    {
      id: 'submission-readiness',
      icon: FileCheck,
      title: 'Submission Readiness',
      description:
        'Definitive PASS / IMPROVE / FAIL decisions ensuring documents pass regulatory KYC, passport, and archival gateways.',
      tag: 'Compliance Pass',
    },
  ];

  return (
    <section
      id="features"
      className="py-20 bg-slate-50/50 dark:bg-slate-950/40 border-b border-slate-200/80 dark:border-slate-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            Engine Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-2">
            Engineered for Precision Verification
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400 mt-3">
            Every feature is purpose-built to eliminate failed submissions, blurry rejections, and manual verification delays.
          </p>
        </div>

        {/* 8 Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                id={`feature-${item.id}`}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-indigo-400 dark:hover:border-indigo-600 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/50 group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                    {item.title}
                  </h3>

                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
