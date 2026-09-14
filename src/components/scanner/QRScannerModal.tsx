"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Camera,
  UploadCloud,
  X,
  Shield,
  Search,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Zap,
  Terminal,
  ScanLine,
} from "lucide-react";
import { CyberButton } from "../ui/CyberButton";
import { QRDropzone } from "./QRDropzone";
import { PresetPayloadSelector } from "./PresetPayloadSelector";
import { SecurityDashboard } from "../dashboard/SecurityDashboard";
import { analyzeSecurityPayload } from "@/lib/securityEngine";
import { SecurityAnalysisResult, PresetPayload } from "@/lib/types";
import { decodeQRFromVideo } from "@/lib/qrDecoder";
import { soundFX } from "../ui/SoundFX";

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPayload?: string;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  isOpen,
  onClose,
  initialPayload,
}) => {
  const [activeTab, setActiveTab] = useState<"camera" | "upload" | "manual">("upload");
  const [manualInput, setManualInput] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState<"idle" | "detected" | "analyzing" | "complete">("idle");
  const [detectedRawPayload, setDetectedRawPayload] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<SecurityAnalysisResult | null>(null);

  // Camera references
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Start / Stop Camera
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute("playsinline", "true");
          await videoRef.current.play();
          requestAnimationFrame(scanVideoFrame);
        }
      } else {
        setCameraError("Webcam access not supported on this browser/environment. Use file upload or preset scenarios.");
      }
    } catch {
      setCameraError("Camera permission denied or camera device unavailable. You can upload an image or choose a preset.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
  };

  // Live video frame QR scanner loop
  const scanVideoFrame = () => {
    if (videoRef.current && canvasRef.current && scanStatus === "idle") {
      const code = decodeQRFromVideo(videoRef.current, canvasRef.current);
      if (code) {
        handlePayloadReceived(code);
        return;
      }
    }
    if (streamRef.current) {
      animFrameRef.current = requestAnimationFrame(scanVideoFrame);
    }
  };

  useEffect(() => {
    if (isOpen && activeTab === "camera" && !analysisResult) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen, activeTab, analysisResult]);

  useEffect(() => {
    if (initialPayload) {
      handlePayloadReceived(initialPayload);
    }
  }, [initialPayload]);

  const handlePayloadReceived = (raw: string) => {
    stopCamera();
    setDetectedRawPayload(raw);
    setScanStatus("detected");
    soundFX.playScanBeam();

    setTimeout(() => {
      setScanStatus("analyzing");
      setTimeout(() => {
        const result = analyzeSecurityPayload(raw);
        setAnalysisResult(result);
        setScanStatus("complete");
        if (result.riskScore > 60) {
          soundFX.playThreatAlarm();
        } else {
          soundFX.playSafeChime();
        }
      }, 1200);
    }, 800);
  };

  const handleSelectPreset = (preset: PresetPayload) => {
    handlePayloadReceived(preset.payload);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    handlePayloadReceived(manualInput.trim());
  };

  const handleReset = () => {
    soundFX.playClick();
    setAnalysisResult(null);
    setDetectedRawPayload(null);
    setScanStatus("idle");
    setManualInput("");
    if (activeTab === "camera") {
      startCamera();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-xl">
      {/* Hidden processing canvas */}
      <canvas ref={canvasRef} className="hidden" />

      <div className="relative w-full max-w-5xl bg-slate-950 rounded-2xl border border-cyber-cyan/40 shadow-[0_0_60px_rgba(0,240,255,0.2)] overflow-hidden my-8">
        {/* Top Header */}
        <div className="bg-slate-900/90 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyber-900 border border-cyber-cyan/40 text-cyber-cyan">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-mono text-sm font-bold text-white tracking-wider uppercase">
                QRSHIELD SCAN &amp; ANALYSIS LAB
              </h3>
              <p className="text-[11px] font-mono text-slate-400">
                Zero Trust Pre-Execution Threat Triage Engine
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundFX.playClick();
              stopCamera();
              onClose();
            }}
            className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8">
          {analysisResult ? (
            <SecurityDashboard result={analysisResult} onReset={handleReset} />
          ) : scanStatus === "detected" || scanStatus === "analyzing" ? (
            /* Scanning & Extraction Transition HUD */
            <div className="py-16 flex flex-col items-center justify-center text-center space-y-6">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-cyber-cyan border-t-transparent animate-spin" />
                <div className="absolute inset-2 rounded-full border border-dashed border-cyber-cyan/40 animate-radar-sweep" />
                <ScanLine className="w-12 h-12 text-cyber-cyan animate-pulse" />
              </div>

              <div className="space-y-2">
                <span className="px-3 py-1 rounded bg-cyber-cyan/10 border border-cyber-cyan/40 text-cyber-cyan text-xs font-mono font-bold tracking-widest uppercase">
                  {scanStatus === "detected" ? "QR CODE DETECTED" : "ANALYZING DESTINATION..."}
                </span>
                <h4 className="text-xl sm:text-2xl font-mono font-bold text-white">
                  {scanStatus === "detected"
                    ? "EXTRACTING PAYLOAD MATRIX..."
                    : "CALCULATING THREAT REPUTATION..."}
                </h4>
                <p className="text-xs font-mono text-slate-400 max-w-md mx-auto truncate">
                  Target: {detectedRawPayload}
                </p>
              </div>

              <div className="w-64 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-cyber-cyan animate-pulse" style={{ width: "85%" }} />
              </div>
            </div>
          ) : (
            /* Scanner Input Interface */
            <div className="space-y-8">
              {/* Method Selector Tabs */}
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => {
                    soundFX.playClick();
                    setActiveTab("upload");
                  }}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-xs font-bold transition-all ${
                    activeTab === "upload"
                      ? "bg-cyber-cyan text-slate-950 shadow-[0_0_20px_rgba(0,240,255,0.4)]"
                      : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>UPLOAD QR IMAGE</span>
                </button>

                <button
                  onClick={() => {
                    soundFX.playClick();
                    setActiveTab("camera");
                  }}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-xs font-bold transition-all ${
                    activeTab === "camera"
                      ? "bg-cyber-cyan text-slate-950 shadow-[0_0_20px_rgba(0,240,255,0.4)]"
                      : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  <Camera className="w-4 h-4" />
                  <span>SCAN WITH CAMERA</span>
                </button>

                <button
                  onClick={() => {
                    soundFX.playClick();
                    setActiveTab("manual");
                  }}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-xs font-bold transition-all ${
                    activeTab === "manual"
                      ? "bg-cyber-cyan text-slate-950 shadow-[0_0_20px_rgba(0,240,255,0.4)]"
                      : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  <Terminal className="w-4 h-4" />
                  <span>DIRECT URL / BUFFER</span>
                </button>
              </div>

              {/* Tab 1: Upload */}
              {activeTab === "upload" && (
                <div className="max-w-2xl mx-auto">
                  <QRDropzone onDecoded={handlePayloadReceived} />
                </div>
              )}

              {/* Tab 2: Live Camera HUD Frame */}
              {activeTab === "camera" && (
                <div className="max-w-md mx-auto">
                  <div className="relative aspect-square rounded-2xl bg-slate-950 border-2 border-cyber-cyan/40 overflow-hidden flex items-center justify-center shadow-[0_0_40px_rgba(0,240,255,0.15)]">
                    <video
                      ref={videoRef}
                      className="absolute inset-0 w-full h-full object-cover"
                      muted
                    />

                    {/* Camera HUD Corner Brackets */}
                    <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-cyber-cyan" />
                    <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-cyber-cyan" />
                    <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-cyber-cyan" />
                    <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-cyber-cyan" />

                    {/* Animated Scanning Laser Line */}
                    <div className="absolute inset-x-4 h-0.5 bg-gradient-to-r from-transparent via-cyber-cyan to-transparent shadow-[0_0_15px_#00f0ff] animate-laser-scan pointer-events-none" />

                    {/* Rotating Holographic Center Ring */}
                    <div className="absolute w-44 h-44 rounded-full border border-dashed border-cyber-cyan/40 animate-radar-sweep pointer-events-none" />

                    {/* Frame Label */}
                    <div className="absolute bottom-6 inset-x-0 text-center pointer-events-none">
                      <span className="bg-slate-950/80 px-3 py-1 rounded text-[11px] font-mono text-cyber-cyan border border-cyber-cyan/30 backdrop-blur-md">
                        PLACE QR CODE INSIDE FRAME
                      </span>
                    </div>

                    {cameraError && (
                      <div className="absolute inset-0 p-6 bg-slate-950/95 flex flex-col items-center justify-center text-center">
                        <AlertTriangle className="w-8 h-8 text-amber-400 mb-2" />
                        <p className="text-xs font-mono text-slate-300 mb-4">{cameraError}</p>
                        <CyberButton size="sm" variant="secondary" onClick={startCamera}>
                          RETRY CAMERA
                        </CyberButton>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 3: Manual input */}
              {activeTab === "manual" && (
                <form onSubmit={handleManualSubmit} className="max-w-2xl mx-auto space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-slate-300">
                      PASTE QR PAYLOAD OR RAW TARGET URL:
                    </label>
                    <input
                      type="text"
                      value={manualInput}
                      onChange={(e) => setManualInput(e.target.value)}
                      placeholder="e.g. https://login.microsoftonline-verify-auth92.cc/auth/sso"
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-sm focus:border-cyber-cyan focus:outline-none"
                    />
                  </div>
                  <CyberButton variant="primary" size="md" className="w-full">
                    ANALYZE TARGET BUFFER
                  </CyberButton>
                </form>
              )}

              {/* Preset Payload Test Suite */}
              <div className="pt-6 border-t border-slate-800/80">
                <PresetPayloadSelector onSelectPayload={handleSelectPreset} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
