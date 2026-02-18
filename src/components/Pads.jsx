import React, { useState, useCallback } from 'react';
import { ROW_COLORS, getRowLabel } from '../utils/rowModel.js';
import { soundToLabel } from '../utils/soundCatalog.js';

/**
 * Pads -- Dual-mode pad grid: compact inline strip OR full performance view.
 *
 * compact=true: 2x8 mini-pad strip for inline docking below sequencer (tablet+).
 *   Small, tappable, always visible. Each pad shows row color + abbreviated name.
 *
 * compact=false (default): Full 4x8 performance pad view with banks.
 *   Edge-to-edge pads, big and chunky (100px mobile, 140px tablet+).
 *   Bank A: pads 1-16 map to sequencer rows 0-15.
 *   Bank B: pads 1-16 map to rows 0-15 with different voicings.
 *
 * @param {Object} props
 * @param {Array} props.rows - The 16 sequencer rows from the row model
 * @param {function} props.onPadTap - Called with (rowIndex) to trigger the row's sound
 * @param {string} props.activeBank - 'A' or 'B'
 * @param {function} props.onBankChange - Called with bank letter ('A' or 'B')
 * @param {boolean} props.compact - If true, render as mini-pad strip
 */
function Pads({ rows, onPadTap, activeBank, onBankChange, compact = false }) {
  const [flashingPads, setFlashingPads] = useState({});

  const handleTap = useCallback((rowIndex, bankKey) => {
    onPadTap(rowIndex);

    const padKey = `${bankKey}-${rowIndex}`;
    setFlashingPads(prev => ({ ...prev, [padKey]: true }));
    setTimeout(() => {
      setFlashingPads(prev => ({ ...prev, [padKey]: false }));
    }, 200);
  }, [onPadTap]);

  // --- Compact Mini-Pad Strip ---
  if (compact) {
    return (
      <div className="mini-pads">
        {rows.map((row, rowIndex) => {
          const padKey = `mini-${rowIndex}`;
          const color = ROW_COLORS[rowIndex] || '#888';
          const label = getRowLabel(row, rowIndex);
          const isFlashing = flashingPads[padKey];

          return (
            <button
              key={padKey}
              className={`mini-pad${isFlashing ? ' flash' : ''}`}
              style={{
                '--pad-color': color,
                borderColor: color,
                background: isFlashing ? color : undefined,
                color: isFlashing ? 'var(--bg-primary)' : undefined,
              }}
              onClick={() => {
                onPadTap(rowIndex);
                setFlashingPads(prev => ({ ...prev, [padKey]: true }));
                setTimeout(() => setFlashingPads(prev => ({ ...prev, [padKey]: false })), 200);
              }}
              aria-label={`${label} mini pad`}
              type="button"
            >
              <span className="mini-pad-label">{label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // --- Full Performance Pad View ---
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
            className={`pad pad-row pad-performance${isFlashing ? ' flash' : ''}`}
            style={{
              '--pad-color': color,
              borderLeft: `4px solid ${color}`,
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
    <div className="pads-container pads-performance">
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
