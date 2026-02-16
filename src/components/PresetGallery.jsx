import React from 'react';
import { PRESETS } from '../utils/presets.js';
import PresetCard from './PresetCard.jsx';

/**
 * PresetGallery — Horizontal scrollable gallery of preset cards
 *
 * K.K. Slider record-crate energy: scroll through album covers,
 * tap to preview, "+" to add as a layer. CSS scroll-snap for
 * smooth navigation.
 *
 * @param {Object} props
 * @param {Function} props.onPresetSelect - Called with preset on card tap (preview)
 * @param {Function} props.onPresetAdd - Called with preset on "+" tap (add layer)
 */
function PresetGallery({ onPresetSelect, onPresetAdd }) {
  return (
    <div className="preset-gallery-wrapper">
      <div className="preset-gallery-label">Presets</div>
      <div className="preset-gallery" role="list" aria-label="Preset gallery">
        {PRESETS.map((preset) => (
          <PresetCard
            key={preset.id}
            preset={preset}
            onSelect={onPresetSelect}
            onAdd={onPresetAdd}
          />
        ))}
      </div>
    </div>
  );
}

export default PresetGallery;
