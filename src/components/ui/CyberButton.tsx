"use client";

import React from "react";
import { soundFX } from "./SoundFX";

interface CyberButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "safe" | "outline";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  glitch?: boolean;
}

export const CyberButton: React.FC<CyberButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  icon,
  className = "",
  onClick,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    soundFX.playClick();
    if (onClick) onClick(e);
  };

  const baseStyles =
    "relative inline-flex items-center justify-center font-mono font-semibold uppercase tracking-wider transition-all duration-300 select-none overflow-hidden group cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyber-cyan/50";

  const sizeStyles = {
    sm: "px-3.5 py-1.5 text-xs gap-1.5",
    md: "px-6 py-2.5 text-sm gap-2.5",
    lg: "px-8 py-3.5 text-base gap-3 font-bold",
  };

  const variantStyles = {
    primary:
      "bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/60 hover:bg-cyber-cyan/25 hover:border-cyber-cyan shadow-[0_0_15px_rgba(0,240,255,0.25)] hover:shadow-[0_0_25px_rgba(0,240,255,0.45)]",
    secondary:
      "bg-slate-900/80 text-slate-200 border border-slate-700 hover:border-cyber-cyan/50 hover:text-cyber-cyan hover:bg-slate-800/80 shadow-[0_0_10px_rgba(0,0,0,0.5)]",
    danger:
      "bg-cyber-danger/15 text-cyber-danger border border-cyber-danger/60 hover:bg-cyber-danger/25 hover:border-cyber-danger shadow-[0_0_15px_rgba(239,68,68,0.25)] hover:shadow-[0_0_25px_rgba(239,68,68,0.45)]",
    safe:
      "bg-cyber-safe/15 text-cyber-safe border border-cyber-safe/60 hover:bg-cyber-safe/25 hover:border-cyber-safe shadow-[0_0_15px_rgba(16,185,129,0.25)] hover:shadow-[0_0_25px_rgba(16,185,129,0.45)]",
    outline:
      "bg-transparent text-slate-300 border border-slate-700 hover:border-cyber-cyan/60 hover:text-cyber-cyan",
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      onClick={handleClick}
      style={{
        clipPath:
          "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
      }}
      {...props}
    >
      {/* Corner cyber decorations */}
      <span className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-current opacity-70 group-hover:opacity-100 transition-opacity" />
      <span className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-current opacity-70 group-hover:opacity-100 transition-opacity" />

      {/* Cyber scanning sweep overlay on hover */}
      <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 pointer-events-none" />

      {icon && <span className="relative z-10 transition-transform group-hover:scale-110">{icon}</span>}
      <span className="relative z-10">{children}</span>
    </button>
  );
};
