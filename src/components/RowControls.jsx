import React from 'react';
import Slider from './Slider.jsx';
import Knob from './Knob.jsx';
import ToggleSwitch from './ToggleSwitch.jsx';
import { EFFECT_RANGES } from '../utils/effectDefaults.js';
import { getRowLabel } from '../utils/rowModel.js';
import { soundToLabel } from '../utils/soundCatalog.js';

/**
 * RowControls — Compact inline control strip per sequencer row
 *
 * Shows: sound name button, volume slider, featured effect knob (filter cutoff),
 * mute button, and expand/collapse chevron for the full effects rack.
 *
 * @param {Object} props
 * @param {Object} props.row - Row model object
 * @param {number} props.rowIndex - Index in rows array
 * @param {function} props.onSoundBrowserOpen - Called with rowIndex to open sound browser
 * @param {function} props.onVolumeChange - Called with (rowIndex, value)
 * @param {function} props.onEffectChange - Called with (rowIndex, paramPath, value)
 * @param {function} props.onToggleExpand - Called with rowIndex
 * @param {function} props.onMuteToggle - Called with rowIndex
 * @param {boolean} props.isExpanded - Whether the full effects rack is visible
 * @param {string} props.color - CSS color for this row
 */
export default function RowControls({
  row,
  rowIndex,
  onSoundBrowserOpen,
  onVolumeChange,
  onEffectChange,
  onToggleExpand,
  onMuteToggle,
  isExpanded,
  color,
}) {
  const label = getRowLabel(row, rowIndex);
  // Show sound source info on the selector pill
  const soundLabel = soundToLabel(row.sound);
  const truncatedSound = soundLabel.length > 10 ? soundLabel.slice(0, 9) + '\u2026' : soundLabel;

  // Filter cutoff range
  const cutoffRange = EFFECT_RANGES.cutoff;

  // Format cutoff value: "2.4k" for values > 1000
  const formatCutoff = (v) => {
    if (v >= 1000) return `${(v / 1000).toFixed(1)}k`;
    return `${Math.round(v)}`;
  };

  return (
    <div className={`row-controls${row.muted ? ' muted' : ''}`}>
      {/* Mute button */}
      <button
        type="button"
        className={`row-mute-btn${row.muted ? ' active' : ''}`}
        onClick={() => onMuteToggle(rowIndex)}
        aria-label={`${row.muted ? 'Unmute' : 'Mute'} ${label}`}
        aria-pressed={row.muted}
        style={{ '--row-color': color }}
      >
        M
      </button>

      {/* Sound selector button */}
      <button
        type="button"
        className="row-sound-btn sound-selector-pill"
        onClick={() => onSoundBrowserOpen && onSoundBrowserOpen(rowIndex)}
        aria-label={`Change sound for ${label}, currently ${soundLabel}`}
        style={{ borderColor: color }}
        title={soundLabel}
      >
        {truncatedSound}
      </button>

      {/* Volume slider (compact) */}
      <div className="row-volume-wrap">
        <Slider
          label=""
          value={row.volume}
          min={0}
          max={1}
          step={0.01}
          onChange={(v) => onVolumeChange(rowIndex, v)}
          color={color}
          formatValue={(v) => `${Math.round(v * 100)}%`}
        />
      </div>

      {/* Featured effect: filter cutoff knob + bypass toggle */}
      <div className="row-featured-effect">
        <ToggleSwitch
          active={row.effects.cutoff.active}
          onChange={(active) => onEffectChange(rowIndex, 'cutoff.active', active)}
          size={20}
          color={color}
        />
        <Knob
          label="CUT"
          value={row.effects.cutoff.value}
          min={cutoffRange.min}
          max={cutoffRange.max}
          step={cutoffRange.step}
          logScale={cutoffRange.logScale}
          onChange={(v) => onEffectChange(rowIndex, 'cutoff.value', v)}
          size={36}
          color={color}
          defaultValue={2000}
          formatValue={formatCutoff}
        />
      </div>

      {/* Expand/collapse chevron */}
      <button
        type="button"
        className={`row-expand-btn${isExpanded ? ' expanded' : ''}`}
        onClick={() => onToggleExpand(rowIndex)}
        aria-label={`${isExpanded ? 'Collapse' : 'Expand'} effects for ${label}`}
        aria-expanded={isExpanded}
      >
        {'\u25BC'}
      </button>
    </div>
  );
}
