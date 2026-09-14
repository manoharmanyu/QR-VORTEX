"use client";

import React from "react";
import { ThreatSignal } from "@/lib/types";
import {
  AlertTriangle,
  AlertCircle,
  Info,
  ShieldAlert,
  Globe,
  Lock,
  GitBranch,
  FileCode,
  Bug,
} from "lucide-react";

interface ThreatIndicatorsProps {
  signals: ThreatSignal[];
}

export const ThreatIndicators: React.FC<ThreatIndicatorsProps> = ({ signals }) => {
  const getCategoryIcon = (cat: ThreatSignal["category"]) => {
    switch (cat) {
      case "domain":
        return <Globe className="w-3.5 h-3.5" />;
      case "ssl":
        return <Lock className="w-3.5 h-3.5" />;
      case "redirect":
        return <GitBranch className="w-3.5 h-3.5" />;
      case "url_structure":
        return <FileCode className="w-3.5 h-3.5" />;
      case "phishing":
        return <ShieldAlert className="w-3.5 h-3.5" />;
      case "malware":
        return <Bug className="w-3.5 h-3.5" />;
      default:
        return <Info className="w-3.5 h-3.5" />;
    }
  };

  const getSeverityBadge = (sev: ThreatSignal["severity"]) => {
    switch (sev) {
      case "critical":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
            CRITICAL
          </span>
        );
      case "high":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-orange-500/20 text-orange-300 border border-orange-500/40">
            HIGH
          </span>
        );
      case "medium":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
            MEDIUM
          </span>
        );
      case "low":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
            LOW
          </span>
        );
      case "info":
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            CLEAN
          </span>
        );
    }
  };

  return (
    <div className="space-y-3">
      {signals.map((sig) => (
        <div
          key={sig.id}
          className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-slate-800 text-cyber-cyan shrink-0 mt-0.5">
              {getCategoryIcon(sig.category)}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs font-bold text-white">
                  {sig.title}
                </span>
                <span className="text-[10px] font-mono text-slate-500 uppercase">
                  [{sig.category}]
                </span>
              </div>
              <p className="text-xs font-mono text-slate-400 leading-relaxed">
                {sig.description}
              </p>
            </div>
          </div>

          <div className="shrink-0 flex sm:justify-end">
            {getSeverityBadge(sig.severity)}
          </div>
        </div>
      ))}
    </div>
  );
};
