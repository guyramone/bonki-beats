import React from 'react';
import { createRoot } from 'react-dom/client';
import { initStrudel, samples } from '@strudel/web';
import App from './App.jsx';
import './styles/index.css';

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

    // Set up audio analysis tap for Visualizer.
    // Override audioContext.destination with a GainNode that splits the signal
    // to both the real destination and our AnalyserNode. This intercepts all
    // future audio routing transparently.
    const audioCtx = strudelRepl.scheduler.audioContext;
    const realDestination = audioCtx.destination;

    analyserNode = audioCtx.createAnalyser();
    analyserNode.fftSize = 512;
    analyserNode.smoothingTimeConstant = 0.8;

    const masterTap = audioCtx.createGain();
    masterTap.gain.value = 1;
    masterTap.connect(realDestination);
    masterTap.connect(analyserNode);

    Object.defineProperty(audioCtx, 'destination', {
      get: () => masterTap,
      configurable: true,
    });

    initialized = true;
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
 * Get the Web Audio AudioContext for AnalyserNode connections.
 * Returns null if audio not initialized yet.
 */
export function getAudioContext() {
  return strudelRepl?.scheduler?.audioContext || null;
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
