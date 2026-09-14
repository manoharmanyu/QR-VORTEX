"use client";

import React, { useEffect, useState } from "react";
import { RiskLevel } from "@/lib/types";

interface RiskScoreMeterProps {
  score: number;
  riskLevel: RiskLevel;
  size?: "sm" | "md" | "lg";
}

export const RiskScoreMeter: React.FC<RiskScoreMeterProps> = ({
  score,
  riskLevel,
  size = "md",
}) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1000;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = score / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.round(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [score]);

  // Color config based on classification
  const getColorConfig = () => {
    switch (riskLevel) {
      case "SAFE":
        return {
          stroke: "#10b981", // emerald
          text: "text-emerald-400",
          glow: "rgba(16, 185, 129, 0.4)",
          bg: "bg-emerald-500/10",
          label: "SAFE DESTINATION",
        };
      case "LOW_RISK":
        return {
          stroke: "#00f0ff", // cyan
          text: "text-cyber-cyan",
          glow: "rgba(0, 240, 255, 0.4)",
          bg: "bg-cyan-500/10",
          label: "LOW RISK",
        };
      case "SUSPICIOUS":
        return {
          stroke: "#f59e0b", // amber
          text: "text-amber-400",
          glow: "rgba(245, 158, 11, 0.4)",
          bg: "bg-amber-500/10",
          label: "SUSPICIOUS",
        };
      case "HIGH_RISK":
        return {
          stroke: "#f97316", // orange
          text: "text-orange-400",
          glow: "rgba(249, 115, 22, 0.4)",
          bg: "bg-orange-500/10",
          label: "HIGH RISK",
        };
      case "MALICIOUS":
        return {
          stroke: "#ef4444", // crimson red
          text: "text-rose-400",
          glow: "rgba(239, 68, 68, 0.5)",
          bg: "bg-rose-500/10",
          label: "CRITICAL MALICIOUS",
        };
      case "UNKNOWN":
      default:
        return {
          stroke: "#a855f7", // purple
          text: "text-purple-400",
          glow: "rgba(168, 85, 247, 0.4)",
          bg: "bg-purple-500/10",
          label: "UNCLASSIFIED / CAUTION",
        };
    }
  };

  const colorConfig = getColorConfig();

  // Dimensions
  const dims = {
    sm: { width: 100, radius: 40, strokeWidth: 7, fontSize: "text-xl" },
    md: { width: 160, radius: 64, strokeWidth: 10, fontSize: "text-3xl" },
    lg: { width: 220, radius: 90, strokeWidth: 14, fontSize: "text-5xl" },
  }[size];

  const circumference = 2 * Math.PI * dims.radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className="relative flex items-center justify-center"
        style={{ width: dims.width, height: dims.width }}
      >
        <svg className="w-full h-full transform -rotate-90">
          {/* Background Track */}
          <circle
            cx={dims.width / 2}
            cy={dims.width / 2}
            r={dims.radius}
            stroke="currentColor"
            strokeWidth={dims.strokeWidth}
            className="text-slate-800/80"
            fill="transparent"
          />
          {/* Progress Ring */}
          <circle
            cx={dims.width / 2}
            cy={dims.width / 2}
            r={dims.radius}
            stroke={colorConfig.stroke}
            strokeWidth={dims.strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0 0 8px ${colorConfig.glow})`,
              transition: "stroke-dashoffset 0.5s ease-out, stroke 0.3s ease",
            }}
          />
        </svg>

        {/* Center Score Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className={`font-mono font-black ${dims.fontSize} ${colorConfig.text}`}>
            {animatedScore}
          </span>
          <span className="text-[10px] font-mono text-slate-400 tracking-wider">
            / 100
          </span>
        </div>
      </div>

      <div className="mt-2 text-center">
        <span
          className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-mono font-bold tracking-wider ${colorConfig.text} ${colorConfig.bg} border border-current/30`}
        >
          {colorConfig.label}
        </span>
      </div>
    </div>
  );
};
