"use client";

import React, { useState } from "react";
import {
  Scan,
  Binary,
  Cpu,
  ShieldCheck,
  Scale,
  Lock,
  ArrowRight,
  Activity,
} from "lucide-react";
import { soundFX } from "../ui/SoundFX";

export const ProtectionTimeline: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(2);

  const steps = [
    {
      num: "01",
      title: "SCAN",
      icon: <Scan className="w-5 h-5" />,
      desc: "Camera or upload ingest captures the 2D QR matrix without launching device browser.",
      action: "Matrix Ingested",
    },
    {
      num: "02",
      title: "DECODE",
      icon: <Binary className="w-5 h-5" />,
      desc: "Client-side engine extracts the raw URL buffer in a sandboxed, isolated memory scope.",
      action: "Payload Extracted",
    },
    {
      num: "03",
      title: "ANALYZE",
      icon: <Cpu className="w-5 h-5" />,
      desc: "Heuristic engine computes Shannon entropy, scans TLD risk, and inspects redirect hop depth.",
      action: "Heuristics Executed",
    },
    {
      num: "04",
      title: "VERIFY",
      icon: <ShieldCheck className="w-5 h-5" />,
      desc: "Cross-checks SSL certificate transparency logs, domain WHOIS age, and known phishing kits.",
      action: "Threat Feeds Queried",
    },
    {
      num: "05",
      title: "DECIDE",
      icon: <Scale className="w-5 h-5" />,
      desc: "Calculates 0–100 Severity Index and assigns definitive action: ALLOW, WARN, or BLOCK.",
      action: "Action Assigned",
    },
    {
      num: "06",
      title: "PROTECT",
      icon: <Lock className="w-5 h-5" />,
      desc: "Malicious destinations are blocked behind titanium defense barrier before browser connection.",
      action: "Endpoint Secured",
    },
  ];

  return (
    <section id="protection-timeline" className="relative py-24 bg-slate-950 overflow-hidden">
      {/* Glow background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl h-64 bg-cyber-cyan/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan text-xs font-mono mb-4">
            <Activity className="w-3.5 h-3.5" />
            <span>PRE-EXECUTION DEFENSE LIFECYCLE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-mono font-black text-white tracking-tight leading-none mb-4">
            HOW QRSHIELD <span className="text-cyber-cyan">PROTECTS YOU</span>
          </h2>
          <p className="text-slate-300 font-mono text-sm sm:text-base leading-relaxed">
            A synchronized 6-stage telemetry conduit ensuring no payload executes without cryptographic verification.
          </p>
        </div>

        {/* Horizontal Stepper */}
        <div className="relative">
          {/* Connecting Glow Conduit Line for Desktop */}
          <div className="hidden lg:block absolute top-1/2 left-8 right-8 h-0.5 bg-gradient-to-r from-cyber-cyan/20 via-cyber-cyan to-cyber-cyan/20 -translate-y-1/2 z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 relative z-10">
            {steps.map((st, idx) => {
              const isSelected = activeStep === idx;

              return (
                <div
                  key={st.num}
                  onClick={() => {
                    soundFX.playClick();
                    setActiveStep(idx);
                  }}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between backdrop-blur-md ${
                    isSelected
                      ? "bg-slate-900 border-cyber-cyan shadow-[0_0_30px_rgba(0,240,255,0.3)] scale-105"
                      : "bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-xs font-black text-cyber-cyan">
                        {st.num}
                      </span>
                      <div
                        className={`p-2 rounded-xl border ${
                          isSelected
                            ? "bg-cyber-cyan text-slate-950 border-cyber-cyan"
                            : "bg-slate-800 text-slate-300 border-slate-700"
                        }`}
                      >
                        {st.icon}
                      </div>
                    </div>

                    <h4 className="font-mono text-base font-bold text-white mb-2">
                      {st.title}
                    </h4>
                    <p className="text-xs font-mono text-slate-400 leading-relaxed">
                      {st.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-cyber-cyan/90 font-semibold">
                    &gt; {st.action}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
