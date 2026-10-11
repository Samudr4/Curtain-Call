import { useEffect } from 'react';
import { useLaunchSequence } from './hooks/useLaunchSequence';
import { LaunchForm } from './components/LaunchForm/LaunchForm';
import { CurtainStage } from './components/CurtainStage/CurtainStage';
import './App.css';

function App() {
  const { session, prepare, reveal, clearError } = useLaunchSequence();
  const { state, destinationUrl, error, settings } = session;

  const isFormVisible = state === 'idle';
  const isStageVisible =
    state === 'curtainClosed' ||
    state === 'bursting'     ||
    state === 'revealing'    ||
    state === 'celebrating'  ||
    state === 'transitioning'||
    state === 'redirecting';

  // Toggle body lock during curtain stage
  useEffect(() => {
    document.body.classList.toggle('curtain-active', isStageVisible);
    return () => {
      document.body.classList.remove('curtain-active');
    };
  }, [isStageVisible]);

  // Navigate immediately when redirecting state is reached
  useEffect(() => {
    if (state === 'redirecting' && destinationUrl) {
      window.location.href = destinationUrl;
    }
  }, [state, destinationUrl]);

  return (
    <div className="app-root">
      {/* Ambient background always present */}
      <div className="app-bg">
        <div className="bg-orb bg-orb--1" />
        <div className="bg-orb bg-orb--2" />
        <div className="bg-noise" />
      </div>

      {/* Form screen */}
      {isFormVisible && (
        <main className="app-form-screen">
          <LaunchForm
            onSubmit={prepare}
            error={error}
            onClearError={clearError}
          />
        </main>
      )}

      {/* Curtain stage */}
      {isStageVisible && (
        <CurtainStage
          state={state}
          settings={settings}
          onReveal={reveal}
        />
      )}
    </div>
  );
}

export default App;
