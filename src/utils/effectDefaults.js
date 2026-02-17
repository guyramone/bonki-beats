/**
 * effectDefaults.js -- Constants for every effect parameter
 *
 * Default values, ranges, labels, and named options for all Strudel effects.
 * Used by the effects rack UI (knobs, sliders, selectors) and the code generator.
 *
 * Exports: EFFECT_DEFAULTS, EFFECT_RANGES, DISTORTION_TYPES, FILTER_TYPES, DELAY_DIVISIONS
 */

// --- Default values for each effect parameter (matching createRow defaults) ---

export const EFFECT_DEFAULTS = {
  cutoff: 2000,
  resonance: 1,
  filterType: 'lowpass',
  lpattack: 0,
  lpdecay: 0.14,
  lpsustain: 0,
  lprelease: 0.1,
  lpenv: 1,
  lprate: null,
  lpdepth: null,
  hcutoff: 200,
  hresonance: 1,
  delay: 0,
  delaytime: 0.25,
  delayfeedback: 0.5,
  delaysync: true,
  room: 0,
  roomsize: 2,
  ir: null,
  distort: 0,
  distorttype: 0,
  crush: null,
  coarse: null,
  pan: 0.5,
  volume: 0.8,
  speed: 1,
  degradeBy: 0,
  swing: 0,
};

// --- Ranges for each parameter: min, max, step, unit, logScale ---

export const EFFECT_RANGES = {
  cutoff: { min: 20, max: 20000, step: 1, unit: 'Hz', logScale: true },
  resonance: { min: 0, max: 40, step: 0.1, unit: '', logScale: false },
  lpattack: { min: 0, max: 2, step: 0.01, unit: 's', logScale: false },
  lpdecay: { min: 0, max: 2, step: 0.01, unit: 's', logScale: false },
  lpsustain: { min: 0, max: 1, step: 0.01, unit: '', logScale: false },
  lprelease: { min: 0, max: 2, step: 0.01, unit: 's', logScale: false },
  lpenv: { min: -1, max: 1, step: 0.01, unit: '', logScale: false },
  lprate: { min: 0.1, max: 20, step: 0.1, unit: 'Hz', logScale: true },
  lpdepth: { min: 0, max: 1, step: 0.01, unit: '', logScale: false },
  hcutoff: { min: 20, max: 20000, step: 1, unit: 'Hz', logScale: true },
  hresonance: { min: 0, max: 40, step: 0.1, unit: '', logScale: false },
  delay: { min: 0, max: 1, step: 0.01, unit: '', logScale: false },
  delaytime: { min: 0.01, max: 1, step: 0.01, unit: 's', logScale: false },
  delayfeedback: { min: 0, max: 0.95, step: 0.01, unit: '', logScale: false },
  room: { min: 0, max: 1, step: 0.01, unit: '', logScale: false },
  roomsize: { min: 0.5, max: 10, step: 0.1, unit: '', logScale: false },
  distort: { min: 0, max: 10, step: 0.1, unit: '', logScale: false },
  crush: { min: 1, max: 16, step: 1, unit: 'bit', logScale: false },
  coarse: { min: 1, max: 32, step: 1, unit: 'x', logScale: false },
  pan: { min: 0, max: 1, step: 0.01, unit: '', logScale: false },
  volume: { min: 0, max: 1, step: 0.01, unit: '', logScale: false },
  speed: { min: 0.25, max: 4, step: 0.25, unit: 'x', logScale: false },
  degradeBy: { min: 0, max: 1, step: 0.01, unit: '', logScale: false },
  swing: { min: 0, max: 1, step: 0.01, unit: '', logScale: false },
};

// --- Distortion algorithm types (index = distorttype value) ---

export const DISTORTION_TYPES = [
  'S-Curve',
  'Soft Clip',
  'Hard Clip',
  'Cubic',
  'Diode',
  'Asymmetric',
  'Wavefold',
  'Sinefold',
  'Chebyshev',
];

// --- Filter types ---

export const FILTER_TYPES = ['lowpass', 'highpass', 'bandpass'];

// --- Delay time divisions (tempo-synced) ---

export const DELAY_DIVISIONS = [
  { label: '1/4', value: 0.25 },
  { label: '1/8', value: 0.125 },
  { label: '1/16', value: 0.0625 },
  { label: '1/4 dot', value: 0.375 },
  { label: '1/8 dot', value: 0.1875 },
];
