import { QualityMetric } from '../types';

/**
 * =========================================================================
 * CLEARCHECK AI - LIGHTING & ILLUMINATION ANALYSIS MODULE
 * =========================================================================
 *
 * FOR AI/ML ENGINEERS:
 * In OpenCV/Python:
 *   gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
 *   mean_val = cv2.mean(gray)[0]
 *   hist = cv2.calcHist([gray], [0], None, [256], [0, 256])
 *   shadow_pct = np.sum(hist[:30]) / gray.size
 *   highlight_pct = np.sum(hist[235:]) / gray.size
 * =========================================================================
 */

export interface LightingAnalysisResult {
  metric: QualityMetric;
  exposureMetric: QualityMetric;
  contrastMetric: QualityMetric;
  meanLuminance: number;
  contrastRatio: number;
}

export function analyzeLightingAndTone(
  imageData: ImageData,
  mockValues?: { brightness?: number; contrast?: number }
): LightingAnalysisResult {
  const { data, width, height } = imageData;
  const totalPixels = width * height;
  const step = Math.max(1, Math.floor(Math.sqrt(totalPixels / 25000)));

  let sampledCount = 0;
  let totalLum = 0;
  let minLum = 255;
  let maxLum = 0;
  let shadowCount = 0;
  let highlightCount = 0;

  for (let i = 0; i < data.length; i += 4 * step) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;

    totalLum += lum;
    if (lum < minLum) minLum = lum;
    if (lum > maxLum) maxLum = lum;
    if (lum < 35) shadowCount++;
    if (lum > 230) highlightCount++;
    sampledCount++;
  }

  const avgLum = sampledCount > 0 ? totalLum / sampledCount : 128;
  const shadowPct = sampledCount > 0 ? (shadowCount / sampledCount) * 100 : 0;
  const highlightPct = sampledCount > 0 ? (highlightCount / sampledCount) * 100 : 0;

  // Standard deviation for contrast
  let varianceSum = 0;
  for (let i = 0; i < data.length; i += 4 * step) {
    const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    varianceSum += (lum - avgLum) * (lum - avgLum);
  }
  const stdDev = sampledCount > 0 ? Math.sqrt(varianceSum / sampledCount) : 45;

  const brightness = mockValues?.brightness ?? Math.round(avgLum);
  const contrast = mockValues?.contrast ?? Math.round(stdDev);

  // Lighting Score (Optimal range is 100 - 180 out of 255)
  let lightingScore = 100;
  let lightingStatus: 'pass' | 'warning' | 'fail' = 'pass';
  let lightingFeedback = 'Optimal illumination and shadow balance';

  if (brightness < 70) {
    lightingScore = Math.max(20, Math.round((brightness / 70) * 55));
    lightingStatus = 'fail';
    lightingFeedback = 'Underexposed and dim. Increase light source or activate flash.';
  } else if (brightness < 100) {
    lightingScore = Math.round(60 + ((brightness - 70) / 30) * 18);
    lightingStatus = 'warning';
    lightingFeedback = 'Slightly dim environment. More light recommended.';
  } else if (brightness > 225) {
    lightingScore = Math.max(25, Math.round(100 - (brightness - 225) * 2.5));
    lightingStatus = 'fail';
    lightingFeedback = 'Blown out highlights and intense glare detected.';
  } else if (brightness > 195) {
    lightingScore = Math.round(75 - ((brightness - 195) / 30) * 15);
    lightingStatus = 'warning';
    lightingFeedback = 'Bright surface glare. Reposition camera away from direct reflection.';
  } else {
    // 100 - 195 is sweet spot
    lightingScore = Math.min(100, Math.round(85 + ((45 - Math.abs(brightness - 145)) / 45) * 15));
    lightingStatus = 'pass';
  }

  // Exposure Metric
  let exposureScore = 95;
  let exposureStatus: 'pass' | 'warning' | 'fail' = 'pass';
  let exposureVal = 'Balanced';
  let exposureFeedback = 'Histogram shows even distribution without clipping';

  if (shadowPct > 35 || highlightPct > 25) {
    exposureScore = 48;
    exposureStatus = 'fail';
    exposureVal = shadowPct > 35 ? 'Severe Underexposure' : 'Severe Overexposure';
    exposureFeedback = shadowPct > 35 ? 'Large clipped black regions' : 'Severe bleached white clipping';
  } else if (shadowPct > 20 || highlightPct > 12) {
    exposureScore = 68;
    exposureStatus = 'warning';
    exposureVal = shadowPct > 20 ? 'Slightly Dark' : 'Bright Glare';
    exposureFeedback = 'Tonal clipping detected in corners or glossy spots';
  } else {
    exposureScore = 94;
    exposureStatus = 'pass';
    exposureVal = 'Good';
    exposureFeedback = 'Even dynamic range without harsh shadows or highlights';
  }

  // Contrast Metric (Standard deviation of luminance)
  // High contrast needed for document reading
  let contrastScore = 90;
  let contrastStatus: 'pass' | 'warning' | 'fail' = 'pass';
  let contrastVal = 'High';
  let contrastFeedback = 'Text ink contrasts strongly against page background';

  if (contrast < 25) {
    contrastScore = 45;
    contrastStatus = 'fail';
    contrastVal = 'Low';
    contrastFeedback = 'Muted contrast makes fine text illegible';
  } else if (contrast < 40) {
    contrastScore = 68;
    contrastStatus = 'warning';
    contrastVal = 'Moderate';
    contrastFeedback = 'Acceptable contrast, but font edges are slightly washed out';
  } else {
    contrastScore = Math.min(100, 80 + Math.round(((contrast - 40) / 40) * 20));
    contrastStatus = 'pass';
    contrastVal = 'Good';
    contrastFeedback = 'Bold character contrast ideal for OCR and review';
  }

  return {
    meanLuminance: brightness,
    contrastRatio: contrast,
    metric: {
      id: 'lighting',
      label: 'Lighting',
      name: 'Ambient Illumination',
      value: `${brightness} Luma`,
      rawScore: lightingScore,
      status: lightingStatus,
      iconName: 'Sun',
      feedback: lightingFeedback,
      threshold: '100 – 195 Luma',
      details: `Mean pixel luminance measured at ${brightness}/255. Shadows: ${shadowPct.toFixed(1)}%, Highlights: ${highlightPct.toFixed(1)}%.`,
    },
    exposureMetric: {
      id: 'exposure',
      label: 'Exposure',
      name: 'Tonal Balance',
      value: exposureVal,
      rawScore: exposureScore,
      status: exposureStatus,
      iconName: 'Zap',
      feedback: exposureFeedback,
      threshold: 'Balanced (Pass)',
      details: `Shadow clipping: ${shadowPct.toFixed(1)}% | Highlight saturation: ${highlightPct.toFixed(1)}%.`,
    },
    contrastMetric: {
      id: 'contrast',
      label: 'Contrast',
      name: 'Dynamic Separation',
      value: contrastVal,
      rawScore: contrastScore,
      status: contrastStatus,
      iconName: 'Contrast',
      feedback: contrastFeedback,
      threshold: 'High / Standard (Pass)',
      details: `Luminance std-dev: ${contrast}. Ensures clear character differentiation for OCR.`,
    },
  };
}
