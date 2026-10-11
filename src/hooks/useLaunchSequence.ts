import { useState, useCallback, useRef, useEffect } from 'react';
import type { LaunchSession, LaunchSettings } from '../types';
import { DEFAULT_LAUNCH_SETTINGS } from '../types';

function normalizeUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) throw new Error('Please enter a URL.');
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  const url = new URL(withProtocol);
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new Error('Only http and https URLs are supported.');
  }
  return url.href;
}

export function useLaunchSequence() {
  const [session, setSession] = useState<LaunchSession>({
    destinationUrl: '',
    state: 'idle',
    hasRevealed: false,
    error: null,
    settings: DEFAULT_LAUNCH_SETTINGS,
  });

  const revealedRef = useRef(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  useEffect(() => {
    return () => clearTimers();
  }, []);

  const after = (ms: number, fn: () => void) => {
    const t = setTimeout(fn, ms);
    timersRef.current.push(t);
  };

  const prepare = useCallback((rawUrl: string, customSettings?: LaunchSettings) => {
    try {
      const validated = normalizeUrl(rawUrl);
      setSession({
        destinationUrl: validated,
        state: 'curtainClosed',
        hasRevealed: false,
        error: null,
        settings: customSettings || DEFAULT_LAUNCH_SETTINGS,
      });
      revealedRef.current = false;
    } catch (err) {
      setSession(prev => ({
        ...prev,
        state: 'idle',
        error: err instanceof Error ? err.message : 'Invalid URL.',
      }));
    }
  }, []);

  const reveal = useCallback(() => {
    if (revealedRef.current) return;
    revealedRef.current = true;
    clearTimers();

    // T=0: User clicks — curtains immediately start sliding to the sides
    setSession(prev => ({ ...prev, state: 'revealing', hasRevealed: true }));

    // T=900ms: Halfway through the 1.8s curtain slide — party poppers blast across 70% screen
    after(900, () => {
      setSession(prev => ({ ...prev, state: 'bursting' }));
    });

    // T=1800ms: Curtains have slid completely offscreen; celebration continues
    after(1800, () => {
      setSession(prev => ({ ...prev, state: 'celebrating' }));
    });

    // T=3400ms: Fade overlay begins transitioning to black
    after(3400, () => {
      setSession(prev => ({ ...prev, state: 'transitioning' }));
    });

    // T=4200ms: Direct redirect to destination website
    after(4200, () => {
      setSession(prev => ({ ...prev, state: 'redirecting' }));
    });
  }, []);

  const reset = useCallback(() => {
    clearTimers();
    revealedRef.current = false;
    setSession({
      destinationUrl: '',
      state: 'idle',
      hasRevealed: false,
      error: null,
      settings: DEFAULT_LAUNCH_SETTINGS,
    });
  }, []);

  const clearError = useCallback(() => {
    setSession(prev => ({ ...prev, error: null }));
  }, []);

  return { session, prepare, reveal, reset, clearError };
}
