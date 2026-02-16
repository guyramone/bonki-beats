import React from 'react';
import '../styles/bonki.css';

/**
 * Bonki — The DJ cat companion
 *
 * SVG pixel art tribute to the Ramone family's Scottish Fold cat.
 * Round head (fold ears), big golden amber eyes, DJ headphones, loaf body.
 * Renders at 48x48 CSS pixels from a 32x32 SVG viewBox.
 *
 * States:
 *   idle   — gentle breathing sway + periodic slow blink
 *   vibing — rhythmic head bob when music plays
 *
 * @param {Object} props
 * @param {'idle'|'vibing'} props.state - Animation state (default: 'idle')
 */
function Bonki({ state = 'idle' }) {
  return (
    <div className={`bonki bonki-${state}`} aria-label="Bonki the DJ cat" role="img">
      <svg
        viewBox="0 0 32 32"
        width="48"
        height="48"
        xmlns="http://www.w3.org/2000/svg"
        shapeRendering="crispEdges"
      >
        {/* --- Headphone Band --- */}
        <rect x="8"  y="4" width="1" height="1" fill="#6b9080" />
        <rect x="9"  y="3" width="1" height="1" fill="#6b9080" />
        <rect x="10" y="2" width="1" height="1" fill="#6b9080" />
        <rect x="11" y="2" width="1" height="1" fill="#6b9080" />
        <rect x="12" y="1" width="1" height="1" fill="#6b9080" />
        <rect x="13" y="1" width="1" height="1" fill="#6b9080" />
        <rect x="14" y="1" width="1" height="1" fill="#6b9080" />
        <rect x="15" y="1" width="1" height="1" fill="#6b9080" />
        <rect x="16" y="1" width="1" height="1" fill="#6b9080" />
        <rect x="17" y="1" width="1" height="1" fill="#6b9080" />
        <rect x="18" y="1" width="1" height="1" fill="#6b9080" />
        <rect x="19" y="2" width="1" height="1" fill="#6b9080" />
        <rect x="20" y="2" width="1" height="1" fill="#6b9080" />
        <rect x="21" y="3" width="1" height="1" fill="#6b9080" />
        <rect x="22" y="4" width="1" height="1" fill="#6b9080" />

        {/* --- Headphone Cups (left and right) --- */}
        <rect x="6"  y="5" width="2" height="3" fill="#6b9080" />
        <rect x="7"  y="4" width="1" height="1" fill="#6b9080" />
        <rect x="7"  y="8" width="1" height="1" fill="#6b9080" />
        <rect x="23" y="5" width="2" height="3" fill="#6b9080" />
        <rect x="23" y="4" width="1" height="1" fill="#6b9080" />
        <rect x="23" y="8" width="1" height="1" fill="#6b9080" />

        {/* --- Fold Ears (small rounded bumps) --- */}
        <rect x="9"  y="4" width="2" height="1" fill="#1a1a1a" />
        <rect x="10" y="3" width="1" height="1" fill="#1a1a1a" />
        <rect x="20" y="4" width="2" height="1" fill="#1a1a1a" />
        <rect x="20" y="3" width="1" height="1" fill="#1a1a1a" />

        {/* --- Head (round Scottish Fold shape) --- */}
        <rect x="11" y="4" width="9" height="1" fill="#1a1a1a" />
        <rect x="9"  y="5" width="13" height="1" fill="#1a1a1a" />
        <rect x="8"  y="6" width="15" height="1" fill="#1a1a1a" />
        <rect x="8"  y="7" width="15" height="1" fill="#1a1a1a" />
        <rect x="8"  y="8" width="15" height="1" fill="#1a1a1a" />
        <rect x="8"  y="9" width="15" height="1" fill="#1a1a1a" />
        <rect x="8"  y="10" width="15" height="1" fill="#1a1a1a" />
        <rect x="8"  y="11" width="15" height="1" fill="#1a1a1a" />
        <rect x="9"  y="12" width="13" height="1" fill="#1a1a1a" />
        <rect x="10" y="13" width="11" height="1" fill="#1a1a1a" />
        <rect x="11" y="14" width="9" height="1" fill="#1a1a1a" />

        {/* --- Eyes (golden amber, THE focal point) --- */}
        <g className="bonki-eyes">
          {/* Left eye */}
          <rect x="11" y="8" width="3" height="3" fill="#f5a623" />
          {/* Left eye highlight (Ghibli sparkle) */}
          <rect x="11" y="8" width="1" height="1" fill="#ffffff" />
          {/* Left pupil */}
          <rect x="12" y="9" width="1" height="1" fill="#1a1a1a" />

          {/* Right eye */}
          <rect x="18" y="8" width="3" height="3" fill="#f5a623" />
          {/* Right eye highlight (Ghibli sparkle) */}
          <rect x="18" y="8" width="1" height="1" fill="#ffffff" />
          {/* Right pupil */}
          <rect x="19" y="9" width="1" height="1" fill="#1a1a1a" />
        </g>

        {/* --- Nose (small dark pink) --- */}
        <rect x="15" y="11" width="1" height="1" fill="#3a2a2a" />

        {/* --- Whiskers (fine lines) --- */}
        <line x1="8" y1="10.5" x2="11" y2="10" stroke="#555555" strokeWidth="0.3" />
        <line x1="8" y1="11.5" x2="11" y2="11.5" stroke="#555555" strokeWidth="0.3" />
        <line x1="20" y1="10" x2="23" y2="10.5" stroke="#555555" strokeWidth="0.3" />
        <line x1="20" y1="11.5" x2="23" y2="11.5" stroke="#555555" strokeWidth="0.3" />

        {/* --- Body (compact loaf shape) --- */}
        <rect x="9"  y="15" width="14" height="1" fill="#1a1a1a" />
        <rect x="7"  y="16" width="17" height="1" fill="#1a1a1a" />
        <rect x="6"  y="17" width="19" height="1" fill="#1a1a1a" />
        <rect x="6"  y="18" width="20" height="1" fill="#1a1a1a" />
        <rect x="5"  y="19" width="21" height="1" fill="#1a1a1a" />
        <rect x="5"  y="20" width="21" height="1" fill="#1a1a1a" />
        <rect x="5"  y="21" width="21" height="1" fill="#1a1a1a" />
        <rect x="5"  y="22" width="21" height="1" fill="#1a1a1a" />
        <rect x="6"  y="23" width="20" height="1" fill="#1a1a1a" />
        <rect x="6"  y="24" width="19" height="1" fill="#1a1a1a" />
        <rect x="7"  y="25" width="17" height="1" fill="#1a1a1a" />

        {/* --- Body highlight (subtle dark gray for depth) --- */}
        <rect x="12" y="18" width="6" height="1" fill="#2d2d2d" />
        <rect x="11" y="19" width="8" height="1" fill="#2d2d2d" />
        <rect x="11" y="20" width="8" height="1" fill="#2d2d2d" />
        <rect x="12" y="21" width="6" height="1" fill="#2d2d2d" />

        {/* --- Paws (front, peeking out) --- */}
        <rect x="8"  y="25" width="3" height="1" fill="#2d2d2d" />
        <rect x="8"  y="26" width="3" height="1" fill="#1a1a1a" />
        <rect x="20" y="25" width="3" height="1" fill="#2d2d2d" />
        <rect x="20" y="26" width="3" height="1" fill="#1a1a1a" />

        {/* --- Tail (curled around right side) --- */}
        <rect x="24" y="22" width="2" height="1" fill="#1a1a1a" />
        <rect x="25" y="21" width="2" height="1" fill="#1a1a1a" />
        <rect x="26" y="20" width="1" height="1" fill="#1a1a1a" />
        <rect x="26" y="19" width="1" height="1" fill="#1a1a1a" />
        <rect x="26" y="18" width="1" height="1" fill="#2d2d2d" />
      </svg>
    </div>
  );
}

export default Bonki;
