import React from 'react';
import { Camera, Cpu, BarChart3, CheckCircle2, ArrowRight, Scan, ShieldCheck } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '1',
      title: 'Capture / Upload Image',
      subtitle: 'Browser Camera or File',
      description:
        'Launch the dedicated webcam interface with alignment corner guides, or drag-and-drop an existing ID, passport, or document file.',
      icon: Camera,
      badgeColor: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800',
      graphic: (
        <div className="w-full h-24 rounded-xl bg-slate-900 border border-slate-800 relative flex items-center justify-center overflow-hidden mb-4">
          <div className="absolute inset-2 border border-dashed border-cyan-400/40 rounded-lg flex items-center justify-center">
            <div className="w-16 h-12 rounded bg-slate-800 border border-slate-700 p-1 flex flex-col justify-between">
              <div className="w-6 h-1 bg-cyan-400 rounded"></div>
              <div className="w-12 h-1 bg-slate-600 rounded"></div>
              <div className="w-8 h-1 bg-slate-600 rounded"></div>
            </div>
            {/* Brackets */}
            <div className="absolute top-1 left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-cyan-400"></div>
            <div className="absolute top-1 right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-cyan-400"></div>
            <div className="absolute bottom-1 left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-cyan-400"></div>
            <div className="absolute bottom-1 right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-cyan-400"></div>
          </div>
        </div>
      ),
    },
    {
      step: '2',
      title: 'AI Analyzes Image',
      subtitle: '7-Dimensional Verification',
      description:
        'The vision pipeline processes Laplacian blur, ambient lighting, highlight clipping, dynamic contrast, framing margins, and skew tilt in parallel.',
      icon: Cpu,
      badgeColor: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800',
      graphic: (
        <div className="w-full h-24 rounded-xl bg-slate-900 border border-slate-800 relative flex items-center justify-center overflow-hidden mb-4">
          <div className="flex items-center gap-1.5">
            {[45, 80, 60, 95, 30, 70, 85].map((h, i) => (
              <div
                key={i}
                className="w-2.5 bg-gradient-to-t from-cyan-600 to-indigo-400 rounded-t-sm animate-pulse"
                style={{ height: `${h}%`, animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>
          <div className="absolute inset-x-0 top-1/2 h-[1px] bg-cyan-400/50 shadow-[0_0_8px_#22d3ee]"></div>
        </div>
      ),
    },
    {
      step: '3',
      title: 'Quality Score Generated',
      subtitle: 'Unified Scale (0 - 100)',
      description:
        'A mathematically weighted algorithm computes an aggregate score reflecting strict compliance standards for automated document processing.',
      icon: BarChart3,
      badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800',
      graphic: (
        <div className="w-full h-24 rounded-xl bg-slate-900 border border-slate-800 relative flex items-center justify-center overflow-hidden mb-4">
          <div className="relative flex items-center justify-center">
            <svg className="w-16 h-16 transform -rotate-90">
              <circle cx="32" cy="32" r="24" stroke="#334155" strokeWidth="4" fill="none" />
              <circle
                cx="32"
                cy="32"
                r="24"
                stroke="#10b981"
                strokeWidth="4"
                strokeDasharray={2 * Math.PI * 24}
                strokeDashoffset={2 * Math.PI * 24 * 0.08}
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-sm font-black font-mono text-emerald-400">92</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      step: '4',
      title: 'PASS or FAIL Result',
      subtitle: 'Actionable Feedback',
      description:
        'Images scoring 80+ receive a PASS certificate for submission. Sub-80 captures receive pinpoint diagnostic tips to correct lighting, focus, or alignment.',
      icon: CheckCircle2,
      badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
      graphic: (
        <div className="w-full h-24 rounded-xl bg-slate-900 border border-slate-800 relative flex items-center justify-center overflow-hidden mb-4">
          <div className="px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/50 flex items-center gap-2 text-emerald-400 shadow-[0_0_12px_#10b98130]">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-xs font-black font-mono tracking-wider">VERIFIED PASS</span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section
      id="how-it-works"
      className="py-20 border-b border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            Pipeline Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-2">
            How It Works
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400 mt-3">
            Four streamlined stages transforming raw sensor pixels into submission-ready certified documents.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                id={`how-it-works-step-${item.step}`}
                className="relative p-6 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all duration-200 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black font-mono text-slate-300 dark:text-slate-700">
                      0{item.step}
                    </span>
                    <div className={`p-2.5 rounded-xl border ${item.badgeColor}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Graphical Step Illustration */}
                  {item.graphic}

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-3">
                    {item.subtitle}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>Phase {item.step} of 4</span>
                  {idx < 3 && <ArrowRight className="w-3.5 h-3.5 text-slate-400 hidden lg:block" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
