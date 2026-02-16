import React from 'react';
import { SOUNDS } from '../utils/patterns.js';

/**
 * Sequencer — 8-step x 4-row grid for building drum patterns.
 *
 * Each row is a sound (kick, snare, hi-hat, clap).
 * Each column is a step. Tap a cell to toggle it on/off.
 * Active cells light up terracotta. Grid state lives in App.
 *
 * @param {Object} props
 * @param {boolean[][]} props.grid - 2D array: grid[row][step]
 * @param {function} props.onToggleCell - Called with (rowIndex, stepIndex)
 */
function Sequencer({ grid, onToggleCell }) {
  return (
    <div className="sequencer">
      {SOUNDS.map((sound, rowIndex) => (
        <div className="sequencer-grid" key={sound.name}>
          <span className="sequencer-label">{sound.name}</span>
          {grid[rowIndex].map((active, stepIndex) => (
            <button
              key={stepIndex}
              className={`sequencer-cell${active ? ' active' : ''}`}
              onClick={() => onToggleCell(rowIndex, stepIndex)}
              aria-label={`${sound.name} step ${stepIndex + 1}`}
              aria-pressed={active}
              type="button"
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default Sequencer;
