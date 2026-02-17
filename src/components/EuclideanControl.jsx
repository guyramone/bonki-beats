import React from 'react';

/**
 * Bjorklund algorithm: distribute `pulses` hits as evenly as possible across `steps` slots.
 * Returns an array of booleans where true = active hit.
 *
 * @param {number} pulses - Number of active hits
 * @param {number} steps - Total number of slots
 * @returns {boolean[]} Pattern array
 */
function bjorklund(pulses, steps) {
  if (pulses >= steps) return Array(steps).fill(true);
  if (pulses <= 0) return Array(steps).fill(false);

  let pattern = [];
  let counts = [];
  let remainders = [];

  let divisor = steps - pulses;
  remainders.push(pulses);
  let level = 0;

  while (remainders[level] > 1) {
    counts.push(Math.floor(divisor / remainders[level]));
    remainders.push(divisor % remainders[level]);
    divisor = remainders[level];
    level++;
  }
  counts.push(divisor);

  function build(l) {
    if (l === -1) {
      pattern.push(false);
    } else if (l === -2) {
      pattern.push(true);
    } else {
      for (let i = 0; i < counts[l]; i++) {
        build(l - 1);
      }
      if (remainders[l] !== 0) {
        build(l - 2);
      }
    }
  }

  build(level);
  // The algorithm outputs with the first beat = true by convention
  // Reverse to get the standard euclidean ordering (first hit at start)
  pattern = pattern.reverse();
  // Ensure first element is true (rotate to first hit)
  const firstHit = pattern.indexOf(true);
  if (firstHit > 0) {
    pattern = [...pattern.slice(firstHit), ...pattern.slice(0, firstHit)];
  }
  return pattern;
}

/**
 * Apply rotation to a pattern (shift by N positions).
 *
 * @param {boolean[]} pattern - The base pattern
 * @param {number} rotation - Number of positions to rotate
 * @returns {boolean[]}
 */
function rotatePattern(pattern, rotation) {
  if (!rotation || rotation === 0) return pattern;
  const len = pattern.length;
  const rot = ((rotation % len) + len) % len;
  return [...pattern.slice(rot), ...pattern.slice(0, rot)];
}

/**
 * Named rhythm lookup: maps (pulses,steps) to known world rhythm names.
 */
const NAMED_RHYTHMS = {
  '3,4': 'Afro-Cuban',
  '2,5': 'Khafif-e-ramal',
  '3,8': 'Tresillo',
  '5,8': 'Cinquillo',
  '7,8': 'Bembe',
  '4,9': 'Turkish Aksak',
  '7,12': 'West African Bell',
  '5,16': 'Bossa Nova',
  '3,7': 'Ruchenitza',
  '5,12': 'Venda',
};

/**
 * EuclideanControl -- Pulses/steps steppers with circular SVG ring preview.
 *
 * Displays a ring of dots showing the euclidean pattern, with controls
 * for pulses, steps, and rotation. Shows named rhythm hints for known patterns.
 *
 * @param {Object} props
 * @param {number} props.pulses - Number of active pulses (0 to steps)
 * @param {number} props.steps - Total number of steps (1-32)
 * @param {number} props.rotation - Rotation offset (0 to steps-1)
 * @param {function} props.onChange - Called with { pulses, steps, rotation }
 * @param {number} props.size - Ring preview diameter (default 64)
 * @param {string} props.color - Ring color (default accent-primary)
 * @param {boolean} props.disabled - Whether in manual mode (show switch button)
 * @param {function} props.onSwitchToEuclid - Called to switch from manual to euclidean mode
 */
