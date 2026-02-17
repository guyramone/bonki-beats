/**
 * localStorage.js -- Safe localStorage helpers for session persistence
 *
 * All keys prefixed with 'homie-beats-' to avoid collisions.
 * JSON parse/stringify with error handling for quota exceeded, etc.
 */

const PREFIX = 'homie-beats-';

/**
 * Save a value to localStorage (JSON-serialized).
 * @param {string} key - Storage key (auto-prefixed)
 * @param {*} value - Value to store (must be JSON-serializable)
 */
export function saveState(key, value) {
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(PREFIX + key, serialized);
  } catch (err) {
    console.warn(`[HOMIE Beats] Failed to save "${key}":`, err.message);
  }
}

/**
 * Load a value from localStorage (JSON-parsed).
 * @param {string} key - Storage key (auto-prefixed)
 * @param {*} defaultValue - Returned if key is missing or parse fails
 * @returns {*} Parsed value or defaultValue
 */
export function loadState(key, defaultValue = null) {
  try {
    const serialized = localStorage.getItem(PREFIX + key);
    if (serialized === null) return defaultValue;
    return JSON.parse(serialized);
  } catch (err) {
    console.warn(`[HOMIE Beats] Failed to load "${key}":`, err.message);
    return defaultValue;
  }
}

/**
 * Remove a key from localStorage, or clear all homie-beats keys.
 * @param {string} [key] - Specific key to remove. If omitted, clears all prefixed keys.
 */
export function clearState(key) {
  try {
    if (key) {
      localStorage.removeItem(PREFIX + key);
    } else {
      const toRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(PREFIX)) {
          toRemove.push(k);
        }
      }
      toRemove.forEach(k => localStorage.removeItem(k));
    }
  } catch (err) {
    console.warn('[HOMIE Beats] Failed to clear state:', err.message);
  }
}
