import React from 'react';
import { createRoot } from 'react-dom/client';
import { initStrudel, samples, getAudioContext as strudelGetAudioContext, getSuperdoughAudioController } from '@strudel/web';
import App from './App.jsx';
import './styles/index.css';
import './styles/knobs.css';
import './styles/scale-picker.css';
import './styles/effects-rack.css';
import './styles/sound-browser.css';
import './styles/master-strip.css';

// Audio initialization state (module-level)
let initialized = false;
let strudelRepl = null;
let analyserNode = null;

/**
 * Initialize Strudel audio engine with drum machine samples.
 * MUST be called from user gesture (click/tap) due to browser autoplay policy.
 * Stores the repl reference for scheduler access (audio-accurate beat tracking).
 * Sets up an AnalyserNode tap for real-time audio visualization.
 * @returns {Promise<boolean>} - true if initialized successfully
 */
export async function initAudio() {
  if (initialized) {
    console.log('Strudel already initialized');
    return true;
  }

  try {
    console.log('Initializing Strudel...');

    strudelRepl = await initStrudel({
      prebake: async () => {
        console.log('Loading drum machine samples...');
        await samples('https://raw.githubusercontent.com/felixroos/dough-samples/main/tidal-drum-machines.json');
        console.log('Samples loaded successfully');
      }
    });

    initialized = true;

    // Register soundfont playback (fonts load lazily from CDN on first use)
    try {
      const { registerSoundfonts } = await import('@strudel/soundfonts');
      await registerSoundfonts();
      console.log('Soundfonts registered');
    } catch (err) {
      console.warn('Soundfont registration failed (non-fatal):', err.message);
    }

    // Tap superdough's master gain for visualization (non-destructive — no destination override).
    // The audio chain: Orbits → channelMerger → destinationGain → audioContext.destination.
    // We connect our AnalyserNode as a parallel output from destinationGain.
    try {
      const audioCtx = strudelGetAudioContext();
      const controller = getSuperdoughAudioController();
      const masterGain = controller?.output?.destinationGain;
      if (audioCtx && masterGain) {
        analyserNode = audioCtx.createAnalyser();
        analyserNode.fftSize = 512;
        analyserNode.smoothingTimeConstant = 0.8;
        masterGain.connect(analyserNode);
        console.log('AnalyserNode tapped into superdough master gain (non-destructive)');
      }
    } catch (analyserErr) {
      console.warn('Visualizer analyser setup failed (non-fatal):', analyserErr.message);
    }
    console.log('Strudel initialized successfully');
    return true;
  } catch (error) {
    console.error('Failed to initialize Strudel:', error);
    throw error;
  }
}

/**
 * Get the Strudel scheduler for audio-accurate timing.
 * Returns null if audio not initialized yet.
 */
export function getScheduler() {
  return strudelRepl?.scheduler || null;
}

/**
 * Get the Web Audio AudioContext (from superdough — the real one Strudel uses).
 * Returns null if audio not initialized yet.
 */
export function getAudioContext() {
  try {
    return strudelGetAudioContext() || null;
  } catch {
    return null;
  }
}

/**
 * Get the AnalyserNode for real-time audio visualization.
 * Returns null if audio not initialized yet.
 */
export function getAnalyser() {
  return analyserNode;
}

// Register iOS touch activation for :active pseudo-class
document.body.addEventListener('touchstart', () => {}, { passive: true });

// Render React app
const root = createRoot(document.getElementById('root'));
root.render(<App />);
