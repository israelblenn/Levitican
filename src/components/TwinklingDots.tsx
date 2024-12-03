"use client";

import { useEffect, useRef } from "react";

// Configuration Variables
const CONFIG = {
  numberOfDots: 200,
  dotRadiusRange: [0.5, 2.5],
  driftRange: [1, 5],
  driftSpeed: 0.05,
  springStrength: 0.02,
  mouseRepelRange: 200,
  repelForce: 5,
  primary: "#cba054",
  secondary: "#ebd4ac",
  colorSpeedRange: [0.005, 0.02],
  canvasWidth: 1152,
  canvasClampTop: 232,
  canvasClampBottom: 48,
};

type Dot = {
  x: number;
  y: number;
  homeX: number;
  homeY: number;
  radius: number;
  driftVX: number;
  driftVY: number;
  colorPhase: number;
  colorSpeed: number;
  colorDirection: number;
};

// Helper Functions
const hexToRgb = (hex: string) => {
  const bigint = parseInt(hex.slice(1), 16);
  return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
};

const interpolateColor = (primary: string, secondary: string, factor: number) => {
  const [c1, c2] = [hexToRgb(primary), hexToRgb(secondary)];
  return `rgb(${Math.round(c1.r + factor * (c2.r - c1.r))}, ${Math.round(
    c1.g + factor * (c2.g - c1.g)
  )}, ${Math.round(c1.b + factor * (c2.b - c1.b))})`;
};

const TwinklingDots = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let homeZoneLeft = 0,
      homeZoneTop = 0,
      homeZoneHeight = 0;

    const updateCanvasSizeAndZones = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Recalculate home zone
      homeZoneLeft = (window.innerWidth - CONFIG.canvasWidth) / 2;
      homeZoneTop = CONFIG.canvasClampTop;
      homeZoneHeight = window.innerHeight - homeZoneTop - CONFIG.canvasClampBottom;
    };

    updateCanvasSizeAndZones();

    const mouse = { x: -100, y: -100 }; // Initialize mouse position off-screen

    // Generate dots
    const dots: Dot[] = Array.from({ length: CONFIG.numberOfDots }, () => {
      const homeX = Math.random() * CONFIG.canvasWidth + homeZoneLeft;
      const homeY = Math.random() * homeZoneHeight + homeZoneTop;
      return {
        x: homeX,
        y: homeY,
        homeX,
        homeY,
        radius:
          Math.random() * (CONFIG.dotRadiusRange[1] - CONFIG.dotRadiusRange[0]) +
          CONFIG.dotRadiusRange[0],
        driftVX: (Math.random() - 0.5) * CONFIG.driftRange[1],
        driftVY: (Math.random() - 0.5) * CONFIG.driftRange[1],
        colorPhase: Math.random(),
        colorSpeed:
          Math.random() * (CONFIG.colorSpeedRange[1] - CONFIG.colorSpeedRange[0]) +
          CONFIG.colorSpeedRange[0],
        colorDirection: 1,
      };
    });

    // Mouse movement handler
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    // Resize handler
    const handleResize = () => {
      updateCanvasSizeAndZones();

      // Recenter home positions
      dots.forEach(dot => {
        dot.homeX = Math.random() * CONFIG.canvasWidth + homeZoneLeft;
        dot.homeY = Math.random() * homeZoneHeight + homeZoneTop;
      });
    };

    // Dot animation
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const dot of dots) {
        // Mouse repelling
        const dx = dot.x - mouse.x;
        const dy = dot.y - mouse.y;
        const distance = Math.hypot(dx, dy);

        if (distance < CONFIG.mouseRepelRange) {
          const angle = Math.atan2(dy, dx);
          const force = (CONFIG.mouseRepelRange - distance) / CONFIG.mouseRepelRange;
          dot.x += Math.cos(angle) * force * CONFIG.repelForce;
          dot.y += Math.sin(angle) * force * CONFIG.repelForce;
        } else {
          // Spring back to home position and drift
          dot.x += (dot.homeX - dot.x) * CONFIG.springStrength + dot.driftVX * CONFIG.driftSpeed;
          dot.y += (dot.homeY - dot.y) * CONFIG.springStrength + dot.driftVY * CONFIG.driftSpeed;

          // Update drift velocities
          dot.driftVX += (Math.random() - 0.5) * CONFIG.driftRange[0];
          dot.driftVY += (Math.random() - 0.5) * CONFIG.driftRange[0];

          // Clamp drift velocities
          dot.driftVX = Math.max(-CONFIG.driftRange[1], Math.min(CONFIG.driftRange[1], dot.driftVX));
          dot.driftVY = Math.max(-CONFIG.driftRange[1], Math.min(CONFIG.driftRange[1], dot.driftVY));
        }

        // Update color phase
        dot.colorPhase += dot.colorSpeed * dot.colorDirection;
        if (dot.colorPhase >= 1 || dot.colorPhase <= 0) {
          dot.colorDirection *= -1;
          dot.colorPhase = Math.max(0, Math.min(dot.colorPhase, 1));
        }

        // Draw the dot
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        ctx.fillStyle = interpolateColor(CONFIG.primary, CONFIG.secondary, dot.colorPhase);
        ctx.fill();
      }

      requestAnimationFrame(animate);
    };

    // Start animation
    animate();

    // Event listeners
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} />;
};

export default TwinklingDots;
