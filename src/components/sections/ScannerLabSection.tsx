"use client";

import React, { useState, useRef } from "react";
import {
  Camera,
  UploadCloud,
  Terminal,
  Shield,
  ScanLine,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  Sparkles,
} from "lucide-react";
import { CyberButton } from "../ui/CyberButton";
import { QRDropzone } from "../scanner/QRDropzone";
import { PresetPayloadSelector } from "../scanner/PresetPayloadSelector";
import { SecurityDashboard } from "../dashboard/SecurityDashboard";
import { analyzeSecurityPayload } from "@/lib/securityEngine";
import { SecurityAnalysisResult, PresetPayload } from "@/lib/types";
import { decodeQRFromVideo } from "@/lib/qrDecoder";
import { soundFX } from "../ui/SoundFX";

export const ScannerLabSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"upload" | "camera" | "manual">("upload");
  const [manualInput, setManualInput] = useState("");
  const [scanStatus, setScanStatus] = useState<"idle" | "detected" | "analyzing" | "complete">("idle");
  const [detectedPayload, setDetectedPayload] = useState<string | null>(null);
  const [result, setResult] = useState<SecurityAnalysisResult | null>(null);

  // Camera
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

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
        setCameraError("Camera access not supported on this device/browser.");
      }
    } catch {
      setCameraError("Camera permission denied or camera device busy. Use file upload or preset vectors below.");
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

  const scanVideoFrame = () => {
    if (videoRef.current && canvasRef.current && scanStatus === "idle") {
      const code = decodeQRFromVideo(videoRef.current, canvasRef.current);
      if (code) {
        handleProcessPayload(code);
        return;
      }
    }
    if (streamRef.current) {
      animFrameRef.current = requestAnimationFrame(scanVideoFrame);
    }
  };

  const handleTabChange = (tab: "upload" | "camera" | "manual") => {
    soundFX.playClick();
    setActiveTab(tab);
    if (tab === "camera" && !result) {
      startCamera();
    } else {
      stopCamera();
    }
  };

  const handleProcessPayload = (raw: string) => {
    stopCamera();
    setDetectedPayload(raw);
    setScanStatus("detected");
    soundFX.playScanBeam();

    setTimeout(() => {
      setScanStatus("analyzing");
      setTimeout(() => {
        const analysis = analyzeSecurityPayload(raw);
        setResult(analysis);
        setScanStatus("complete");
        if (analysis.riskScore > 60) {
          soundFX.playThreatAlarm();
        } else {
          soundFX.playSafeChime();
        }
      }, 1000);
    }, 600);
  };

  const handleSelectPreset = (preset: PresetPayload) => {
    handleProcessPayload(preset.payload);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    handleProcessPayload(manualInput.trim());
  };

  const handleReset = () => {
    soundFX.playClick();
    setResult(null);
    setDetectedPayload(null);
    setScanStatus("idle");
    setManualInput("");
    if (activeTab === "camera") {
      startCamera();
    }
  };

  return (
    <section id="scanner-section" className="relative py-24 bg-slate-950/90 overflow-hidden">
      {/* Hidden processing canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-3/4 h-96 bg-cyber-cyan/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan text-xs font-mono mb-4">
            <Terminal className="w-3.5 h-3.5" />
            <span>INTERACTIVE SECURITY SCANNER LAB</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-mono font-black text-white tracking-tight leading-none mb-4">
            TEST YOUR <span className="text-cyber-cyan">QR DESTINATION</span>
          </h2>
          <p className="text-slate-300 font-mono text-sm sm:text-base leading-relaxed">
            Drag &amp; drop an image, point your camera, or run simulated threat intelligence tests through the QRShield heuristic matrix.
          </p>
        </div>

        {/* Main interactive container */}
        <div className="max-w-5xl mx-auto">
          {result ? (
            <SecurityDashboard result={result} onReset={handleReset} />
          ) : scanStatus === "detected" || scanStatus === "analyzing" ? (
            <div className="bg-slate-950 p-12 rounded-2xl border border-cyber-cyan/40 flex flex-col items-center justify-center text-center space-y-6 shadow-[0_0_50px_rgba(0,240,255,0.15)]">
              <div className="relative w-28 h-28 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-cyber-cyan border-t-transparent animate-spin" />
                <ScanLine className="w-10 h-10 text-cyber-cyan animate-pulse" />
              </div>
              <div className="space-y-2 font-mono">
                <span className="px-3 py-1 rounded bg-cyber-cyan/10 border border-cyber-cyan/40 text-cyber-cyan text-xs font-bold uppercase tracking-wider">
                  {scanStatus === "detected" ? "QR CODE DETECTED" : "ANALYZING DESTINATION..."}
                </span>
                <h4 className="text-xl font-bold text-white">
                  {scanStatus === "detected" ? "EXTRACTING RAW URL BUFFER..." : "CALCULATING RISK &amp; REPUTATION..."}
                </h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto truncate">
                  Target: {detectedPayload}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-slate-950/80 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-2xl space-y-8">
              {/* Tab Selector */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => handleTabChange("upload")}
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
                  onClick={() => handleTabChange("camera")}
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
                  onClick={() => handleTabChange("manual")}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-xs font-bold transition-all ${
                    activeTab === "manual"
                      ? "bg-cyber-cyan text-slate-950 shadow-[0_0_20px_rgba(0,240,255,0.4)]"
                      : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  <FileCode className="w-4 h-4" />
                  <span>PASTE RAW URL</span>
                </button>
              </div>

              {/* Upload view */}
              {activeTab === "upload" && (
                <div className="max-w-2xl mx-auto">
                  <QRDropzone onDecoded={handleProcessPayload} />
                </div>
              )}

              {/* Live camera view */}
              {activeTab === "camera" && (
                <div className="max-w-md mx-auto">
                  <div className="relative aspect-square rounded-2xl bg-slate-950 border-2 border-cyber-cyan/40 overflow-hidden flex items-center justify-center shadow-[0_0_40px_rgba(0,240,255,0.15)]">
                    <video
                      ref={videoRef}
                      className="absolute inset-0 w-full h-full object-cover"
                      muted
                    />

                    {/* Reticle Brackets */}
                    <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-cyber-cyan" />
                    <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-cyber-cyan" />
                    <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-cyber-cyan" />
                    <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-cyber-cyan" />

                    {/* Laser scan line */}
                    <div className="absolute inset-x-4 h-0.5 bg-gradient-to-r from-transparent via-cyber-cyan to-transparent shadow-[0_0_15px_#00f0ff] animate-laser-scan pointer-events-none" />

                    {/* Rotating Ring */}
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

              {/* Manual URL input */}
              {activeTab === "manual" && (
                <form onSubmit={handleManualSubmit} className="max-w-2xl mx-auto space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-slate-300">
                      ENTER DESTINATION URL OR STRING BUFFER:
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
                    ANALYZE TARGET
                  </CyberButton>
                </form>
              )}

              {/* 1-Click Preset library */}
              <div className="pt-6 border-t border-slate-800">
                <PresetPayloadSelector onSelectPayload={handleSelectPreset} />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
