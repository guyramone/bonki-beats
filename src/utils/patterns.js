/**
 * patterns.js — Sound definitions, pad presets, and sequencer-to-pattern converter
 *
 * This is where HOMIE Beats translates grid state and pad taps into
 * Strudel pattern code that evaluate() can play.
 */

// --- Sequencer Sound Definitions ---

export const SOUNDS = [
  { name: 'Kick', sample: 'RolandTR808_bd' },
  { name: 'Snare', sample: 'RolandTR909_sd' },
  { name: 'Hi-Hat', sample: 'RolandTR808_hh' },
  { name: 'Open Hat', sample: 'RolandTR808_oh' },
  { name: 'Clap', sample: 'RolandTR808_cp' },
  { name: 'Ride', sample: 'RolandTR808_rd' },
  { name: 'Tom', sample: 'RolandTR808_ht' },
  { name: 'Cowbell', sample: 'RolandTR808_cb' },
];

// Per-row colors matching the sequencer grid CSS
// Index matches SOUNDS array index
export const ROW_COLORS = [
  '#d97757',  // 0: Kick — terracotta (--accent-warm)
  '#6b9080',  // 1: Snare — sage (--accent-cool)
  '#f5a623',  // 2: Hi-Hat — gold (--accent-primary)
  '#5bc0de',  // 3: Open Hat — cyan
  '#c678dd',  // 4: Clap — purple
  '#e06c75',  // 5: Ride — rose
  '#61afef',  // 6: Tom — blue
  '#e5c07b',  // 7: Cowbell — amber
];

// --- Sequencer Grid Defaults ---

export const STEP_COUNT = 8;
export const STEP_OPTIONS = [8, 16];

// Grid is always 16 columns wide (max). View shows first stepCount columns.
export const DEFAULT_GRID = SOUNDS.map(() => Array(16).fill(false));

// --- Sequencer-to-Pattern Converter ---

/**
 * Convert a 2D boolean grid into a Strudel pattern string.
 * Accepts an optional stepCount to slice each row.
 *
 * @param {boolean[][]} grid - 2D array: grid[row][step] = true/false (always 16 wide)
 * @param {Array<{name: string, sample: string}>} sounds - Sound definitions per row
 * @param {number} [stepCount=8] - Number of steps to use from each row
 * @returns {string} Strudel code string (e.g. stack(...)) or empty string if all cells off
 */
export function sequencerToPattern(grid, sounds, stepCount = 8) {
  // Slice each row to stepCount entries
  const slicedGrid = grid.map(row => row.slice(0, stepCount));

  // Check if every cell is off — nothing to play
  const hasActiveCell = slicedGrid.some(row => row.some(cell => cell));
  if (!hasActiveCell) return '';

  const patterns = slicedGrid.map((row, i) => {
    const steps = row.map(active => active ? 'x' : '~').join(' ');
    return `s("${sounds[i].sample}").struct("${steps}")`;
  });

  return `stack(${patterns.join(', ')})`;
}

// --- Pad Presets (16 pads, 4x4 grid) ---

export const PADS = [
  // Row 1 — Drums (warm accent)
  { id: 0,  label: 'Kick',     pattern: 's("RolandTR808_bd")',     color: 'warm' },
  { id: 1,  label: 'Snare',    pattern: 's("RolandTR909_sd")',     color: 'warm' },
  { id: 2,  label: 'Hi-hat',   pattern: 's("RolandTR808_hh")',     color: 'warm' },
  { id: 3,  label: 'Open Hat',  pattern: 's("RolandTR808_oh")',     color: 'warm' },

  // Row 2 — Percussion (warm accent)
  { id: 4,  label: 'Clap',     pattern: 's("RolandTR808_cp")',     color: 'warm' },
  { id: 5,  label: 'Rimshot',  pattern: 's("RolandTR909_rim")',    color: 'warm' },
  { id: 6,  label: 'Cowbell',  pattern: 's("RolandTR808_cb")',     color: 'warm' },
  { id: 7,  label: 'Tom',      pattern: 's("RolandTR808_ht")',     color: 'warm' },

  // Row 3 — Patterns (cool accent)
  { id: 8,  label: '4 Floor',  pattern: 's("RolandTR808_bd").fast(4)',                  color: 'cool' },
  { id: 9,  label: 'Backbeat', pattern: 's("RolandTR909_sd").struct("~ x ~ x")',        color: 'cool' },
  { id: 10, label: 'HH Groove', pattern: 's("RolandTR808_hh").fast(8)',                  color: 'cool' },
  { id: 11, label: 'Funk Kick', pattern: 's("RolandTR808_bd").struct("x ~ x ~ ~ x ~ ~")', color: 'cool' },

  // Row 4 — Weird/Fun (gold accent)
  { id: 12, label: 'Synth',    pattern: 'note("c3 e3 g3").s("sawtooth").cutoff(800)',              color: 'gold' },
  { id: 13, label: 'Bass',     pattern: 'note("c2").s("sawtooth").cutoff(400).gain(0.8)',           color: 'gold' },
  { id: 14, label: 'Blip',     pattern: 'note("c5 e5").s("triangle").decay(0.05).sustain(0)',       color: 'gold' },
  { id: 15, label: 'Chaos',    pattern: 's("RolandTR808_bd RolandTR909_sd RolandTR808_hh RolandTR808_cp").fast(2).sometimes(rev)', color: 'gold' },
];
