import React, { useState, useRef } from 'react';
import type { LaunchSettings, PopperIntensity, LightShowIntensity } from '../../types';
import './LaunchForm.css';

interface LaunchFormProps {
  onSubmit: (url: string, settings: LaunchSettings) => void;
  error: string | null;
  onClearError: () => void;
}

export const LaunchForm: React.FC<LaunchFormProps> = ({ onSubmit, error, onClearError }) => {
  const [url, setUrl] = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Theatrical effects configuration
  const [popperEnabled, setPopperEnabled] = useState(true);
  const [popperIntensity, setPopperIntensity] = useState<PopperIntensity>('standard');

  const [lightShowEnabled, setLightShowEnabled] = useState(true);
  const [lightShowIntensity, setLightShowIntensity] = useState<LightShowIntensity>('concert');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(url, {
      popperEnabled,
      popperIntensity,
      lightShowEnabled,
      lightShowIntensity,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    if (error) onClearError();
  };

  return (
    <div className="launch-form-wrapper">
      <div className="brand-mark">
        <span className="brand-icon">🎭</span>
        <span className="brand-name">CurtainCall</span>
      </div>

      <div className="headline-block">
        <h1 className="headline">Every great website deserves a grand opening.</h1>
        <p className="subheadline">
          Enter your URL and let the curtain rise.
        </p>
      </div>

      <form className="url-form" onSubmit={handleSubmit} noValidate>
        <div className={`input-group ${focused ? 'focused' : ''} ${error ? 'has-error' : ''}`}>
          <div className="input-prefix">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
          </div>
          <input
            ref={inputRef}
            id="url-input"
            type="url"
            className="url-input"
            placeholder="https://yourwebsite.com"
            value={url}
            onChange={handleChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            autoComplete="url"
            spellCheck={false}
          />
        </div>

        {error && (
          <div className="error-message" role="alert">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </div>
        )}

        {/* ─── Theatrical Effects Customization Card ─── */}
        <div className="effects-card" role="region" aria-label="Theatrical Effects Settings">
          <div className="effects-card-header">
            <div className="effects-card-title-group">
              <span className="effects-card-icon">🎛️</span>
              <div>
                <h2 className="effects-card-title">Stage Effects</h2>
                <p className="effects-card-subtitle">Fine-tune party popper and theatrical stage lighting</p>
              </div>
            </div>
          </div>

          <div className="effects-list">
            {/* ── Effect 1: Party Popper ── */}
            <div className={`effect-item ${popperEnabled ? 'is-enabled' : 'is-disabled'}`}>
              <div className="effect-header">
                <div className="effect-info">
                  <span className="effect-glyph">🎉</span>
                  <div>
                    <span className="effect-name">Party Popper</span>
                    <span className="effect-badge">{popperEnabled ? 'Active' : 'Off'}</span>
                  </div>
                </div>

                {/* Luxury Switch */}
                <button
                  type="button"
                  role="switch"
                  aria-checked={popperEnabled}
                  aria-label="Toggle Party Popper"
                  className={`toggle-switch ${popperEnabled ? 'toggle-on' : ''}`}
                  onClick={() => setPopperEnabled(prev => !prev)}
                >
                  <span className="toggle-thumb" />
                </button>
              </div>

              {/* Intensity Segmented Controls */}
              <div className="effect-controls">
                <span className="control-label">Confetti Density:</span>
                <div className="segmented-group">
                  <button
                    type="button"
                    className={`seg-btn ${popperIntensity === 'subtle' ? 'seg-active' : ''}`}
                    onClick={() => setPopperIntensity('subtle')}
                    disabled={!popperEnabled}
                  >
                    Subtle
                  </button>
                  <button
                    type="button"
                    className={`seg-btn ${popperIntensity === 'standard' ? 'seg-active' : ''}`}
                    onClick={() => setPopperIntensity('standard')}
                    disabled={!popperEnabled}
                  >
                    Balanced
                  </button>
                  <button
                    type="button"
                    className={`seg-btn ${popperIntensity === 'grand' ? 'seg-active' : ''}`}
                    onClick={() => setPopperIntensity('grand')}
                    disabled={!popperEnabled}
                  >
                    Grand
                  </button>
                </div>
              </div>
              <p className="effect-hint">
                {popperIntensity === 'subtle' && '🎈 Gentle Flutter · 350 soft celebratory flakes'}
                {popperIntensity === 'standard' && '🎉 Balanced Spread · Multi-cannon blast across 70% screen'}
                {popperIntensity === 'grand' && '💥 Grand Celebration · 1,000+ dense flakes, stars & ribbons'}
              </p>
            </div>

            <div className="effects-divider" />

            {/* ── Effect 2: Theatrical Stage Lighting ── */}
            <div className={`effect-item ${lightShowEnabled ? 'is-enabled' : 'is-disabled'}`}>
              <div className="effect-header">
                <div className="effect-info">
                  <span className="effect-glyph">💡</span>
                  <div>
                    <span className="effect-name">Theatrical Lighting</span>
                    <span className="effect-badge effect-badge--gold">{lightShowEnabled ? 'Active' : 'Off'}</span>
                  </div>
                </div>

                {/* Luxury Switch */}
                <button
                  type="button"
                  role="switch"
                  aria-checked={lightShowEnabled}
                  aria-label="Toggle Theatrical Lighting"
                  className={`toggle-switch toggle-switch--gold ${lightShowEnabled ? 'toggle-on' : ''}`}
                  onClick={() => setLightShowEnabled(prev => !prev)}
                >
                  <span className="toggle-thumb" />
                </button>
              </div>

              {/* Intensity Segmented Controls */}
              <div className="effect-controls">
                <span className="control-label">Spotlight Profile:</span>
                <div className="segmented-group">
                  <button
                    type="button"
                    className={`seg-btn ${lightShowIntensity === 'ambient' ? 'seg-active' : ''}`}
                    onClick={() => setLightShowIntensity('ambient')}
                    disabled={!lightShowEnabled}
                  >
                    Warm Glow
                  </button>
                  <button
                    type="button"
                    className={`seg-btn ${lightShowIntensity === 'concert' ? 'seg-active' : ''}`}
                    onClick={() => setLightShowIntensity('concert')}
                    disabled={!lightShowEnabled}
                  >
                    Grand Stage
                  </button>
                  <button
                    type="button"
                    className={`seg-btn ${lightShowIntensity === 'extreme' ? 'seg-active' : ''}`}
                    onClick={() => setLightShowIntensity('extreme')}
                    disabled={!lightShowEnabled}
                  >
                    Spectacular
                  </button>
                </div>
              </div>
              <p className="effect-hint">
                {lightShowIntensity === 'ambient' && '✨ Golden Broadway Followspot & Warm Candlelight Footlights'}
                {lightShowIntensity === 'concert' && '🎭 Chiaroscuro Cross-Beams (Amber & Midnight Blue) + Cool Pin-Spot'}
                {lightShowIntensity === 'extreme' && '🌟 7 Cathedral God Rays & 4 Moving-Head Profile Sweepers'}
              </p>
            </div>
          </div>
        </div>

        <button
          type="submit"
          id="prepare-launch-btn"
          className="cta-button"
          disabled={!url.trim()}
        >
          <span className="cta-text">Prepare Launch</span>
          <span className="cta-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </span>
        </button>
      </form>

      <div className="form-footer">
        <div className="divider-line"/>
        <p className="footer-note">
          A theatrical reveal experience · No data stored · Opens in same tab
        </p>
      </div>
    </div>
  );
};
