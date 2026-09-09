import { AnalysisResult, QualityMetric } from '../types';
import { analyzeBlur } from './blur';
import { analyzeLightingAndTone } from './lighting';
import { calculateHistogram } from './histogram';
import { analyzeFraming } from './framing';
import { analyzeSkew } from './skew';

/**
 * =========================================================================
 * CLEARCHECK AI - CORE QUALITY AGGREGATOR PIPELINE
 * =========================================================================
 * Weight Matrix:
 * - Blur / Sharpness: 25% (Critical for OCR & readability)
 * - Lighting / Illumination: 18%
 * - Exposure / Clipping: 14%
 * - Contrast: 15%
 * - Resolution: 12%
 * - Framing: 10%
 * - Skew / Tilt: 6%
 * =========================================================================
 */

export interface AnalysisOptions {
  mockBaseline?: {
    blur?: number;
    brightness?: number;
    contrast?: number;
    skew?: number;
    framingRatio?: number;
  };
  fileName?: string;
}

export async function processImageQuality(
  imageSource: string | HTMLCanvasElement,
  options: AnalysisOptions = {}
): Promise<AnalysisResult> {
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let imgWidth = 1920;
  let imgHeight = 1080;
  let previewDataUrl = '';

  if (typeof imageSource === 'string') {
    previewDataUrl = imageSource;
    const img = new Image();
    img.crossOrigin = 'anonymous';

    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Failed to load image for quality analysis'));
      img.src = imageSource;
    });

    imgWidth = img.naturalWidth || 1920;
    imgHeight = img.naturalHeight || 1080;

    canvas = document.createElement('canvas');
    canvas.width = imgWidth;
    canvas.height = imgHeight;
    ctx = canvas.getContext('2d', { willReadFrequently: true })!;
    ctx.drawImage(img, 0, 0);
  } else {
    canvas = imageSource;
    imgWidth = canvas.width;
    imgHeight = canvas.height;
    ctx = canvas.getContext('2d', { willReadFrequently: true })!;
    previewDataUrl = canvas.toDataURL('image/jpeg', 0.9);
  }

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  // Run modular analyzers
  const blurResult = analyzeBlur(imageData, options.mockBaseline?.blur);
  const toneResult = analyzeLightingAndTone(imageData, {
    brightness: options.mockBaseline?.brightness,
    contrast: options.mockBaseline?.contrast,
  });
  const framingResult = analyzeFraming(imageData, {
    fillRatio: options.mockBaseline?.framingRatio,
  });
  const skewResult = analyzeSkew(imageData, options.mockBaseline?.skew);
  const histogram = calculateHistogram(imageData);

  // Resolution Metric
  const totalPixels = imgWidth * imgHeight;
  const megapixels = Math.round((totalPixels / 1000000) * 10) / 10;
  let resScore = 100;
  let resStatus: 'pass' | 'warning' | 'fail' = 'pass';
  let resFeedback = 'Ultra-crisp resolution exceeds archival standards';

  if (imgWidth < 800 || imgHeight < 600) {
    resScore = 30;
    resStatus = 'fail';
    resFeedback = 'Resolution is critically low. Text fine lines will break up.';
  } else if (imgWidth < 1280 || imgHeight < 720) {
    resScore = 65;
    resStatus = 'warning';
    resFeedback = 'Sub-HD resolution. May be acceptable but high-def is preferred.';
  } else if (imgWidth >= 1920) {
    resScore = 100;
    resStatus = 'pass';
    resFeedback = 'High definition (1080p+) resolution suitable for official verification';
  } else {
    resScore = 85;
    resStatus = 'pass';
    resFeedback = 'HD resolution meeting document submission standards';
  }

  const resolutionMetric: QualityMetric = {
    id: 'resolution',
    label: 'Resolution',
    name: 'Spatial Definition',
    value: `${imgWidth} × ${imgHeight}`,
    rawScore: resScore,
    status: resStatus,
    iconName: 'Maximize',
    feedback: resFeedback,
    threshold: '≥ 1280 × 720 (Pass)',
    details: `${megapixels} MP capture (${imgWidth}x${imgHeight} px). Aspect ratio ${(imgWidth / imgHeight).toFixed(2)}:1.`,
  };

  const metrics = {
    blur: blurResult.metric,
    lighting: toneResult.metric,
    exposure: toneResult.exposureMetric,
    contrast: toneResult.contrastMetric,
    resolution: resolutionMetric,
    framing: framingResult.metric,
    skew: skewResult.metric,
  };

  // Weighted score calculation
  const weightedTotal =
    metrics.blur.rawScore * 0.25 +
    metrics.lighting.rawScore * 0.18 +
    metrics.exposure.rawScore * 0.14 +
    metrics.contrast.rawScore * 0.15 +
    metrics.resolution.rawScore * 0.12 +
    metrics.framing.rawScore * 0.10 +
    metrics.skew.rawScore * 0.06;

  const overallScore = Math.round(weightedTotal);

  // Status mapping:
  // 80–100 -> PASS
  // 60–79 -> WARNING / IMPROVE
  // Below 60 -> FAIL
  let status: 'PASS' | 'IMPROVE' | 'FAIL' = 'PASS';
  let summaryMessage = 'Image is submission ready and passes all compliance checks.';

  if (overallScore >= 80) {
    status = 'PASS';
    summaryMessage = 'Image meets all clarity, framing, and lighting standards for submission.';
  } else if (overallScore >= 60) {
    status = 'IMPROVE';
    summaryMessage = 'Image meets basic readability but has minor warnings. Consider retaking.';
  } else {
    status = 'FAIL';
    summaryMessage = 'Image quality is too low for automated submission or official verification.';
  }

  // Compile specific detected problems
  const problems: string[] = [];
  const suggestions: string[] = [];

  if (metrics.blur.status === 'fail') {
    problems.push('Image is too blurry for character recognition');
    suggestions.push('Hold the camera steady or place device on a stable surface');
  } else if (metrics.blur.status === 'warning') {
    problems.push('Slight motion or focal blur detected');
    suggestions.push('Tap to focus on the document text before capturing');
  }

  if (metrics.lighting.status === 'fail') {
    problems.push('Lighting is too dark or washed out');
    suggestions.push('Move to a brighter area or turn on ambient room lights');
  }

  if (metrics.exposure.status === 'fail' || metrics.exposure.status === 'warning') {
    problems.push('Glares or heavy shadows are obscuring text');
    suggestions.push('Tilt document slightly away from direct overhead spotlights');
  }

  if (metrics.contrast.status === 'fail') {
    problems.push('Insufficient contrast between text and background');
    suggestions.push('Avoid capturing against busy backgrounds; place on a dark contrasting surface');
  }

  if (metrics.framing.status === 'fail' || metrics.framing.status === 'warning') {
    problems.push('Document edges are touching frame or too far away');
    suggestions.push('Place the entire document inside the viewfinder corner guides');
  }

  if (metrics.skew.status === 'fail' || metrics.skew.status === 'warning') {
    problems.push('Document is noticeably tilted or skewed');
    suggestions.push('Align document parallel to camera edges and hold phone flat above it');
  }

  if (metrics.resolution.status === 'fail') {
    problems.push('Resolution is too low (less than 720p)');
    suggestions.push('Use a higher resolution camera setting or bring camera closer');
  }

  // If pass but 0 suggestions, provide standard best practices
  if (suggestions.length === 0) {
    suggestions.push('Maintain clean lens surface before document captures');
    suggestions.push('Store official submission receipts with verification hash');
  }

  return {
    overallScore,
    status,
    summaryMessage,
    metrics,
    problems,
    suggestions,
    histogram,
    dimensions: {
      width: imgWidth,
      height: imgHeight,
      megapixels,
      aspectRatio: (imgWidth / imgHeight).toFixed(2),
    },
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    imagePreview: previewDataUrl,
    fileName: options.fileName,
  };
}
