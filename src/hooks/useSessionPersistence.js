import { useEffect, useRef, useCallback } from 'react';
import { saveState, loadState, clearState } from '../utils/localStorage.js';

const SESSION_KEY = 'session';
const DEBOUNCE_MS = 500;

/**
 * Serialize rows for storage -- strip non-serializable fields.
 * Keeps: pattern (steps + euclid), sound, effects, transforms, volume, muted, note, octave.
 */
function serializeRows(rows) {
  return rows.map(r => ({
    pattern: {
      steps: [...r.pattern.steps],
      euclid: r.pattern.euclid ? { ...r.pattern.euclid } : null,
    },
    sound: { ...r.sound },
    effects: JSON.parse(JSON.stringify(r.effects)),
    transforms: { ...r.transforms },
    volume: r.volume,
    muted: r.muted,
    note: r.note,
    octave: r.octave,
  }));
}

/**
 * Load initial session state from localStorage.
 * Returns null if no saved session exists.
 *
 * @returns {Object|null} Saved session or null
 */
export function loadInitialState() {
  const saved = loadState(SESSION_KEY, null);
  if (!saved || !saved.rows) return null;
  return saved;
}

/**
 * useSessionPersistence -- Auto-save session state to localStorage (debounced).
 *
 * Does NOT auto-play on restore (respects browser autoplay policy).
 * Call clearSession() to reset to defaults.
 *
 * @param {Object} state - Current app state to persist
 * @param {Array} state.rows - Row model array
 * @param {number} state.bpm
 * @param {number} state.stepCount
 * @param {number} state.volume
 * @param {string} state.rootNote
 * @param {string} state.scaleName
 * @param {boolean} state.scaleActive
 * @param {Object} state.masterEffects
 * @param {Object} state.globalTransforms
 */
export function useSessionPersistence(state) {
  const timerRef = useRef(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  // Debounced save
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      const s = stateRef.current;
      saveState(SESSION_KEY, {
        rows: serializeRows(s.rows),
        bpm: s.bpm,
        stepCount: s.stepCount,
        volume: s.volume,
        rootNote: s.rootNote,
        scaleName: s.scaleName,
        scaleActive: s.scaleActive,
        masterEffects: s.masterEffects,
        globalTransforms: s.globalTransforms,
        savedAt: Date.now(),
      });
    }, DEBOUNCE_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [
    state.rows, state.bpm, state.stepCount, state.volume,
    state.rootNote, state.scaleName, state.scaleActive,
    state.masterEffects, state.globalTransforms,
  ]);
}

/**
 * Clear saved session and all homie-beats localStorage (except favorites/recents).
 */
export function clearSession() {
  clearState(SESSION_KEY);
}
