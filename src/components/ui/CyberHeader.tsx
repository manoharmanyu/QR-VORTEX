"use client";

import React, { useState, useEffect } from "react";
import { Shield, ShieldAlert, Volume2, VolumeX, Terminal, QrCode, Cpu, ChevronRight } from "lucide-react";
import { soundFX } from "./SoundFX";
import { CyberButton } from "./CyberButton";

interface CyberHeaderProps {
  onOpenScanner: () => void;
  activeSection?: string;
}

export const CyberHeader: React.FC<CyberHeaderProps> = ({ onOpenScanner }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [threatLevel, setThreatLevel] = useState<"DEFCON 4" | "DEFCON 3" | "DEFCON 2">("DEFCON 3");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleToggleSound = () => {
    const muted = soundFX.toggleMute();
    setIsMuted(muted);
    if (!muted) soundFX.playClick();
  };

  const scrollToSection = (id: string) => {
    soundFX.playClick();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-slate-950/85 backdrop-blur-md border-b border-cyber-cyan/20 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.8)]"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo and Brand */}
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-cyber-900 border border-cyber-cyan/50 shadow-[0_0_15px_rgba(0,240,255,0.3)] group-hover:border-cyber-cyan transition-all">
            <Shield className="w-5 h-5 text-cyber-cyan transition-transform group-hover:scale-110" />
            <div className="absolute inset-0 rounded-lg bg-cyber-cyan/10 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xl font-black tracking-widest text-white">
                QR<span className="text-cyber-cyan">SHIELD</span>
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono tracking-tighter bg-cyber-cyan/10 border border-cyber-cyan/40 text-cyber-cyan rounded">
                SOC v2.4
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-400 tracking-wider hidden md:block">
              QUISHING DEFENSE MATRIX
            </p>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-mono tracking-wider text-slate-300">
          <button
            onClick={() => scrollToSection("interactive-stage")}
            className="hover:text-cyber-cyan transition-colors flex items-center gap-1.5 group"
          >
            <span className="text-cyber-cyan/60 group-hover:text-cyber-cyan">01.</span>
            <span>SCENARIOS</span>
          </button>
          <button
            onClick={() => scrollToSection("threat-pipeline")}
            className="hover:text-cyber-cyan transition-colors flex items-center gap-1.5 group"
          >
            <span className="text-cyber-cyan/60 group-hover:text-cyber-cyan">02.</span>
            <span>THREAT KILL-CHAIN</span>
          </button>
          <button
            onClick={() => scrollToSection("quishing-education")}
            className="hover:text-cyber-cyan transition-colors flex items-center gap-1.5 group"
          >
            <span className="text-cyber-cyan/60 group-hover:text-cyber-cyan">03.</span>
            <span>WHAT IS QUISHING?</span>
          </button>
          <button
            onClick={() => scrollToSection("protection-timeline")}
            className="hover:text-cyber-cyan transition-colors flex items-center gap-1.5 group"
          >
            <span className="text-cyber-cyan/60 group-hover:text-cyber-cyan">04.</span>
            <span>HOW IT WORKS</span>
          </button>
          <button
            onClick={() => scrollToSection("scanner-section")}
            className="hover:text-cyber-cyan transition-colors flex items-center gap-1.5 group text-cyber-cyan"
          >
            <span className="text-cyber-cyan/60 group-hover:text-cyber-cyan">05.</span>
            <span>SCANNER LAB</span>
          </button>
        </nav>

        {/* Status indicator & Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Live telemetry badge */}
          <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded bg-slate-900/90 border border-slate-800 text-[11px] font-mono text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-slate-400">TELEMETRY:</span>
            <span className="text-emerald-400 font-semibold">ACTIVE</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={handleToggleSound}
            aria-label={isMuted ? "Unmute audio" : "Mute audio"}
            className="p-2 rounded bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-cyber-cyan hover:border-cyber-cyan/40 transition-colors"
            title={isMuted ? "Sound: Muted (Click to enable)" : "Sound: Active (Click to mute)"}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-cyber-cyan" />}
          </button>

          {/* Primary CTA */}
          <CyberButton
            variant="primary"
            size="sm"
            icon={<QrCode className="w-3.5 h-3.5" />}
            onClick={onOpenScanner}
          >
            <span className="hidden sm:inline">SCAN A QR</span>
            <span className="sm:hidden">SCAN</span>
          </CyberButton>
        </div>
      </div>
    </header>
  );
};
