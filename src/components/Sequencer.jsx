import React from 'react';
import { SOUNDS } from '../utils/patterns.js';

/**
 * Sequencer — Dynamic step grid for building drum patterns.
 *
 * Each row is a sound (kick, snare, hi-hat, clap).
 * Each column is a step. Tap a cell to toggle it on/off.
 * Active cells show per-row colors. Grid state lives in App.
 * Supports 8 or 16 steps via stepCount prop (grid data is always 16 wide).
 * Beat position indicator sweeps across the grid during playback.
 *
 * @param {Object} props
 * @param {boolean[][]} props.grid - 2D array: grid[row][step] (always 16 wide)
 * @param {function} props.onToggleCell - Called with (rowIndex, stepIndex)
 * @param {number} props.stepCount - Number of visible steps (8 or 16, default 8)
 * @param {function} [props.onClear] - Called to reset all sequencer cells
 * @param {number|null} [props.beatStep] - Current beat position (0-based) or null when stopped
 */
function Sequencer({ grid, onToggleCell, stepCount = 8, onClear, beatStep = null }) {
  return (
    <div className="sequencer" style={{ '--step-count': stepCount }}>
      <div className="sequencer-header">
        {onClear && (
          <button
            className="sequencer-clear-btn"
            onClick={onClear}
            type="button"
            aria-label="Clear all sequencer cells"
          >
            Clear
          </button>
        )}
      </div>
      {SOUNDS.map((sound, rowIndex) => (
        <div className="sequencer-grid" key={sound.name}>
          <span className="sequencer-label">{sound.name}</span>
          {grid[rowIndex].slice(0, stepCount).map((active, stepIndex) => (
            <button
              key={stepIndex}
              className={`sequencer-cell${active ? ' active' : ''}${beatStep === stepIndex ? ' on-beat' : ''}`}
              data-row={rowIndex}
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
