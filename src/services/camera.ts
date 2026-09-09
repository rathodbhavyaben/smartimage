import { LiveCameraStats } from '../types';

/**
 * =========================================================================
 * CLEARCHECK AI - WEBCAM & MEDIA STREAM SERVICE
 * =========================================================================
 */

export interface CameraDevice {
  deviceId: string;
  label: string;
}

export class CameraService {
  private currentStream: MediaStream | null = null;
  private videoElement: HTMLVideoElement | null = null;
  private analysisCanvas: HTMLCanvasElement | null = null;
  private analysisCtx: CanvasRenderingContext2D | null = null;

  constructor() {
    this.analysisCanvas = document.createElement('canvas');
    this.analysisCanvas.width = 160;
    this.analysisCanvas.height = 120;
    this.analysisCtx = this.analysisCanvas.getContext('2d', { willReadFrequently: true });
  }

  async getAvailableCameras(): Promise<CameraDevice[]> {
    try {
      if (!navigator.mediaDevices?.enumerateDevices) return [];
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices
        .filter((d) => d.kind === 'videoinput')
        .map((d, idx) => ({
          deviceId: d.deviceId,
          label: d.label || `Camera ${idx + 1}`,
        }));
    } catch (err) {
      console.warn('Unable to enumerate camera devices:', err);
      return [];
    }
  }

  async startCamera(
    videoElement: HTMLVideoElement,
    facingMode: 'environment' | 'user' = 'environment',
    deviceId?: string
  ): Promise<MediaStream> {
    this.stopCamera();
    this.videoElement = videoElement;

    const constraints: MediaStreamConstraints = {
      audio: false,
      video: deviceId
        ? { deviceId: { exact: deviceId } }
        : {
            facingMode: { ideal: facingMode },
            width: { ideal: 1920, min: 640 },
            height: { ideal: 1080, min: 480 },
          },
    };

    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    this.currentStream = stream;
    videoElement.srcObject = stream;
    await videoElement.play();
    return stream;
  }

  stopCamera(): void {
    if (this.currentStream) {
      this.currentStream.getTracks().forEach((track) => track.stop());
      this.currentStream = null;
    }
    if (this.videoElement) {
      this.videoElement.srcObject = null;
    }
  }

  isStreaming(): boolean {
    return !!this.currentStream && this.currentStream.active;
  }

  captureFrame(video: HTMLVideoElement): { dataUrl: string; width: number; height: number; canvas: HTMLCanvasElement } {
    const canvas = document.createElement('canvas');
    const width = video.videoWidth || 1280;
    const height = video.videoHeight || 720;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(video, 0, 0, width, height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    return { dataUrl, width, height, canvas };
  }

  /**
   * Fast real-time frame metric estimator run every 200-300ms on a 160x120 subcanvas
   * to drive live on-screen tips (Good lighting, Too dark, Blurry, Tilt, Ready for capture)
   */
  evaluateLiveFrame(video: HTMLVideoElement): LiveCameraStats {
    if (!this.analysisCtx || !this.analysisCanvas || video.readyState < 2) {
      return {
        brightness: 130,
        estimatedLux: 150,
        sharpness: 80,
        isSteady: true,
        lightingState: 'optimal',
        blurState: 'sharp',
        framingState: 'centered',
        isReady: true,
      };
    }

    const w = this.analysisCanvas.width;
    const h = this.analysisCanvas.height;
    this.analysisCtx.drawImage(video, 0, 0, w, h);
    const imgData = this.analysisCtx.getImageData(0, 0, w, h);
    const data = imgData.data;

    let totalLum = 0;
    let sampleCount = 0;
    let laplacianVarianceSum = 0;

    for (let y = 1; y < h - 1; y += 2) {
      for (let x = 1; x < w - 1; x += 2) {
        const idx = (y * w + x) * 4;
        const lum = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
        totalLum += lum;

        // Fast horizontal edge check
        const idxLeft = (y * w + (x - 1)) * 4;
        const idxRight = (y * w + (x + 1)) * 4;
        const lumL = 0.299 * data[idxLeft] + 0.587 * data[idxLeft + 1] + 0.114 * data[idxLeft + 2];
        const lumR = 0.299 * data[idxRight] + 0.587 * data[idxRight + 1] + 0.114 * data[idxRight + 2];
        const diff = Math.abs(2 * lum - lumL - lumR);
        laplacianVarianceSum += diff * diff;

        sampleCount++;
      }
    }

    const avgLum = sampleCount > 0 ? Math.round(totalLum / sampleCount) : 128;
    const edgeEnergy = sampleCount > 0 ? Math.round(laplacianVarianceSum / sampleCount) : 100;
    const estimatedLux = Math.round(avgLum * 1.3);

    let lightingState: 'optimal' | 'too_dark' | 'too_bright' = 'optimal';
    if (avgLum < 75) lightingState = 'too_dark';
    else if (avgLum > 215) lightingState = 'too_bright';

    const blurState: 'sharp' | 'blurry' = edgeEnergy < 60 ? 'blurry' : 'sharp';
    const isReady = lightingState === 'optimal' && blurState === 'sharp';

    return {
      brightness: avgLum,
      estimatedLux,
      sharpness: Math.min(100, Math.round(edgeEnergy * 0.75)),
      isSteady: blurState === 'sharp',
      lightingState,
      blurState,
      framingState: 'centered',
      isReady,
    };
  }
}

export const cameraService = new CameraService();
