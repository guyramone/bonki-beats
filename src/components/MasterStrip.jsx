import React from 'react';
import DJFilter from './DJFilter.jsx';
import Knob from './Knob.jsx';
import Slider from './Slider.jsx';

/**
 * MasterStrip -- Combined transport + master effects bar
 *
 * Layout: Play/Stop/Hush (left) | DJ Filter | Master FX (center) | Transforms (center-right) | Volume (right)
 * Single ~60px height bar. Mobile: transport + DJ filter + volume always visible, FX scrollable.
 *
 * @param {Object} props
 * @param {Object} props.masterEffects - { djf, room, delay, volume }
 * @param {function} props.onMasterEffectChange - Called with (param, value)
 * @param {Object} props.globalTransforms - { swing, degradeBy, speed, reverse }
 * @param {function} props.onGlobalTransformChange - Called with (param, value)
 * @param {function} props.onPlay - Play callback
 * @param {function} props.onStop - Stop callback
 * @param {function} props.onHush - Hush callback
 * @param {boolean} props.isPlaying - Whether audio is currently playing
 */
export default function MasterStrip({
  masterEffects,
  onMasterEffectChange,
  globalTransforms,
  onGlobalTransformChange,
  onPlay,
  onStop,
  onHush,
  isPlaying,
}) {
  const fmtPct = (v) => `${Math.round(v * 100)}%`;

  return (
    <div className="master-strip" role="toolbar" aria-label="Master controls">
      {/* Transport Controls -- inline */}
      <div className="master-transport">
        <button
          className={`master-transport-btn play${isPlaying ? ' active' : ''}`}
          onClick={onPlay}
          aria-label="Play"
          type="button"
        >
          &#9654;
        </button>
        <button
          className="master-transport-btn stop"
          onClick={onStop}
          aria-label="Stop"
          type="button"
        >
          &#9632;
        </button>
        <button
          className="master-transport-btn hush"
          onClick={onHush}
          aria-label="Hush all sounds"
          type="button"
        >
          HUSH
        </button>
      </div>

      {/* Separator */}
      <div className="master-separator" />

      {/* DJ Filter -- featured control */}
      <div className="master-dj-filter">
        <DJFilter
          value={masterEffects.djf}
          onChange={(v) => onMasterEffectChange('djf', v)}
          size={56}
        />
      </div>

      {/* Separator */}
      <div className="master-separator" />

      {/* Scrollable middle section (FX + Transforms) */}
      <div className="master-middle">
        {/* Master FX Group */}
        <div className="master-fx-group">
          <Knob
            label="VERB"
            value={masterEffects.room}
            min={0}
            max={1}
            step={0.01}
            onChange={(v) => onMasterEffectChange('room', v)}
            size={48}
            color="var(--accent-cool)"
            defaultValue={0}
            formatValue={fmtPct}
          />
          <Knob
            label="ECHO"
            value={masterEffects.delay}
            min={0}
            max={1}
            step={0.01}
            onChange={(v) => onMasterEffectChange('delay', v)}
            size={48}
            color="var(--accent-cool)"
            defaultValue={0}
            formatValue={fmtPct}
          />
        </div>

        {/* Separator */}
        <div className="master-separator" />

        {/* Global Transforms Group */}
        <div className="master-transforms">
          <Knob
            label="SWING"
            value={globalTransforms.swing}
            min={0}
            max={1}
            step={0.01}
            onChange={(v) => onGlobalTransformChange('swing', v)}
            size={48}
            color="var(--accent-primary)"
            defaultValue={0}
            formatValue={fmtPct}
          />
          <Knob
            label="PROB"
            value={globalTransforms.degradeBy}
            min={0}
            max={1}
            step={0.01}
            onChange={(v) => onGlobalTransformChange('degradeBy', v)}
            size={48}
            color="var(--accent-primary)"
            defaultValue={0}
            formatValue={fmtPct}
          />
        </div>
      </div>

      {/* Master Volume -- pushed to the right */}
      <div className="master-volume">
        <Slider
          label="VOL"
          value={masterEffects.volume}
          min={0}
          max={1}
          step={0.01}
          onChange={(v) => onMasterEffectChange('volume', v)}
          color="var(--text-primary)"
          formatValue={fmtPct}
        />
      </div>
    </div>
  );
}
