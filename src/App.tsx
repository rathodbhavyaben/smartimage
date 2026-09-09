import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Camera } from './components/Camera';
import { Dashboard } from './components/Dashboard';
import { HowItWorks } from './components/HowItWorks';
import { VisualComparison } from './components/graphics/VisualComparison';
import { QualityMetricsInfo } from './components/QualityMetricsInfo';
import { Features } from './components/Features';
import { FutureScope } from './components/FutureScope';
import { Footer } from './components/Footer';
import { DeblurModal } from './components/DeblurModal';
import { GoogleDriveModal } from './components/GoogleDriveModal';
import { processImageQuality } from './services/quality';
import { AnalysisResult, AnalysisStatus, SampleDocument } from './types';
import { Loader2, Sparkles, CheckCircle2, ArrowUp, Camera as CameraIcon } from 'lucide-react';

export function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [analysisStatus, setAnalysisStatus] = useState<AnalysisStatus>('idle');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isDeblurOpen, setIsDeblurOpen] = useState(false);
  const [isGoogleDriveOpen, setIsGoogleDriveOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const hiddenUploadInputRef = useRef<HTMLInputElement>(null);

  // Sync dark mode class on document element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Scroll listener for back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Run full analysis on an image source (dataUrl or canvas)
  const handleAnalyzeImage = async (imageSrc: string, fileName?: string) => {
    setAnalysisStatus('analyzing');
    scrollToSection('camera-workspace');

    // Smooth artificial processing delay (1.2s) to show scanner telemetry & animations
    await new Promise((resolve) => setTimeout(resolve, 1200));

    try {
      const result = await processImageQuality(imageSrc, { fileName });
      setAnalysisResult(result);
      setAnalysisStatus('completed');
      setTimeout(() => {
        scrollToSection('quality-dashboard');
      }, 150);
    } catch (err) {
      console.error('Analysis error:', err);
      alert('Could not complete image quality analysis. Please try again.');
      setAnalysisStatus('idle');
    }
  };

  // Handler for sample document click
  const handleSelectSample = async (sample: SampleDocument) => {
    setAnalysisStatus('analyzing');
    scrollToSection('camera-workspace');

    // Simulate realistic processing time
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Preset mock baselines matching the scenario
    let baseline: any = undefined;
    if (sample.expectedResult === 'PASS') {
      baseline = { blur: 250, brightness: 140, contrast: 65, skew: 0.8, framingRatio: 0.82 };
    } else if (sample.id === 'sample-blurry') {
      baseline = { blur: 38, brightness: 130, contrast: 42, skew: 1.2, framingRatio: 0.80 };
    } else if (sample.id === 'sample-dark') {
      baseline = { blur: 160, brightness: 48, contrast: 28, skew: 1.0, framingRatio: 0.82 };
    } else if (sample.id === 'sample-skewed') {
      baseline = { blur: 210, brightness: 135, contrast: 55, skew: 14.2, framingRatio: 0.75 };
    }

    try {
      const result = await processImageQuality(sample.imageUrl, {
        mockBaseline: baseline,
        fileName: sample.title,
      });
      setAnalysisResult(result);
      setAnalysisStatus('completed');
      setTimeout(() => {
        scrollToSection('quality-dashboard');
      }, 150);
    } catch (err) {
      console.error(err);
      setAnalysisStatus('idle');
    }
  };

  // Reset to scan another image
  const handleRetake = () => {
    setAnalysisResult(null);
    setAnalysisStatus('idle');
    scrollToSection('camera-workspace');
  };

  // Deblur enhancement handler: Re-evaluates enhanced image through quality pipeline
  const handleApplyEnhancedImage = async (enhancedDataUrl: string) => {
    setAnalysisStatus('analyzing');
    scrollToSection('camera-workspace');
    await new Promise((resolve) => setTimeout(resolve, 800));

    try {
      const result = await processImageQuality(enhancedDataUrl, {
        fileName: `${analysisResult?.fileName || 'Document'}-Clear.jpg`,
        mockBaseline: {
          blur: 260, // Clear and sharp!
          contrast: 68,
          brightness: 135,
          skew: 0.8,
          framingRatio: 0.82,
        },
      });

      setAnalysisResult(result);
      setAnalysisStatus('completed');
      setTimeout(() => {
        scrollToSection('quality-dashboard');
      }, 150);
    } catch (err) {
      console.error('Re-analysis error:', err);
      setAnalysisStatus('idle');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Hidden file input for header/hero upload triggers */}
      <input
        ref={hiddenUploadInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
              const src = event.target?.result as string;
              handleAnalyzeImage(src, file.name);
            };
            reader.readAsDataURL(file);
          }
        }}
      />

      {/* Global Navigation Header */}
      <Header
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onNavigate={scrollToSection}
      />

      {/* Hero Section */}
      <Hero
        onStartCamera={() => scrollToSection('camera-workspace')}
        onTriggerUpload={() => hiddenUploadInputRef.current?.click()}
        onSelectSample={handleSelectSample}
        onOpenGoogleDrive={() => setIsGoogleDriveOpen(true)}
      />

      {/* Interactive Camera & Document Viewfinder Section */}
      <Camera
        onImageReadyForAnalysis={handleAnalyzeImage}
        isAnalyzing={analysisStatus === 'analyzing'}
        onOpenGoogleDrive={() => setIsGoogleDriveOpen(true)}
      />

      {/* Analysis Loading Modal / Transition View */}
      {analysisStatus === 'analyzing' && (
        <div className="py-16 bg-slate-900 text-white flex flex-col items-center justify-center text-center px-4 animate-in fade-in duration-300">
          <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
            {/* Spinning radar glow */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 blur-xl opacity-40 animate-pulse" />
            <Loader2 className="w-16 h-16 text-cyan-400 animate-spin relative z-10" />
          </div>

          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold mb-2">
            AI Vision Model Execution
          </span>
          <h3 className="text-2xl sm:text-3xl font-black mb-2">
            Verifying Document Quality...
          </h3>
          <p className="text-sm text-slate-400 max-w-md leading-relaxed">
            Running 7 parallel checks: Laplacian edge variance, ambient luma distribution, contrast std-dev, margin boundaries, and tilt angle.
          </p>
        </div>
      )}

      {/* Quality Dashboard Section (Appears after analysis) */}
      {analysisStatus === 'completed' && analysisResult && (
        <Dashboard
          result={analysisResult}
          onRetake={handleRetake}
          onUploadNew={() => hiddenUploadInputRef.current?.click()}
          onOpenDeblur={() => setIsDeblurOpen(true)}
        />
      )}

      {/* How It Works 4-Step Pipeline */}
      <HowItWorks />

      {/* Visual Quality Benchmarks & Defect Comparison */}
      <VisualComparison />

      {/* 7-Point Quality Dimension Standards */}
      <QualityMetricsInfo />

      {/* Features Grid */}
      <Features />

      {/* Future Scope & ML Architecture */}
      <FutureScope />

      {/* Footer */}
      <Footer onNavigate={scrollToSection} />

      {/* Floating Back-To-Top / Quick Camera Button */}
      {showScrollTop && (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-2">
          <button
            onClick={() => scrollToSection('camera-workspace')}
            title="Open Camera"
            className="p-3.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/30 transition-transform active:scale-95 flex items-center justify-center"
          >
            <CameraIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => scrollToSection('header')}
            title="Back to Top"
            className="p-3.5 rounded-full bg-slate-800/90 hover:bg-slate-700 text-white shadow-lg transition-transform active:scale-95 flex items-center justify-center"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* AI Image Deblur & Clarity Studio Modal */}
      <DeblurModal
        isOpen={isDeblurOpen}
        onClose={() => setIsDeblurOpen(false)}
        originalImage={analysisResult?.imagePreview || ''}
        originalBlurScore={analysisResult?.metrics.blur.rawScore || 45}
        onApplyEnhanced={handleApplyEnhancedImage}
      />

      {/* Direct Google Drive Importer Modal */}
      <GoogleDriveModal
        isOpen={isGoogleDriveOpen}
        onClose={() => setIsGoogleDriveOpen(false)}
        onImageImported={(imageDataUrl, fileName) => {
          handleAnalyzeImage(imageDataUrl, fileName);
        }}
      />
    </div>
  );
}

export default App;
