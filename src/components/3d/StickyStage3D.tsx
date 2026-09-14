"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Search,
  Server,
  Terminal,
  Activity,
  Layers,
  AlertOctagon,
  Lock,
  ArrowRight,
  Database,
  Eye,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { soundFX } from "../ui/SoundFX";

interface StickyStage3DProps {
  onOpenScanner: () => void;
}

export const StickyStage3D: React.FC<StickyStage3DProps> = ({ onOpenScanner }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [currentScene, setCurrentScene] = useState<number>(0);
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  // 3D Three.js references
  const threeRefs = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    qrBaseGroup: THREE.Group;
    layer1Group: THREE.Group;
    layer2Group: THREE.Group;
    layer3Group: THREE.Group;
    shieldGroup: THREE.Group;
    laserMesh: THREE.Mesh;
    laserLight: THREE.PointLight;
    maliciousRedLight: THREE.PointLight;
    ringGroup: THREE.Group;
    matrixBlocks: THREE.Mesh[];
  } | null>(null);

  // Initialize Three.js Scene
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let width = canvas.clientWidth || window.innerWidth;
    let height = canvas.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 0, 16);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Groups
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    const qrBaseGroup = new THREE.Group();
    masterGroup.add(qrBaseGroup);

    const layer1Group = new THREE.Group(); // Finder layer
    const layer2Group = new THREE.Group(); // Data layer
    const layer3Group = new THREE.Group(); // Substrate glass layer
    qrBaseGroup.add(layer3Group);
    qrBaseGroup.add(layer2Group);
    qrBaseGroup.add(layer1Group);

    // Substrate
    const substrateGeom = new THREE.BoxGeometry(4.2, 4.2, 0.1);
    const substrateMat = new THREE.MeshPhysicalMaterial({
      color: 0x050d1a,
      metalness: 0.9,
      roughness: 0.1,
      transmission: 0.5,
      transparent: true,
      opacity: 0.8,
    });
    const substrate = new THREE.Mesh(substrateGeom, substrateMat);
    layer3Group.add(substrate);

    const substrateWire = new THREE.LineSegments(
      new THREE.EdgesGeometry(substrateGeom),
      new THREE.LineBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.6 })
    );
    layer3Group.add(substrateWire);

    // Blocks
    const matrixBlocks: THREE.Mesh[] = [];
    const gridSize = 17;
    const boxSize = 3.6 / gridSize;
    const blockGeom = new THREE.BoxGeometry(boxSize * 0.9, boxSize * 0.9, 0.2);
    const cyanMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x0088cc,
      emissiveIntensity: 0.6,
      roughness: 0.2,
    });
    const redMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xdc2626,
      emissiveIntensity: 0.9,
      roughness: 0.1,
    });

    let seed = 1337;
    const rnd = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        const isCorner =
          (r < 5 && c < 5) || (r < 5 && c >= gridSize - 5) || (r >= gridSize - 5 && c < 5);
        const shouldFill = isCorner || rnd() > 0.45;

        if (shouldFill) {
          const mesh = new THREE.Mesh(blockGeom, cyanMat);
          mesh.position.set(
            (c - gridSize / 2 + 0.5) * boxSize,
            (gridSize / 2 - r - 0.5) * boxSize,
            0.12
          );
          if (isCorner) {
            layer1Group.add(mesh);
          } else {
            layer2Group.add(mesh);
          }
          matrixBlocks.push(mesh);
        }
      }
    }

    // Shield (Initially behind QR at z = -4)
    const shieldGroup = new THREE.Group();
    shieldGroup.position.set(0, 0, -4);
    masterGroup.add(shieldGroup);

    const shieldShape = new THREE.Shape();
    shieldShape.moveTo(0, 3.4);
    shieldShape.quadraticCurveTo(2.8, 3.2, 3.0, 1.4);
    shieldShape.quadraticCurveTo(3.0, -1.2, 0, -3.4);
    shieldShape.quadraticCurveTo(-3.0, -1.2, -3.0, 1.4);
    shieldShape.quadraticCurveTo(-2.8, 3.2, 0, 3.4);

    const shieldGeom = new THREE.ExtrudeGeometry(shieldShape, {
      depth: 0.35,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.1,
      bevelThickness: 0.1,
    });
    shieldGeom.center();

    const shieldMat = new THREE.MeshStandardMaterial({
      color: 0x07152b,
      metalness: 0.95,
      roughness: 0.15,
      emissive: 0x004488,
      emissiveIntensity: 0.3,
    });
    const shieldMesh = new THREE.Mesh(shieldGeom, shieldMat);
    shieldGroup.add(shieldMesh);

    const shieldWire = new THREE.LineSegments(
      new THREE.WireframeGeometry(shieldGeom),
      new THREE.LineBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.5 })
    );
    shieldGroup.add(shieldWire);

    // Laser Beam
    const laserGeom = new THREE.CylinderGeometry(0.035, 0.035, 4.4, 16);
    laserGeom.rotateZ(Math.PI / 2);
    const laserMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.9 });
    const laserMesh = new THREE.Mesh(laserGeom, laserMat);
    laserMesh.position.set(0, 0, 0.3);
    qrBaseGroup.add(laserMesh);

    const laserLight = new THREE.PointLight(0x00f0ff, 2.0, 6);
    laserLight.position.set(0, 0, 0.5);
    qrBaseGroup.add(laserLight);

    const maliciousRedLight = new THREE.PointLight(0xff0044, 0, 8);
    maliciousRedLight.position.set(0, 0, 1);
    scene.add(maliciousRedLight);

    // Holographic Rings
    const ringGroup = new THREE.Group();
    masterGroup.add(ringGroup);

    const r1 = new THREE.Mesh(
      new THREE.TorusGeometry(4.8, 0.02, 16, 80),
      new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.3 })
    );
    ringGroup.add(r1);

    // Lights
    const ambient = new THREE.AmbientLight(0x081326, 2.0);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0x00f0ff, 2.5);
    dirLight.position.set(5, 5, 10);
    scene.add(dirLight);

    threeRefs.current = {
      scene,
      camera,
      renderer,
      qrBaseGroup,
      layer1Group,
      layer2Group,
      layer3Group,
      shieldGroup,
      laserMesh,
      laserLight,
      maliciousRedLight,
      ringGroup,
      matrixBlocks,
    };

    // Resize handler
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.clientWidth || window.innerWidth;
      height = canvas.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    // Animation Loop
    let clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Ambient laser sweep
      const laserY = Math.sin(time * 2.5) * 1.8;
      laserMesh.position.y = laserY;
      laserLight.position.y = laserY;

      ringGroup.rotation.z = time * 0.15;
      ringGroup.rotation.x = Math.sin(time * 0.3) * 0.2;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, []);

  // Update 3D Stage according to Scroll Progress / Scene (0 to 4)
  useEffect(() => {
    if (!threeRefs.current) return;
    const {
      qrBaseGroup,
      layer1Group,
      layer2Group,
      layer3Group,
      shieldGroup,
      maliciousRedLight,
      matrixBlocks,
    } = threeRefs.current;

    // SCENE 0: Intro
    if (currentScene === 0) {
      qrBaseGroup.position.set(0, 0, 0);
      qrBaseGroup.rotation.set(0.1, -0.3, 0);
      layer1Group.position.z = 0;
      layer2Group.position.z = 0;
      layer3Group.position.z = 0;
      shieldGroup.position.set(0, 0, -4);
      shieldGroup.scale.set(0.9, 0.9, 0.9);
      maliciousRedLight.intensity = 0;
      matrixBlocks.forEach((m) => {
        (m.material as THREE.MeshStandardMaterial).color.setHex(0x00f0ff);
      });
    }
    // SCENE 1: Threat Detection (Laser Scan & Telemetry)
    else if (currentScene === 1) {
      qrBaseGroup.position.set(1.2, 0, 0.5);
      qrBaseGroup.rotation.set(0.15, -0.45, 0);
      layer1Group.position.z = 0.2;
      layer2Group.position.z = 0;
      layer3Group.position.z = -0.2;
      shieldGroup.position.set(-2, 0, -3.5);
      maliciousRedLight.intensity = 0.5;
    }
    // SCENE 2: Threat Discovery (Layer separation)
    else if (currentScene === 2) {
      qrBaseGroup.position.set(2.4, 0, 1.0);
      qrBaseGroup.rotation.set(0.3, -0.7, 0.1);
      // Exploded 3D layers
      layer1Group.position.z = 1.4; // Finder patterns pop forward
      layer2Group.position.z = 0.6; // Data payload layer
      layer3Group.position.z = -0.6; // Substrate
      shieldGroup.position.set(-3, 0, -2);
      maliciousRedLight.intensity = 1.8;
      // Turn some blocks crimson/red to visualize threat payload extraction
      matrixBlocks.forEach((m, idx) => {
        if (idx % 3 === 0) {
          (m.material as THREE.MeshStandardMaterial).color.setHex(0xef4444);
        }
      });
    }
    // SCENE 3: Risk Analysis (Holographic meter & high threat warning)
    else if (currentScene === 3) {
      qrBaseGroup.position.set(2.8, -0.2, 0);
      qrBaseGroup.rotation.set(0.2, -0.85, 0);
      layer1Group.position.z = 1.8;
      layer2Group.position.z = 0.8;
      layer3Group.position.z = -0.8;
      shieldGroup.position.set(-1.0, 0, -1.5);
      shieldGroup.scale.set(1.1, 1.1, 1.1);
      maliciousRedLight.intensity = 3.0;
      matrixBlocks.forEach((m) => {
        (m.material as THREE.MeshStandardMaterial).color.setHex(0xdc2626);
      });
    }
    // SCENE 4: Decision & Shield Intervention (Shield moves in FRONT, QR vanishes behind)
    else if (currentScene === 4) {
      qrBaseGroup.position.set(0, 0, -3.0); // QR pushed back
      qrBaseGroup.rotation.set(0, 0, 0);
      layer1Group.position.z = 0;
      layer2Group.position.z = 0;
      layer3Group.position.z = 0;
      // Shield takes center stage IN FRONT OF QR
      shieldGroup.position.set(0, 0, 2.8);
      shieldGroup.scale.set(1.4, 1.4, 1.4);
      shieldGroup.rotation.set(0, 0, 0);
      maliciousRedLight.intensity = 0.2;
    }
  }, [currentScene]);

  // Scroll tracking to calculate active scene
  useEffect(() => {
    const handleScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const totalHeight = el.scrollHeight - window.innerHeight;
      const progress = Math.max(0, Math.min(1, -rect.top / (totalHeight || 1)));
      setScrollProgress(progress);

      // Map progress to scene 0-4
      const sceneIndex = Math.min(4, Math.floor(progress * 5));
      if (sceneIndex !== currentScene) {
        setCurrentScene(sceneIndex);
        if (sceneIndex === 4) {
          soundFX.playShieldDeploy();
        } else if (sceneIndex === 3) {
          soundFX.playThreatAlarm();
        } else if (sceneIndex === 1 || sceneIndex === 2) {
          soundFX.playScanBeam();
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [currentScene]);

  const jumpToScene = (sceneIndex: number) => {
    soundFX.playClick();
    setCurrentScene(sceneIndex);
    const el = containerRef.current;
    if (!el) return;
    const targetY = el.offsetTop + (sceneIndex / 5) * (el.scrollHeight - window.innerHeight);
    window.scrollTo({ top: targetY, behavior: "smooth" });
  };

  const sceneTitles = [
    "01. Introduction",
    "02. Threat Detection",
    "03. Layer Separation",
    "04. Risk Analysis",
    "05. Shield Lockdown",
  ];

  return (
    <div
      id="interactive-stage"
      ref={containerRef}
      className="relative w-full h-[400vh] bg-transparent"
    >
      {/* Sticky Viewport Stage */}
      <div className="sticky top-0 w-full h-screen flex items-center justify-center overflow-hidden">
        {/* Background 3D Canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block z-0 pointer-events-none" />

        {/* Ambient Top HUD Bar */}
        <div className="absolute top-20 left-0 right-0 z-20 max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-2 font-mono text-xs text-cyber-cyan bg-slate-950/80 px-3 py-1.5 rounded-full border border-cyber-cyan/30 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-cyber-cyan animate-ping" />
            <span>CINEMATIC STAGE: {sceneTitles[currentScene]}</span>
          </div>

          {/* Interactive Scene Scrubber for direct clicking */}
          <div className="hidden md:flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-lg border border-slate-800 backdrop-blur-md pointer-events-auto">
            {sceneTitles.map((title, idx) => (
              <button
                key={title}
                onClick={() => jumpToScene(idx)}
                className={`px-2.5 py-1 rounded text-[11px] font-mono transition-all ${
                  currentScene === idx
                    ? "bg-cyber-cyan text-slate-950 font-bold shadow-[0_0_10px_rgba(0,240,255,0.6)]"
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Scene HUD Content Overlays */}
        <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <AnimatePresence mode="wait">
            {/* SCENE 1: Introduction */}
            {currentScene === 0 && (
              <motion.div
                key="scene-0"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.5 }}
                className="max-w-xl"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan text-xs font-mono mb-4">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>SCENE 01 &mdash; SURFACE RECONNAISSANCE</span>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-mono font-black text-white tracking-tight leading-none mb-4">
                  THE HIDDEN <span className="text-cyber-cyan">PAYLOAD</span>
                </h2>
                <p className="text-slate-300 font-mono text-sm sm:text-base leading-relaxed mb-6">
                  To the human eye, every QR matrix is identical. Without automated zero-trust inspection, a physical QR code acts as an unverified tunnel directly to weaponized credential harvesting kits.
                </p>
                <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
                  <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded border border-slate-800">
                    <Activity className="w-4 h-4 text-cyber-cyan" />
                    <span>SCROLL TO INITIATE TELEMETRY</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* SCENE 2: Threat Detection */}
            {currentScene === 1 && (
              <motion.div
                key="scene-1"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5 }}
                className="max-w-lg bg-slate-950/85 backdrop-blur-md p-6 sm:p-8 rounded-xl border border-cyber-cyan/40 shadow-[0_0_30px_rgba(0,240,255,0.15)]"
              >
                <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2 text-xs font-mono text-cyber-cyan font-bold">
                    <Search className="w-4 h-4" />
                    <span>REAL-TIME TELEMETRY SCAN</span>
                  </div>
                  <span className="text-[10px] font-mono bg-cyber-cyan/20 text-cyber-cyan px-2 py-0.5 rounded animate-pulse">
                    ACTIVE
                  </span>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between p-2 rounded bg-slate-900/90 border border-slate-800">
                    <span className="text-slate-400">QR DETECTED</span>
                    <span className="text-cyber-cyan font-bold">21x21 MATRIX</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-slate-900/90 border border-slate-800">
                    <span className="text-slate-400">PAYLOAD EXTRACTED</span>
                    <span className="text-amber-400 font-bold">RAW URL BUFFER</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-slate-900/90 border border-slate-800">
                    <span className="text-slate-400">URL ANALYZING</span>
                    <span className="text-cyber-cyan animate-pulse">IN PROGRESS...</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-slate-900/90 border border-slate-800">
                    <span className="text-slate-400">DOMAIN CHECK</span>
                    <span className="text-rose-400 font-bold">TYPOSQUAT FLAG</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-slate-900/90 border border-slate-800">
                    <span className="text-slate-400">THREAT INTELLIGENCE</span>
                    <span className="text-rose-400 font-bold">KNOWN EVILGINX KIT</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* SCENE 3: Threat Discovery & Layer Separation */}
            {currentScene === 2 && (
              <motion.div
                key="scene-2"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.5 }}
                className="max-w-lg bg-slate-950/85 backdrop-blur-md p-6 sm:p-8 rounded-xl border border-rose-500/40 shadow-[0_0_30px_rgba(244,63,94,0.2)]"
              >
                <div className="flex items-center gap-2 text-xs font-mono text-rose-400 font-bold mb-3">
                  <Layers className="w-4 h-4" />
                  <span>3D LAYER DISSECTION & INSPECTION</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-mono font-bold text-white mb-3">
                  EXTRACTED THREAT VECTOR
                </h3>
                <div className="p-2.5 rounded bg-slate-900 font-mono text-xs text-rose-300 break-all border border-rose-500/30 mb-4">
                  https://login.microsoftonline-verify-auth92[.]cc/auth/sso
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between text-slate-300 py-1 border-b border-slate-800">
                    <span>DOMAIN REPUTATION:</span>
                    <span className="text-rose-400 font-bold">SUSPICIOUS (Age: 1d)</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300 py-1 border-b border-slate-800">
                    <span>URL STRUCTURE:</span>
                    <span className="text-rose-400 font-bold">SSO Impersonation</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300 py-1 border-b border-slate-800">
                    <span>REDIRECT ANALYSIS:</span>
                    <span className="text-amber-400 font-bold">2 Chained Hops</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300 py-1 border-b border-slate-800">
                    <span>PHISHING INDICATORS:</span>
                    <span className="text-rose-400 font-bold">Reverse Proxy Token Skim</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300 py-1">
                    <span>MALWARE INTELLIGENCE:</span>
                    <span className="text-rose-400 font-bold">C2 Channel Active</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* SCENE 4: Risk Analysis & Dynamic Risk Meter */}
            {currentScene === 3 && (
              <motion.div
                key="scene-3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="max-w-xl bg-slate-950/90 backdrop-blur-md p-6 sm:p-8 rounded-xl border border-rose-500/50 shadow-[0_0_40px_rgba(239,68,68,0.25)]"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-xs font-mono text-rose-400 font-bold">
                    <AlertOctagon className="w-4 h-4 animate-bounce" />
                    <span>CALCULATED THREAT SEVERITY</span>
                  </div>
                  <span className="text-xs font-mono bg-rose-500/20 text-rose-400 border border-rose-500/40 px-2.5 py-0.5 rounded font-bold">
                    HIGH RISK
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center mb-6">
                  {/* Circular Risk Meter */}
                  <div className="relative flex flex-col items-center justify-center p-4 bg-slate-900/60 rounded-xl border border-slate-800">
                    <div className="relative w-36 h-36 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="72"
                          cy="72"
                          r="56"
                          stroke="currentColor"
                          strokeWidth="10"
                          className="text-slate-800"
                          fill="transparent"
                        />
                        <circle
                          cx="72"
                          cy="72"
                          r="56"
                          stroke="currentColor"
                          strokeWidth="10"
                          className="text-rose-500 transition-all duration-1000"
                          fill="transparent"
                          strokeDasharray={351.8}
                          strokeDashoffset={351.8 * (1 - 0.87)}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-mono font-black text-rose-400">87</span>
                        <span className="text-[10px] font-mono text-slate-400">/ 100</span>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-slate-300 font-bold mt-2">
                      SEVERITY INDEX
                    </span>
                  </div>

                  {/* Identified Risk Factors */}
                  <div className="space-y-2">
                    <div className="p-2 rounded bg-rose-950/40 border border-rose-800/40 flex items-center gap-2 text-xs font-mono text-rose-300">
                      <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span>Suspicious Domain (.cc TLD)</span>
                    </div>
                    <div className="p-2 rounded bg-rose-950/40 border border-rose-800/40 flex items-center gap-2 text-xs font-mono text-rose-300">
                      <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span>Phishing Indicators (Evilginx)</span>
                    </div>
                    <div className="p-2 rounded bg-rose-950/40 border border-rose-800/40 flex items-center gap-2 text-xs font-mono text-rose-300">
                      <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span>Redirect Detected (2 hops)</span>
                    </div>
                    <div className="p-2 rounded bg-rose-950/40 border border-rose-800/40 flex items-center gap-2 text-xs font-mono text-rose-300">
                      <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span>Unknown Reputation (1 day old)</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs font-mono text-slate-400">
                  Calculated using multi-variable entropy, SSL certificate issuer heuristics, and global threat feed correlation.
                </p>
              </motion.div>
            )}

            {/* SCENE 5: Decision & Shield Intervention */}
            {currentScene === 4 && (
              <motion.div
                key="scene-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                className="max-w-xl mx-auto text-center bg-slate-950/90 backdrop-blur-md p-8 rounded-2xl border-2 border-cyber-cyan shadow-[0_0_50px_rgba(0,240,255,0.35)]"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-red-500/20 border border-red-500/50 text-red-400 text-xs font-mono font-bold mb-4">
                  <ShieldAlert className="w-4 h-4" />
                  <span>THREAT DETECTED &mdash; ACCESS BLOCKED</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-mono font-black text-white mb-2">
                  MALICIOUS QR DESTINATION
                </h3>
                <p className="text-sm font-mono text-rose-400 mb-6">
                  Zero Trust Shield Deployed &bull; Navigation Severed
                </p>

                <p className="text-xs sm:text-sm text-slate-300 font-mono leading-relaxed mb-6">
                  The malicious destination was neutralized behind the QRShield defense barrier before your browser or device could open the connection.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={onOpenScanner}
                    className="w-full sm:w-auto px-6 py-2.5 rounded bg-cyber-cyan text-slate-950 font-mono font-bold text-xs uppercase tracking-wider hover:bg-cyber-cyan/90 transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)]"
                  >
                    SCAN YOUR OWN QR CODE
                  </button>
                  <button
                    onClick={() => jumpToScene(0)}
                    className="w-full sm:w-auto px-6 py-2.5 rounded bg-slate-900 border border-slate-700 text-slate-300 font-mono text-xs uppercase tracking-wider hover:border-cyber-cyan transition-all"
                  >
                    REPLAY CINEMATIC
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Scroll Progress Bar at bottom */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 bg-slate-950/80 px-4 py-2 rounded-full border border-slate-800 backdrop-blur-md">
          <span className="text-[10px] font-mono text-slate-400">STAGE PROGRESS:</span>
          <div className="w-32 sm:w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-cyber-cyan transition-all duration-150"
              style={{ width: `${Math.round(scrollProgress * 100)}%` }}
            />
          </div>
          <span className="text-[10px] font-mono text-cyber-cyan font-bold">
            {Math.round(scrollProgress * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
};
