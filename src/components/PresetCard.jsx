import React from 'react';
import BonkiCover from './BonkiCovers.jsx';

/**
 * PresetCard — Individual album cover card for the preset gallery
 *
 * Displays a Bonki album cover SVG, preset name, and genre subtitle.
 * Tap to preview (onSelect), "+" button to add as layer (onAdd).
 *
 * @param {Object} props
 * @param {Object} props.preset - Full preset object from presets.js
 * @param {Function} props.onSelect - Called with preset when card is tapped (preview)
 * @param {Function} props.onAdd - Called with preset when "+" button is tapped (add layer)
 */
function PresetCard({ preset, onSelect, onAdd }) {
  const handleClick = () => {
    onSelect(preset);
  };

  const handleAdd = (e) => {
    e.stopPropagation(); // Don't trigger card click (preview)
    onAdd(preset);
  };

  return (
    <div
      className="preset-card"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={`Preview ${preset.name} - ${preset.genre}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {/* Album cover art */}
      <div className="preset-card-cover">
        <BonkiCover variant={preset.cover} />
      </div>

      {/* Preset info */}
      <div className="preset-card-info">
        <div className="preset-card-name">{preset.name}</div>
        <div className="preset-card-genre">{preset.genre}</div>
      </div>

      {/* Add as layer button */}
      <button
        className="preset-card-add"
        onClick={handleAdd}
        aria-label={`Add ${preset.name} as layer`}
        type="button"
      >
        +
      </button>
    </div>
  );
}

export default PresetCard;
