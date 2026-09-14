"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export const CyberBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = window.innerWidth;
    let height = window.innerHeight;

    // --- Scene, Camera, Renderer ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020617, 0.018);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 200);
    camera.position.set(0, 8, 30);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x020617, 1);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    container.appendChild(renderer.domElement);

    // --- Scroll state ---
    let scrollY = 0;
    let targetScrollY = 0;
    const docHeight = () =>
      Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        window.innerHeight * 5
      );

    // --- 1. INFINITE PERSPECTIVE GRID FLOOR ---
    const gridGroup = new THREE.Group();
    scene.add(gridGroup);

    // Main grid lines along X
    const gridExtent = 80;
    const gridSpacing = 3;
    const gridLineMat = new THREE.LineBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.08,
    });
    const gridLineBrightMat = new THREE.LineBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.18,
    });

    for (let x = -gridExtent; x <= gridExtent; x += gridSpacing) {
      const isMajor = x % (gridSpacing * 4) === 0;
      const pts = [
        new THREE.Vector3(x, 0, -gridExtent),
        new THREE.Vector3(x, 0, gridExtent),
      ];
      const geom = new THREE.BufferGeometry().setFromPoints(pts);
      const line = new THREE.Line(geom, isMajor ? gridLineBrightMat : gridLineMat);
      gridGroup.add(line);
    }

    for (let z = -gridExtent; z <= gridExtent; z += gridSpacing) {
      const isMajor = z % (gridSpacing * 4) === 0;
      const pts = [
        new THREE.Vector3(-gridExtent, 0, z),
        new THREE.Vector3(gridExtent, 0, z),
      ];
      const geom = new THREE.BufferGeometry().setFromPoints(pts);
      const line = new THREE.Line(geom, isMajor ? gridLineBrightMat : gridLineMat);
      gridGroup.add(line);
    }

    gridGroup.position.y = -6;

    // Grid glow plane (subtle emissive floor)
    const floorGeom = new THREE.PlaneGeometry(180, 180);
    const floorMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.015,
      side: THREE.DoubleSide,
    });
    const floorPlane = new THREE.Mesh(floorGeom, floorMat);
    floorPlane.rotation.x = -Math.PI / 2;
    floorPlane.position.y = -6.01;
    scene.add(floorPlane);

    // --- 2. VOLUMETRIC PARTICLE FIELD ---
    const particleCount = prefersReducedMotion ? 200 : 600;
    const particleGeom = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);
    const particleOriginalY = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      particlePositions[i3] = (Math.random() - 0.5) * 100;
      particlePositions[i3 + 1] = Math.random() * 50 - 10;
      particlePositions[i3 + 2] = (Math.random() - 0.5) * 100;
      particleSpeeds[i] = 0.01 + Math.random() * 0.03;
      particleOriginalY[i] = particlePositions[i3 + 1];
    }

    particleGeom.setAttribute(
      "position",
      new THREE.BufferAttribute(particlePositions, 3)
    );

    const particleMat = new THREE.PointsMaterial({
      color: 0x00f0ff,
      size: 0.12,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeom, particleMat);
    scene.add(particles);

    // --- 3. DATA STREAM COLUMNS (vertical glowing lines) ---
    const streamCount = prefersReducedMotion ? 8 : 24;
    const streamGroup = new THREE.Group();
    scene.add(streamGroup);

    interface DataStream {
      mesh: THREE.Line;
      speed: number;
      baseX: number;
      baseZ: number;
      height: number;
      offset: number;
    }

    const dataStreams: DataStream[] = [];

    for (let i = 0; i < streamCount; i++) {
      const streamHeight = 8 + Math.random() * 25;
      const points = [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, streamHeight, 0),
      ];
      const geom = new THREE.BufferGeometry().setFromPoints(points);
      const mat = new THREE.LineBasicMaterial({
        color: i % 3 === 0 ? 0x0070f3 : 0x00f0ff,
        transparent: true,
        opacity: 0.15 + Math.random() * 0.2,
      });
      const line = new THREE.Line(geom, mat);
      const bx = (Math.random() - 0.5) * 80;
      const bz = (Math.random() - 0.5) * 80;
      line.position.set(bx, -6, bz);
      streamGroup.add(line);
      dataStreams.push({
        mesh: line,
        speed: 0.3 + Math.random() * 0.8,
        baseX: bx,
        baseZ: bz,
        height: streamHeight,
        offset: Math.random() * Math.PI * 2,
      });
    }

    // --- 4. ORBITING HOLOGRAPHIC RING STRUCTURES ---
    const ringGroup = new THREE.Group();
    scene.add(ringGroup);

    const ring1Geom = new THREE.TorusGeometry(14, 0.04, 16, 120);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.12,
    });
    const ring1 = new THREE.Mesh(ring1Geom, ring1Mat);
    ring1.rotation.x = Math.PI / 2.3;
    ring1.position.set(0, 5, -15);
    ringGroup.add(ring1);

    const ring2Geom = new THREE.TorusGeometry(18, 0.03, 16, 120);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0x0070f3,
      transparent: true,
      opacity: 0.08,
    });
    const ring2 = new THREE.Mesh(ring2Geom, ring2Mat);
    ring2.rotation.x = Math.PI / 3;
    ring2.rotation.z = Math.PI / 6;
    ring2.position.set(0, 8, -20);
    ringGroup.add(ring2);

    // Dashed ring (radar sweep feel)
    const ring3Geom = new THREE.TorusGeometry(22, 0.025, 16, 60);
    const ring3Mat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.06,
      wireframe: true,
    });
    const ring3 = new THREE.Mesh(ring3Geom, ring3Mat);
    ring3.rotation.x = Math.PI / 4;
    ring3.position.set(0, 3, -25);
    ringGroup.add(ring3);

    // --- 5. FLOATING NETWORK NODE CLUSTERS ---
    const nodeGroup = new THREE.Group();
    scene.add(nodeGroup);

    interface NetNode {
      mesh: THREE.Mesh;
      basePos: THREE.Vector3;
      pulseOffset: number;
      pulseSpeed: number;
    }

    const netNodes: NetNode[] = [];
    const nodeSphereGeom = new THREE.SphereGeometry(0.15, 12, 12);
    const nodeGlowMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.7,
    });
    const nodeRedMat = new THREE.MeshBasicMaterial({
      color: 0xef4444,
      transparent: true,
      opacity: 0.6,
    });
    const nodeBlueMat = new THREE.MeshBasicMaterial({
      color: 0x0070f3,
      transparent: true,
      opacity: 0.6,
    });

    const nodeCount = prefersReducedMotion ? 15 : 40;
    for (let i = 0; i < nodeCount; i++) {
      const mat = i % 7 === 0 ? nodeRedMat : i % 4 === 0 ? nodeBlueMat : nodeGlowMat;
      const mesh = new THREE.Mesh(nodeSphereGeom, mat);
      const basePos = new THREE.Vector3(
        (Math.random() - 0.5) * 60,
        Math.random() * 30 - 5,
        (Math.random() - 0.5) * 60
      );
      mesh.position.copy(basePos);
      nodeGroup.add(mesh);
      netNodes.push({
        mesh,
        basePos,
        pulseOffset: Math.random() * Math.PI * 2,
        pulseSpeed: 0.5 + Math.random() * 1.5,
      });
    }

    // Draw network connection edges between nearby nodes
    const edgeMat = new THREE.LineBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.06,
    });

    for (let i = 0; i < netNodes.length; i++) {
      for (let j = i + 1; j < netNodes.length; j++) {
        const dist = netNodes[i].basePos.distanceTo(netNodes[j].basePos);
        if (dist < 15) {
          const pts = [netNodes[i].basePos.clone(), netNodes[j].basePos.clone()];
          const geom = new THREE.BufferGeometry().setFromPoints(pts);
          const edge = new THREE.Line(geom, edgeMat);
          nodeGroup.add(edge);
        }
      }
    }

    // --- 6. LIGHTING ---
    const ambientLight = new THREE.AmbientLight(0x081326, 3.0);
    scene.add(ambientLight);

    const cyanLight = new THREE.PointLight(0x00f0ff, 6, 80);
    cyanLight.position.set(0, 15, 0);
    scene.add(cyanLight);

    const blueLight = new THREE.PointLight(0x0055ff, 4, 60);
    blueLight.position.set(-20, 10, -20);
    scene.add(blueLight);

    // --- Mouse parallax ---
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / width - 0.5) * 2;
      targetMouseY = (e.clientY / height - 0.5) * 2;
    };

    // --- Scroll handler ---
    const handleScroll = () => {
      targetScrollY = window.scrollY;
    };

    // --- Resize handler ---
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    // --- Animation loop ---
    const clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      const speedMultiplier = prefersReducedMotion ? 0.1 : 1.0;

      // Smooth scroll interpolation
      scrollY += (targetScrollY - scrollY) * 0.06;
      const scrollNorm = scrollY / (docHeight() - height || 1);

      // Smooth mouse interpolation
      mouseX += (targetMouseX - mouseX) * 0.03;
      mouseY += (targetMouseY - mouseY) * 0.03;

      // *** SCROLL-DRIVEN CAMERA ***
      // Camera flies forward along Z as user scrolls, tilts down, rotates subtly
      const scrollDepth = scrollNorm * 60;
      camera.position.z = 30 - scrollDepth;
      camera.position.y = 8 + scrollNorm * 4 + Math.sin(elapsed * 0.2 * speedMultiplier) * 1.5;
      camera.position.x = mouseX * 3 + Math.sin(elapsed * 0.15 * speedMultiplier) * 2;

      camera.lookAt(
        mouseX * 2,
        2 + scrollNorm * 2,
        camera.position.z - 20
      );

      // *** SCROLL-DRIVEN GRID ***
      // Grid scrolls with parallax offset
      gridGroup.position.z = -scrollDepth * 0.3;

      // *** ANIMATE DATA STREAMS ***
      dataStreams.forEach((ds) => {
        const t = elapsed * ds.speed * speedMultiplier + ds.offset;
        // Streams pulse up and down
        const pulseY = Math.sin(t) * ds.height * 0.3;
        ds.mesh.position.y = -6 + pulseY;
        // Subtle scroll parallax
        ds.mesh.position.z = ds.baseZ - scrollDepth * 0.15;
        // Fade streams based on distance to camera
        const camDist = camera.position.distanceTo(ds.mesh.position);
        (ds.mesh.material as THREE.LineBasicMaterial).opacity =
          Math.max(0.05, 0.35 - camDist * 0.004);
      });

      // *** ANIMATE RINGS (scroll-linked rotation) ***
      ring1.rotation.z = elapsed * 0.08 * speedMultiplier + scrollNorm * Math.PI;
      ring1.position.z = -15 - scrollDepth * 0.5;
      ring2.rotation.y = -elapsed * 0.06 * speedMultiplier + scrollNorm * Math.PI * 0.5;
      ring2.position.z = -20 - scrollDepth * 0.4;
      ring3.rotation.z = elapsed * 0.04 * speedMultiplier + scrollNorm * Math.PI * 1.5;
      ring3.rotation.x = Math.PI / 4 + scrollNorm * 0.5;
      ring3.position.z = -25 - scrollDepth * 0.35;

      // *** ANIMATE PARTICLES (scroll depth + floating) ***
      const posArr = particleGeom.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        // Gentle floating motion
        posArr[i3 + 1] =
          particleOriginalY[i] +
          Math.sin(elapsed * particleSpeeds[i] * 20 * speedMultiplier + i) * 1.5;
        // Scroll parallax on Z axis — particles at different depths scroll at
        // different speeds for a strong parallax feel
        const depthFactor = 0.1 + (posArr[i3 + 2] + 50) / 100 * 0.3;
        posArr[i3 + 2] += (targetScrollY - scrollY) * depthFactor * -0.002;
      }
      particleGeom.attributes.position.needsUpdate = true;

      // *** ANIMATE NETWORK NODES ***
      netNodes.forEach((node) => {
        const t = elapsed * node.pulseSpeed * speedMultiplier + node.pulseOffset;
        node.mesh.position.y = node.basePos.y + Math.sin(t) * 1.2;
        node.mesh.position.x = node.basePos.x + Math.cos(t * 0.7) * 0.5;
        // Scroll parallax
        node.mesh.position.z = node.basePos.z - scrollDepth * 0.2;
        // Pulse scale
        const scale = 1 + Math.sin(t * 2) * 0.3;
        node.mesh.scale.setScalar(scale);
      });

      // *** ANIMATE LIGHTS with scroll ***
      cyanLight.position.z = -scrollDepth * 0.4;
      cyanLight.intensity = 6 + Math.sin(elapsed * 0.5) * 2;
      blueLight.position.z = -20 - scrollDepth * 0.3;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
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
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
      style={{ background: "#020617" }}
    />
  );
};
