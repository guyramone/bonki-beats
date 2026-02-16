import React, { useState, useCallback } from 'react';
import { PADS } from '../utils/patterns.js';

/**
 * Pads — 4x4 grid of tappable sound pads.
 *
 * Each pad triggers a pre-built Strudel pattern on tap.
 * Visual flash feedback (200ms) confirms the hit.
 * Color-coded by category: warm (drums/perc), cool (patterns), gold (weird/fun).
 *
 * @param {Object} props
 * @param {function} props.onPadTap - Called with pad object { id, label, pattern, color }
 */
function Pads({ onPadTap }) {
  const [flashingPads, setFlashingPads] = useState({});

  const handleTap = useCallback((pad) => {
    // Trigger sound
    onPadTap(pad);

    // Flash feedback
    setFlashingPads(prev => ({ ...prev, [pad.id]: true }));
    setTimeout(() => {
      setFlashingPads(prev => ({ ...prev, [pad.id]: false }));
    }, 200);
  }, [onPadTap]);

  return (
    <div className="pads-grid">
      {PADS.map((pad) => (
        <button
          key={pad.id}
          className={`pad pad-${pad.color}${flashingPads[pad.id] ? ' flash' : ''}`}
          onClick={() => handleTap(pad)}
          aria-label={pad.label}
          type="button"
        >
          {pad.label}
        </button>
      ))}
    </div>
  );
}

export default Pads;
