import React, { useState, useCallback, useMemo } from 'react';
import { KnobHeadless, KnobHeadlessLabel, KnobHeadlessOutput } from 'react-knob-headless';

/**
 * Knob — TE-inspired rotary knob wrapping react-knob-headless
 *
 * SVG visuals: background track, colored value arc, indicator line, center cap.
 * Supports logarithmic scale mapping for frequency parameters (cutoff, etc.).
 * Vertical drag: up = increase, down = decrease (Ableton-style).
 * Double-tap resets to default value.
 *
 * @param {Object} props
 * @param {string} props.label - Parameter name displayed below knob
 * @param {number} props.value - Current value
 * @param {number} props.min - Minimum value
 * @param {number} props.max - Maximum value
 * @param {function} props.onChange - Called with new value on drag
 * @param {string} [props.unit] - Unit suffix for display (e.g. 'Hz', '%')
 * @param {boolean} [props.logScale] - Use logarithmic mapping (for frequency)
 * @param {number} [props.size=48] - Knob diameter in px (min 48 for touch)
 * @param {string} [props.color] - CSS color for arc/glow (default: --accent-primary)
 * @param {number} [props.step=1] - Step size for rounding
 * @param {number} [props.defaultValue] - Reset target on double-tap
 * @param {function} [props.formatValue] - Custom display formatter
 */
export default function Knob({
  label,
  value,
  min,
  max,
  onChange,
  unit = '',
  logScale = false,
  size = 48,
  color,
  step = 1,
  defaultValue,
  formatValue,
}) {
  const [isDragging, setIsDragging] = useState(false);

  // --- Logarithmic / Linear mapping ---
  // react-knob-headless passes (value, min, max) to mapTo01/mapFrom01
  const mapTo01 = useCallback((v, lo, hi) => {
    if (logScale && lo > 0) {
      return Math.log(v / lo) / Math.log(hi / lo);
    }
    return (v - lo) / (hi - lo);
  }, [logScale]);

  const mapFrom01 = useCallback((n, lo, hi) => {
    if (logScale && lo > 0) {
      return lo * Math.pow(hi / lo, n);
    }
    return lo + n * (hi - lo);
  }, [logScale]);

  // --- Rounding ---
  const roundFn = useCallback((v) => {
    if (step < 1) {
      const decimals = Math.max(0, -Math.floor(Math.log10(step)));
      return parseFloat(v.toFixed(decimals));
    }
    return Math.round(v / step) * step;
  }, [step]);

  // --- Display value ---
  const displayFn = useCallback((v) => {
    if (formatValue) return formatValue(v);
    const rounded = roundFn(v);
    return `${rounded}${unit}`;
  }, [formatValue, roundFn, unit]);

  // --- Normalized 0-1 for arc drawing ---
  const norm01 = useMemo(() => {
    return mapTo01(value, min, max);
  }, [value, min, max, mapTo01]);

  // --- SVG Arc ---
  // Arc sweeps from -135deg (min) to +135deg (max), total 270deg
  const startAngleDeg = -135;
  const endAngleDeg = startAngleDeg + norm01 * 270;

  // Indicator tip position
  const indicatorAngleRad = (endAngleDeg * Math.PI) / 180;
  const cx = 24;
  const cy = 24;
  const arcRadius = 19;
  const indicatorRadius = 16;

  // --- Double-tap reset ---
  const handleDoubleClick = () => {
    if (defaultValue !== undefined && onChange) {
      onChange(defaultValue);
    }
  };

  // --- Active state tracking ---
  const handlePointerDown = () => setIsDragging(true);
  const handlePointerUp = () => setIsDragging(false);

  return (
    <div
      className={`knob-container ${isDragging ? 'knob-active' : ''}`}
      style={{ '--knob-color': color || 'var(--accent-primary)' }}
      onDoubleClick={handleDoubleClick}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => setIsDragging(false)}
    >
      {/* Value display above */}
      <span className="knob-value">{displayFn(value)}</span>

      {/* Headless knob wrapper (handles drag + ARIA) */}
      <KnobHeadless
        valueRaw={value}
        valueMin={min}
        valueMax={max}
        dragSensitivity={0.006}
        valueRawRoundFn={roundFn}
        valueRawDisplayFn={displayFn}
        mapTo01={mapTo01}
        mapFrom01={mapFrom01}
        onValueRawChange={onChange}
        aria-label={label}
        includeIntoTabOrder={true}
        style={{ width: size, height: size, cursor: 'grab' }}
      >
        {/* SVG knob visual */}
        <svg
          viewBox="0 0 48 48"
          width={size}
          height={size}
          className="knob-svg"
        >
          {/* Background track ring */}
          <circle
            cx={cx}
            cy={cy}
            r={arcRadius}
            className="knob-track"
            fill="none"
            strokeWidth="3"
          />

          {/* Value arc */}
          {norm01 > 0.001 && (
            <path
              d={describeArc(cx, cy, arcRadius, startAngleDeg, endAngleDeg)}
              className="knob-arc"
              fill="none"
              strokeWidth="3"
              strokeLinecap="round"
            />
          )}

          {/* Center cap (3D gradient) */}
          <defs>
            <radialGradient id={`cap-grad-${label}`} cx="45%" cy="40%">
              <stop offset="0%" stopColor="var(--bg-secondary)" stopOpacity="1" />
              <stop offset="100%" stopColor="var(--bg-primary)" stopOpacity="1" />
            </radialGradient>
          </defs>
          <circle
            cx={cx}
            cy={cy}
            r={10}
            className="knob-cap"
            fill={`url(#cap-grad-${label})`}
          />

          {/* Indicator line */}
          <line
            x1={cx}
            y1={cy}
            x2={cx + indicatorRadius * Math.sin(indicatorAngleRad)}
            y2={cy - indicatorRadius * Math.cos(indicatorAngleRad)}
            className="knob-indicator"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Bright dot at indicator tip */}
          <circle
            cx={cx + indicatorRadius * Math.sin(indicatorAngleRad)}
            cy={cy - indicatorRadius * Math.cos(indicatorAngleRad)}
            r={2.5}
            className="knob-dot"
          />
        </svg>
      </KnobHeadless>

      {/* Label below */}
      <span className="knob-label">{label}</span>
    </div>
  );
}

/**
 * Generate SVG arc path between two angles (in degrees).
 * 0deg = top (12 o'clock), clockwise positive.
 * Range: -135deg (min) to +135deg (max), 270deg total sweep.
 */
function describeArc(cx, cy, radius, startAngle, endAngle) {
  const startRad = ((startAngle - 90) * Math.PI) / 180;
  const endRad = ((endAngle - 90) * Math.PI) / 180;

  const x1 = cx + radius * Math.cos(startRad);
  const y1 = cy + radius * Math.sin(startRad);
  const x2 = cx + radius * Math.cos(endRad);
  const y2 = cy + radius * Math.sin(endRad);

  const sweep = endAngle - startAngle;
  const largeArc = sweep > 180 ? 1 : 0;

  return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`;
}
