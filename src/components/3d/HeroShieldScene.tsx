"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export const HeroShieldScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Dimensions
    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 14);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Group for all rotating objects
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 1. CREATE 3D CYBER SHIELD (Behind QR)
    const shieldGroup = new THREE.Group();
    shieldGroup.position.set(0, 0, -2.5);
    mainGroup.add(shieldGroup);

    // Shield Shape
    const shieldShape = new THREE.Shape();
    shieldShape.moveTo(0, 3.2);
    shieldShape.quadraticCurveTo(2.4, 3.0, 2.6, 1.2);
    shieldShape.quadraticCurveTo(2.6, -1.0, 0, -3.2);
    shieldShape.quadraticCurveTo(-2.6, -1.0, -2.6, 1.2);
    shieldShape.quadraticCurveTo(-2.4, 3.0, 0, 3.2);

    const extrudeSettings = {
      depth: 0.4,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.15,
      bevelThickness: 0.15,
    };

    const shieldGeometry = new THREE.ExtrudeGeometry(shieldShape, extrudeSettings);
    shieldGeometry.center();

    // Shield Materials (Metallic Dark Chrome + Glowing Edge Wireframe)
    const shieldMaterial = new THREE.MeshStandardMaterial({
      color: 0x091428,
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0x003366,
      emissiveIntensity: 0.25,
    });

    const shieldMesh = new THREE.Mesh(shieldGeometry, shieldMaterial);
    shieldGroup.add(shieldMesh);

    // Shield Wireframe / Circuit overlay
    const shieldWireframeGeom = new THREE.WireframeGeometry(shieldGeometry);
    const shieldWireframeMat = new THREE.LineBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.35,
    });
    const shieldWireframe = new THREE.LineSegments(shieldWireframeGeom, shieldWireframeMat);
    shieldGroup.add(shieldWireframe);

    // Shield Core Emblem
    const emblemGeom = new THREE.TorusGeometry(1.0, 0.05, 16, 64);
    const emblemMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const emblemMesh = new THREE.Mesh(emblemGeom, emblemMat);
    emblemMesh.position.z = 0.3;
    shieldGroup.add(emblemMesh);

    // 2. CREATE 3D FLOATING QR CODE
    const qrGroup = new THREE.Group();
    qrGroup.position.set(0, 0, 1.2);
    mainGroup.add(qrGroup);

    // QR Base Glass Plate
    const basePlateGeom = new THREE.BoxGeometry(4.4, 4.4, 0.15);
    const basePlateMat = new THREE.MeshPhysicalMaterial({
      color: 0x040914,
      metalness: 0.8,
      roughness: 0.15,
      transmission: 0.4,
      transparent: true,
      opacity: 0.85,
    });
    const basePlate = new THREE.Mesh(basePlateGeom, basePlateMat);
    qrGroup.add(basePlate);

    // Base plate rim
    const baseEdgesGeom = new THREE.EdgesGeometry(basePlateGeom);
    const baseEdgesMat = new THREE.LineBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.7 });
    const baseEdges = new THREE.LineSegments(baseEdgesGeom, baseEdgesMat);
    qrGroup.add(baseEdges);

    // Procedural QR Matrix Pattern (21x21 grid)
    const gridSize = 19;
    const boxSize = 3.6 / gridSize;
    const blockGeom = new THREE.BoxGeometry(boxSize * 0.9, boxSize * 0.9, 0.25);
    const blockMat = new THREE.MeshStandardMaterial({
      color: 0x00e5ff,
      emissive: 0x0077aa,
      emissiveIntensity: 0.8,
      metalness: 0.5,
      roughness: 0.2,
    });

    const darkBlockMat = new THREE.MeshStandardMaterial({
      color: 0x081320,
      metalness: 0.8,
      roughness: 0.3,
    });

    // Finder pattern positions (Top-Left, Top-Right, Bottom-Left)
    const isFinder = (r: number, c: number) => {
      // Top-Left (7x7)
      if (r < 7 && c < 7) return true;
      // Top-Right
      if (r < 7 && c >= gridSize - 7) return true;
      // Bottom-Left
      if (r >= gridSize - 7 && c < 7) return true;
      return false;
    };

    // Finder pattern logic
    const isFinderFilled = (r: number, c: number) => {
      // Normalize to 7x7 corner
      let nr = r;
      let nc = c;
      if (r < 7 && c >= gridSize - 7) nc = c - (gridSize - 7);
      if (r >= gridSize - 7 && c < 7) nr = r - (gridSize - 7);

      // Outer 7x7 border
      if (nr === 0 || nr === 6 || nc === 0 || nc === 6) return true;
      // Inner 3x3 core
      if (nr >= 2 && nr <= 4 && nc >= 2 && nc <= 4) return true;
      return false;
    };

    // Seeded pseudo-random for stable QR pattern
    let seed = 42;
    const pseudoRandom = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        let filled = false;
        if (isFinder(r, c)) {
          filled = isFinderFilled(r, c);
        } else {
          filled = pseudoRandom() > 0.45;
        }

        if (filled) {
          const block = new THREE.Mesh(blockGeom, isFinder(r, c) ? blockMat : (pseudoRandom() > 0.3 ? blockMat : darkBlockMat));
          const posX = (c - gridSize / 2 + 0.5) * boxSize;
          const posY = (gridSize / 2 - r - 0.5) * boxSize;
          block.position.set(posX, posY, 0.15);
          qrGroup.add(block);
        }
      }
    }

    // 3. SCANNING LASER BEAM
    const laserGeom = new THREE.CylinderGeometry(0.04, 0.04, 4.6, 16);
    laserGeom.rotateZ(Math.PI / 2);
    const laserMat = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.9,
    });
    const laserBeam = new THREE.Mesh(laserGeom, laserMat);
    laserBeam.position.set(0, 0, 0.35);
    qrGroup.add(laserBeam);

    // Laser Light
    const laserLight = new THREE.PointLight(0x00f0ff, 2.5, 4);
    laserLight.position.set(0, 0, 0.5);
    qrGroup.add(laserLight);

    // 4. HOLOGRAPHIC SECURITY RINGS
    const ring1Geom = new THREE.TorusGeometry(4.2, 0.02, 16, 100);
    const ring1Mat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.35 });
    const ring1 = new THREE.Mesh(ring1Geom, ring1Mat);
    mainGroup.add(ring1);

    const ring2Geom = new THREE.TorusGeometry(4.8, 0.015, 16, 100);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0x0070f3, transparent: true, opacity: 0.25 });
    const ring2 = new THREE.Mesh(ring2Geom, ring2Mat);
    ring2.rotation.x = Math.PI / 4;
    mainGroup.add(ring2);

    // 5. ORBITING PARTICLES
    const particleCount = 120;
    const particleGeom = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 12;
      positions[i + 1] = (Math.random() - 0.5) * 12;
      positions[i + 2] = (Math.random() - 0.5) * 8;

      velocities[i] = (Math.random() - 0.5) * 0.01;
      velocities[i + 1] = (Math.random() - 0.5) * 0.01;
      velocities[i + 2] = (Math.random() - 0.5) * 0.01;
    }

    particleGeom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x00f0ff,
      size: 0.06,
      transparent: true,
      opacity: 0.6,
    });
    const particles = new THREE.Points(particleGeom, particleMat);
    scene.add(particles);

    // 6. LIGHTING
    const ambientLight = new THREE.AmbientLight(0x0a192f, 2.0);
    scene.add(ambientLight);

    const cyanKeyLight = new THREE.DirectionalLight(0x00f0ff, 3.0);
    cyanKeyLight.position.set(5, 5, 8);
    scene.add(cyanKeyLight);

    const blueFillLight = new THREE.DirectionalLight(0x0055ff, 2.0);
    blueFillLight.position.set(-5, -3, -5);
    scene.add(blueFillLight);

    // Mouse parallax tracking
    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      targetRotY = ((e.clientX / innerWidth) - 0.5) * 0.6;
      targetRotX = ((e.clientY / innerHeight) - 0.5) * 0.4;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Handle Resize
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
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
      const elapsedTime = clock.getElapsedTime();

      // Smooth parallax interpolation
      currentRotX += (targetRotX - currentRotX) * 0.05;
      currentRotY += (targetRotY - currentRotY) * 0.05;

      // Base idle rotations
      mainGroup.rotation.y = Math.sin(elapsedTime * 0.5) * 0.15 + currentRotY;
      mainGroup.rotation.x = Math.cos(elapsedTime * 0.4) * 0.1 + currentRotX;

      // Shield counter-rotation & subtle pulse
      shieldGroup.rotation.z = Math.sin(elapsedTime * 0.3) * 0.05;
      shieldGroup.rotation.y = -Math.sin(elapsedTime * 0.4) * 0.1;

      // Scanning laser movement
      const laserY = Math.sin(elapsedTime * 2.2) * 1.8;
      laserBeam.position.y = laserY;
      laserLight.position.y = laserY;

      // Rings rotation
      ring1.rotation.z = elapsedTime * 0.2;
      ring2.rotation.y = -elapsedTime * 0.15;
      ring2.rotation.z = elapsedTime * 0.1;

      // Particle floating
      const posAttr = particleGeom.attributes.position as THREE.BufferAttribute;
      const posArray = posAttr.array as Float32Array;
      for (let i = 0; i < particleCount * 3; i += 3) {
        posArray[i] += velocities[i];
        posArray[i + 1] += velocities[i + 1];
        posArray[i + 2] += velocities[i + 2];

        if (posArray[i] > 6) posArray[i] = -6;
        if (posArray[i] < -6) posArray[i] = 6;
        if (posArray[i + 1] > 6) posArray[i + 1] = -6;
        if (posArray[i + 1] < -6) posArray[i + 1] = 6;
      }
      posAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[520px] sm:h-[620px] lg:h-[700px] flex items-center justify-center pointer-events-none"
    />
  );
};
