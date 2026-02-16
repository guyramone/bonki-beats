/**
 * layers.js — Layer management utilities for multi-pattern composition
 *
 * Pure functions for managing the layer state array and composing
 * active layers into a single Strudel stack() code string.
 *
 * Layer shape: { id: string, name: string, type: 'sequencer'|'pad'|'preset', code: string, active: boolean }
 */

// --- Layer Composition ---

/**
 * Compose all active layers into a single Strudel code string.
 * 0 active → '' (empty). 1 active → its code directly. 2+ → stack() wrapper.
 *
 * @param {Array<{id: string, code: string, active: boolean}>} layers
 * @returns {string} Strudel pattern code
 */
export function composeLayerCode(layers) {
  const activeCodes = layers.filter(l => l.active).map(l => l.code);
  if (activeCodes.length === 0) return '';
  if (activeCodes.length === 1) return activeCodes[0];
  return `stack(\n  ${activeCodes.join(',\n  ')}\n)`;
}

/**
 * Wrap code with .gain() for master volume control.
 * If volume >= 1, returns code unchanged (no unnecessary wrapping).
 *
 * @param {string} code - Strudel pattern code
 * @param {number} volume - 0 to 1
 * @returns {string} Code with gain applied
 */
export function applyVolume(code, volume) {
  if (volume >= 1) return code;
  return `(${code}).gain(${volume.toFixed(2)})`;
}

// --- Layer CRUD ---

/**
 * Add a layer to the array. If a layer with the same id exists, replace it.
 *
 * @param {Array} layers - Current layers array
 * @param {Object} newLayer - Layer to add
 * @returns {Array} New layers array
 */
export function addLayer(layers, newLayer) {
  const exists = layers.findIndex(l => l.id === newLayer.id);
  if (exists !== -1) {
    const next = [...layers];
    next[exists] = newLayer;
    return next;
  }
  return [...layers, newLayer];
}

/**
 * Remove a layer by id.
 *
 * @param {Array} layers - Current layers array
 * @param {string} layerId - ID of layer to remove
 * @returns {Array} New layers array without the removed layer
 */
export function removeLayer(layers, layerId) {
  return layers.filter(l => l.id !== layerId);
}

/**
 * Toggle solo on a layer. If the target is the only active one, un-solo
 * (re-activate all). Otherwise, deactivate all except the target.
 *
 * @param {Array} layers - Current layers array
 * @param {string} layerId - ID of layer to solo/un-solo
 * @returns {Array} New layers array with toggled active states
 */
export function toggleSolo(layers, layerId) {
  const activeIds = layers.filter(l => l.active).map(l => l.id);

  // If the target is the only active layer, un-solo: activate all
  if (activeIds.length === 1 && activeIds[0] === layerId) {
    return layers.map(l => ({ ...l, active: true }));
  }

  // Otherwise, solo: deactivate all except target
  return layers.map(l => ({ ...l, active: l.id === layerId }));
}

// --- BPM Utilities ---

/**
 * Convert BPM to Strudel CPS (cycles per second).
 * Assumes 4/4 time: 1 cycle = 1 bar = 4 beats.
 * Default: 120 BPM = 0.5 CPS.
 *
 * @param {number} bpm
 * @returns {number} CPS
 */
export function bpmToCps(bpm) {
  return bpm / 60 / 4;
}

/**
 * Map BPM to hue for slider color feedback.
 * 60 BPM = 220 (blue), 120 BPM = 140 (green), 180 BPM = 0 (red).
 * Linear interpolation across the full range.
 *
 * @param {number} bpm - 60 to 180
 * @returns {number} Hue value (0-220)
 */
export function bpmToHue(bpm) {
  return Math.round(220 - ((bpm - 60) / 120) * 220);
}
