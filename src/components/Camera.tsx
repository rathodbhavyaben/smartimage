import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Camera as CameraIcon,
  Upload,
  RefreshCw,
  Sparkles,
  Zap,
  CheckCircle2,
  XCircle,
  AlertCircle,
  VideoOff,
  SwitchCamera,
  Maximize2,
  Eye,
  FileText,
  Sliders,
} from 'lucide-react';
import { cameraService, CameraDevice } from '../services/camera';
import { LiveCameraStats } from '../types';
import { Tips } from './Tips';

interface CameraProps {
  onImageReadyForAnalysis: (imageSrc: string, fileName?: string) => void;
  isAnalyzing: boolean;
  onSelectSampleRequested?: () => void;
  onOpenGoogleDrive?: () => void;
}

export const Camera: React.FC<CameraProps> = ({
  onImageReadyForAnalysis,
  isAnalyzing,
  onOpenGoogleDrive,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraDevices, setCameraDevices] = useState<CameraDevice[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [isFlashActive, setIsFlashActive] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [liveStats, setLiveStats] = useState<LiveCameraStats>({
    brightness: 135,
    estimatedLux: 160,
    sharpness: 82,
    isSteady: true,
    lightingState: 'optimal',
    blurState: 'sharp',
    framingState: 'centered',
    isReady: true,
  });

  // Start webcam feed
  const startCamera = useCallback(async () => {
    setCameraError(null);
    if (!videoRef.current) return;

    try {
      await cameraService.startCamera(videoRef.current, facingMode, selectedDeviceId || undefined);
      setIsCameraActive(true);
      setCapturedImage(null);

      const devices = await cameraService.getAvailableCameras();
      setCameraDevices(devices);
    } catch (err: any) {
      console.warn('Camera start error:', err);
      let msg = 'Could not start webcam. Please grant camera permissions or upload an image.';
      if (err.name === 'NotAllowedError') {
        msg = 'Camera permission was denied. Please allow camera access in browser settings.';
      } else if (err.name === 'NotFoundError') {
        msg = 'No video capture hardware detected on this device.';
      }
      setCameraError(msg);
      setIsCameraActive(false);
    }
  }, [facingMode, selectedDeviceId]);

  // Stop webcam feed
  const stopCamera = useCallback(() => {
    cameraService.stopCamera();
    setIsCameraActive(false);
  }, []);

  // Toggle Camera Facing Mode (Front / Rear)
  const toggleFacingMode = async () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    if (isCameraActive && videoRef.current) {
      try {
        await cameraService.startCamera(videoRef.current, nextMode);
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Real-time frame loop for live tips
  useEffect(() => {
    let intervalId: any;
    if (isCameraActive && videoRef.current) {
      intervalId = setInterval(() => {
        if (videoRef.current && videoRef.current.readyState >= 2) {
          const stats = cameraService.evaluateLiveFrame(videoRef.current);
          setLiveStats(stats);
        }
      }, 350);
    }
    return () => clearInterval(intervalId);
  }, [isCameraActive]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cameraService.stopCamera();
    };
  }, []);

  // Capture Frame
  const handleCapture = () => {
    if (!videoRef.current) return;
    try {
      const captureResult = cameraService.captureFrame(videoRef.current);
      setCapturedImage(captureResult.dataUrl);
      stopCamera();
    } catch (err) {
      console.error('Frame capture error:', err);
    }
  };

  // Retake
  const handleRetake = () => {
    setCapturedImage(null);
    startCamera();
  };

  // Trigger analysis on captured or uploaded image
  const handleAnalyzeCaptured = () => {
    if (capturedImage) {
      onImageReadyForAnalysis(capturedImage, 'webcam_capture.jpg');
    }
  };

  // Upload File Handling
  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, WebP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setCapturedImage(result);
      stopCamera();
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <section
      id="camera-workspace"
      className="py-12 bg-slate-100/60 dark:bg-slate-950/60 border-b border-slate-200/80 dark:border-slate-800"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60 mb-2">
            <CameraIcon className="w-3.5 h-3.5" />
            <span>Interactive Quality Viewfinder</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Document Capture & Analysis
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Frame your document within the corner guides. Real-time algorithms monitor focus and ambient lighting before capture.
          </p>
        </div>

        {/* Viewfinder Main Container */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative rounded-3xl overflow-hidden bg-slate-900 border-4 shadow-2xl transition-all duration-300 ${
            isDragOver
              ? 'border-indigo-500 scale-[1.01]'
              : 'border-slate-800 dark:border-slate-800'
          }`}
        >
          {/* Top Camera Bar */}
          <div className="flex items-center justify-between px-6 py-3 bg-slate-950/90 border-b border-slate-800 text-xs text-slate-400 font-mono z-20">
            {/* Camera ON/OFF Indicator */}
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isCameraActive
                    ? 'bg-emerald-500 animate-pulse'
                    : capturedImage
                    ? 'bg-cyan-500'
                    : 'bg-slate-600'
                }`}
              />
              <span className="font-semibold text-slate-200">
                {isCameraActive
                  ? 'CAMERA ONLINE (STREAMING)'
                  : capturedImage
                  ? 'FRAME CAPTURED'
                  : 'CAMERA STANDBY'}
              </span>
            </div>

            {/* Quick Controls: Flash simulation & Facing mode switch */}
            <div className="flex items-center gap-2">
              {isCameraActive && (
                <>
                  <button
                    onClick={() => setIsFlashActive(!isFlashActive)}
                    title="Simulate Fill Flash"
                    className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-colors ${
                      isFlashActive
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Flash</span>
                  </button>

                  <button
                    onClick={toggleFacingMode}
                    title="Flip camera"
                    className="p-1.5 rounded-lg border bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 transition-colors flex items-center gap-1"
                  >
                    <SwitchCamera className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Flip</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Flash screen effect */}
          {isFlashActive && (
            <div className="absolute inset-0 bg-white/25 pointer-events-none z-30 animate-pulse" />
          )}

          {/* Center Stage: Live Video, Captured Image, or Initial Prompt */}
          <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-slate-950 flex items-center justify-center overflow-hidden">
            {/* 1. Live Video Stream */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${
                isCameraActive && !capturedImage ? 'block' : 'hidden'
              }`}
            />

            {/* 2. Captured Image Preview Mode */}
            {capturedImage && (
              <div className="relative w-full h-full flex items-center justify-center bg-slate-950">
                <img
                  src={capturedImage}
                  alt="Captured Document Frame"
                  className="max-h-full max-w-full object-contain"
                />
                <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono text-cyan-400 border border-cyan-500/30">
                  Ready for Quality Verification
                </div>
              </div>
            )}

            {/* 3. Standby / Idle Landing State */}
            {!isCameraActive && !capturedImage && (
              <div className="p-8 text-center max-w-md mx-auto flex flex-col items-center">
                <div className="w-20 h-20 rounded-3xl bg-indigo-600/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-6 shadow-inner">
                  <CameraIcon className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Launch Web Camera
                </h3>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                  Position your passport, ID, or receipt under direct, even light. Drag and drop any image file to inspect immediately.
                </p>

                {cameraError && (
                  <div className="w-full mb-6 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2 text-left">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{cameraError}</span>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    id="camera-btn-start"
                    onClick={startCamera}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/25 active:scale-[0.98] transition-all"
                  >
                    <CameraIcon className="w-4 h-4" />
                    <span>Start Webcam</span>
                  </button>

                  <button
                    id="camera-btn-upload-idle"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload Image</span>
                  </button>

                  {onOpenGoogleDrive && (
                    <button
                      id="camera-btn-drive-idle"
                      onClick={onOpenGoogleDrive}
                      className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl font-bold text-sm text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 transition-all shadow-sm group"
                    >
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg">
                        <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
                        <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44c-.8 1.4-1.2 2.95-1.2 4.5h27.5z" fill="#00ac47"/>
                        <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.5l5.85 10.15z" fill="#ea4335"/>
                        <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.25z" fill="#00832d"/>
                        <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.25z" fill="#2684fc"/>
                        <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
                      </svg>
                      <span>Google Drive</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Document Corner Guides Overlay (Visible during live streaming or on captured image) */}
            {(isCameraActive || capturedImage) && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-6 sm:p-12">
                <div className="relative w-full h-full max-w-3xl max-h-[88%] border-2 border-dashed border-cyan-400/25 rounded-2xl flex items-center justify-center">
                  {/* Top-Left Bracket */}
                  <div className="absolute -top-1 -left-1 w-10 h-10 border-t-4 border-l-4 border-cyan-400 rounded-tl-xl shadow-[0_0_10px_#22d3ee]"></div>
                  {/* Top-Right Bracket */}
                  <div className="absolute -top-1 -right-1 w-10 h-10 border-t-4 border-r-4 border-cyan-400 rounded-tr-xl shadow-[0_0_10px_#22d3ee]"></div>
                  {/* Bottom-Left Bracket */}
                  <div className="absolute -bottom-1 -left-1 w-10 h-10 border-b-4 border-l-4 border-cyan-400 rounded-bl-xl shadow-[0_0_10px_#22d3ee]"></div>
                  {/* Bottom-Right Bracket */}
                  <div className="absolute -bottom-1 -right-1 w-10 h-10 border-b-4 border-r-4 border-cyan-400 rounded-br-xl shadow-[0_0_10px_#22d3ee]"></div>

                  {/* Edge alignment ticks */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-1 bg-cyan-400/70"></div>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-1 bg-cyan-400/70"></div>
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-cyan-400/70"></div>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-cyan-400/70"></div>

                  {/* Centering Crosshair & Circle */}
                  <div className="w-8 h-8 border border-cyan-400/50 rounded-full flex items-center justify-center opacity-75">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_6px_#22d3ee]"></div>
                  </div>

                  {/* Animated Sweeping Laser Bar (Only while actively streaming) */}
                  {isCameraActive && (
                    <div className="absolute inset-x-2 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_14px_#38bdf8] animate-bounce"></div>
                  )}

                  {/* HUD Corner Data Labels */}
                  <div className="absolute top-2 left-3 text-[9px] font-mono text-cyan-400/80 bg-black/60 px-1.5 py-0.5 rounded">
                    FOV: ACTIVE &bull; TARGET BOUNDS
                  </div>
                  <div className="absolute bottom-2 right-3 text-[9px] font-mono text-cyan-400/80 bg-black/60 px-1.5 py-0.5 rounded">
                    ISO-DOC-9303 CALIBRATED
                  </div>
                </div>
              </div>
            )}

            {/* Real-time floating tips HUD bar (while camera is live) */}
            {isCameraActive && (
              <div className="absolute bottom-4 inset-x-4 flex justify-center pointer-events-none z-20">
                <Tips stats={liveStats} compact />
              </div>
            )}
          </div>

          {/* Bottom Action Controls Footer */}
          <div className="px-6 py-4 bg-slate-950/95 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
            {/* Left Actions: Upload & Hidden File Input */}
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
                }}
              />

              <button
                id="camera-btn-upload"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Image</span>
              </button>

              {onOpenGoogleDrive && (
                <button
                  id="camera-btn-drive-footer"
                  onClick={onOpenGoogleDrive}
                  className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                >
                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg">
                    <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
                    <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44c-.8 1.4-1.2 2.95-1.2 4.5h27.5z" fill="#00ac47"/>
                    <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.5l5.85 10.15z" fill="#ea4335"/>
                    <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.25z" fill="#00832d"/>
                    <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.25z" fill="#2684fc"/>
                    <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
                  </svg>
                  <span>Google Drive</span>
                </button>
              )}

              {isCameraActive && (
                <button
                  id="camera-btn-stop"
                  onClick={stopCamera}
                  className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold bg-slate-800/80 hover:bg-rose-950/50 hover:text-rose-400 text-slate-400 border border-slate-800 transition-colors"
                >
                  <VideoOff className="w-4 h-4" />
                  <span>Turn Off</span>
                </button>
              )}
            </div>

            {/* Center / Primary Action: Capture or Retake + Analyze */}
            <div className="flex items-center gap-3">
              {isCameraActive ? (
                <button
                  id="camera-btn-capture"
                  onClick={handleCapture}
                  className="inline-flex items-center gap-2.5 px-8 py-3 rounded-2xl font-black text-sm text-white bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 shadow-lg shadow-indigo-500/25 active:scale-95 transition-all"
                >
                  <CameraIcon className="w-5 h-5" />
                  <span>Capture Image</span>
                </button>
              ) : capturedImage ? (
                <>
                  <button
                    id="camera-btn-retake"
                    onClick={handleRetake}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Retake</span>
                  </button>

                  <button
                    id="camera-btn-analyze"
                    disabled={isAnalyzing}
                    onClick={handleAnalyzeCaptured}
                    className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/25 active:scale-95 transition-all disabled:opacity-50"
                  >
                    <Sparkles className="w-4 h-4 text-cyan-300" />
                    <span>{isAnalyzing ? 'Analyzing Image...' : 'Analyze Image'}</span>
                  </button>
                </>
              ) : (
                <button
                  id="camera-btn-start-alt"
                  onClick={startCamera}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-md"
                >
                  <CameraIcon className="w-4 h-4" />
                  <span>Open Camera</span>
                </button>
              )}
            </div>

            {/* Right Status Badge */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400">
              <span>{isCameraActive ? 'LIVE EVALUATION ACTIVE' : 'CORNER GUIDES READY'}</span>
            </div>
          </div>
        </div>

        {/* Live Diagnostics Card below camera */}
        {isCameraActive && (
          <div className="mt-4">
            <Tips stats={liveStats} />
          </div>
        )}
      </div>
    </section>
  );
};
