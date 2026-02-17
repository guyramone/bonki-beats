/**
 * rowModel.js -- Declarative row model for Phase 3 sequencer
 *
 * Each sequencer row is a data object containing: sound source, effects chain,
 * pattern parameters, transforms, and volume. This is the single source of truth
 * for all sequencer state. The code generator reads this model to produce Strudel code.
 *
 * Exports: createRow, DEFAULT_ROWS, SECTIONS, ROW_COLORS, getRowsBySection
 */

let rowIdCounter = 0;

/**
 * Factory function: create a row model object with sensible defaults.
 * Pass overrides to customize any field.
 *
 * @param {Object} overrides - Partial row model to merge with defaults
 * @returns {Object} Complete row model object
 */
export function createRow(overrides = {}) {
  const id = overrides.id || `row-${rowIdCounter++}`;

  const defaults = {
    id,
    sound: { type: 'sample', bank: 'RolandTR808', name: 'bd', n: 0 },
    pattern: {
      steps: Array(16).fill(false),
      euclid: null, // { pulses, steps, rotation }
    },
    effects: {
      cutoff: { value: 2000, active: false },
      resonance: { value: 1, active: false },
      filterType: 'lowpass',
      lpattack: 0,
      lpdecay: 0.14,
      lpsustain: 0,
      lprelease: 0.1,
      lpenv: 1,
      lprate: null,
      lpdepth: null,
      hcutoff: { value: 200, active: false },
      hresonance: { value: 1, active: false },
      delay: { value: 0, active: false },
      delaytime: 0.25,
      delayfeedback: 0.5,
      delaysync: true,
      room: { value: 0, active: false },
      roomsize: 2,
      ir: null,
      distort: { value: 0, active: false },
      distorttype: 0,
      crush: null,
      coarse: null,
      pan: 0.5,
    },
    transforms: {
      swing: null,
      degradeBy: null,
      speed: 1,
      reverse: false,
    },
    volume: 0.8,
    muted: false,
    note: null,
    octave: 3,
    sectionId: 'drums',
  };

  // Deep merge overrides -- handle nested objects
  const row = { ...defaults };
  if (overrides.sound) row.sound = { ...defaults.sound, ...overrides.sound };
  if (overrides.pattern) {
    row.pattern = {
      ...defaults.pattern,
      ...overrides.pattern,
      steps: overrides.pattern.steps || [...defaults.pattern.steps],
    };
  }
  if (overrides.effects) row.effects = { ...defaults.effects, ...overrides.effects };
  if (overrides.transforms) row.transforms = { ...defaults.transforms, ...overrides.transforms };
  if (overrides.volume !== undefined) row.volume = overrides.volume;
  if (overrides.muted !== undefined) row.muted = overrides.muted;
  if (overrides.note !== undefined) row.note = overrides.note;
  if (overrides.octave !== undefined) row.octave = overrides.octave;
  if (overrides.sectionId !== undefined) row.sectionId = overrides.sectionId;
  if (overrides.id !== undefined) row.id = overrides.id;

  return row;
}

// --- Collapsible instrument sections ---

export const SECTIONS = [
  { id: 'drums', name: 'Drums', collapsed: false },
  { id: 'perc', name: 'Percussion', collapsed: true },
  { id: 'bass', name: 'Bass', collapsed: true },
  { id: 'synth', name: 'Synths', collapsed: true },
  { id: 'melodic', name: 'Melodic', collapsed: true },
];

// --- Default 16 rows ---

