import React from 'react';

/**
 * ToggleSwitch — Glowing bypass toggle for effects nodes
 *
 * A circular button that toggles between active (filled + glowing)
 * and inactive (outlined, dim) states. Used for effect bypass
 * in the signal chain layout.
 *
 * @param {Object} props
 * @param {boolean} props.active - Whether the toggle is on
 * @param {function} props.onChange - Called with new boolean state
 * @param {string} [props.label] - Optional label displayed below
 * @param {string} [props.color] - CSS color for glow/fill (default: --accent-primary)
 * @param {number} [props.size=32] - Diameter in px
 */
export default function ToggleSwitch({
  active,
  onChange,
  label,
  color,
  size = 32,
}) {
  const handleClick = () => {
    onChange(!active);
  };

  return (
    <div className="toggle-container">
      <button
        type="button"
        className={`toggle-switch ${active ? 'active' : ''}`}
        onClick={handleClick}
        aria-pressed={active}
        aria-label={label || 'Toggle'}
        style={{
          '--toggle-color': color || 'var(--accent-primary)',
          '--toggle-size': `${size}px`,
        }}
      />
      {label && <span className="toggle-label">{label}</span>}
    </div>
  );
}
