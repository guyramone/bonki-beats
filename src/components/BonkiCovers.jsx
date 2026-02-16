import React from 'react';

/**
 * BonkiCovers — Genre-themed album cover SVG variants of Bonki
 *
 * Each variant is a simplified 24x24 pixel-art Bonki with:
 * - Colored background rect
 * - Base Bonki silhouette (head + body + eyes)
 * - Genre-specific accessory overlays
 *
 * Used inside PresetCard at ~110x110 display size.
 * K.K. Slider energy: simple, charming, collectible.
 */

// --- Color palettes per genre ---
const COVER_THEMES = {
  lofi:       { bg: '#3d2a5c', accent: '#9b7ec8' },
  breakbeat:  { bg: '#1a3a5c', accent: '#4dc9f6' },
  ambient:    { bg: '#0f1f3d', accent: '#4a7da8' },
  hiphop:     { bg: '#3d1a1a', accent: '#d97757' },
  techno:     { bg: '#0f2d1a', accent: '#39ff14' },
  afrobeat:   { bg: '#3d2a0f', accent: '#f5a623' },
  chiptune:   { bg: '#0f3d1a', accent: '#39ff14' },
  jazz:       { bg: '#1a2a3d', accent: '#6b9cbe' },
  trap:       { bg: '#2a0f3d', accent: '#9b4dca' },
  chill:      { bg: '#3d1a2a', accent: '#f5a0b0' },
  drone:      { bg: '#0a0a0a', accent: '#333333' },
  dance:      { bg: '#3d0f2a', accent: '#ff1493' },
  cartoon:    { bg: '#3d3a0f', accent: '#ffe135' },
  space:      { bg: '#0a0f2d', accent: '#6b7ec8' },
  videogame:  { bg: '#3d0f0f', accent: '#ff3333' },
  lullaby:    { bg: '#0f1a3d', accent: '#7a9ec8' },
};

/**
 * Render the base Bonki body shared by all cover variants.
 * Simplified from the full 32x32 Bonki to fit 24x24 viewBox.
 */
function BaseBonki() {
  return (
    <g>
      {/* Fold ears */}
      <rect x="6" y="4" width="2" height="1" fill="#1a1a1a" />
      <rect x="7" y="3" width="1" height="1" fill="#1a1a1a" />
      <rect x="16" y="4" width="2" height="1" fill="#1a1a1a" />
      <rect x="16" y="3" width="1" height="1" fill="#1a1a1a" />

      {/* Head */}
      <rect x="8" y="4" width="8" height="1" fill="#1a1a1a" />
      <rect x="6" y="5" width="12" height="1" fill="#1a1a1a" />
      <rect x="5" y="6" width="14" height="5" fill="#1a1a1a" />
      <rect x="6" y="11" width="12" height="1" fill="#1a1a1a" />
      <rect x="7" y="12" width="10" height="1" fill="#1a1a1a" />

      {/* Eyes */}
      <rect x="8" y="7" width="2" height="2" fill="#f5a623" />
      <rect x="8" y="7" width="1" height="1" fill="#ffffff" />
      <rect x="14" y="7" width="2" height="2" fill="#f5a623" />
      <rect x="14" y="7" width="1" height="1" fill="#ffffff" />

      {/* Nose */}
      <rect x="11" y="9" width="1" height="1" fill="#3a2a2a" />

      {/* Body */}
      <rect x="6" y="13" width="12" height="1" fill="#1a1a1a" />
      <rect x="5" y="14" width="14" height="4" fill="#1a1a1a" />
      <rect x="6" y="18" width="12" height="1" fill="#1a1a1a" />

      {/* Paws */}
      <rect x="6" y="19" width="2" height="1" fill="#2d2d2d" />
      <rect x="16" y="19" width="2" height="1" fill="#2d2d2d" />
    </g>
  );
}

/**
 * Genre-specific accessories rendered on top of base Bonki.
 */
