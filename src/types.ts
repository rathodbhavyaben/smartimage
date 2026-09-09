export type StatusType = 'pass' | 'warning' | 'fail';

export interface QualityMetric {
  id: string;
  label: string;
  name: string;
  value: string | number;
  rawScore: number; // 0 to 100
  status: StatusType;
  iconName: 'Search' | 'Sun' | 'Zap' | 'Contrast' | 'Maximize' | 'Frame' | 'RotateCcw';
  feedback: string;
  threshold: string;
  details?: string;
}

export interface HistogramData {
  luminance: number[];
  red: number[];
  green: number[];
  blue: number[];
}

export interface AnalysisResult {
  overallScore: number;
  status: 'PASS' | 'IMPROVE' | 'FAIL';
  summaryMessage: string;
  metrics: {
    blur: QualityMetric;
    lighting: QualityMetric;
    exposure: QualityMetric;
    contrast: QualityMetric;
    resolution: QualityMetric;
    framing: QualityMetric;
    skew: QualityMetric;
  };
  problems: string[];
  suggestions: string[];
  histogram: HistogramData;
  dimensions: {
    width: number;
    height: number;
    megapixels: number;
    aspectRatio: string;
  };
  timestamp: string;
  imagePreview: string;
  fileName?: string;
}

export interface LiveCameraStats {
  brightness: number; // 0-255
  estimatedLux: number;
  sharpness: number; // 0-100 estimate
  isSteady: boolean;
  lightingState: 'optimal' | 'too_dark' | 'too_bright';
  blurState: 'sharp' | 'blurry';
  framingState: 'centered' | 'off_center' | 'tilted';
  isReady: boolean;
}

export type AnalysisStatus = 'idle' | 'scanning' | 'analyzing' | 'completed';

export interface SampleDocument {
  id: string;
  title: string;
  category: string;
  description: string;
  expectedResult: 'PASS' | 'IMPROVE' | 'FAIL';
  imageUrl: string;
}
