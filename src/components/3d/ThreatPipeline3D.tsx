"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  QrCode,
  Link2,
  Globe,
  KeyRound,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
} from "lucide-react";
import { soundFX } from "../ui/SoundFX";

export const ThreatPipeline3D: React.FC = () => {
  const [activeMode, setActiveMode] = useState<"attack" | "defended">("defended");
  const [activeStep, setActiveStep] = useState<number>(1); // 0 to 3

  const nodes = [
    {
      id: "qr",
      title: "01. PHYSICAL QR",
      subtitle: "Weaponized Sticker / PDF",
      desc: "Physical QR pasted over legitimate parking meter or sent via email.",
      icon: <QrCode className="w-5 h-5" />,
      color: "cyan",
    },
    {
      id: "url",
      title: "02. DECEPTIVE URL",
      subtitle: "Evasive Redirect Chaining",
      desc: "Multi-hop shortener or typosquatted domain masking true intent.",
      icon: <Link2 className="w-5 h-5" />,
      color: activeMode === "defended" ? "amber" : "rose",
    },
    {
      id: "phish",
      title: "03. PHISHING PROXY",
      subtitle: "Evilginx Reverse Proxy",
      desc: "Cloned SSO interface intercepting real-time session tokens and passwords.",
      icon: <Globe className="w-5 h-5" />,
      color: "rose",
    },
    {
      id: "theft",
      title: "04. COMPROMISE",
      subtitle: "Token Exfiltration",
      desc: "Attacker obtains session cookies and bypasses FIDO2 / MFA.",
      icon: <KeyRound className="w-5 h-5" />,
      color: "rose",
    },
  ];

  const handleToggleMode = (mode: "attack" | "defended") => {
    soundFX.playClick();
    setActiveMode(mode);
    if (mode === "defended") {
      soundFX.playShieldDeploy();
    } else {
      soundFX.playThreatAlarm();
    }
  };

  return (
    <section id="threat-pipeline" className="relative py-24 bg-slate-950/60 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-cyber-cyan/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan text-xs font-mono mb-4">
            <Zap className="w-3.5 h-3.5" />
            <span>INTERACTIVE ATTACK KILL-CHAIN</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-mono font-black text-white tracking-tight leading-none mb-4">
            HOW QUISHING <span className="text-cyber-cyan">SPREADS</span> & HOW WE <span className="text-rose-500">STOP IT</span>
          </h2>
          <p className="text-slate-300 font-mono text-sm sm:text-base leading-relaxed">
            Examine the weaponized QR infection vector from physical sticker to credential theft, and see how QRShield intervenes at the network gateway.
          </p>

          {/* Mode Switcher */}
          <div className="mt-8 inline-flex p-1.5 rounded-xl bg-slate-900 border border-slate-800 shadow-xl">
            <button
              onClick={() => handleToggleMode("defended")}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
                activeMode === "defended"
                  ? "bg-cyber-cyan text-slate-950 shadow-[0_0_15px_rgba(0,240,255,0.4)]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>QRSHIELD DEFENSE ACTIVE (PROTECTED)</span>
            </button>
            <button
              onClick={() => handleToggleMode("attack")}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
                activeMode === "attack"
                  ? "bg-rose-600 text-white shadow-[0_0_15px_rgba(225,29,72,0.5)]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>UNPROTECTED USER PATH</span>
            </button>
          </div>
        </div>

        {/* 3D Pipeline Diagram Grid */}
        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-6 items-stretch mb-12">
          {nodes.map((node, index) => {
            const isBlockedByShield = activeMode === "defended" && index >= 2;

            return (
              <div
                key={node.id}
                className={`relative flex flex-col justify-between p-6 rounded-2xl border transition-all duration-500 backdrop-blur-md ${
                  isBlockedByShield
                    ? "bg-slate-950/40 border-slate-800/40 opacity-40 grayscale"
                    : activeMode === "defended" && index === 1
                    ? "bg-slate-900/90 border-cyber-cyan shadow-[0_0_30px_rgba(0,240,255,0.2)]"
                    : "bg-slate-900/80 border-slate-800 hover:border-slate-700"
                }`}
              >
                {/* Connector Conduit for Desktop */}
                {index < 3 && (
                  <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-20">
                    <div
                      className={`w-6 h-0.5 ${
                        activeMode === "defended" && index === 1
                          ? "bg-rose-500/80 dashed animate-pulse"
                          : "bg-cyber-cyan/40"
                      }`}
                    />
                  </div>
                )}

                <div>
                  {/* Top node badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`p-2.5 rounded-xl border ${
                        isBlockedByShield
                          ? "bg-slate-800/40 border-slate-700 text-slate-500"
                          : index === 0
                          ? "bg-cyber-cyan/10 border-cyber-cyan/40 text-cyber-cyan"
                          : activeMode === "defended" && index === 1
                          ? "bg-amber-500/10 border-amber-500/40 text-amber-400"
                          : "bg-rose-500/10 border-rose-500/40 text-rose-400"
                      }`}
                    >
                      {node.icon}
                    </div>

                    <span className="text-[11px] font-mono text-slate-500">
                      STEP 0{index + 1}
                    </span>
                  </div>

                  <h3 className="text-base font-mono font-bold text-white mb-1">
                    {node.title}
                  </h3>
                  <p className="text-xs font-mono text-cyber-cyan/90 mb-3">
                    {node.subtitle}
                  </p>
                  <p className="text-xs font-mono text-slate-400 leading-relaxed">
                    {node.desc}
                  </p>
                </div>

                {/* Node bottom status */}
                <div className="mt-6 pt-4 border-t border-slate-800/60">
                  {isBlockedByShield ? (
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500 font-semibold">
                      <Shield className="w-3.5 h-3.5" />
                      <span>SEVERED / NEVER REACHED</span>
                    </div>
                  ) : activeMode === "defended" && index === 1 ? (
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-cyber-cyan font-bold">
                      <ShieldCheck className="w-3.5 h-3.5 text-cyber-cyan" />
                      <span>INTERCEPTED &amp; ANALYZED</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-rose-400 font-bold">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>VULNERABLE FLOW</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Shield Intervention Banner */}
        <AnimatePresence mode="wait">
          {activeMode === "defended" ? (
            <motion.div
              key="shield-active"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-6 rounded-2xl bg-gradient-to-r from-cyber-900/90 via-slate-900/90 to-cyber-900/90 border-2 border-cyber-cyan/60 shadow-[0_0_30px_rgba(0,240,255,0.15)] flex flex-col md:flex-row items-center justify-between gap-6"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-cyber-cyan/20 border border-cyber-cyan text-cyber-cyan">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-base font-mono font-bold text-white mb-1">
                    ZERO TRUST PRE-EXECUTION INTERVENTION
                  </h4>
                  <p className="text-xs font-mono text-slate-300">
                    QRShield parses the destination payload at Node 02 before navigation triggers, severing the link to phishing proxies and malicious downloads.
                  </p>
                </div>
              </div>
              <div className="shrink-0 flex items-center gap-2 bg-emerald-950/60 border border-emerald-500/50 px-4 py-2 rounded-lg text-xs font-mono text-emerald-300 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>ACCESS TO MALICIOUS HOST BLOCKED</span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="shield-inactive"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-6 rounded-2xl bg-rose-950/40 border-2 border-rose-600/60 shadow-[0_0_30px_rgba(225,29,72,0.2)] flex flex-col md:flex-row items-center justify-between gap-6"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500 text-rose-400">
                  <ShieldAlert className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-base font-mono font-bold text-rose-200 mb-1">
                    UNCHECKED QR FLOW &mdash; COMPROMISE IMMINENT
                  </h4>
                  <p className="text-xs font-mono text-rose-300/80">
                    Standard smartphone camera apps automatically prompt users to open the link without inspecting SSL certificates, redirects, or reverse proxy kits.
                  </p>
                </div>
              </div>
              <div className="shrink-0 flex items-center gap-2 bg-rose-900/60 border border-rose-500/80 px-4 py-2 rounded-lg text-xs font-mono text-rose-200 font-bold">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>ATTACK SUCCESSFUL (TOKENS EXFILTRATED)</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
