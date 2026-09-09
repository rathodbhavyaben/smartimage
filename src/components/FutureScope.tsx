import React, { useState } from 'react';
import { Code2, Terminal, Layers, Sparkles, Check, Copy, ExternalLink, Cpu } from 'lucide-react';

export const FutureScope: React.FC = () => {
  const [activeCodeTab, setActiveCodeTab] = useState<'opencv' | 'python' | 'wasm'>('opencv');
  const [copied, setCopied] = useState(false);

  const opencvCode = `// src/services/blur.ts - Drop-in OpenCV.js (WebAssembly) Implementation
import cv from '@techstark/opencv-js';

export function analyzeBlurOpenCV(imageElement: HTMLImageElement | HTMLCanvasElement) {
  // 1. Read canvas into OpenCV matrix
  const src = cv.imread(imageElement);
  const gray = new cv.Mat();
  
  // 2. Convert RGB to single-channel Grayscale
  cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
  
  // 3. Compute 2D Laplacian high-pass filter
  const lap = new cv.Mat();
  cv.Laplacian(gray, lap, cv.CV_64F);
  
  // 4. Calculate mean and standard deviation of response
  const mean = new cv.Mat();
  const stddev = new cv.Mat();
  cv.meanStdDev(lap, mean, stddev);
  
  // Variance = (stddev)^2
  const variance = Math.pow(stddev.doubleAt(0, 0), 2);
  
  // Clean up native WebAssembly memory
  src.delete(); gray.delete(); lap.delete(); mean.delete(); stddev.delete();
  
  return {
    variance: Math.round(variance),
    isSharp: variance >= 150
  };
}`;

  const pythonCode = `# ClearCheck AI - Python / FastAPI Microservice (Optional Cloud Tier)
import cv2
import numpy as np
from fastapi import FastAPI, UploadFile, File

app = FastAPI(title="ClearCheck AI Vision Service")

@app.post("/api/v1/analyze-quality")
async def analyze_document_quality(file: UploadFile = File(...)):
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    # 1. Blur via Laplacian Variance
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    blur_score = cv2.Laplacian(gray, cv2.CV_64F).var()
    
    # 2. Lighting / Mean Brightness
    brightness = np.mean(gray)
    
    # 3. Document Contour / Perspective Rectification
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    edges = cv2.Canny(blurred, 75, 200)
    contours, _ = cv2.findContours(edges, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)
    
    return {
        "blur_score": round(blur_score, 2),
        "brightness_lux": round(brightness, 1),
        "resolution": f"{img.shape[1]}x{img.shape[0]}",
        "status": "PASS" if (blur_score > 150 and 90 < brightness < 200) else "FAIL"
    }`;

  const wasmCode = `// WebAssembly / FFT (Fast Fourier Transform) Frequency Energy
export function calculateFftSharpness(imageFloat32Array: Float32Array, width: number, height: number) {
  // Radix-2 2D FFT extracts high-frequency energy ratio
  // Sharp glyph edges concentrate energy in high spatial frequencies (outer spectrum)
  // Low blur energy confirms defocus or motion smear
  const highFrequencyEnergyRatio = compute2DFFTEnergyDistribution(imageFloat32Array, width, height);
  return {
    highFrequencyRatio: highFrequencyEnergyRatio,
    sharpnessIndex: Math.round(highFrequencyEnergyRatio * 100)
  };
}`;

  const currentCode =
    activeCodeTab === 'opencv'
      ? opencvCode
      : activeCodeTab === 'python'
      ? pythonCode
      : wasmCode;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const roadmapItems = [
    {
      title: 'Automatic Edge Perspective Unwarping',
      desc: 'Find 4 document polygon corners and apply 3x3 homography transformation to straighten skewed documents automatically.',
      phase: 'v2.6 Upcoming',
    },
    {
      title: 'On-Device Tesseract OCR Verification',
      desc: 'Verify character read confidence alongside image visual metrics to guarantee MRZ passports and driver licenses are 100% decipherable.',
      phase: 'v2.8 Q3',
    },
    {
      title: 'Multi-Page Batch Processing',
      desc: 'Continuously stream multi-page legal contracts and tax submissions with automated burst capturing as soon as framing stabilizes.',
      phase: 'v3.0 Roadmap',
    },
    {
      title: 'Anti-Spoofing & Screen Glare Classifier',
      desc: 'Detect moiré screen pixel patterns to prevent users submitting photos of computer monitors instead of authentic documents.',
      phase: 'v3.2 Research',
    },
  ];

  return (
    <section
      id="opencv-integration"
      className="py-20 bg-slate-900 text-slate-100 border-b border-slate-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-3">
            <Cpu className="w-3.5 h-3.5" />
            <span>AI / ML Developer Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Decoupled AI Vision Pipeline
          </h2>
          <p className="text-base text-slate-400 mt-3 leading-relaxed">
            The frontend UI is strictly decoupled from the mathematical algorithms. The AI/ML engineering team can swap out the lightweight Canvas algorithms with full OpenCV.js (WebAssembly) or TensorFlow Lite in minutes.
          </p>
        </div>

        {/* Code Snippet Box */}
        <div className="rounded-3xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl mb-16">
          {/* Tabs header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/70">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
              <span className="text-xs font-mono text-slate-400 ml-2 hidden sm:inline">
                /src/services/analysisEngine.ts
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 text-xs">
                <button
                  onClick={() => setActiveCodeTab('opencv')}
                  className={`px-3 py-1 rounded-lg font-mono font-medium transition-colors ${
                    activeCodeTab === 'opencv'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  OpenCV.js (WASM)
                </button>
                <button
                  onClick={() => setActiveCodeTab('python')}
                  className={`px-3 py-1 rounded-lg font-mono font-medium transition-colors ${
                    activeCodeTab === 'python'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Python / FastAPI
                </button>
                <button
                  onClick={() => setActiveCodeTab('wasm')}
                  className={`px-3 py-1 rounded-lg font-mono font-medium transition-colors ${
                    activeCodeTab === 'wasm'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  FFT Spectrum Energy
                </button>
              </div>

              <button
                onClick={handleCopyCode}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Copy code"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Code Body */}
          <div className="p-6 overflow-x-auto text-xs sm:text-sm font-mono text-cyan-300 leading-relaxed max-h-[380px]">
            <pre>{currentCode}</pre>
          </div>
        </div>

        {/* Future Scope Roadmap Grid */}
        <div>
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
              Evolutionary Path
            </span>
            <h3 className="text-2xl font-black text-white mt-1">
              Future Scope & Enterprise Capabilities
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roadmapItems.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-colors flex flex-col justify-between"
              >
                <div>
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-800/60 inline-block mb-3">
                    {item.phase}
                  </span>
                  <h4 className="text-base font-bold text-white mb-2">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
