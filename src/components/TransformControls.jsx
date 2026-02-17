import React, { useCallback } from 'react';
import Knob from './Knob.jsx';
import ToggleSwitch from './ToggleSwitch.jsx';

/**
 * TransformControls -- Per-row pattern transform overrides (swing, probability, speed, reverse).
 *
 * Each control shows whether it's using the global default or a per-row override.
 * "G" badge = using global. No badge = overridden.
 * Double-tap on an overridden knob reverts to global (null).
 *
 * @param {Object} props
 * @param {Object} props.transforms - Row's transform overrides (null values = use global)
 * @param {Object} props.globalTransforms - Current global defaults
 * @param {function} props.onChange - Called with (param, value) -- value can be null to revert
 * @param {string} props.color - Row accent color
 */
export default function TransformControls({ transforms, globalTransforms, onChange, color }) {
  const fmtPct = (v) => `${Math.round(v * 100)}%`;
  const fmtSpeed = (v) => `${v}x`;

  // Resolve effective value (row override or global fallback)
  const effective = (param) => {
    const rowVal = transforms[param];
    return rowVal !== null && rowVal !== undefined ? rowVal : globalTransforms[param];
  };

  const isOverridden = (param) => {
    return transforms[param] !== null && transforms[param] !== undefined;
  };

  // Handler that resets to global on double-tap (when already overridden)
  const handleChange = useCallback((param, value) => {
    onChange(param, value);
  }, [onChange]);

  const handleReset = useCallback((param) => {
    onChange(param, null);
  }, [onChange]);

  // Speed stepped values
  const SPEED_STEPS = [0.25, 0.5, 1, 2, 4];
  const currentSpeed = effective('speed') || 1;
  const nextSpeed = () => {
    const idx = SPEED_STEPS.indexOf(currentSpeed);
    return SPEED_STEPS[Math.min(idx + 1, SPEED_STEPS.length - 1)];
  };
  const prevSpeed = () => {
    const idx = SPEED_STEPS.indexOf(currentSpeed);
    return SPEED_STEPS[Math.max(idx - 1, 0)];
  };

  return (
    <div className="transform-controls">
      <span className="effect-node-label">Transforms</span>
      <div className="transform-knobs">
        {/* Swing */}
        <div className="transform-param">
          {!isOverridden('swing') && <span className="transform-global-badge">G</span>}
          <Knob
            label="SWING"
            value={effective('swing') || 0}
            min={0}
            max={1}
            step={0.01}
            onChange={(v) => handleChange('swing', v)}
            size={36}
            color={color}
            defaultValue={null}
            formatValue={fmtPct}
          />
        </div>

        {/* Probability (degradeBy) */}
        <div className="transform-param">
          {!isOverridden('degradeBy') && <span className="transform-global-badge">G</span>}
          <Knob
            label="PROB"
            value={effective('degradeBy') || 0}
            min={0}
            max={1}
            step={0.01}
            onChange={(v) => handleChange('degradeBy', v)}
            size={36}
            color={color}
            defaultValue={null}
            formatValue={fmtPct}
          />
        </div>

        {/* Speed (stepped) */}
        <div className="transform-param">
          {!isOverridden('speed') && <span className="transform-global-badge">G</span>}
          <div className="speed-control">
            <button
              type="button"
              className="speed-btn"
              onClick={() => handleChange('speed', prevSpeed())}
              disabled={currentSpeed <= 0.25}
            >-</button>
            <span className="speed-value">{fmtSpeed(currentSpeed)}</span>
            <button
              type="button"
              className="speed-btn"
              onClick={() => handleChange('speed', nextSpeed())}
              disabled={currentSpeed >= 4}
            >+</button>
          </div>
          <span className="knob-label">SPEED</span>
        </div>

        {/* Reverse */}
        <div className="transform-param">
          {!isOverridden('reverse') && <span className="transform-global-badge">G</span>}
          <ToggleSwitch
            active={effective('reverse') || false}
            onChange={(v) => handleChange('reverse', v)}
            size={24}
            color={color}
          />
          <span className="knob-label">REV</span>
        </div>
      </div>
    </div>
  );
}