function Accessories({ variant }) {
  switch (variant) {
    case 'lofi':
      // Headphones + sleepy eyes (half-closed)
      return (
        <g>
          <rect x="4" y="5" width="2" height="3" fill="#9b7ec8" />
          <rect x="18" y="5" width="2" height="3" fill="#9b7ec8" />
          <rect x="6" y="3" width="12" height="1" fill="#9b7ec8" />
          {/* Sleepy lids */}
          <rect x="8" y="7" width="2" height="1" fill="#1a1a1a" />
          <rect x="14" y="7" width="2" height="1" fill="#1a1a1a" />
        </g>
      );

    case 'breakbeat':
      // Spiky collar + wide eyes (no lid overlay)
      return (
        <g>
          <rect x="5" y="12" width="1" height="2" fill="#4dc9f6" />
          <rect x="7" y="12" width="1" height="2" fill="#4dc9f6" />
          <rect x="9" y="12" width="1" height="2" fill="#4dc9f6" />
          <rect x="14" y="12" width="1" height="2" fill="#4dc9f6" />
          <rect x="16" y="12" width="1" height="2" fill="#4dc9f6" />
          <rect x="18" y="12" width="1" height="2" fill="#4dc9f6" />
        </g>
      );

    case 'ambient':
      // Closed eyes + halo
      return (
        <g>
          {/* Closed eyes */}
          <rect x="8" y="8" width="2" height="1" fill="#4a7da8" />
          <rect x="14" y="8" width="2" height="1" fill="#4a7da8" />
          {/* Halo */}
          <rect x="9" y="2" width="6" height="1" fill="#4a7da8" opacity="0.6" />
          <rect x="8" y="1" width="8" height="1" fill="#4a7da8" opacity="0.4" />
        </g>
      );

    case 'hiphop':
      // Backwards cap + chain
      return (
        <g>
          {/* Cap brim (backwards) */}
          <rect x="6" y="4" width="12" height="2" fill="#d97757" />
          <rect x="16" y="5" width="3" height="1" fill="#d97757" />
          {/* Gold chain */}
          <rect x="9" y="12" width="6" height="1" fill="#f5a623" />
        </g>
      );

    case 'techno':
      // Cyber goggles
      return (
        <g>
          <rect x="7" y="6" width="4" height="3" fill="none" stroke="#39ff14" strokeWidth="0.5" />
          <rect x="13" y="6" width="4" height="3" fill="none" stroke="#39ff14" strokeWidth="0.5" />
          <rect x="11" y="7" width="2" height="1" fill="#39ff14" />
        </g>
      );

    case 'afrobeat':
      // Dashiki pattern on body
      return (
        <g>
          <rect x="8" y="14" width="1" height="1" fill="#f5a623" />
          <rect x="10" y="14" width="1" height="1" fill="#f5a623" />
          <rect x="12" y="14" width="1" height="1" fill="#f5a623" />
          <rect x="14" y="14" width="1" height="1" fill="#f5a623" />
          <rect x="9" y="16" width="1" height="1" fill="#f5a623" />
          <rect x="11" y="16" width="1" height="1" fill="#f5a623" />
          <rect x="13" y="16" width="1" height="1" fill="#f5a623" />
        </g>
      );

    case 'chiptune':
      // Pixelated outline (blocky extra border)
      return (
        <g>
          <rect x="4" y="5" width="1" height="7" fill="#39ff14" opacity="0.4" />
          <rect x="19" y="5" width="1" height="7" fill="#39ff14" opacity="0.4" />
          <rect x="7" y="3" width="10" height="1" fill="#39ff14" opacity="0.4" />
          <rect x="5" y="19" width="14" height="1" fill="#39ff14" opacity="0.4" />
        </g>
      );

    case 'jazz':
      // Tiny top hat
      return (
        <g>
          <rect x="9" y="1" width="6" height="1" fill="#6b9cbe" />
          <rect x="10" y="0" width="4" height="1" fill="#6b9cbe" />
          <rect x="8" y="2" width="8" height="1" fill="#6b9cbe" />
        </g>
      );

    case 'trap':
      // Dark shades
      return (
        <g>
          <rect x="7" y="7" width="4" height="2" fill="#1a1a1a" />
          <rect x="13" y="7" width="4" height="2" fill="#1a1a1a" />
          <rect x="11" y="7" width="2" height="1" fill="#9b4dca" />
          {/* Shine on shades */}
          <rect x="8" y="7" width="2" height="1" fill="#2a2a2a" />
          <rect x="14" y="7" width="2" height="1" fill="#2a2a2a" />
        </g>
      );

    case 'chill':
      // Blanket wrap
      return (
        <g>
          <rect x="4" y="13" width="16" height="6" fill="#f5a0b0" opacity="0.5" />
          <rect x="5" y="14" width="14" height="4" fill="#f5a0b0" opacity="0.3" />
        </g>
      );

    case 'drone':
      // Void eyes (all black, no golden)
      return (
        <g>
          <rect x="8" y="7" width="2" height="2" fill="#0a0a0a" />
          <rect x="14" y="7" width="2" height="2" fill="#0a0a0a" />
          {/* Tiny white dot for eerie look */}
          <rect x="9" y="8" width="1" height="1" fill="#333333" />
          <rect x="15" y="8" width="1" height="1" fill="#333333" />
        </g>
      );

    case 'dance':
      // Disco ball earring
      return (
        <g>
          <rect x="18" y="10" width="2" height="2" fill="#ff1493" />
          <rect x="19" y="10" width="1" height="1" fill="#ffffff" opacity="0.6" />
          <rect x="18" y="11" width="1" height="1" fill="#ffffff" opacity="0.3" />
        </g>
      );

    case 'cartoon':
      // Spring legs
      return (
        <g>
          <rect x="7" y="19" width="1" height="1" fill="#ffe135" />
          <rect x="6" y="20" width="1" height="1" fill="#ffe135" />
          <rect x="7" y="21" width="1" height="1" fill="#ffe135" />
          <rect x="16" y="19" width="1" height="1" fill="#ffe135" />
          <rect x="17" y="20" width="1" height="1" fill="#ffe135" />
          <rect x="16" y="21" width="1" height="1" fill="#ffe135" />
        </g>
      );

    case 'space':
      // Astronaut helmet
      return (
        <g>
          <rect x="5" y="3" width="14" height="1" fill="#6b7ec8" opacity="0.4" />
          <rect x="4" y="4" width="1" height="8" fill="#6b7ec8" opacity="0.4" />
          <rect x="19" y="4" width="1" height="8" fill="#6b7ec8" opacity="0.4" />
          <rect x="5" y="12" width="14" height="1" fill="#6b7ec8" opacity="0.4" />
          {/* Visor reflection */}
          <rect x="6" y="6" width="2" height="1" fill="#ffffff" opacity="0.2" />
        </g>
      );

    case 'videogame':
      // Sword
      return (
        <g>
          <rect x="19" y="6" width="1" height="6" fill="#ff3333" />
          <rect x="18" y="12" width="3" height="1" fill="#ff3333" />
          <rect x="19" y="13" width="1" height="2" fill="#996633" />
        </g>
      );

    case 'lullaby':
      // Sleep cap + moon
      return (
        <g>
          {/* Night cap */}
          <rect x="7" y="3" width="10" height="2" fill="#7a9ec8" />
          <rect x="9" y="1" width="6" height="2" fill="#7a9ec8" />
          <rect x="14" y="0" width="2" height="2" fill="#7a9ec8" />
          {/* Pom-pom */}
          <rect x="15" y="0" width="1" height="1" fill="#ffffff" />
          {/* Closed eyes */}
          <rect x="8" y="8" width="2" height="1" fill="#7a9ec8" />
          <rect x="14" y="8" width="2" height="1" fill="#7a9ec8" />
        </g>
      );

    default:
      return null;
  }
}

