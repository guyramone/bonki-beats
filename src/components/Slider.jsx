import React, { useMemo } from 'react';

/**
 * Slider — TE-inspired styled range input for volume/mix/gain levels
 *
 * Custom-styled <input type="range"> with colored fill track, thumb,
 * value display, and label. Supports vertical orientation.
 * Minimum 48px touch target.
 *
 * @param {Object} props
 * @param {string} props.label - Parameter name displayed below
 * @param {number} props.value - Current value
 * @param {number} props.min - Minimum value
 * @param {number} props.max - Maximum value
 * @param {number} [props.step=0.01] - Step increment
 * @param {function} props.onChange - Called with new numeric value on change
 * @param {string} [props.unit] - Unit suffix for display
 * @param {string} [props.color] - CSS color for fill/thumb (default: --accent-primary)
 * @param {function} [props.formatValue] - Custom display formatter
 * @param {boolean} [props.vertical=false] - Render vertically
 */
export default function Slider({
  label,
  value,
  min,
  max,
  step = 0.01,
  onChange,
  unit = '',
  color,
  formatValue,
  vertical = false,
}) {
  // --- Display value ---
  const displayValue = useMemo(() => {
    if (formatValue) return formatValue(value);
    // Auto-format: show decimal only if step is < 1
    if (step >= 1) return `${Math.round(value)}${unit}`;
    const decimals = Math.max(0, -Math.floor(Math.log10(step)));
    return `${value.toFixed(decimals)}${unit}`;
  }, [value, step, unit, formatValue]);

  // --- Fill percentage for track gradient ---
  const fillPercent = useMemo(() => {
    if (max === min) return 0;
    return ((value - min) / (max - min)) * 100;
  }, [value, min, max]);

  // --- Track background gradient (fill color left, surface right) ---
  const sliderColor = color || 'var(--accent-primary)';
  const trackBg = `linear-gradient(to right, ${sliderColor} ${fillPercent}%, var(--surface-elevated) ${fillPercent}%)`;

  const handleChange = (e) => {
    onChange(parseFloat(e.target.value));
  };

  return (
    <div className={`slider-container ${vertical ? 'vertical' : ''}`}>
      {/* Value display */}
      <span className="slider-value">{displayValue}</span>

      {/* Range input */}
      <input
        type="range"
        className="slider-input"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        style={{
          '--slider-bg': trackBg,
          '--slider-color': sliderColor,
        }}
      />

      {/* Label */}
      {label && <span className="slider-label">{label}</span>}
    </div>
  );
}
