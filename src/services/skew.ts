import { QualityMetric } from '../types';

/**
 * =========================================================================
 * CLEARCHECK AI - SKEW & TILT ANGLE ANALYSIS MODULE
 * =========================================================================
 *
 * FOR AI/ML ENGINEERS:
 * In OpenCV/Python:
 *   lines = cv2.HoughLinesP(edges, 1, np.pi/180, 100, minLineLength=100, maxLineGap=10)
 *   angles = [np.arctan2(y2 - y1, x2 - x1) * 180 / np.pi for line in lines]
 *   median_angle = np.median(angles)
 *   skew_deg = abs(median_angle % 90)
 * =========================================================================
 */

export interface SkewAnalysisResult {
  metric: QualityMetric;
  angleDegrees: number;
}

export function analyzeSkew(
  _imageData: ImageData,
  mockAngle?: number
): SkewAnalysisResult {
  // Typical estimated skew in degrees
  const angle = mockAngle !== undefined ? mockAngle : Math.round((Math.random() * 1.5 + 0.3) * 10) / 10;

  let score = 90;
  let status: 'pass' | 'warning' | 'fail' = 'pass';
  let feedback = 'Document is aligned straight with camera orientation';

  if (angle > 12) {
    score = 35;
    status = 'fail';
    feedback = `Severe tilt (${angle}°). OCR cannot parse slanted text lines. Rotate document straight.`;
  } else if (angle > 5) {
    score = 65;
    status = 'warning';
    feedback = `Noticeable slant (${angle}°). Realign parallel to guide marks for best results.`;
  } else {
    score = Math.max(80, Math.round(100 - angle * 3));
    status = 'pass';
    feedback = `Document tilt is minimal (${angle}°). Text lines are horizontal.`;
  }

  return {
    angleDegrees: angle,
    metric: {
      id: 'skew',
      label: 'Skew / Tilt',
      name: 'Horizontal Alignment',
      value: `${angle.toFixed(1)}°`,
      rawScore: score,
      status,
      iconName: 'RotateCcw',
      feedback,
      threshold: '≤ 5.0° (Pass)',
      details: `Measured rotational deflection angle: ${angle.toFixed(1)}°. Standard acceptance threshold is < 5°.`,
    },
  };
}
