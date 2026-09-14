"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, Image as ImageIcon, CheckCircle, AlertTriangle, FileCode } from "lucide-react";
import { decodeQRFromFile } from "@/lib/qrDecoder";
import { soundFX } from "../ui/SoundFX";

interface QRDropzoneProps {
  onDecoded: (rawPayload: string) => void;
}

export const QRDropzone: React.FC<QRDropzoneProps> = ({ onDecoded }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const processFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please upload an image file (PNG, JPG, WEBP)");
      return;
    }

    setErrorMsg(null);
    setIsProcessing(true);
    soundFX.playScanBeam();

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    try {
      const decoded = await decodeQRFromFile(file);
      setIsProcessing(false);

      if (decoded) {
        soundFX.playClick();
        onDecoded(decoded);
      } else {
        setErrorMsg("No clear QR code could be parsed from this image. Try uploading a higher resolution QR image or select a preset vector.");
      }
    } catch {
      setIsProcessing(false);
      setErrorMsg("Error parsing QR image.");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed transition-all cursor-pointer select-none ${
          isDragging
            ? "border-cyber-cyan bg-cyber-cyan/10 shadow-[0_0_30px_rgba(0,240,255,0.3)]"
            : "border-slate-700 bg-slate-900/60 hover:border-cyber-cyan/60 hover:bg-slate-900/80"
        }`}
      >
        {/* Corner cyber markers */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyber-cyan" />
        <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyber-cyan" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyber-cyan" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyber-cyan" />

        {isProcessing ? (
          <div className="flex flex-col items-center gap-3 py-4">
            <div className="w-10 h-10 rounded-full border-2 border-cyber-cyan border-t-transparent animate-spin" />
            <span className="text-xs font-mono text-cyber-cyan font-bold tracking-widest animate-pulse">
              EXTRACTING QR MATRIX &amp; PAYLOAD...
            </span>
          </div>
        ) : previewUrl ? (
          <div className="flex flex-col items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Uploaded QR Preview"
              className="w-24 h-24 object-contain rounded-lg border border-cyber-cyan/40 shadow-md"
            />
            <span className="text-xs font-mono text-slate-300">
              Click or drop another image to scan
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-800 text-cyber-cyan shadow-inner">
              <UploadCloud className="w-8 h-8" />
            </div>
            <div>
              <p className="font-mono text-sm font-bold text-white mb-1">
                UPLOAD OR DRAG &amp; DROP QR IMAGE
              </p>
              <p className="text-xs font-mono text-slate-400">
                Supports PNG, JPG, WEBP, or screenshot snips
              </p>
            </div>
            <span className="px-3 py-1 rounded bg-slate-800 border border-slate-700 text-[11px] font-mono text-cyber-cyan">
              BROWSE FILES
            </span>
          </div>
        )}
      </div>

      {errorMsg && (
        <div className="mt-3 p-3 rounded-lg bg-rose-950/40 border border-rose-800/60 flex items-start gap-2.5 text-xs font-mono text-rose-300">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
};
