import React from 'react';
import { createRoot } from 'react-dom/client';
import { initStrudel, samples } from '@strudel/web';
import App from './App.jsx';
import './styles/index.css';

// Audio initialization state (module-level)
let initialized = false;

/**
 * Initialize Strudel audio engine with drum machine samples.
 * MUST be called from user gesture (click/tap) due to browser autoplay policy.
 * @returns {Promise<boolean>} - true if initialized successfully
 */
export async function initAudio() {
  if (initialized) {
    console.log('Strudel already initialized');
    return true;
  }

  try {
    console.log('Initializing Strudel...');

    await initStrudel({
      prebake: async () => {
        console.log('Loading drum machine samples...');
        await samples('https://raw.githubusercontent.com/felixroos/dough-samples/main/tidal-drum-machines.json');
        console.log('Samples loaded successfully');
      }
    });

    initialized = true;
    console.log('Strudel initialized successfully');
    return true;
  } catch (error) {
    console.error('Failed to initialize Strudel:', error);
    throw error;
  }
}

// Register iOS touch activation for :active pseudo-class
document.body.addEventListener('touchstart', () => {}, { passive: true });

// Render React app
const root = createRoot(document.getElementById('root'));
root.render(<App />);
