import React, { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import type { PopperIntensity } from '../../types';
import './ConfettiCelebration.css';

interface ConfettiCelebrationProps {
  active: boolean;
  intensity?: PopperIntensity;
}

// Luxurious, vibrant party-popper palette: metallic golds, celebratory crimsons,
// platinum silvers, and dazzling jewel-tone confetti streamers.
const POPPER_COLORS = {
  gold: ['#ffd700', '#ffdf00', '#f5c518', '#e5a910', '#d4af37', '#f1c40f'],
  red: ['#ff4757', '#e74c3c', '#c0392b', '#ff6b81', '#ee5253'],
  silver: ['#ffffff', '#f1f2f6', '#dfe4ea', '#ced6e0'],
  jewel: ['#9b59b6', '#3498db', '#1abc9c', '#ff9f43', '#e056fd', '#00d2d3'],
};

const ALL_COLORS = [
  ...POPPER_COLORS.gold,
  ...POPPER_COLORS.red,
  ...POPPER_COLORS.silver,
  ...POPPER_COLORS.jewel,
];

export const ConfettiCelebration: React.FC<ConfettiCelebrationProps> = ({
  active,
  intensity = 'standard',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const confettiInstanceRef = useRef<confetti.CreateTypes | null>(null);
  const firedRef = useRef(false);
  const timersRef = useRef<number[]>([]);

  const clearTimers = () => {
    timersRef.current.forEach(t => clearTimeout(t));
    timersRef.current = [];
  };

  useEffect(() => {
    if (!active) {
      firedRef.current = false;
      clearTimers();
      confettiInstanceRef.current?.reset();
      return;
    }

    if (firedRef.current) return;
    firedRef.current = true;

    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!confettiInstanceRef.current) {
      confettiInstanceRef.current = confetti.create(canvas, {
        resize: true,
        useWorker: true,
      });
    }

    const fire = confettiInstanceRef.current;

    const schedule = (ms: number, fn: () => void) => {
      const id = window.setTimeout(fn, ms);
      timersRef.current.push(id);
    };

    // Intensity scaling factor
    const scale = intensity === 'subtle' ? 0.5 : intensity === 'grand' ? 1.4 : 1.0;
    const count = (base: number) => Math.max(10, Math.round(base * scale));

    /* ════════════════════════════════════════════════════════════════════════
       PARTY POPPER BLAST: EVEN SPREAD ACROSS 70% OF THE SCREEN
       Central 70% width: x = 0.15 to x = 0.85
       Central 70% height: y = 0.15 to y = 0.85
       ════════════════════════════════════════════════════════════════════════ */

    /* ─── Wave 1 (T=0): 5 Coordinated Party Popper Cannons across the 70% width ─── */
    // Left boundary cannon (x: 0.18) shooting inward/upward
    fire({
      particleCount: count(75),
      angle: 65,
      spread: 60,
      origin: { x: 0.18, y: 0.75 },
      colors: ALL_COLORS,
      startVelocity: 55,
      gravity: 0.5,
      scalar: 1.15,
      ticks: 400,
      shapes: ['square', 'circle', 'star'],
    });

    // Left-mid cannon (x: 0.34)
    fire({
      particleCount: count(85),
      angle: 78,
      spread: 65,
      origin: { x: 0.34, y: 0.78 },
      colors: ALL_COLORS,
      startVelocity: 60,
      gravity: 0.48,
      scalar: 1.1,
      ticks: 420,
      shapes: ['square', 'circle'],
    });

    // Dead-center cannon (x: 0.50)
    fire({
      particleCount: count(110),
      angle: 90,
      spread: 85,
      origin: { x: 0.50, y: 0.80 },
      colors: [...POPPER_COLORS.gold, ...POPPER_COLORS.red, ...POPPER_COLORS.silver],
      startVelocity: 65,
      gravity: 0.46,
      scalar: 1.25,
      ticks: 450,
      shapes: ['square', 'circle', 'star'],
    });

    // Right-mid cannon (x: 0.66)
    fire({
      particleCount: count(85),
      angle: 102,
      spread: 65,
      origin: { x: 0.66, y: 0.78 },
      colors: ALL_COLORS,
      startVelocity: 60,
      gravity: 0.48,
      scalar: 1.1,
      ticks: 420,
      shapes: ['square', 'circle'],
    });

    // Right boundary cannon (x: 0.82) shooting inward/upward
    fire({
      particleCount: count(75),
      angle: 115,
      spread: 60,
      origin: { x: 0.82, y: 0.75 },
      colors: ALL_COLORS,
      startVelocity: 55,
      gravity: 0.5,
      scalar: 1.15,
      ticks: 400,
      shapes: ['square', 'circle', 'star'],
    });

    /* ─── Wave 2 (+100ms): 5-Point Mid-Air Radial Pop across the 70% region ─── */
    schedule(100, () => {
      const midPoints = [0.20, 0.35, 0.50, 0.65, 0.80];
      midPoints.forEach((xPos, idx) => {
        fire({
          particleCount: count(38),
          angle: 90,
          spread: 360,
          origin: { x: xPos, y: 0.48 },
          colors: ALL_COLORS,
          startVelocity: 30 + (idx % 2) * 5,
          gravity: 0.42,
          scalar: 0.95,
          ticks: 380,
          shapes: ['circle', 'square', 'star'],
        });
      });
    });

    /* ─── Wave 3 (+240ms): High-Altitude Golden Star & Foil Rain ─── */
    schedule(240, () => {
      [0.25, 0.50, 0.75].forEach(xPos => {
        fire({
          particleCount: count(45),
          angle: 90,
          spread: 120,
          origin: { x: xPos, y: 0.28 },
          colors: [...POPPER_COLORS.gold, ...POPPER_COLORS.silver],
          startVelocity: 22,
          gravity: 0.35,
          scalar: 1.3,
          ticks: 550,
          shapes: ['star', 'circle'],
        });
      });
    });

    /* ─── Wave 4 (+400ms): Secondary Streamer Flutter ─── */
    schedule(400, () => {
      [0.22, 0.40, 0.60, 0.78].forEach((xPos, i) => {
        fire({
          particleCount: count(32),
          angle: i < 2 ? 80 : 100,
          spread: 75,
          origin: { x: xPos, y: 0.65 },
          colors: ALL_COLORS,
          startVelocity: 42,
          gravity: 0.48,
          scalar: 1.05,
          drift: (i % 2 === 0 ? 0.3 : -0.3),
          ticks: 360,
          shapes: ['square', 'circle'],
        });
      });
    });

    return () => {
      clearTimers();
      confettiInstanceRef.current?.reset();
    };
  }, [active, intensity]);

  return (
    <canvas
      ref={canvasRef}
      className="confetti-canvas"
      aria-hidden="true"
    />
  );
};
