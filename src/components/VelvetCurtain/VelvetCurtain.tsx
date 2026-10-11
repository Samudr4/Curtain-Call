import React from 'react';
import './VelvetCurtain.css';

interface VelvetCurtainProps {
  side: 'left' | 'right';
  isOpen: boolean;
}

// 11 natural, organic pinch-pleat fold widths (%) with cascading depths and velvet pile highlights
const FOLDS = [
  { w: 9.5,  h: 0.10, s: 0.16 },
  { w: 8.5,  h: 0.06, s: 0.22 },
  { w: 10.0, h: 0.12, s: 0.15 },
  { w: 7.5,  h: 0.05, s: 0.26 },
  { w: 11.0, h: 0.14, s: 0.18 },
  { w: 9.0,  h: 0.08, s: 0.21 },
  { w: 10.5, h: 0.11, s: 0.16 },
  { w: 8.0,  h: 0.06, s: 0.24 },
  { w: 9.5,  h: 0.12, s: 0.19 },
  { w: 8.5,  h: 0.07, s: 0.22 },
  { w: 8.0,  h: 0.09, s: 0.18 },
];

const FOLDS_LEFT = FOLDS.reduce<Array<(typeof FOLDS)[number] & { left: number }>>((acc, f) => {
  const left = acc.length === 0 ? 0 : acc[acc.length - 1].left + acc[acc.length - 1].w;
  acc.push({ ...f, left });
  return acc;
}, []);

const FOLDS_RIGHT = [...FOLDS].reverse().reduce<Array<(typeof FOLDS)[number] & { left: number }>>((acc, f) => {
  const left = acc.length === 0 ? 0 : acc[acc.length - 1].left + acc[acc.length - 1].w;
  acc.push({ ...f, left });
  return acc;
}, []);

export const VelvetCurtain: React.FC<VelvetCurtainProps> = ({ side, isOpen }) => {
  const folds = side === 'right' ? FOLDS_RIGHT : FOLDS_LEFT;

  return (
    <div
      className={`vc vc--${side} ${isOpen ? 'vc--open' : ''}`}
      aria-hidden="true"
    >
      {/* ── Full-height fabric (covers everything top to bottom) ── */}
      <div className="vc-fabric">
        <div className="vc-fabric-base" />

        {/* 11 Natural organic velvet drapery folds */}
        {folds.map((f, i) => (
          <div
            key={i}
            className={`vc-fold ${i % 2 === 0 ? 'vc-fold--a' : 'vc-fold--b'}`}
            style={{ left: `${f.left}%`, width: `${f.w}%`, '--h': f.h, '--s': f.s } as React.CSSProperties}
          />
        ))}

        {/* Sheen — diagonal light catching the velvet pile */}
        <div className="vc-sheen" />

        {/* Inner edge shadow toward stage center */}
        <div className={`vc-edge vc-edge--${side}`} />

        {/* Bottom hem floor puddle weight */}
        <div className="vc-hem" />
      </div>

      {/* ── Gold curtain rod (on top of fabric) ── */}
      <div className="vc-rod" aria-hidden="true">
        <div className="vc-rod-tube" />
        <div className="vc-rod-finial vc-rod-finial--a" />
        <div className="vc-rod-finial vc-rod-finial--b" />
      </div>

      {/* ── Valance (decorative top drape, on top of fabric) ── */}
      <div className="vc-valance" aria-hidden="true">
        <div className="vc-valance-body" />
        <div className="vc-valance-fringe">
          {Array.from({ length: 16 }).map((_, i) => (
            <div
              key={i}
              className="vc-fringe"
              style={{ '--fi': i, '--fl': 0.65 + (i % 3) * 0.22 } as React.CSSProperties}
            />
          ))}
        </div>
      </div>

      {/* ── Tassel ── */}
      <div className={`vc-tassel vc-tassel--${side}`} aria-hidden="true">
        <div className="vc-tassel-cord" />
        <div className="vc-tassel-knot" />
        <div className="vc-tassel-head" />
        <div className="vc-tassel-threads">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="vc-tassel-thread"
              style={{
                '--ti': i,
                '--th': `${16 + (i % 4) * 5}px`,
                '--td': `${i % 2 === 0 ? 1.8 : -1.5}deg`,
              } as React.CSSProperties}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