/**
 * Background extras for specific genres.
 */
function BackgroundExtras({ variant, theme }) {
  switch (variant) {
    case 'space':
      // Stars
      return (
        <g>
          <rect x="2" y="2" width="1" height="1" fill="#ffffff" opacity="0.6" />
          <rect x="20" y="4" width="1" height="1" fill="#ffffff" opacity="0.4" />
          <rect x="3" y="15" width="1" height="1" fill="#ffffff" opacity="0.5" />
          <rect x="21" y="18" width="1" height="1" fill="#ffffff" opacity="0.3" />
          <rect x="12" y="1" width="1" height="1" fill="#ffffff" opacity="0.5" />
        </g>
      );

    case 'lullaby':
      // Moon + stars
      return (
        <g>
          <rect x="20" y="2" width="2" height="2" fill="#f5e6a0" opacity="0.6" />
          <rect x="21" y="1" width="1" height="1" fill="#f5e6a0" opacity="0.4" />
          <rect x="3" y="5" width="1" height="1" fill="#ffffff" opacity="0.3" />
          <rect x="1" y="10" width="1" height="1" fill="#ffffff" opacity="0.2" />
        </g>
      );

    case 'drone':
      // Subtle void particles
      return (
        <g>
          <rect x="3" y="8" width="1" height="1" fill="#222222" />
          <rect x="20" y="12" width="1" height="1" fill="#222222" />
          <rect x="10" y="21" width="1" height="1" fill="#222222" />
        </g>
      );

    default:
      return null;
  }
}

/**
 * BonkiCover — Renders a genre-themed Bonki album cover SVG.
 *
 * @param {Object} props
 * @param {string} props.variant - Genre variant key (e.g. 'lofi', 'techno')
 */
function BonkiCover({ variant = 'lofi' }) {
  const theme = COVER_THEMES[variant] || COVER_THEMES.lofi;

  return (
    <svg
      viewBox="0 0 24 24"
      width="110"
      height="110"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
      style={{ display: 'block' }}
    >
      {/* Background */}
      <rect x="0" y="0" width="24" height="24" fill={theme.bg} />

      {/* Genre-specific background extras */}
      <BackgroundExtras variant={variant} theme={theme} />

      {/* Base Bonki body */}
      <BaseBonki />

      {/* Genre-specific accessories */}
      <Accessories variant={variant} />
    </svg>
  );
}

export default BonkiCover;
