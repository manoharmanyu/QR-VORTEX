"use client";

import React from "react";
import { PRESET_PAYLOADS } from "@/lib/securityEngine";
import { PresetPayload } from "@/lib/types";
import { ShieldAlert, ShieldCheck, AlertTriangle, HelpCircle, Terminal } from "lucide-react";
import { soundFX } from "../ui/SoundFX";

interface PresetPayloadSelectorProps {
  onSelectPayload: (payload: PresetPayload) => void;
  selectedId?: string;
}

export const PresetPayloadSelector: React.FC<PresetPayloadSelectorProps> = ({
  onSelectPayload,
  selectedId,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-mono font-bold text-slate-300 tracking-wider uppercase flex items-center gap-1.5">
          <Terminal className="w-3.5 h-3.5 text-cyber-cyan" />
          <span>Quick Threat Presets (1-Click Test Scenarios)</span>
        </h4>
        <span className="text-[10px] font-mono text-slate-500">
          SELECT VECTOR TO SIMULATE
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {PRESET_PAYLOADS.map((preset) => {
          const isSelected = selectedId === preset.id;

          return (
            <div
              key={preset.id}
              onClick={() => {
                soundFX.playClick();
                onSelectPayload(preset);
              }}
              className={`p-4 rounded-xl border transition-all cursor-pointer group flex flex-col justify-between ${
                isSelected
                  ? "bg-slate-900 border-cyber-cyan shadow-[0_0_20px_rgba(0,240,255,0.25)]"
                  : "bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">
                    {preset.category}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${preset.badgeColor}`}
                  >
                    {preset.badge}
                  </span>
                </div>
                <h5 className="font-mono text-sm font-bold text-white group-hover:text-cyber-cyan transition-colors mb-1.5">
                  {preset.title}
                </h5>
                <p className="text-xs font-mono text-slate-400 line-clamp-2 leading-relaxed">
                  {preset.description}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-500 truncate max-w-[180px]">
                  {preset.payload}
                </span>
                <span className="text-cyber-cyan group-hover:translate-x-0.5 transition-transform font-bold">
                  TEST &rarr;
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
