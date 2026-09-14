"use client";

import React from "react";
import { Shield, Lock, Terminal, Radio, AlertTriangle, ExternalLink, Activity } from "lucide-react";

export const CyberFooter: React.FC = () => {
  return (
    <footer className="relative bg-cyber-950 border-t border-slate-800/80 pt-16 pb-12 overflow-hidden">
      {/* Top cyber grid glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-cyber-cyan/50 to-transparent" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-cyber-cyan/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Crucial Security Principle Banner as mandated by Requirement #21 */}
        <div className="mb-12 p-5 rounded-lg bg-cyber-900/90 border border-cyber-cyan/30 shadow-[0_0_20px_rgba(0,240,255,0.08)]">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-mono font-bold tracking-widest text-amber-300 uppercase mb-1">
                Zero Trust UX Principle
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed font-mono">
                &ldquo;A QR code itself is not automatically safe just because it can be scanned. The destination must be decoded, analyzed, and cryptographically verified before access.&rdquo;
              </p>
              <p className="text-xs text-slate-500 mt-2 font-mono">
                QRShield operates as a risk-based QR phishing (Quishing) detection & triage engine.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Brand & Mission */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded bg-cyber-900 border border-cyber-cyan/40 text-cyber-cyan">
                <Shield className="w-4 h-4" />
              </div>
              <span className="font-mono text-lg font-black tracking-widest text-white">
                QR<span className="text-cyber-cyan">SHIELD</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-mono mb-4">
              Next-generation 3D Quishing detection platform analyzing QR vectors, multi-hop redirects, and reverse-proxy credential harvesting kits in real-time.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1 rounded w-fit">
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              <span>DEFENSE MATRIX ONLINE</span>
            </div>
          </div>

          {/* Col 2: Threat Classifications */}
          <div>
            <h4 className="text-xs font-mono font-bold text-slate-200 tracking-wider uppercase mb-4 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-cyber-cyan" />
              <span>Risk Classifications</span>
            </h4>
            <ul className="space-y-2 text-xs font-mono text-slate-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-slate-300">00–20:</span> Safe / Verified
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span className="text-slate-300">21–40:</span> Low Risk
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span className="text-slate-300">41–60:</span> Suspicious
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                <span className="text-slate-300">61–80:</span> High Risk
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                <span className="text-slate-300">81–100:</span> Malicious
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                <span className="text-slate-300">UNKNOWN:</span> Strict Caution
              </li>
            </ul>
          </div>

          {/* Col 3: Architecture & Integrations */}
          <div>
            <h4 className="text-xs font-mono font-bold text-slate-200 tracking-wider uppercase mb-4 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-cyber-cyan" />
              <span>Integration APIs</span>
            </h4>
            <ul className="space-y-2 text-xs font-mono text-slate-400">
              <li className="hover:text-cyber-cyan transition-colors cursor-pointer flex items-center gap-1.5">
                <span>POST /api/v1/scan</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </li>
              <li className="hover:text-cyber-cyan transition-colors cursor-pointer flex items-center gap-1.5">
                <span>n8n Webhook Workflow</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </li>
              <li className="hover:text-cyber-cyan transition-colors cursor-pointer flex items-center gap-1.5">
                <span>FastAPI Microservice Engine</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </li>
              <li className="hover:text-cyber-cyan transition-colors cursor-pointer flex items-center gap-1.5">
                <span>SIEM / SOAR Event Forwarding</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </li>
            </ul>
          </div>

          {/* Col 4: SOC Readiness */}
          <div>
            <h4 className="text-xs font-mono font-bold text-slate-200 tracking-wider uppercase mb-4 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-cyber-cyan" />
              <span>Standards & Compliance</span>
            </h4>
            <p className="text-xs text-slate-400 font-mono leading-relaxed mb-3">
              Compliant with NIST Cybersecurity Framework (CSF 2.0), MITRE ATT&CK T1566.002 (Phishing: Spearphishing Link), and CISA Anti-Quishing Guidelines.
            </p>
            <div className="text-[11px] font-mono text-slate-500">
              BUILD: QRSHIELD-PROD-2026.08.19
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} QRShield Cybersecurity Systems. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-300 transition-colors cursor-pointer">Security Policy</span>
            <span className="hover:text-slate-300 transition-colors cursor-pointer">Responsible Disclosure</span>
            <span className="hover:text-slate-300 transition-colors cursor-pointer">API Reference</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
