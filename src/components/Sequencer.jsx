import React, { useState, useEffect, useRef } from 'react';
import { SOUNDS } from '../utils/patterns.js';

/**
 * Sequencer — Dynamic step grid for building drum patterns.
 *
 * Each row is a sound (kick, snare, hi-hat, etc.).
 * Each column is a step. Tap a cell to toggle it on/off.
 * Active cells show per-row colors. Grid state lives in App.
 * Supports 8 or 16 steps via stepCount prop (grid data is always 16 wide).
 * Beat position indicator sweeps across the grid during playback.
 * Active cells on-beat get a trigger-pop animation (scale + glow).
 * Downbeat markers on beats 1 and midpoint provide visual timing guides.
 *
 * @param {Object} props
 * @param {boolean[][]} props.grid - 2D array: grid[row][step] (always 16 wide)
 * @param {function} props.onToggleCell - Called with (rowIndex, stepIndex)
 * @param {number} props.stepCount - Number of visible steps (8 or 16, default 8)
 * @param {function} [props.onClear] - Called to reset all sequencer cells
 * @param {number|null} [props.beatStep] - Current beat position (0-based) or null when stopped
 */
function Sequencer({ grid, onToggleCell, stepCount = 8, onClear, beatStep = null }) {
  // Track which cells just triggered (for pop animation)
  const [triggeredCells, setTriggeredCells] = useState(new Set());
  const prevBeatRef = useRef(null);

  useEffect(() => {
    if (beatStep !== null && beatStep !== prevBeatRef.current) {
      // Find all active cells in the new beat column
      const newTriggers = new Set();
      grid.forEach((row, rowIndex) => {
        if (row[beatStep]) {
          newTriggers.add(`${rowIndex}-${beatStep}`);
        }
      });
      setTriggeredCells(newTriggers);

      // Clear triggered state after animation completes
      const timer = setTimeout(() => setTriggeredCells(new Set()), 200);
      prevBeatRef.current = beatStep;
      return () => clearTimeout(timer);
    }
  }, [beatStep, grid]);

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
          {grid[rowIndex].slice(0, stepCount).map((active, stepIndex) => {
            const isOnBeat = beatStep === stepIndex;
            const isTriggered = triggeredCells.has(`${rowIndex}-${stepIndex}`);
            const isDownbeat = stepIndex === 0 || stepIndex === Math.floor(stepCount / 2);

            return (
              <button
                key={stepIndex}
                className={[
                  'sequencer-cell',
                  active ? 'active' : '',
                  isOnBeat ? 'on-beat' : '',
                  isTriggered ? 'triggered' : '',
                  isDownbeat ? 'downbeat' : '',
                ].filter(Boolean).join(' ')}
                data-row={rowIndex}
                onClick={() => onToggleCell(rowIndex, stepIndex)}
                aria-label={`${sound.name} step ${stepIndex + 1}`}
                aria-pressed={active}
                type="button"
              />
            );
          })}
        </div>
      ))}

      {/* Column playhead overlay (hidden — column highlight handled by on-beat class) */}
      {beatStep !== null && (
        <div
          className="sequencer-playhead"
          style={{
            '--playhead-col': beatStep,
            '--total-steps': stepCount,
          }}
        />
      )}
    </div>
  );
}

export default Sequencer;
