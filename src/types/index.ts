export type LaunchState =
  | 'idle'
  | 'preparing'
  | 'curtainClosed'
  | 'revealing'      // click: curtains begin sliding to sides (T=0)
  | 'bursting'       // halfway: party poppers blast across 70% screen (T=900ms)
  | 'celebrating'    // curtains fully offscreen, celebration peak (T=1800ms)
  | 'transitioning'  // smooth fade to black (T=3400ms)
  | 'redirecting';   // direct redirect to website (T=4200ms)

export type PopperIntensity = 'subtle' | 'standard' | 'grand';
export type LightShowIntensity = 'ambient' | 'concert' | 'extreme';

export interface LaunchSettings {
  popperEnabled: boolean;
  popperIntensity: PopperIntensity;
  lightShowEnabled: boolean;
  lightShowIntensity: LightShowIntensity;
}

export const DEFAULT_LAUNCH_SETTINGS: LaunchSettings = {
  popperEnabled: true,
  popperIntensity: 'standard',
  lightShowEnabled: true,
  lightShowIntensity: 'concert',
};

export interface LaunchSession {
  destinationUrl: string;
  state: LaunchState;
  hasRevealed: boolean;
  error: string | null;
  settings: LaunchSettings;
}
