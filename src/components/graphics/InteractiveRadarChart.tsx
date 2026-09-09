import React from 'react';
import { QualityMetric } from '../../types';
import { Radar, Sparkles } from 'lucide-react';

interface InteractiveRadarChartProps {
  metrics: {
    blur: QualityMetric;
    lighting: QualityMetric;
    exposure: QualityMetric;
    contrast: QualityMetric;
    framing: QualityMetric;
    resolution: QualityMetric;
    skew: QualityMetric;
  };
  overallScore: number;
}

export const InteractiveRadarChart: React.FC<InteractiveRadarChartProps> = ({
  metrics,
  overallScore,
}) => {
  // 7 axes around 360 degrees
  const axes = [
    { label: 'Sharpness', score: metrics.blur.score, status: metrics.blur.status },
    { label: 'Lighting', score: metrics.lighting.score, status: metrics.lighting.status },
    { label: 'Exposure', score: metrics.exposure.score, status: metrics.exposure.status },
    { label: 'Contrast', score: metrics.contrast.score, status: metrics.contrast.status },
    { label: 'Framing', score: metrics.framing.score, status: metrics.framing.status },
    { label: 'Resolution', score: metrics.resolution.score, status: metrics.resolution.status },
    { label: 'Skew Angle', score: metrics.skew.score, status: metrics.skew.status },
  ];

  const size = 320;
  const center = size / 2;
  const radius = size * 0.38;
  const totalAxes = axes.length;

  const getCoordinates = (index: number, valueRatio: number) => {
    // Angle in radians (starting at top = -PI/2)
    const angle = (index * 2 * Math.PI) / totalAxes - Math.PI / 2;
    const r = radius * valueRatio;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // Generate target threshold polygon (80% baseline)
  const targetPoints = axes
    .map((_, i) => {
      const { x, y } = getCoordinates(i, 0.8);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  // Generate actual metric polygon
  const actualPoints = axes
    .map((axis, i) => {
      const ratio = Math.max(0.15, Math.min(1.0, axis.score / 100));
      const { x, y } = getCoordinates(i, ratio);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  const gridLevels = [0.25, 0.5, 0.75, 1.0];

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center">
      <div className="w-full flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            <Radar className="w-3.5 h-3.5" />
            <span>7-Axis Quality Polygon</span>
          </div>
          <h4 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
            Holistic Metric Distribution
          </h4>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-mono">
          <span className="flex items-center gap-1.5 text-emerald-500">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Measured
          </span>
          <span className="flex items-center gap-1.5 text-slate-400">
            <span className="w-2.5 h-0.5 bg-slate-400"></span> Target (80%)
          </span>
        </div>
      </div>

      {/* SVG Spiderweb Graphic */}
      <div className="relative flex items-center justify-center">
        <svg
          width={size}
          height={size}
          className="overflow-visible select-none drop-shadow-md"
        >
          {/* Concentric Web Rings */}
          {gridLevels.map((lvl, idx) => {
            const points = axes
              .map((_, i) => {
                const { x, y } = getCoordinates(i, lvl);
                return `${x.toFixed(1)},${y.toFixed(1)}`;
              })
              .join(' ');

            return (
              <polygon
                key={idx}
                points={points}
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-slate-200 dark:text-slate-800"
              />
            );
          })}

          {/* Radial Spokes */}
          {axes.map((_, i) => {
            const outer = getCoordinates(i, 1.0);
            return (
              <line
                key={i}
                x1={center}
                y1={center}
                x2={outer.x}
                y2={outer.y}
                stroke="currentColor"
                strokeWidth="1"
                className="text-slate-200 dark:text-slate-800"
              />
            );
          })}

          {/* Target Boundary (80%) */}
          <polygon
            points={targetPoints}
            fill="none"
            stroke="#94a3b8"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            className="opacity-60"
          />

          {/* Actual Document Quality Polygon */}
          <polygon
            points={actualPoints}
            fill="url(#radarGradient)"
            stroke={overallScore >= 80 ? '#10b981' : overallScore >= 60 ? '#f59e0b' : '#ef4444'}
            strokeWidth="2.5"
            className="transition-all duration-700 ease-out"
          />

          {/* Gradients */}
          <defs>
            <radialGradient id="radarGradient" cx="50%" cy="50%" r="50%">
              <stop
                offset="0%"
                stopColor={overallScore >= 80 ? '#10b981' : '#f59e0b'}
                stopOpacity="0.45"
              />
              <stop
                offset="100%"
                stopColor={overallScore >= 80 ? '#10b981' : '#ef4444'}
                stopOpacity="0.1"
              />
            </radialGradient>
          </defs>

          {/* Data Points and Labels */}
          {axes.map((axis, i) => {
            const ratio = Math.max(0.15, Math.min(1.0, axis.score / 100));
            const point = getCoordinates(i, ratio);
            const labelCoord = getCoordinates(i, 1.18);

            return (
              <g key={i}>
                {/* Vertex node */}
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="4"
                  fill="#ffffff"
                  stroke={axis.status === 'pass' ? '#10b981' : axis.status === 'warning' ? '#f59e0b' : '#ef4444'}
                  strokeWidth="2.5"
                  className="shadow-sm"
                />

                {/* Axis Title */}
                <text
                  x={labelCoord.x}
                  y={labelCoord.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="text-[10px] font-mono font-bold fill-slate-600 dark:fill-slate-300"
                >
                  {axis.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Footer explanation */}
      <div className="w-full mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-mono text-slate-500 dark:text-slate-400 flex items-center justify-between">
        <span>Target Area: 80% Envelope</span>
        <span className="text-indigo-600 dark:text-indigo-400 font-bold">
          Coverage: {Math.round(overallScore)}% Balanced
        </span>
      </div>
    </div>
  );
};
