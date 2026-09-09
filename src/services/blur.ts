import { QualityMetric } from '../types';

/**
 * =========================================================================
 * CLEARCHECK AI - BLUR & SHARPNESS ANALYSIS MODULE
 * =========================================================================
 *
 * FOR AI/ML ENGINEERS:
 * In OpenCV/Python, this corresponds to:
 *   gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
 *   score = cv2.Laplacian(gray, cv2.CV_64F).var()
 *   is_blurry = score < threshold (typically ~100 to 200 depending on resolution)
 *
 * In OpenCV.js (WebAssembly):
 *   let gray = new cv.Mat();
 *   cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
 *   let lap = new cv.Mat();
 *   cv.Laplacian(gray, lap, cv.CV_64F);
 *   let mean = new cv.Mat(), stddev = new cv.Mat();
 *   cv.meanStdDev(lap, mean, stddev);
 *   let blurVar = stddev.data64F[0] * stddev.data64F[0];
 * =========================================================================
 */

export interface BlurAnalysisResult {
  metric: QualityMetric;
  laplacianScore: number;
}

/**
 * Calculates sharpness using a fast discrete Laplacian variance approximation
 * on Canvas pixel data.
 */
export function analyzeBlur(
  imageData: ImageData,
  mockBaseline?: number
): BlurAnalysisResult {
  const { data, width, height } = imageData;
  
  // Downsample sampling step for fast performance on 4K/high-res frames
  const step = Math.max(1, Math.floor(Math.min(width, height) / 240));
  let count = 0;
  let sumLap = 0;
  let sumLapSq = 0;

  // Discrete Laplacian: 4 * center - top - bottom - left - right
  // Using luminance Y = 0.299R + 0.587G + 0.114B
  for (let y = step; y < height - step; y += step) {
    for (let x = step; x < width - step; x += step) {
      const idxCenter = (y * width + x) * 4;
      const idxTop = ((y - step) * width + x) * 4;
      const idxBottom = ((y + step) * width + x) * 4;
      const idxLeft = (y * width + (x - step)) * 4;
      const idxRight = (y * width + (x + step)) * 4;

      const lumCenter = 0.299 * data[idxCenter] + 0.587 * data[idxCenter + 1] + 0.114 * data[idxCenter + 2];
      const lumTop = 0.299 * data[idxTop] + 0.587 * data[idxTop + 1] + 0.114 * data[idxTop + 2];
      const lumBottom = 0.299 * data[idxBottom] + 0.587 * data[idxBottom + 1] + 0.114 * data[idxBottom + 2];
      const lumLeft = 0.299 * data[idxLeft] + 0.587 * data[idxLeft + 1] + 0.114 * data[idxLeft + 2];
      const lumRight = 0.299 * data[idxRight] + 0.587 * data[idxRight + 1] + 0.114 * data[idxRight + 2];

      const lap = 4 * lumCenter - lumTop - lumBottom - lumLeft - lumRight;
      sumLap += lap;
      sumLapSq += lap * lap;
      count++;
    }
  }

  // Variance of Laplacian
  let variance = 0;
  if (count > 0) {
    const mean = sumLap / count;
    variance = sumLapSq / count - mean * mean;
  }

  // Adjust score to normalized index (0 - 400 typical range)
  let normalizedScore = mockBaseline !== undefined ? mockBaseline : Math.round(variance * 1.8);
  if (normalizedScore < 0) normalizedScore = 0;

  // Normalized 0-100 score
  // Typical sharp document is > 150
  let qualityScore = 0;
  if (normalizedScore >= 200) {
    qualityScore = Math.min(100, 85 + Math.round(((normalizedScore - 200) / 200) * 15));
  } else if (normalizedScore >= 120) {
    qualityScore = Math.round(70 + ((normalizedScore - 120) / 80) * 15);
  } else if (normalizedScore >= 60) {
    qualityScore = Math.round(45 + ((normalizedScore - 60) / 60) * 25);
  } else {
    qualityScore = Math.max(15, Math.round((normalizedScore / 60) * 45));
  }

  const status = qualityScore >= 80 ? 'pass' : qualityScore >= 60 ? 'warning' : 'fail';
  const feedback =
    status === 'pass'
      ? 'Crisp, high-contrast text and edge sharpness detected'
      : status === 'warning'
      ? 'Mild motion or focus blur detected. Keep steady.'
      : 'Severe blur detected. Document details may be illegible.';

  return {
    laplacianScore: normalizedScore,
    metric: {
      id: 'blur',
      label: 'Blur & Sharpness',
      name: 'Laplacian Variance',
      value: `${normalizedScore}`,
      rawScore: qualityScore,
      status,
      iconName: 'Search',
      feedback,
      threshold: '≥ 150 (Pass)',
      details: `Calculated edge-energy variance: ${normalizedScore}. High frequency text transitions are ${status === 'pass' ? 'well defined' : 'softened'}.`,
    },
  };
}
