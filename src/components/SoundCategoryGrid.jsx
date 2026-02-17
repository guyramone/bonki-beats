import React from 'react';

/**
 * SoundCategoryGrid -- Big colorful tiles for sound categories.
 *
 * Renders a responsive CSS grid of category tiles. Each tile shows
 * the category icon (emoji) and name on a colored background.
 *
 * @param {Object} props
 * @param {Array} props.categories - Array of category objects from soundCatalog.js
 * @param {function} props.onCategorySelect - Called with category object on tap
 */
function SoundCategoryGrid({ categories, onCategorySelect }) {
  return (
    <div className="category-grid">
      {categories.map(cat => (
        <button
          key={cat.id}
          className="category-tile"
          style={{ backgroundColor: cat.color }}
          onClick={() => onCategorySelect(cat)}
          type="button"
          aria-label={`${cat.name} - ${cat.description}`}
        >
          <span className="category-tile-icon">{cat.icon}</span>
          <span className="category-tile-name">{cat.name}</span>
          <span className="category-tile-count">{cat.banks.length} banks</span>
        </button>
      ))}
    </div>
  );
}

export default SoundCategoryGrid;
