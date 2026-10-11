import React, { useEffect, useRef } from 'react';
import type { LightShowIntensity } from '../../types';
import './LaserLightShow.css';

interface LaserLightShowProps {
  active: boolean;
  isFadingOut?: boolean;
  peakBoost?: boolean;
  intensity?: LightShowIntensity;
}

interface HazeCloud {
  x: number;
  y: number;
  vx: number;
  radius: number;
  baseAlpha: number;
  phase: number;
}

export const LaserLightShow: React.FC<LaserLightShowProps> = ({
  active,
  isFadingOut = false,
  peakBoost = false,
  intensity = 'concert',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const cloudsRef = useRef<HazeCloud[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Initialize atmospheric stage floor haze puffs (rolling dry-ice fog)
    if (cloudsRef.current.length === 0) {
      const puffs: HazeCloud[] = [];
      for (let i = 0; i < 20; i++) {
        puffs.push({
          x: Math.random() * width,
          y: height * 0.74 + Math.random() * (height * 0.24),
          vx: (Math.random() - 0.48) * 14,
          radius: 110 + Math.random() * 110,
          baseAlpha: 0.04 + Math.random() * 0.05,
          phase: Math.random() * Math.PI * 2,
        });
      }
      cloudsRef.current = puffs;
    }

    startTimeRef.current = performance.now();
    let lastTime = performance.now();

    /* ─── Volumetric Theatrical Spotlight Cone Drawing Engine ─── */
    // Source origins are positioned strictly off-screen (overhead catwalks or wings).
    // Zero source bulbs or circles are drawn — only the natural volumetric beam and floor pool!
    const drawVolumetricSpotlight = (
      x0: number, // Offscreen fixture X
      y0: number, // Offscreen fixture Y
      x1: number, // Floor target X
      y1: number, // Floor target Y
      topWidth: number,
      floorWidth: number,
      color: { r: number; g: number; b: number },
      beamIntensity: number,
      hasFloorPool: boolean = true
    ) => {
      const { r, g, b } = color;
      const alpha = Math.min(1, Math.max(0, beamIntensity));
      if (alpha <= 0.005) return;

      const dx = x1 - x0;
      const dy = y1 - y0;
      const len = Math.hypot(dx, dy);
      if (len < 10) return;

      const nx = -dy / len;
      const ny = dx / len;

      // Draw 3 concentric layered passes to achieve true optical Gaussian penumbra (soft edges)
      const passes = [
        { wTop: topWidth * 1.5, wBot: floorWidth * 1.35, alphaMult: 0.06 }, // Outer soft penumbra
        { wTop: topWidth * 1.0, wBot: floorWidth * 0.95, alphaMult: 0.18 }, // Main volumetric body
        { wTop: topWidth * 0.5, wBot: floorWidth * 0.45, alphaMult: 0.35 }, // Intense core beam
      ];

      passes.forEach(pass => {
        const p0x = x0 - nx * pass.wTop * 0.5;
        const p0y = y0 - ny * pass.wTop * 0.5;
        const p1x = x0 + nx * pass.wTop * 0.5;
        const p1y = y0 + ny * pass.wTop * 0.5;
        const p2x = x1 + nx * pass.wBot * 0.5;
        const p2y = y1 + ny * pass.wBot * 0.5;
        const p3x = x1 - nx * pass.wBot * 0.5;
        const p3y = y1 - ny * pass.wBot * 0.5;

        // Volumetric falloff along the beam axis
        const beamGrad = ctx.createLinearGradient(x0, y0, x1, y1);
        beamGrad.addColorStop(0.0, `rgba(${r}, ${g}, ${b}, ${0.7 * pass.alphaMult * alpha})`);
        beamGrad.addColorStop(0.25, `rgba(${r}, ${g}, ${b}, ${0.5 * pass.alphaMult * alpha})`);
        beamGrad.addColorStop(0.75, `rgba(${r}, ${g}, ${b}, ${0.28 * pass.alphaMult * alpha})`);
        beamGrad.addColorStop(1.0, `rgba(${r}, ${g}, ${b}, ${0.05 * pass.alphaMult * alpha})`);

        ctx.beginPath();
        ctx.moveTo(p0x, p0y);
        ctx.lineTo(p1x, p1y);
        ctx.lineTo(p2x, p2y);
        ctx.lineTo(p3x, p3y);
        ctx.closePath();
        ctx.fillStyle = beamGrad;
        ctx.fill();
      });

      // Floor puddle / illuminated stage pool (elliptical perspective)
      if (hasFloorPool) {
        const poolRadiusX = floorWidth * 0.65;
        const poolRadiusY = floorWidth * 0.24;

        const poolGrad = ctx.createRadialGradient(x1, y1, 0, x1, y1, poolRadiusX);
        poolGrad.addColorStop(0.0, `rgba(${r}, ${g}, ${b}, ${0.45 * alpha})`);
        poolGrad.addColorStop(0.4, `rgba(${r}, ${g}, ${b}, ${0.22 * alpha})`);
        poolGrad.addColorStop(1.0, `rgba(${r}, ${g}, ${b}, 0)`);

        ctx.beginPath();
        ctx.ellipse(x1, y1, poolRadiusX, poolRadiusY, 0, 0, Math.PI * 2);
        ctx.fillStyle = poolGrad;
        ctx.fill();

        // Hot center core where light concentrates
        const hotGrad = ctx.createRadialGradient(x1, y1, 0, x1, y1, poolRadiusX * 0.35);
        hotGrad.addColorStop(0.0, `rgba(255, 255, 255, ${0.4 * alpha})`);
        hotGrad.addColorStop(1.0, `rgba(255, 255, 255, 0)`);

        ctx.beginPath();
        ctx.ellipse(x1, y1, poolRadiusX * 0.35, poolRadiusY * 0.35, 0, 0, Math.PI * 2);
        ctx.fillStyle = hotGrad;
        ctx.fill();
      }
    };

    const render = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      const elapsed = (now - startTimeRef.current) / 1000;

      ctx.clearRect(0, 0, width, height);

      if (!active) {
        animFrameRef.current = requestAnimationFrame(render);
        return;
      }

      // Smooth theatrical fade-in over 0.7s
      const rampIn = Math.min(1, elapsed / 0.7);
      const boost = peakBoost ? 1.35 : 1.0;
      const masterIntensity = rampIn * boost;

      // Realistic additive photon blending on stage haze
      ctx.globalCompositeOperation = 'screen';

      /* ════════════════════════════════════════════════════════════════════════
         PRESET 1: 'ambient' — WARM VINTAGE THEATER (GOLDEN BROADWAY SPOTLIGHT)
         • Single Majestic Golden Key Followspot
         • Warm Candlelight Footlights along the stage floor
         • Soft Golden Center Halo
         • ZERO cold blue lights, ZERO god rays — pure intimate golden warmth!
         ════════════════════════════════════════════════════════════════════════ */
      if (intensity === 'ambient') {
        const VINTAGE_GOLD = { r: 255, g: 215, b: 125 };
        const AMBER_CANDLE = { r: 255, g: 175, b: 65 };

        // 1. Warm Candlelight Footlights (washing up from stage floor)
        const footGrad = ctx.createLinearGradient(0, height, 0, height * 0.65);
        footGrad.addColorStop(0.0, `rgba(${AMBER_CANDLE.r}, ${AMBER_CANDLE.g}, ${AMBER_CANDLE.b}, ${0.35 * masterIntensity})`);
        footGrad.addColorStop(0.45, `rgba(${AMBER_CANDLE.r}, ${AMBER_CANDLE.g}, ${AMBER_CANDLE.b}, ${0.14 * masterIntensity})`);
        footGrad.addColorStop(1.0, 'transparent');
        ctx.fillStyle = footGrad;
        ctx.fillRect(0, height * 0.65, width, height * 0.35);

        // 2. Soft Ambient Center Halo behind curtain seam
        const haloGrad = ctx.createRadialGradient(width * 0.5, height * 0.48, 10, width * 0.5, height * 0.48, width * 0.4);
        haloGrad.addColorStop(0.0, `rgba(${VINTAGE_GOLD.r}, ${VINTAGE_GOLD.g}, ${VINTAGE_GOLD.b}, ${0.28 * masterIntensity})`);
        haloGrad.addColorStop(0.5, `rgba(${AMBER_CANDLE.r}, ${AMBER_CANDLE.g}, ${AMBER_CANDLE.b}, ${0.10 * masterIntensity})`);
        haloGrad.addColorStop(1.0, 'transparent');
        ctx.fillStyle = haloGrad;
        ctx.fillRect(0, 0, width, height);

        // 3. Single Grand Center Key Followspot
        const keyTargetX = width * 0.5 + Math.sin(elapsed * 0.35) * 14;
        const keyTargetY = height * 0.82;
        drawVolumetricSpotlight(
          width * 0.5, // Center overhead catwalk (hidden)
          -90,
          keyTargetX,
          keyTargetY,
          26,
          320,
          VINTAGE_GOLD,
          masterIntensity * 1.15,
          true
        );

        // Subtle drifting golden warm smoke
        const clouds = cloudsRef.current;
        clouds.forEach(c => {
          c.x += c.vx * dt * 0.6;
          c.phase += dt * 1.0;
          if (c.x < -c.radius) c.x = width + c.radius;
          if (c.x > width + c.radius) c.x = -c.radius;
          const alpha = c.baseAlpha * (0.8 + 0.2 * Math.sin(c.phase)) * masterIntensity * 0.9;
          const hazeGrad = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.radius);
          hazeGrad.addColorStop(0.0, `rgba(255, 215, 140, ${alpha})`);
          hazeGrad.addColorStop(1.0, 'transparent');
          ctx.beginPath();
          ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
          ctx.fillStyle = hazeGrad;
          ctx.fill();
        });
      }

      /* ════════════════════════════════════════════════════════════════════════
         PRESET 2: 'concert' — MODERN DRAMATIC STAGE (CHIAROSCURO CROSS-WASH)
         • Dual Dramatic Diagonal Cross-Beams intersecting in an "X":
           - Left: Fiery Theatrical Amber-Gold
           - Right: Deep Royal Midnight Steel Blue
         • Overhead Soliloquy Downlight (Cool Moonlight Pin-Spot)
         • Split Two-Tone Atmospheric Stage Fog
         ════════════════════════════════════════════════════════════════════════ */
      else if (intensity === 'concert') {
        const FIERY_AMBER = { r: 255, g: 145, b: 30 };   // High-contrast warm theatrical amber
        const MIDNIGHT_BLUE = { r: 60, g: 145, b: 245 };  // Deep royal theatrical steel blue
        const MOON_PIN    = { r: 215, g: 235, b: 255 };  // Cool soliloquy downlight

        // 1. Left Catwalk Fiery Amber Diagonal Beam (Shooting top-left to stage right)
        const leftTargetX = width * 0.70 + Math.sin(elapsed * 0.45) * 35;
        const leftTargetY = height * 0.88;
        drawVolumetricSpotlight(
          -70, // Off-screen left wing (hidden)
          height * 0.04,
          leftTargetX,
          leftTargetY,
          24,
          250,
          FIERY_AMBER,
          masterIntensity * 1.0,
          true
        );

        // 2. Right Catwalk Royal Midnight Blue Diagonal Beam (Shooting top-right to stage left)
        const rightTargetX = width * 0.30 + Math.cos(elapsed * 0.45) * 35;
        const rightTargetY = height * 0.88;
        drawVolumetricSpotlight(
          width + 70, // Off-screen right wing (hidden)
          height * 0.04,
          rightTargetX,
          rightTargetY,
          24,
          250,
          MIDNIGHT_BLUE,
          masterIntensity * 1.0,
          true
        );

        // 3. Overhead Soliloquy Pin-Spot (Straight down center stage)
        drawVolumetricSpotlight(
          width * 0.5,
          -90,
          width * 0.5,
          height * 0.84,
          16,
          150,
          MOON_PIN,
          masterIntensity * 0.75,
          true
        );

        // Two-tone stage haze (amber on right, blue on left)
        const clouds = cloudsRef.current;
        clouds.forEach(c => {
          c.x += c.vx * dt;
          c.phase += dt * 1.2;
          if (c.x < -c.radius) c.x = width + c.radius;
          if (c.x > width + c.radius) c.x = -c.radius;
          const alpha = c.baseAlpha * masterIntensity * 0.8;
          const isRight = c.x > width * 0.5;
          const col = isRight ? FIERY_AMBER : MIDNIGHT_BLUE;
          const hazeGrad = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.radius);
          hazeGrad.addColorStop(0.0, `rgba(${col.r}, ${col.g}, ${col.b}, ${alpha * 0.8})`);
          hazeGrad.addColorStop(1.0, 'transparent');
          ctx.beginPath();
          ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
          ctx.fillStyle = hazeGrad;
          ctx.fill();
        });
      }

      /* ════════════════════════════════════════════════════════════════════════
         PRESET 3: 'extreme' — SPECTACULAR GALA (7 CATHEDRAL GOD RAYS + MOVING HEADS)
         • 7 Blazing Volumetric Cathedral God Rays fanning across the whole stage
         • 4 Moving-Head Automated Profiles (Amethyst & Electric Azure)
         • Blazing Platinum Center Key Beam with Maximum Lens Radiance
         ════════════════════════════════════════════════════════════════════════ */
      else {
        const PLATINUM_GOLD = { r: 255, g: 252, b: 240 };
        const AMETHYST_BEAM = { r: 215, g: 130, b: 255 };
        const AZURE_BEAM    = { r: 85,  g: 210, b: 255 };
        const CHAMPAGNE     = { r: 255, g: 235, b: 185 };

        // 1. 7 Blazing Cathedral God Rays pouring from upstage
        const rayCount = 7;
        const raySpread = width * 0.85;
        const centerOriginX = width * 0.5;

        for (let i = 0; i < rayCount; i++) {
          const norm = (i / (rayCount - 1)) - 0.5; // -0.5 to 0.5
          const sourceX = centerOriginX + norm * (raySpread * 0.6);
          const sourceY = -85; // High fly loft

          // Fans widely towards floor
          const sway = Math.sin(elapsed * 0.8 + i * 0.7) * 30;
          const targetX = centerOriginX + norm * (width * 0.95) + sway;
          const targetY = height * 0.96;

          const rayAlpha = masterIntensity * (0.65 + 0.2 * Math.sin(elapsed * 1.4 + i));
          drawVolumetricSpotlight(
            sourceX,
            sourceY,
            targetX,
            targetY,
            20,
            180,
            PLATINUM_GOLD,
            rayAlpha,
            false
          );
        }

        // 2. Blazing Center Key Followspot
        drawVolumetricSpotlight(
          width * 0.5,
          -90,
          width * 0.5 + Math.sin(elapsed * 0.4) * 20,
          height * 0.82,
          30,
          320,
          CHAMPAGNE,
          masterIntensity * 1.3,
          true
        );

        // 3. 4 Moving-Head Automated Profile Sweepers (Crisscrossing across stage)
        // Moving Head 1 (Left Amethyst)
        const mh1TargetX = width * 0.42 + Math.sin(elapsed * 0.7) * (width * 0.28);
        drawVolumetricSpotlight(
          width * 0.18,
          -70,
          mh1TargetX,
          height * 0.88,
          20,
          210,
          AMETHYST_BEAM,
          masterIntensity * 0.85,
          true
        );

        // Moving Head 2 (Right Azure)
        const mh2TargetX = width * 0.58 + Math.cos(elapsed * 0.7) * (width * 0.28);
        drawVolumetricSpotlight(
          width * 0.82,
          -70,
          mh2TargetX,
          height * 0.88,
          20,
          210,
          AZURE_BEAM,
          masterIntensity * 0.85,
          true
        );

        // Moving Head 3 & 4 (Inner crossing beams)
        const mh3TargetX = width * 0.65 + Math.sin(elapsed * 0.9 + 1.5) * (width * 0.22);
        drawVolumetricSpotlight(
          width * 0.35,
          -70,
          mh3TargetX,
          height * 0.88,
          18,
          190,
          CHAMPAGNE,
          masterIntensity * 0.75,
          true
        );

        const mh4TargetX = width * 0.35 + Math.cos(elapsed * 0.9 + 1.5) * (width * 0.22);
        drawVolumetricSpotlight(
          width * 0.65,
          -70,
          mh4TargetX,
          height * 0.88,
          18,
          190,
          AMETHYST_BEAM,
          masterIntensity * 0.75,
          true
        );

        // Rolling dense stage fog
        const clouds = cloudsRef.current;
        clouds.forEach(c => {
          c.x += c.vx * dt * 1.2;
          c.phase += dt * 1.5;
          if (c.x < -c.radius) c.x = width + c.radius;
          if (c.x > width + c.radius) c.x = -c.radius;
          const alpha = c.baseAlpha * masterIntensity * 1.1;
          const hazeGrad = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.radius);
          hazeGrad.addColorStop(0.0, `rgba(255, 250, 240, ${alpha})`);
          hazeGrad.addColorStop(0.5, `rgba(240, 225, 255, ${alpha * 0.5})`);
          hazeGrad.addColorStop(1.0, 'transparent');
          ctx.beginPath();
          ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
          ctx.fillStyle = hazeGrad;
          ctx.fill();
        });
      }

      // Restore normal blending
      ctx.globalCompositeOperation = 'source-over';

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [active, peakBoost, intensity]);

  return (
    <div
      className={`laser-light-show ${active ? 'laser-light-show--active' : ''} ${
        isFadingOut ? 'laser-light-show--fade-out' : ''
      }`}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="laser-canvas" />
    </div>
  );
};
