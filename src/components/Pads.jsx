import React, { useState, useCallback } from 'react';
import { ROW_COLORS, getRowLabel } from '../utils/rowModel.js';
import { soundToLabel } from '../utils/soundCatalog.js';

/**
 * Pads -- 4x8 grid of tappable sound pads with two banks (A/B).
 *
 * Bank A: pads 1-16 map to sequencer rows 0-15 (one-shot triggers).
 * Bank B: pads 1-16 map to rows 0-15 with different voicings (structural expansion slot).
 *
 * On mobile: shows 4x4 with bank tabs. On tablet+: shows full 4x8 (all 32 pads).
 * Each pad triggers the row's current sound as a one-shot evaluation.
 *
 * @param {Object} props
 * @param {Array} props.rows - The 16 sequencer rows from the row model
 * @param {function} props.onPadTap - Called with (rowIndex) to trigger the row's sound
 * @param {string} props.activeBank - 'A' or 'B'
 * @param {function} props.onBankChange - Called with bank letter ('A' or 'B')
 */
function Pads({ rows, onPadTap, activeBank, onBankChange }) {
  const [flashingPads, setFlashingPads] = useState({});

  const handleTap = useCallback((rowIndex, bankKey) => {
    // Trigger sound for this row
    onPadTap(rowIndex);

    // Flash feedback
    const padKey = `${bankKey}-${rowIndex}`;
    setFlashingPads(prev => ({ ...prev, [padKey]: true }));
    setTimeout(() => {
      setFlashingPads(prev => ({ ...prev, [padKey]: false }));
    }, 200);
  }, [onPadTap]);

  /**
   * Render a single bank of 16 pads (4 columns x 4 rows).
   * @param {string} bankKey - 'A' or 'B'
   * @param {string} suffix - label suffix for Bank B differentiation
   */
  const renderBank = (bankKey, suffix = '') => (
    <div className="pads-bank" data-bank={bankKey}>
      {rows.map((row, rowIndex) => {
        const padKey = `${bankKey}-${rowIndex}`;
        const color = ROW_COLORS[rowIndex] || '#888';
        const label = getRowLabel(row, rowIndex);
        const soundName = soundToLabel ? soundToLabel(row.sound) : '';
        const isFlashing = flashingPads[padKey];

        return (
          <button
            key={padKey}
            className={`pad pad-row${isFlashing ? ' flash' : ''}`}
            style={{
              '--pad-color': color,
              borderLeft: `3px solid ${color}`,
              background: isFlashing ? color : undefined,
              color: isFlashing ? 'var(--bg-primary)' : undefined,
            }}
            onClick={() => handleTap(rowIndex, bankKey)}
            aria-label={`${label}${suffix} pad`}
            type="button"
          >
            <span className="pad-label">{label}{suffix}</span>
            <span className="pad-sound">{soundName}</span>
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="pads-container">
      {/* Bank selector tabs */}
      <div className="bank-tabs">
        <button
          className={`bank-tab${activeBank === 'A' ? ' active' : ''}`}
          onClick={() => onBankChange('A')}
          type="button"
        >
          A
        </button>
        <button
          className={`bank-tab${activeBank === 'B' ? ' active' : ''}`}
          onClick={() => onBankChange('B')}
          type="button"
        >
          B
        </button>
      </div>

      {/* Pad grid area */}
      <div className="pads-grid-area">
        {/* Mobile: show only active bank's 4x4 */}
        <div className="pads-mobile">
          {activeBank === 'A' ? renderBank('A') : renderBank('B', '*')}
        </div>

        {/* Tablet+: show both banks stacked as 4x8 (all 32) */}
        <div className="pads-desktop">
          {renderBank('A')}
          {renderBank('B', '*')}
        </div>
      </div>
    </div>
  );
}

export default Pads;
