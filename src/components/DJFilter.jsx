import React, { useMemo, useCallback } from 'react';
import Knob from './Knob.jsx';

/**
 * DJFilter -- Featured single-knob LP-to-HP sweep control
 *
 * The "crowd-pleaser" knob. Sweeps from full low-pass (bass only)
 * through bypass (flat) to full high-pass (treble only).
 * Maps to Strudel's .djf() method at the master/orbit level.
 *
 * Value mapping: 0 = full LP (bass), 0.5 = bypass (flat), 1 = full HP (treble)
 * Arc color interpolates warm (red/orange) at LP end to cool (blue/cyan) at HP end.
 *
 * @param {Object} props
 * @param {number} props.value - 0-1, where 0.5 = bypass
 * @param {function} props.onChange - Called with new value on drag
 * @param {number} [props.size=56] - Knob diameter (slightly larger than standard)
 */
export default function DJFilter({ value, onChange, size = 56 }) {
  // --- Color interpolation: warm (LP) -> neutral (center) -> cool (HP) ---
  const arcColor = useMemo(() => {
    if (value <= 0.5) {
      // LP side: red-orange (#e85d3a) at 0, transition to gold (#f5a623) at 0.5
      const t = value / 0.5;
      const r = Math.round(232 + (245 - 232) * t);
      const g = Math.round(93 + (166 - 93) * t);
      const b = Math.round(58 + (35 - 58) * t);
      return `rgb(${r}, ${g}, ${b})`;
    } else {
      // HP side: gold (#f5a623) at 0.5, transition to cyan (#5bc0de) at 1
      const t = (value - 0.5) / 0.5;
      const r = Math.round(245 + (91 - 245) * t);
      const g = Math.round(166 + (192 - 166) * t);
      const b = Math.round(35 + (222 - 35) * t);
      return `rgb(${r}, ${g}, ${b})`;
    }
  }, [value]);

  // --- Display formatter ---
  const formatValue = useCallback((v) => {
    if (Math.abs(v - 0.5) < 0.02) return 'FLAT';
    if (v < 0.5) {
      const pct = Math.round((1 - v / 0.5) * 100);
      return `LP ${pct}%`;
    }
    const pct = Math.round(((v - 0.5) / 0.5) * 100);
    return `HP ${pct}%`;
  }, []);

  return (
    <div className="dj-filter">
      <Knob
        label="DJ FILTER"
        value={value}
        min={0}
        max={1}
        step={0.01}
        onChange={onChange}
        size={size}
        color={arcColor}
        defaultValue={0.5}
        formatValue={formatValue}
      />
    </div>
  );
}
