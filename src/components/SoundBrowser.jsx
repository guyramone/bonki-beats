import React, { useState, useRef, useCallback, useEffect } from 'react';
import { evaluate } from '@strudel/web';
import SoundCategoryGrid from './SoundCategoryGrid.jsx';
import { useSoundBrowser } from '../hooks/useSoundBrowser.js';
import {
  SOUND_CATEGORIES,
  getRandomSound,
  soundToLabel,
  soundToKey,
} from '../utils/soundCatalog.js';

// --- Bonki reaction pools (category-based) ---
const BONKI_REACTIONS = {
  drums: ['classic!', "that's the one!", 'boom!', 'punchy!', 'thump!'],
  keys: ['fancy!', 'tickle those ivories!', 'classy!', 'smooth!'],
  strings: ['orchestral vibes!', 'lush!', 'strings attached!'],
  bass: ['low end!', 'rumble!', 'heavy!', 'subby!'],
  brass: ['fancy!', 'royal vibes!', 'bold!'],
  woodwinds: ['breezy!', 'smooth!', 'jazzy!'],
  synths: ['ooh, synthesized!', 'buzzy!', 'electric!', 'waveforms!'],
  pads: ['atmospheric!', 'dreamy!', 'spacey!'],
  world: ['world tour!', 'exotic!', 'cultural!', 'adventurous!'],
  weird: ["now we're talking!", 'bonkers!', 'wild!', 'chaotic good!'],
  percussion: ['rhythmic!', 'percussive!', 'crispy!'],
  random: ['surprise!', 'wild card!', 'ooh, random!', 'dice says...'],
};

