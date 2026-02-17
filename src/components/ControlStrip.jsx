import React from 'react';
import { bpmToHue } from '../utils/layers.js';
import { STEP_OPTIONS } from '../utils/patterns.js';

/**
 * ControlStrip — BPM slider, volume slider, 8/16 step toggle.
 *
 * Horizontal strip always visible between tab bar and content area.
 * BPM slider color shifts at extremes (blue 60 -> green 120 -> red 180).
 * Volume displays as percentage. Step toggle is a segmented control.
 *
 * @param {Object} props
 * @param {number} props.bpm - Current BPM (60-180)
 * @param {function} props.onBpmChange - Called with new BPM number
 * @param {number} props.volume - Current volume (0-1)
 * @param {function} props.onVolumeChange - Called with new volume (0-1)
 * @param {number} props.stepCount - Current step count (8 or 16)
 * @param {function} props.onStepCountChange - Called with new step count
 * @param {boolean} props.isPlaying - Whether audio is currently playing
 * @param {boolean} props.scalePickerOpen - Whether scale picker panel is visible
 * @param {function} props.onScaleToggle - Called to toggle scale picker visibility
 */
function ControlStrip({ bpm, onBpmChange, volume, onVolumeChange, stepCount, onStepCountChange, isPlaying, scalePickerOpen, onScaleToggle }) {
  const hue = bpmToHue(bpm);

  return (
    <div className="controls-strip">
      {/* BPM Control */}
      <div className="control-group">
        <span className="control-label">BPM</span>
        <input
          type="range"
          className="bpm-slider"
          min={60}
          max={180}
          value={bpm}
          onChange={(e) => onBpmChange(Number(e.target.value))}
          style={{ '--bpm-hue': hue }}
          aria-label="Tempo in BPM"
        />
        <span className="control-readout">{bpm} BPM</span>
      </div>

      {/* Volume Control */}
      <div className="control-group">
        <span className="control-label">VOL</span>
        <input
          type="range"
          className="volume-slider"
          min={0}
          max={100}
          value={Math.round(volume * 100)}
          onChange={(e) => onVolumeChange(Number(e.target.value) / 100)}
          aria-label="Master volume"
        />
        <span className="control-readout">{Math.round(volume * 100)}%</span>
      </div>

      {/* Step Count Toggle */}
      <div className="control-group">
        <div className="step-toggle">
          {STEP_OPTIONS.map((opt) => (
            <button
              key={opt}
              className={`step-toggle-btn${stepCount === opt ? ' active' : ''}`}
              onClick={() => onStepCountChange(opt)}
              aria-label={`${opt} steps`}
              aria-pressed={stepCount === opt}
              type="button"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Scale Picker Toggle */}
      {onScaleToggle && (
        <div className="control-group">
          <button
            className={`scale-toggle-btn${scalePickerOpen ? ' active' : ''}`}
            onClick={onScaleToggle}
            type="button"
            aria-label={scalePickerOpen ? 'Hide scale picker' : 'Show scale picker'}
            aria-pressed={scalePickerOpen}
          >
            Scale
          </button>
        </div>
      )}
    </div>
  );
}

export default ControlStrip;
