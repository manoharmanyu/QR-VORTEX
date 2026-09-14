"use client";

import React from "react";
import { Shield, QrCode, Lock, ArrowRight, CheckCircle2 } from "lucide-react";
import { CyberButton } from "../ui/CyberButton";
import { soundFX } from "../ui/SoundFX";

interface FinalCTAProps {
  onOpenScanner: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onOpenScanner }) => {
  const scrollToEducation = () => {
    soundFX.playClick();
    const el = document.getElementById("quishing-education");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative py-28 bg-gradient-to-b from-slate-950 via-cyber-900/40 to-slate-950 overflow-hidden">
      {/* Background glow circle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyber-cyan/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Floating 3D Shield Icon with Cyber Rings */}
        <div className="relative inline-flex items-center justify-center mb-8">
          <div className="w-24 h-24 rounded-3xl bg-slate-900 border-2 border-cyber-cyan shadow-[0_0_50px_rgba(0,240,255,0.4)] flex items-center justify-center animate-float">
            <Shield className="w-12 h-12 text-cyber-cyan" />
          </div>
          <div className="absolute inset-0 -m-3 rounded-full border border-dashed border-cyber-cyan/30 animate-radar-sweep pointer-events-none" />
        </div>

        {/* Heading */}
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-mono font-black text-white tracking-tight leading-none mb-6">
          DON&rsquo;T TRUST THE QR.<br />
          <span className="text-cyber-cyan">VERIFY IT.</span>
        </h2>

        <p className="text-slate-300 font-mono text-base sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
          Analyze the destination before you access it. Zero trust pre-execution inspection to secure every scan.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
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
            icon={<ArrowRight className="w-4 h-4 text-cyber-cyan" />}
            onClick={scrollToEducation}
          >
            EXPLORE QR SECURITY
          </CyberButton>
        </div>

        {/* Highlights */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>No Browser Auto-Navigation</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyber-cyan" />
            <span>Client-Side Sandboxed Decoupling</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Real-Time Threat Telemetry</span>
          </div>
        </div>
      </div>
    </section>
  );
};
