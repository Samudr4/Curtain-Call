import React, { useEffect, useCallback } from 'react';
import type { LaunchState, LaunchSettings } from '../../types';
import { VelvetCurtain } from '../VelvetCurtain/VelvetCurtain';
import { RevealInstructions } from '../RevealInstructions/RevealInstructions';
import { ConfettiCelebration } from '../ConfettiCelebration/ConfettiCelebration';
import { LaserLightShow } from '../LaserLightShow/LaserLightShow';
import './CurtainStage.css';

interface CurtainStageProps {
  state: LaunchState;
  settings: LaunchSettings;
  onReveal: () => void;
}

export const CurtainStage: React.FC<CurtainStageProps> = ({ state, settings, onReveal }) => {
  const isClosed     = state === 'curtainClosed';
  // Curtains begin sliding on click and stay open through the rest of the flow
  const isOpen       = state !== 'idle' && state !== 'curtainClosed';
  // Party poppers blast at halfway mark ('bursting') only if enabled
  const showConfetti = settings.popperEnabled && (state === 'bursting' || state === 'celebrating' || state === 'transitioning' || state === 'redirecting');
  // Laser light show active only if enabled
  const isLaserActive = settings.lightShowEnabled && isOpen;
  const isFadingOut  = state === 'transitioning' || state === 'redirecting';
  const isLaserPeak  = state === 'bursting' || state === 'celebrating';

  const handleTrigger = useCallback(() => {
    if (isClosed) onReveal();
  }, [isClosed, onReveal]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.code === 'Space' || e.code === 'Enter') && isClosed) {
        e.preventDefault();
        onReveal();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isClosed, onReveal]);

  return (
    <div
      className={`curtain-stage ${!isClosed ? 'stage-bursting' : ''} ${isFadingOut ? 'stage-fade-out' : ''}`}
      onClick={handleTrigger}
      onTouchEnd={handleTrigger}
      tabIndex={isClosed ? 0 : -1}
      role="region"
      aria-label="Curtain reveal stage"
    >
      {/* Atmospheric stage lights */}
      <div className="stage-lights" aria-hidden="true">
        <div className="stage-light stage-light--left" />
        <div className="stage-light stage-light--right" />
        <div className="stage-light stage-light--top" />
      </div>

      {/* Dramatic concert laser light show — emerges as curtains part */}
      <LaserLightShow
        active={isLaserActive}
        isFadingOut={isFadingOut}
        peakBoost={isLaserPeak}
        intensity={settings.lightShowIntensity}
      />

      {/* The velvet curtains — slide completely offscreen */}
      <VelvetCurtain side="left"  isOpen={isOpen} />
      <VelvetCurtain side="right" isOpen={isOpen} />

      {/* Instructions — visible only when curtains are closed */}
      {isClosed && <RevealInstructions />}

      {/* Confetti party poppers — canvas stays mounted; fires halfway on 'bursting' */}
      <ConfettiCelebration
        active={showConfetti}
        intensity={settings.popperIntensity}
      />

      {/* Smooth black fade-out overlay before redirect */}
      <div className={`transition-overlay ${isFadingOut ? 'transition-overlay--visible' : ''}`} />
    </div>
  );
};
