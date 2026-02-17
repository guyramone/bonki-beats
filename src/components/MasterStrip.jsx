import React from 'react';
import DJFilter from './DJFilter.jsx';
import Knob from './Knob.jsx';
import Slider from './Slider.jsx';

/**
 * MasterStrip -- Always-visible global effects bar above the transport bar
 *
 * Layout: DJ Filter (prominent, left) | Master FX (center) | Transforms (center-right) | Volume (right)
 * Compact 60px height. Mobile: DJ filter + volume always visible, middle section scrollable.
 * All knobs use the Knob component from Plan 02. Each control emits onMasterEffectChange(param, value).
 *
 * @param {Object} props
 * @param {Object} props.masterEffects - { djf, room, delay, volume }
 * @param {function} props.onMasterEffectChange - Called with (param, value)
 * @param {Object} props.globalTransforms - { swing, degradeBy, speed, reverse }
 * @param {function} props.onGlobalTransformChange - Called with (param, value)
 */
export default function MasterStrip({
  masterEffects,
  onMasterEffectChange,
  globalTransforms,
  onGlobalTransformChange,
}) {
  const fmtPct = (v) => `${Math.round(v * 100)}%`;

  return (
    <div className="master-strip">
      {/* DJ Filter -- featured control, separated from the rest */}
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
            size={40}
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
            size={40}
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
            size={40}
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
            size={40}
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
