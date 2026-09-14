"use client";

import React, { useState } from "react";
import { CyberBackground } from "@/components/3d/CyberBackground";
import { CyberHeader } from "@/components/ui/CyberHeader";
import { CyberFooter } from "@/components/ui/CyberFooter";
import { HeroSection } from "@/components/sections/HeroSection";
import { StickyStage3D } from "@/components/3d/StickyStage3D";
import { ThreatPipeline3D } from "@/components/3d/ThreatPipeline3D";
import { QuishingEducation } from "@/components/sections/QuishingEducation";
import { ProtectionTimeline } from "@/components/sections/ProtectionTimeline";
import { ScannerLabSection } from "@/components/sections/ScannerLabSection";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { QRScannerModal } from "@/components/scanner/QRScannerModal";
import { soundFX } from "@/components/ui/SoundFX";

export default function Home() {
  const [isScannerModalOpen, setIsScannerModalOpen] = useState(false);
  const [modalPayload, setModalPayload] = useState<string | undefined>(undefined);

  const handleOpenScanner = (payload?: string) => {
    soundFX.playClick();
    setModalPayload(payload);
    setIsScannerModalOpen(true);
  };

  const handleCloseScanner = () => {
    setIsScannerModalOpen(false);
    setModalPayload(undefined);
  };

  return (
    <main className="relative min-h-screen bg-cyber-950 text-slate-100 selection:bg-cyber-cyan selection:text-slate-950 overflow-x-hidden">
      {/* Abstract Cybersecurity Particle & Data Stream Canvas */}
      <CyberBackground />

      {/* Futuristic SOC Top Navigation Header */}
      <CyberHeader onOpenScanner={() => handleOpenScanner()} />

      {/* 1. Hero Section with 3D Floating QR, Shield & Scanning Laser */}
      <HeroSection onOpenScanner={() => handleOpenScanner()} />

      {/* 2. 5-Scene Sticky Full-Screen Cinematic Scroll Experience */}
      <StickyStage3D onOpenScanner={() => handleOpenScanner()} />

      {/* 3. 3D Interactive Threat Kill-Chain Pipeline */}
      <ThreatPipeline3D />

      {/* 4. Educational "WHAT IS QUISHING?" Section */}
      <QuishingEducation onSimulateVector={(payload) => handleOpenScanner(payload)} />

      {/* 5. 6-Stage Pre-Execution Protection Timeline */}
      <ProtectionTimeline />

      {/* 6. Interactive Scanner Lab */}
      <ScannerLabSection />

      {/* 7. Final Call To Action with 3D Shield */}
      <FinalCTA onOpenScanner={() => handleOpenScanner()} />

      {/* SOC Compliance & Zero-Trust Footer */}
      <CyberFooter />

      {/* Interactive Global Scanner Modal */}
      <QRScannerModal
        isOpen={isScannerModalOpen}
        onClose={handleCloseScanner}
        initialPayload={modalPayload}
      />
    </main>
  );
}