function EuclideanControl({
  pulses = 0,
  steps = 8,
  rotation = 0,
  onChange,
  size = 64,
  color = '#f5a623',
  disabled = false,
  onSwitchToEuclid,
}) {
  // If disabled (manual mode), show a switch button
  if (disabled) {
    return (
      <div className="euclid-control euclid-disabled">
        <button
          className="euclid-switch-btn"
          onClick={onSwitchToEuclid}
          type="button"
        >
          Switch to Euclidean
        </button>
      </div>
    );
  }

  // Generate pattern
  const basePattern = bjorklund(pulses, steps);
  const pattern = rotatePattern(basePattern, rotation);

  // Check for named rhythm
  const rhythmKey = `${pulses},${steps}`;
  const rhythmName = NAMED_RHYTHMS[rhythmKey] || null;

  // SVG ring geometry
  const center = size / 2;
  const radius = (size / 2) - 8;
  const angleStep = (2 * Math.PI) / steps;

  // Connect active dots with arcs
  const activeIndices = pattern.reduce((acc, hit, i) => {
    if (hit) acc.push(i);
    return acc;
  }, []);

  const handlePulsesChange = (delta) => {
    const newPulses = Math.max(0, Math.min(steps, pulses + delta));
    onChange({ pulses: newPulses, steps, rotation });
  };

  const handleStepsChange = (delta) => {
    const newSteps = Math.max(1, Math.min(32, steps + delta));
    const newPulses = Math.min(pulses, newSteps);
    const newRotation = Math.min(rotation, newSteps - 1);
    onChange({ pulses: newPulses, steps: newSteps, rotation: newRotation });
  };

  const handleRotationChange = (delta) => {
    const newRotation = ((rotation + delta) % steps + steps) % steps;
    onChange({ pulses, steps, rotation: newRotation });
  };

  return (
    <div className="euclid-control">
      {/* SVG Ring Preview */}
      <div className="euclid-ring-wrapper">
        <svg
          className="euclid-ring"
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
        >
          {/* Background ring */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="var(--bg-tertiary, #2a2a2a)"
            strokeWidth="1"
          />

          {/* Connecting lines between consecutive active dots */}
          {activeIndices.length >= 2 && activeIndices.map((idx, i) => {
            const nextIdx = activeIndices[(i + 1) % activeIndices.length];
            const angle1 = idx * angleStep - Math.PI / 2;
            const angle2 = nextIdx * angleStep - Math.PI / 2;
            const x1 = center + radius * Math.cos(angle1);
            const y1 = center + radius * Math.sin(angle1);
            const x2 = center + radius * Math.cos(angle2);
            const y2 = center + radius * Math.sin(angle2);
            return (
              <line
                key={`line-${i}`}
                x1={x1} y1={y1}
                x2={x2} y2={y2}
                stroke={color}
                strokeWidth="1"
                strokeOpacity="0.3"
              />
            );
          })}

          {/* Dots */}
          {pattern.map((hit, i) => {
            const angle = i * angleStep - Math.PI / 2;
            const x = center + radius * Math.cos(angle);
            const y = center + radius * Math.sin(angle);
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={hit ? 4 : 2}
                fill={hit ? color : 'var(--surface-elevated, #2a2a2a)'}
                className={`euclid-dot${hit ? ' active' : ' inactive'}`}
              />
            );
          })}
        </svg>
      </div>

      {/* Controls */}
      <div className="euclid-controls">
        {/* Pulses stepper */}
        <div className="euclid-stepper">
          <span className="euclid-stepper-label">Pulses</span>
          <button
            className="euclid-btn"
            onClick={() => handlePulsesChange(-1)}
            type="button"
            disabled={pulses <= 0}
            aria-label="Decrease pulses"
          >
            -
          </button>
          <span className="euclid-value">{pulses}</span>
          <button
            className="euclid-btn"
            onClick={() => handlePulsesChange(1)}
            type="button"
            disabled={pulses >= steps}
            aria-label="Increase pulses"
          >
            +
          </button>
        </div>

        {/* Steps stepper */}
        <div className="euclid-stepper">
          <span className="euclid-stepper-label">Steps</span>
          <button
            className="euclid-btn"
            onClick={() => handleStepsChange(-1)}
            type="button"
            disabled={steps <= 1}
            aria-label="Decrease steps"
          >
            -
          </button>
          <span className="euclid-value">{steps}</span>
          <button
            className="euclid-btn"
            onClick={() => handleStepsChange(1)}
            type="button"
            disabled={steps >= 32}
            aria-label="Increase steps"
          >
            +
          </button>
        </div>

        {/* Rotation stepper (show only when pulses > 0) */}
        {pulses > 0 && (
          <div className="euclid-stepper">
            <span className="euclid-stepper-label">Rotate</span>
            <button
              className="euclid-btn"
              onClick={() => handleRotationChange(-1)}
              type="button"
              aria-label="Rotate pattern left"
            >
              -
            </button>
            <span className="euclid-value">{rotation}</span>
            <button
              className="euclid-btn"
              onClick={() => handleRotationChange(1)}
              type="button"
              aria-label="Rotate pattern right"
            >
              +
            </button>
          </div>
        )}

        {/* Named rhythm hint */}
        {rhythmName && (
          <div className="euclid-rhythm-name">{rhythmName}</div>
        )}
      </div>
    </div>
  );
}

export default EuclideanControl;
export { bjorklund, rotatePattern, NAMED_RHYTHMS };
