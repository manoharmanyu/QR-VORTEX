"use client";

import React from "react";
import { HeroShieldScene } from "../3d/HeroShieldScene";
import { CyberButton } from "../ui/CyberButton";
import { QrCode, Play, ShieldAlert, Cpu, Terminal, Sparkles, ChevronDown } from "lucide-react";
import { soundFX } from "../ui/SoundFX";

interface HeroSectionProps {
  onOpenScanner: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenScanner }) => {
  const scrollToStage = () => {
    soundFX.playClick();
    const el = document.getElementById("interactive-stage");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-between pt-24 pb-12 overflow-hidden">
      {/* 3D Scene Layer */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <HeroShieldScene />
      </div>

      {/* Main Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col items-center justify-center text-center mt-6">
        {/* Top SOC Status Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-cyber-cyan/40 text-cyber-cyan text-xs font-mono shadow-[0_0_20px_rgba(0,240,255,0.2)] mb-6 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-cyber-cyan animate-ping" />
          <span className="font-bold tracking-wider">ZERO TRUST QUISHING DEFENSE ENGINE</span>
        </div>

        {/* Main Headings */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-mono font-black text-white tracking-tight leading-none mb-6 drop-shadow-[0_0_35px_rgba(0,240,255,0.2)]">
          SCAN. ANALYZE.<br />
          <span className="text-cyber-cyan">STAY SAFE.</span>
        </h1>

        <p className="text-slate-300 font-mono text-sm sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10 text-shadow">
          QRShield detects suspicious QR destinations before they become a threat. Pre-execution threat triage for enterprise &amp; individual security.
        </p>

        {/* CTA Button Group */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <CyberButton
            variant="primary"
            size="lg"
            icon={<QrCode className="w-5 h-5" />}
            onClick={onOpenScanner}
          >
            SCAN A QR
          </CyberButton>

          <CyberButton
            variant="secondary"
            size="lg"
            icon={<Play className="w-4 h-4 text-cyber-cyan" />}
            onClick={scrollToStage}
          >
            HOW IT WORKS
          </CyberButton>
        </div>
      </div>

      {/* Live Threat Telemetry Ticker */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 backdrop-blur-md">
          <div className="text-left font-mono">
            <span className="text-[10px] text-slate-400 block uppercase">Real-Time Inspection</span>
            <span className="text-sm sm:text-base font-bold text-cyber-cyan">0.042s LATENCY</span>
          </div>
          <div className="text-left font-mono">
            <span className="text-[10px] text-slate-400 block uppercase">Zero-Day Detection</span>
            <span className="text-sm sm:text-base font-bold text-white">99.4% ACCURACY</span>
          </div>
          <div className="text-left font-mono">
            <span className="text-[10px] text-slate-400 block uppercase">Threat Vectors Blocked</span>
            <span className="text-sm sm:text-base font-bold text-rose-400">14,290+ TODAY</span>
          </div>
          <div className="text-left font-mono">
            <span className="text-[10px] text-slate-400 block uppercase">Protocol</span>
            <span className="text-sm sm:text-base font-bold text-emerald-400">PRE-EXECUTION TRIAGE</span>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div
          onClick={scrollToStage}
          className="mt-6 flex flex-col items-center justify-center gap-1 text-[11px] font-mono text-slate-400 hover:text-cyber-cyan cursor-pointer transition-colors"
        >
          <span>EXPLORE 3D CINEMATIC STAGE</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </div>
      </div>
    </section>
  );
};