export const DEFAULT_ROWS = [
  // Drums (rows 0-5)
  createRow({ id: 'row-0', sound: { type: 'sample', bank: 'RolandTR808', name: 'bd', n: 0 }, sectionId: 'drums' }),
  createRow({ id: 'row-1', sound: { type: 'sample', bank: 'RolandTR909', name: 'sd', n: 0 }, sectionId: 'drums' }),
  createRow({ id: 'row-2', sound: { type: 'sample', bank: 'RolandTR808', name: 'hh', n: 0 }, sectionId: 'drums' }),
  createRow({ id: 'row-3', sound: { type: 'sample', bank: 'RolandTR808', name: 'oh', n: 0 }, sectionId: 'drums' }),
  createRow({ id: 'row-4', sound: { type: 'sample', bank: 'RolandTR808', name: 'cp', n: 0 }, sectionId: 'drums' }),
  createRow({ id: 'row-5', sound: { type: 'sample', bank: 'RolandTR808', name: 'rd', n: 0 }, sectionId: 'drums' }),

  // Percussion (rows 6-9)
  createRow({ id: 'row-6', sound: { type: 'sample', bank: 'RolandTR808', name: 'ht', n: 0 }, sectionId: 'perc' }),
  createRow({ id: 'row-7', sound: { type: 'sample', bank: 'RolandTR808', name: 'cb', n: 0 }, sectionId: 'perc' }),
  createRow({ id: 'row-8', sound: { type: 'sample', bank: 'RolandTR909', name: 'rim', n: 0 }, sectionId: 'perc' }),
  createRow({ id: 'row-9', sound: { type: 'sample', bank: 'RolandTR808', name: 'hh', n: 1 }, sectionId: 'perc' }),

  // Bass (rows 10-11)
  createRow({ id: 'row-10', sound: { type: 'synth', bank: 'sawtooth', name: 'Bass 1', n: 0 }, note: 'c2', octave: 2, sectionId: 'bass' }),
  createRow({ id: 'row-11', sound: { type: 'synth', bank: 'sawtooth', name: 'Bass 2', n: 0 }, note: 'c2', octave: 2, sectionId: 'bass' }),

  // Synths (rows 12-13)
  createRow({ id: 'row-12', sound: { type: 'synth', bank: 'supersaw', name: 'Synth 1', n: 0 }, note: 'c3', octave: 3, sectionId: 'synth' }),
  createRow({ id: 'row-13', sound: { type: 'synth', bank: 'supersaw', name: 'Synth 2', n: 0 }, note: 'c3', octave: 3, sectionId: 'synth' }),

  // Melodic (rows 14-15)
  createRow({ id: 'row-14', sound: { type: 'soundfont', bank: 'gm_piano', name: 'Melodic 1', n: 0 }, note: 'c4', octave: 4, sectionId: 'melodic' }),
  createRow({ id: 'row-15', sound: { type: 'soundfont', bank: 'gm_piano', name: 'Melodic 2', n: 0 }, note: 'c4', octave: 4, sectionId: 'melodic' }),
];

// --- Per-row colors (16 entries) ---
// First 8 match existing patterns.js ROW_COLORS, next 8 are new

export const ROW_COLORS = [
  '#d97757',  // 0: Kick -- terracotta (--accent-warm)
  '#6b9080',  // 1: Snare -- sage (--accent-cool)
  '#f5a623',  // 2: Hi-Hat -- gold (--accent-primary)
  '#5bc0de',  // 3: Open Hat -- cyan
  '#c678dd',  // 4: Clap -- purple
  '#e06c75',  // 5: Ride -- rose
  '#61afef',  // 6: Tom -- blue
  '#e5c07b',  // 7: Cowbell -- amber
  '#a3d977',  // 8: Rimshot -- lime
  '#7c6bc4',  // 9: Shaker -- indigo
  '#e87da0',  // 10: Bass 1 -- pink
  '#56c4b8',  // 11: Bass 2 -- teal
  '#e89650',  // 12: Synth 1 -- orange
  '#b07cd8',  // 13: Synth 2 -- violet
  '#5bb8e8',  // 14: Melodic 1 -- sky
  '#e07070',  // 15: Melodic 2 -- coral
];

// --- Row display labels ---
// Derive a human-readable label from the row model

export const ROW_LABELS = [
  'Kick', 'Snare', 'Hi-Hat', 'Open Hat', 'Clap', 'Ride',
  'Tom', 'Cowbell', 'Rimshot', 'Shaker',
  'Bass 1', 'Bass 2',
  'Synth 1', 'Synth 2',
  'Melodic 1', 'Melodic 2',
];

/**
 * Get the display label for a row.
 * Falls back to the sound name or bank if the index is out of range.
 *
 * @param {Object} row - Row model object
 * @param {number} index - Row index in DEFAULT_ROWS
 * @returns {string} Human-readable label
 */
export function getRowLabel(row, index) {
  if (index >= 0 && index < ROW_LABELS.length) return ROW_LABELS[index];
  if (row.sound.type === 'sample') return row.sound.name.toUpperCase();
  if (row.sound.type === 'synth') return row.sound.name || row.sound.bank;
  if (row.sound.type === 'soundfont') return row.sound.name || row.sound.bank;
  return `Row ${index + 1}`;
}

/**
 * Filter rows by section ID.
 *
 * @param {Array} rows - Array of row model objects
 * @param {string} sectionId - Section ID to filter by
 * @returns {Array} Rows belonging to the specified section
 */
export function getRowsBySection(rows, sectionId) {
  return rows.filter(r => r.sectionId === sectionId);
}
