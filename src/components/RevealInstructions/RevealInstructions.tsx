import React from 'react';
import './RevealInstructions.css';

export const RevealInstructions: React.FC = () => {
  return (
    <div className="reveal-instructions" aria-live="polite">
      <div className="instructions-inner">
        <div className="instructions-badge">
          <span className="badge-text">THE MOMENT IS YOURS</span>
        </div>

        <h2 className="instructions-headline">Ready for the Reveal?</h2>

        <div className="instructions-cue">
          <div className="cue-icon">
            <div className="cue-pulse" />
            <div className="cue-dot" />
          </div>
          <p className="cue-text">
            Click anywhere &nbsp;·&nbsp; Touch &nbsp;·&nbsp; Press&nbsp;
            <kbd className="key-badge">Space</kbd>
          </p>
        </div>
      </div>
    </div>
  );
};
