"use client";

import React, { useState } from "react";
import { Lock, Download, CreditCard, ShieldAlert, ArrowRight, Eye, Sparkles, Terminal } from "lucide-react";
import { CyberButton } from "../ui/CyberButton";
import { soundFX } from "../ui/SoundFX";

interface QuishingEducationProps {
  onSimulateVector: (payloadUrl: string) => void;
}

export const QuishingEducation: React.FC<QuishingEducationProps> = ({
  onSimulateVector,
}) => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const vectors = [
    {
      id: 1,
      num: "01",
      title: "Fake Login (SSO Phishing)",
      subtitle: "Reverse Proxy Credential Harvest",
      desc: "QR code leads to a pixel-perfect replica of Microsoft 365, Google Workspace, or Okta SSO. As you enter your credentials and MFA token, an Evilginx reverse proxy captures your active session cookie.",
      samplePayload: "https://login.microsoftonline-verify-auth92.cc/auth/sso?target=enterprise",
      riskBadge: "MALICIOUS",
      icon: <Lock className="w-6 h-6 text-rose-400" />,
      gradient: "from-rose-500/10 to-transparent",
      borderColor: "border-rose-500/30",
    },
    {
      id: 2,
      num: "02",
      title: "Malicious Download",
      subtitle: "Drive-by Mobile Trojans & APKs",
      desc: "QR code masquerades as an urgent mobile banking security patch, airline ticket viewer, or menu reader. Scanning triggers an automatic download of an Android banking overlay Trojan.",
      samplePayload: "http://185.220.101.5/updates/chase_security_patch_v4.apk",
      riskBadge: "CRITICAL",
      icon: <Download className="w-6 h-6 text-rose-500" />,
      gradient: "from-red-600/10 to-transparent",
      borderColor: "border-red-500/30",
    },
    {
      id: 3,
      num: "03",
      title: "Payment Fraud",
      subtitle: "Physical Meter & Restaurant Sticker Swap",
      desc: "Attackers physically paste counterfeit QR stickers over legitimate municipal parking meters, EV chargers, or restaurant tables, directing victims to skimmed offshore payment gateways.",
      samplePayload: "https://city-parking-pay-quick.top/checkout?meter_id=NYC-8492&amount=15.00",
      riskBadge: "HIGH RISK",
      icon: <CreditCard className="w-6 h-6 text-orange-400" />,
      gradient: "from-orange-500/10 to-transparent",
      borderColor: "border-orange-500/30",
    },
  ];

  return (
    <section id="quishing-education" className="relative py-24 bg-slate-950/80 overflow-hidden">
      {/* Background glow */}
      <div className="absolute -top-32 right-1/4 w-96 h-96 bg-cyber-cyan/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan text-xs font-mono mb-4">
            <Terminal className="w-3.5 h-3.5" />
            <span>THREAT INTELLIGENCE &bull; ATTACK PATTERNS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-mono font-black text-white tracking-tight leading-none mb-4">
            WHAT IS <span className="text-cyber-cyan">QUISHING</span>?
          </h2>
          <p className="text-slate-300 font-mono text-sm sm:text-base leading-relaxed">
            QR Phishing (&ldquo;Quishing&rdquo;) exploits human trust in physical and digital QR codes to bypass traditional email security gateways and redirect victims to adversarial infrastructure.
          </p>
        </div>

        {/* 3 Interactive Threat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {vectors.map((vec, idx) => (
            <div
              key={vec.id}
              onMouseEnter={() => {
                setHoveredCard(idx);
                soundFX.playClick();
              }}
              onMouseLeave={() => setHoveredCard(null)}
              className={`relative rounded-2xl bg-gradient-to-b ${vec.gradient} bg-slate-900/90 border ${vec.borderColor} p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(0,240,255,0.15)] group`}
            >
              <div>
                {/* Card Top */}
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-2xl font-black text-cyber-cyan/50 group-hover:text-cyber-cyan transition-colors">
                    {vec.num}
                  </span>
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                    {vec.riskBadge}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 w-fit mb-4">
                  {vec.icon}
                </div>

                <h3 className="font-mono text-lg sm:text-xl font-bold text-white mb-1 group-hover:text-cyber-cyan transition-colors">
                  {vec.title}
                </h3>
                <p className="text-xs font-mono text-cyber-cyan/80 mb-3">
                  {vec.subtitle}
                </p>
                <p className="text-xs sm:text-sm font-mono text-slate-400 leading-relaxed mb-6">
                  {vec.desc}
                </p>
              </div>

              {/* Action */}
              <div className="pt-4 border-t border-slate-800">
                <button
                  onClick={() => {
                    soundFX.playClick();
                    onSimulateVector(vec.samplePayload);
                  }}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-cyber-cyan hover:text-slate-950 text-slate-200 font-mono text-xs font-bold transition-all"
                >
                  <span>SIMULATE &amp; ANALYZE</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
