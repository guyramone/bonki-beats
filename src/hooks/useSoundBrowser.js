/**
 * useSoundBrowser.js -- Custom hook managing sound browser navigation state
 *
 * Handles three-level drill-down (categories > banks > sounds),
 * favorites (persisted to localStorage), and recents (persisted to localStorage).
 *
 * Exports: useSoundBrowser
 */

import { useState, useEffect, useCallback } from 'react';
import { soundToKey } from '../utils/soundCatalog.js';

const FAVORITES_KEY = 'homie-beats-favorites';
const RECENTS_KEY = 'homie-beats-recents';
const MAX_RECENTS = 20;

/**
 * Load a Set of strings from localStorage.
 * @param {string} key - localStorage key
 * @returns {Set<string>}
 */
function loadFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    if (raw) return new Set(JSON.parse(raw));
  } catch {
    // Corrupted data -- start fresh
  }
  return new Set();
}

/**
 * Load an array of sound objects from localStorage.
 * @returns {Array<Object>}
 */
function loadRecents() {
  try {
    const raw = localStorage.getItem(RECENTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // Corrupted data -- start fresh
  }
  return [];
}

/**
 * Custom hook for sound browser navigation, favorites, and recents.
 *
 * @returns {Object} Browser state and actions
 */
export function useSoundBrowser() {
  // --- Navigation state ---
  const [level, setLevel] = useState('categories'); // 'categories' | 'banks' | 'sounds'
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBank, setSelectedBank] = useState(null);

  // --- Persistence state ---
  const [favorites, setFavorites] = useState(() => loadFavorites());
  const [recents, setRecents] = useState(() => loadRecents());

  // --- Persist favorites to localStorage on change ---
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favorites]));
    } catch {
      // localStorage full or unavailable
    }
  }, [favorites]);

  // --- Persist recents to localStorage on change ---
  useEffect(() => {
    try {
      localStorage.setItem(RECENTS_KEY, JSON.stringify(recents));
    } catch {
      // localStorage full or unavailable
    }
  }, [recents]);

  // --- Navigation actions ---

  const navigateToCategory = useCallback((category) => {
    setSelectedCategory(category);
    setSelectedBank(null);
    setLevel('banks');
  }, []);

  const navigateToBank = useCallback((bank) => {
    setSelectedBank(bank);
    setLevel('sounds');
  }, []);

  const navigateBack = useCallback(() => {
    if (level === 'sounds') {
      setSelectedBank(null);
      setLevel('banks');
    } else if (level === 'banks') {
      setSelectedCategory(null);
      setLevel('categories');
    }
  }, [level]);

  const reset = useCallback(() => {
    setSelectedCategory(null);
    setSelectedBank(null);
    setLevel('categories');
  }, []);

  // --- Favorites ---

  const toggleFavorite = useCallback((sound) => {
    const key = soundToKey(sound);
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }, []);

  const isFavorite = useCallback((sound) => {
    return favorites.has(soundToKey(sound));
  }, [favorites]);

  // --- Recents ---

  const addToRecents = useCallback((sound) => {
    setRecents(prev => {
      const key = soundToKey(sound);
      // Remove duplicate if exists
      const filtered = prev.filter(s => soundToKey(s) !== key);
      // Push to front, cap at MAX_RECENTS
      const next = [sound, ...filtered].slice(0, MAX_RECENTS);
      return next;
    });
  }, []);

  return {
    // Navigation state
    level,
    selectedCategory,
    selectedBank,

    // Navigation actions
    navigateToCategory,
    navigateToBank,
    navigateBack,
    reset,

    // Favorites
    favorites,
    toggleFavorite,
    isFavorite,

    // Recents
    recents,
    addToRecents,
  };
}
