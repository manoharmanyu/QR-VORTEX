"use client";

import React, { useState } from "react";
import { SecurityAnalysisResult } from "@/lib/types";
import { RiskScoreMeter } from "./RiskScoreMeter";
import { ThreatIndicators } from "./ThreatIndicators";
import {
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  ExternalLink,
  Copy,
  Check,
  Globe,
  Lock,
  GitFork,
  Calendar,
  Zap,
  Radio,
  FileSpreadsheet,
  AlertTriangle,
  Server,
  Share2,
} from "lucide-react";
import { CyberButton } from "../ui/CyberButton";
import { soundFX } from "../ui/SoundFX";

interface SecurityDashboardProps {
  result: SecurityAnalysisResult;
  onReset: () => void;
}

export const SecurityDashboard: React.FC<SecurityDashboardProps> = ({
  result,
  onReset,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "signals" | "hops" | "raw">("overview");

  const handleCopySanitized = () => {
    soundFX.playClick();
    navigator.clipboard.writeText(result.sanitizedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getReputationBadge = (rep: SecurityAnalysisResult["reputation"]) => {
    switch (rep) {
      case "CLEAN":
        return <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">CLEAN</span>;
      case "SUSPICIOUS":
        return <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">SUSPICIOUS</span>;
      case "MALICIOUS":
        return <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">MALICIOUS</span>;
      case "UNKNOWN":
      default:
        return <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">UNKNOWN</span>;
    }
  };

  const getHttpsBadge = (https: SecurityAnalysisResult["httpsStatus"]) => {
    switch (https) {
      case "VALID":
        return <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">VALID SSL</span>;
      case "INVALID":
        return <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">INVALID / EXPIRED</span>;
      case "MISSING":
      default:
        return <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-rose-600/30 text-rose-200 border border-rose-500/60">NO HTTPS (HTTP)</span>;
    }
  };

  return (
    <div className="bg-slate-950/90 rounded-2xl border-2 border-cyber-cyan/40 shadow-[0_0_50px_rgba(0,240,255,0.15)] overflow-hidden backdrop-blur-xl">
      {/* Header Bar */}
      <div className="bg-slate-900/90 px-6 py-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg border ${
              result.riskScore > 60
                ? "bg-rose-500/20 border-rose-500/40 text-rose-400"
                : result.riskScore > 30
                ? "bg-amber-500/20 border-amber-500/40 text-amber-400"
                : "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
            }`}
          >
            {result.riskScore > 60 ? (
              <ShieldAlert className="w-5 h-5" />
            ) : result.riskScore > 30 ? (
              <AlertTriangle className="w-5 h-5" />
            ) : (
              <ShieldCheck className="w-5 h-5" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-white tracking-wide">
                SECURITY INCIDENT REPORT
              </span>
              <span className="text-[10px] font-mono bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                ID: {result.scanId}
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-400">
              Scanned on {new Date(result.timestamp).toLocaleString()} &bull; Telemetry: {result.isMock ? "Synthetic Intel" : "Live Heuristics"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopySanitized}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs border border-slate-700 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied Sanitized URL" : "Copy Sanitized"}</span>
          </button>
          <CyberButton variant="secondary" size="sm" onClick={onReset}>
            SCAN ANOTHER
          </CyberButton>
        </div>
      </div>

      {/* Main Analysis Body */}
      <div className="p-6 lg:p-8 space-y-8">
        {/* Sanitized URL Alert Box */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span className="flex items-center gap-1.5 text-cyber-cyan font-bold">
              <Globe className="w-3.5 h-3.5" />
              SANITIZED EXTRACTED DESTINATION (DEFANGED)
            </span>
            <span className="text-slate-500">Auto-Navigation: NEVER</span>
          </div>
          <div className="font-mono text-sm sm:text-base text-slate-200 break-all p-3 rounded bg-slate-950 border border-slate-800 select-all">
            {result.sanitizedUrl}
          </div>
        </div>

        {/* Top Metric Grid + Circular Risk Meter */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          {/* Col 1: Circular Risk Gauge */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col items-center justify-center">
            <RiskScoreMeter score={result.riskScore} riskLevel={result.riskLevel} size="lg" />
            <div className="mt-4 text-center">
              <span className="text-[11px] font-mono text-slate-400">
                Action: <strong className="text-white uppercase font-bold">{result.action}</strong>
              </span>
            </div>
          </div>

          {/* Col 2 & 3: Primary Telemetry Properties */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Domain info */}
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
              <span className="text-[11px] font-mono text-slate-400">ANALYZED DOMAIN</span>
              <div className="font-mono text-sm font-bold text-white truncate">
                {result.domain}
              </div>
              <div className="text-[11px] font-mono text-slate-500">
                IP: {result.ipAddress || "Resolved via DNS"} ({result.geoCountry || "Global CDN"})
              </div>
            </div>

            {/* Reputation */}
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
              <span className="text-[11px] font-mono text-slate-400">GLOBAL REPUTATION</span>
              <div>{getReputationBadge(result.reputation)}</div>
              <div className="text-[11px] font-mono text-slate-500">
                Domain Age: ~{result.domainAgeDays} days
              </div>
            </div>

            {/* HTTPS & SSL */}
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
              <span className="text-[11px] font-mono text-slate-400">HTTPS &amp; ENCRYPTION</span>
              <div>{getHttpsBadge(result.httpsStatus)}</div>
              <div className="text-[11px] font-mono text-slate-500 truncate">
                Issuer: {result.sslIssuer || "None"}
              </div>
            </div>

            {/* Redirects */}
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
              <span className="text-[11px] font-mono text-slate-400">REDIRECT HOPS</span>
              <div className="font-mono text-sm font-bold text-white flex items-center gap-2">
                <span>{result.redirectsCount} Hop{result.redirectsCount !== 1 ? "s" : ""}</span>
                <span className={`text-[11px] px-2 py-0.5 rounded ${result.redirectsCount > 1 ? "bg-amber-500/20 text-amber-300" : "bg-emerald-500/20 text-emerald-300"}`}>
                  {result.redirectsCount > 1 ? "MULTI-TIER" : "DIRECT"}
                </span>
              </div>
              <div className="text-[11px] font-mono text-slate-500">
                Entropy Score: {result.entropyScore.toFixed(2)} / 5.0
              </div>
            </div>
          </div>
        </div>

        {/* AI & Threat Intelligence Summary */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-cyber-900/40 to-slate-900 border border-cyber-cyan/30">
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-cyber-cyan/10 border border-cyber-cyan/40 text-cyber-cyan shrink-0 mt-0.5">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-mono text-sm font-bold text-white uppercase tracking-wider">
                  AI Threat Triage Assessment
                </h4>
                <span className="text-[10px] font-mono bg-cyber-cyan/20 text-cyber-cyan px-2 py-0.5 rounded">
                  MODEL: QRSHIELD-DEFENSE-V2
                </span>
              </div>
              <p className="text-xs sm:text-sm font-mono text-slate-300 leading-relaxed mb-3">
                {result.aiAnalysisSummary}
              </p>
              <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-xs font-mono">
                <span className="text-slate-400">Recommended Action: </span>
                <strong className="text-cyber-cyan font-bold">{result.recommendedAction}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed In-Depth Diagnostics */}
        <div>
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-4">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                activeTab === "overview"
                  ? "bg-cyber-cyan text-slate-950 font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              THREAT SIGNALS ({result.threatSignals.length})
            </button>
            <button
              onClick={() => setActiveTab("hops")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                activeTab === "hops"
                  ? "bg-cyber-cyan text-slate-950 font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              REDIRECT CHAIN ({result.redirectChain.length})
            </button>
            <button
              onClick={() => setActiveTab("raw")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                activeTab === "raw"
                  ? "bg-cyber-cyan text-slate-950 font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              JSON TELEMETRY
            </button>
          </div>

          {activeTab === "overview" && (
            <ThreatIndicators signals={result.threatSignals} />
          )}

          {activeTab === "hops" && (
            <div className="space-y-3">
              {result.redirectChain.map((hop, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-4 font-mono text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-cyber-cyan font-bold">
                      HOP {hop.hop}
                    </span>
                    <span className="text-slate-200 break-all">{hop.url}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-slate-400">Status: {hop.status}</span>
                    {hop.country && (
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {hop.country}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "raw" && (
            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyber-cyan overflow-x-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};
