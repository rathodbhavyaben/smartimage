import { HistogramData } from '../types';

/**
 * =========================================================================
 * CLEARCHECK AI - HISTOGRAM COMPUTATION MODULE
 * =========================================================================
 * Generates 64-bin tonal distributions for R, G, B, and Luminance channels
 * for visual dynamic frequency graphs on the Quality Dashboard.
 */

export function calculateHistogram(imageData: ImageData, bins: number = 64): HistogramData {
  const { data } = imageData;
  const luminance = new Array(bins).fill(0);
  const red = new Array(bins).fill(0);
  const green = new Array(bins).fill(0);
  const blue = new Array(bins).fill(0);

  const binScale = bins / 256;
  const step = Math.max(1, Math.floor(data.length / (4 * 40000)));

  let count = 0;
  for (let i = 0; i < data.length; i += 4 * step) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const lum = Math.round(0.299 * r + 0.587 * g + 0.114 * b);

    const rBin = Math.min(bins - 1, Math.floor(r * binScale));
    const gBin = Math.min(bins - 1, Math.floor(g * binScale));
    const bBin = Math.min(bins - 1, Math.floor(b * binScale));
    const lumBin = Math.min(bins - 1, Math.floor(lum * binScale));

    red[rBin]++;
    green[gBin]++;
    blue[bBin]++;
    luminance[lumBin]++;
    count++;
  }

  // Normalize to percentage (0 - 100) relative to max peak
  const maxLum = Math.max(...luminance, 1);
  const maxR = Math.max(...red, 1);
  const maxG = Math.max(...green, 1);
  const maxB = Math.max(...blue, 1);

  return {
    luminance: luminance.map((v) => Math.round((v / maxLum) * 100)),
    red: red.map((v) => Math.round((v / maxR) * 100)),
    green: green.map((v) => Math.round((v / maxG) * 100)),
    blue: blue.map((v) => Math.round((v / maxB) * 100)),
  };
}