function pickReaction(categoryId) {
  const pool = BONKI_REACTIONS[categoryId] || BONKI_REACTIONS.random;
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * SoundBrowser -- Full-screen modal with three-level drill-down.
 *
 * Level 1: Category grid (Drums, Keys, Synths, etc.) + Favorites/Recents
 * Level 2: Bank list within a category
 * Level 3: Sound list within a bank (tap to preview, double-tap to select)
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is visible
 * @param {function} props.onClose - Called when the modal should close
 * @param {function} props.onSelect - Called with sound object when a sound is selected
 * @param {Object} props.currentSound - The row's current sound for highlighting
 * @param {function} props.onBonkiReaction - Triggers Bonki speech bubble
 */
function SoundBrowser({ isOpen, onClose, onSelect, currentSound, onBonkiReaction }) {
  const browser = useSoundBrowser();
  const [diceSound, setDiceSound] = useState(null);
  const [previewingKey, setPreviewingKey] = useState(null);
  const lastTapRef = useRef({ key: null, time: 0 });
  const closingRef = useRef(false);

  // Reset navigation when browser opens
  useEffect(() => {
    if (isOpen) {
      browser.reset();
      setDiceSound(null);
      setPreviewingKey(null);
      closingRef.current = false;
    }
  }, [isOpen]);

  // --- Sound preview (one-shot) ---
  const previewSound = useCallback((sound, bankType, bankId) => {
    try {
      let code = '';
      if (bankType === 'synth' || sound.type === 'synth') {
        code = `note("c3").s("${sound.id}").gain(0.6)`;
      } else if (bankType === 'soundfont') {
        code = `note("c4").s("${sound.id}").gain(0.6)`;
      } else {
        // sample
        code = `s("${bankId}_${sound.id}").gain(0.7)`;
      }
      evaluate(code);
      setPreviewingKey(soundToKey({
        type: bankType === 'synth' || sound.type === 'synth' ? 'synth' : bankType,
        bank: bankType === 'synth' || sound.type === 'synth' ? sound.id : (bankType === 'soundfont' ? sound.id : bankId),
        name: sound.name || sound.id,
        n: sound.n || 0,
      }));
    } catch (err) {
      console.warn('Preview failed:', err.message);
    }
  }, []);

  // --- Build a sound object matching the row.sound shape ---
  const buildSoundObject = useCallback((sound, bankType, bankId) => {
    if (bankType === 'synth' || sound.type === 'synth') {
      return { type: 'synth', bank: sound.id, name: sound.name, n: 0 };
    }
    if (bankType === 'soundfont') {
      return { type: 'soundfont', bank: sound.id, name: sound.name, n: sound.n || 0 };
    }
    return { type: 'sample', bank: bankId, name: sound.id, n: 0 };
  }, []);

  // --- Handle tap on a sound (single=preview, double=select) ---
  const handleSoundTap = useCallback((sound, bankType, bankId, categoryId) => {
    const key = `${bankType}:${bankId}:${sound.id}`;
    const now = Date.now();
    const lastTap = lastTapRef.current;

    if (lastTap.key === key && now - lastTap.time < 400) {
      // Double tap -> select
      lastTapRef.current = { key: null, time: 0 };
      const soundObj = buildSoundObject(sound, bankType, bankId);
      browser.addToRecents(soundObj);

      if (onBonkiReaction) {
        onBonkiReaction(pickReaction(categoryId));
      }

      if (onSelect) {
        onSelect(soundObj);
      }
      onClose();
    } else {
      // Single tap -> preview
      lastTapRef.current = { key, time: now };
      previewSound(sound, bankType, bankId);
    }
  }, [browser, onSelect, onClose, onBonkiReaction, previewSound, buildSoundObject]);

  // --- Dice button ---
  const handleDice = useCallback(() => {
    if (diceSound) {
      // Second tap on dice -> select the random sound
      browser.addToRecents(diceSound);
      if (onBonkiReaction) {
        onBonkiReaction(pickReaction('random'));
      }
      if (onSelect) {
        onSelect(diceSound);
      }
      setDiceSound(null);
      onClose();
    } else {
      // First tap -> pick a random sound and preview it
      const rand = getRandomSound();
      setDiceSound(rand);

      // Preview the random sound
      try {
        let code = '';
        if (rand.type === 'synth') {
          code = `note("c3").s("${rand.bank}").gain(0.6)`;
        } else if (rand.type === 'soundfont') {
          code = `note("c4").s("${rand.bank}").gain(0.6)`;
        } else {
          code = `s("${rand.bank}_${rand.name}").gain(0.7)`;
        }
        evaluate(code);
      } catch (err) {
        console.warn('Dice preview failed:', err.message);
      }

      if (onBonkiReaction) {
        onBonkiReaction(`${pickReaction('random')} ${soundToLabel(rand)}`);
      }
    }
  }, [diceSound, browser, onSelect, onClose, onBonkiReaction]);

  // --- Handle backdrop click ---
  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  // --- Favorite toggle on sound items ---
  const handleFavoriteToggle = useCallback((sound, bankType, bankId, e) => {
    e.stopPropagation();
    const soundObj = buildSoundObject(sound, bankType, bankId);
    browser.toggleFavorite(soundObj);
  }, [browser, buildSoundObject]);

  // --- Recents/Favorites quick-select ---
  const handleQuickSelect = useCallback((sound) => {
    // Preview on first tap
    try {
      let code = '';
      if (sound.type === 'synth') {
        code = `note("c3").s("${sound.bank}").gain(0.6)`;
      } else if (sound.type === 'soundfont') {
        code = `note("c4").s("${sound.bank}").gain(0.6)`;
      } else {
        code = `s("${sound.bank}_${sound.name}").gain(0.7)`;
      }
      evaluate(code);
    } catch (err) {
      console.warn('Quick preview failed:', err.message);
    }

    const key = soundToKey(sound);
    const now = Date.now();
    const lastTap = lastTapRef.current;

    if (lastTap.key === key && now - lastTap.time < 400) {
      // Double tap -> select
      lastTapRef.current = { key: null, time: 0 };
      browser.addToRecents(sound);
      if (onBonkiReaction) {
        onBonkiReaction(pickReaction('random'));
      }
      if (onSelect) {
        onSelect(sound);
      }
      onClose();
    } else {
      lastTapRef.current = { key, time: now };
    }
  }, [browser, onSelect, onClose, onBonkiReaction]);

  if (!isOpen) return null;

  // Current sound key for highlighting
  const currentSoundKey = currentSound ? soundToKey(currentSound) : null;

  // --- Render level content ---
  const renderContent = () => {
    // Level 1: Categories
    if (browser.level === 'categories') {
      return (
        <>
          {/* Recents */}
          {browser.recents.length > 0 && (
            <div className="sound-browser-section">
              <h3 className="sound-browser-section-title">Recent</h3>
              <div className="recents-row">
                {browser.recents.map((sound, i) => {
                  const key = soundToKey(sound);
                  return (
                    <button
                      key={`${key}-${i}`}
                      className={`recent-chip${key === currentSoundKey ? ' selected' : ''}`}
                      onClick={() => handleQuickSelect(sound)}
                      type="button"
                    >
                      {soundToLabel(sound)}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Favorites */}
          {browser.favorites.size > 0 && (
            <div className="sound-browser-section">
              <h3 className="sound-browser-section-title">
                <span className="heart-icon">{'\u2764\uFE0F'}</span> Favorites
              </h3>
              <div className="favorites-row">
                {browser.recents
                  .filter(s => browser.isFavorite(s))
                  .map((sound, i) => {
                    const key = soundToKey(sound);
                    return (
                      <button
                        key={`fav-${key}-${i}`}
                        className={`favorite-chip${key === currentSoundKey ? ' selected' : ''}`}
                        onClick={() => handleQuickSelect(sound)}
                        type="button"
                      >
                        {soundToLabel(sound)}
                      </button>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Category Grid */}
          <SoundCategoryGrid
            categories={SOUND_CATEGORIES}
            onCategorySelect={browser.navigateToCategory}
          />
        </>
      );
    }

    // Level 2: Banks within category
    if (browser.level === 'banks' && browser.selectedCategory) {
      const cat = browser.selectedCategory;
      return (
        <div className="bank-list">
          {cat.banks.map(bank => (
            <button
              key={bank.id}
              className="bank-row"
              onClick={() => browser.navigateToBank(bank)}
              type="button"
            >
              <span className="bank-row-name">{bank.name}</span>
              <span className="bank-row-type">{bank.type}</span>
              <span className="bank-row-count">{bank.sounds.length}</span>
              <span className="bank-row-chevron">{'\u203A'}</span>
            </button>
          ))}
        </div>
      );
    }

    // Level 3: Sounds within bank
    if (browser.level === 'sounds' && browser.selectedBank) {
      const bank = browser.selectedBank;
      const categoryId = browser.selectedCategory?.id || 'drums';

      return (
        <div className="sound-list">
          {bank.sounds.map((sound, i) => {
            const soundObj = buildSoundObject(sound, bank.type, bank.id);
            const key = soundToKey(soundObj);
            const isSelected = key === currentSoundKey;
            const isPreviewing = key === previewingKey;
            const isFav = browser.isFavorite(soundObj);

            return (
              <div
                key={`${sound.id}-${i}`}
                className={`sound-item${isSelected ? ' selected' : ''}${isPreviewing ? ' previewing' : ''}`}
              >
                <button
                  className="sound-item-main"
                  onClick={() => handleSoundTap(sound, bank.type, bank.id, categoryId)}
                  type="button"
                >
                  <span className="sound-item-name">{sound.name}</span>
                  {isSelected && <span className="sound-item-current">{'\u2713'}</span>}
                </button>
                <button
                  className={`sound-item-fav${isFav ? ' active' : ''}`}
                  onClick={(e) => handleFavoriteToggle(sound, bank.type, bank.id, e)}
                  type="button"
                  aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
                >
                  {isFav ? '\u2764\uFE0F' : '\u2661'}
                </button>
              </div>
            );
          })}
          <p className="sound-hint">Tap to preview, double-tap to select</p>
        </div>
      );
    }

    return null;
  };

  // --- Header title ---
  const getTitle = () => {
    if (browser.level === 'sounds' && browser.selectedBank) return browser.selectedBank.name;
    if (browser.level === 'banks' && browser.selectedCategory) return browser.selectedCategory.name;
    return 'Sound Browser';
  };

  return (
    <div className="sound-browser-overlay" onClick={handleBackdropClick}>
      <div className="sound-browser-modal">
        {/* Header */}
        <div className="sound-browser-header">
          {browser.level !== 'categories' && (
            <button
              className="sound-browser-back"
              onClick={browser.navigateBack}
              type="button"
              aria-label="Go back"
            >
              {'\u2190'}
            </button>
          )}
          <h2 className="sound-browser-title">{getTitle()}</h2>
          <button
            className="sound-browser-close"
            onClick={onClose}
            type="button"
            aria-label="Close sound browser"
          >
            {'\u2715'}
          </button>
        </div>

        {/* Body */}
        <div className="sound-browser-body">
          {renderContent()}
        </div>

        {/* Footer with dice button */}
        <div className="sound-browser-footer">
          <button
            className={`dice-button${diceSound ? ' has-pick' : ''}`}
            onClick={handleDice}
            type="button"
            aria-label={diceSound ? `Select ${soundToLabel(diceSound)}` : 'Random sound'}
          >
            {diceSound ? (
              <span className="dice-label">{'\u2713'} {soundToLabel(diceSound)}</span>
            ) : (
              <span className="dice-icon">{'\u{1F3B2}'}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SoundBrowser;
