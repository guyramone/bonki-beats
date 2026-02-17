import React, { useState, useCallback } from 'react';
import Knob from './Knob.jsx';
import Slider from './Slider.jsx';
import ToggleSwitch from './ToggleSwitch.jsx';
import {
  EFFECT_RANGES,
  DISTORTION_TYPES,
  FILTER_TYPES,
  DELAY_DIVISIONS,
} from '../utils/effectDefaults.js';

/**
 * EffectsRack — Full effects chain panel for an expanded sequencer row.
 *
 * Signal chain layout: Filter > Delay > Reverb > Distort > Lo-Fi > Pan
 * Each effect is a visual "node" connected by lines. Each node has a
 * glowing bypass toggle, parameter knobs, and type selectors.
 *
 * @param {Object} props
 * @param {Object} props.row - Row model object
 * @param {number} props.rowIndex - Index in rows array
 * @param {function} props.onEffectChange - Called with (rowIndex, paramPath, value)
 * @param {function} props.onTransformChange - Called with (rowIndex, param, value)
 * @param {string} props.color - CSS color for this row
 */
export default function EffectsRack({
  row,
  rowIndex,
  onEffectChange,
  onTransformChange,
  color,
}) {
  // Collapsible sub-sections for filter envelope and LFO
  const [showEnvelope, setShowEnvelope] = useState(false);
  const [showLfo, setShowLfo] = useState(false);

  // Helper: emit effect change
  const change = useCallback((paramPath, value) => {
    onEffectChange(rowIndex, paramPath, value);
  }, [rowIndex, onEffectChange]);

  // Helper: emit transform change
  const tChange = useCallback((param, value) => {
    onTransformChange(rowIndex, param, value);
  }, [rowIndex, onTransformChange]);

  // Format helpers
  const fmtHz = (v) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : `${Math.round(v)}`;
  const fmtSec = (v) => `${v.toFixed(2)}s`;
  const fmtPct = (v) => `${Math.round(v * 100)}%`;
  const fmtDb = (v) => v.toFixed(1);

  // --- Effect Chain Presets ---
  const PRESETS = [
    {
      name: 'Clean',
      apply: () => {
        change('cutoff.active', false);
        change('delay.active', false);
        change('room.active', false);
        change('distort.active', false);
        change('crush', null);
        change('coarse', null);
      },
    },
    {
      name: 'Gritty',
      apply: () => {
        change('distort.active', true);
        change('distort.value', 2);
        change('distorttype', 1);
        change('crush', 8);
      },
    },
    {
      name: 'Spacey',
      apply: () => {
        change('delay.active', true);
        change('delay.value', 0.4);
        change('delaytime', 0.25);
        change('room.active', true);
        change('room.value', 0.5);
        change('roomsize', 4);
      },
    },
    {
      name: 'Lo-Fi',
      apply: () => {
        change('crush', 6);
        change('coarse', 4);
        change('cutoff.active', true);
        change('cutoff.value', 2000);
      },
    },
  ];

  // --- Randomize within musical ranges ---
  const handleRandomize = () => {
    const rand = (lo, hi) => lo + Math.random() * (hi - lo);

    change('cutoff.active', true);
    change('cutoff.value', Math.round(rand(200, 8000)));
    change('resonance.value', parseFloat(rand(0, 15).toFixed(1)));
    change('resonance.active', true);

    const doDelay = Math.random() > 0.5;
    change('delay.active', doDelay);
    if (doDelay) {
      change('delay.value', parseFloat(rand(0.1, 0.5).toFixed(2)));
      change('delaytime', parseFloat(rand(0.05, 0.4).toFixed(2)));
      change('delayfeedback', parseFloat(rand(0.1, 0.6).toFixed(2)));
    }

    const doRoom = Math.random() > 0.5;
    change('room.active', doRoom);
    if (doRoom) {
      change('room.value', parseFloat(rand(0.1, 0.5).toFixed(2)));
      change('roomsize', parseFloat(rand(1, 5).toFixed(1)));
    }

    const doDistort = Math.random() > 0.7;
    change('distort.active', doDistort);
    if (doDistort) {
      change('distort.value', parseFloat(rand(0.5, 3).toFixed(1)));
      change('distorttype', Math.floor(rand(0, DISTORTION_TYPES.length)));
    }
  };

  // Determine which nodes are active for connector glow
  const filterActive = row.effects.cutoff.active || row.effects.hcutoff?.active;
  const delayActive = row.effects.delay.active && row.effects.delay.value > 0;
  const reverbActive = row.effects.room.active && row.effects.room.value > 0;
  const distortActive = row.effects.distort.active && row.effects.distort.value > 0;
  const lofiActive = row.effects.crush !== null || row.effects.coarse !== null;

  return (
    <div className="effects-rack effects-rack-enter">
      {/* Preset row */}
      <div className="effect-presets">
        {PRESETS.map((preset) => (
          <button
            key={preset.name}
            type="button"
            className="effect-preset-btn"
            onClick={preset.apply}
          >
            {preset.name}
          </button>
        ))}
        <button
          type="button"
          className="effect-preset-btn randomize"
          onClick={handleRandomize}
          aria-label="Randomize effects"
          title="Randomize within musical ranges"
        >
          {'\uD83C\uDFB2'}
        </button>
      </div>

      {/* Signal chain */}
      <div className="effect-chain">

        {/* ====== FILTER NODE ====== */}
        <div className={`effect-node${filterActive ? ' active' : ''}`} style={{ '--node-color': color }}>
          <div className="effect-node-header">
            <span className="effect-node-label">Filter</span>
            <ToggleSwitch
              active={row.effects.cutoff.active}
              onChange={(a) => change('cutoff.active', a)}
              size={24}
              color={color}
            />
          </div>

          {/* Filter type selector */}
          <div className="effect-segmented">
            {FILTER_TYPES.map((ft) => (
              <button
                key={ft}
                type="button"
                className={`effect-seg-btn${row.effects.filterType === ft ? ' active' : ''}`}
                onClick={() => change('filterType', ft)}
              >
                {ft === 'lowpass' ? 'LP' : ft === 'highpass' ? 'HP' : 'BP'}
              </button>
            ))}
          </div>

          <div className="effect-knobs">
            <Knob
              label="CUTOFF"
              value={row.effects.cutoff.value}
              min={EFFECT_RANGES.cutoff.min}
              max={EFFECT_RANGES.cutoff.max}
              step={EFFECT_RANGES.cutoff.step}
              logScale
              onChange={(v) => change('cutoff.value', v)}
              size={48}
              color={color}
              defaultValue={2000}
              formatValue={fmtHz}
            />
            <Knob
              label="RES"
              value={row.effects.resonance?.value ?? row.effects.resonance ?? 1}
              min={EFFECT_RANGES.resonance.min}
              max={EFFECT_RANGES.resonance.max}
              step={EFFECT_RANGES.resonance.step}
              onChange={(v) => {
                change('resonance.value', v);
                change('resonance.active', true);
              }}
              size={48}
              color={color}
              defaultValue={1}
              formatValue={fmtDb}
            />
          </div>

          {/* Envelope sub-section (collapsible) */}
          <button
            type="button"
            className="effect-subsection-toggle"
            onClick={() => setShowEnvelope(!showEnvelope)}
          >
            Envelope {showEnvelope ? '\u25B4' : '\u25BE'}
          </button>
          {showEnvelope && (
            <div className="effect-knobs">
              <Knob label="ATK" value={row.effects.lpattack} min={0} max={2} step={0.01}
                onChange={(v) => change('lpattack', v)} size={36} color={color} defaultValue={0} formatValue={fmtSec} />
              <Knob label="DEC" value={row.effects.lpdecay} min={0} max={2} step={0.01}
                onChange={(v) => change('lpdecay', v)} size={36} color={color} defaultValue={0.14} formatValue={fmtSec} />
              <Knob label="SUS" value={row.effects.lpsustain} min={0} max={1} step={0.01}
                onChange={(v) => change('lpsustain', v)} size={36} color={color} defaultValue={0} formatValue={fmtPct} />
              <Knob label="REL" value={row.effects.lprelease} min={0} max={2} step={0.01}
                onChange={(v) => change('lprelease', v)} size={36} color={color} defaultValue={0.1} formatValue={fmtSec} />
              <Knob label="DEPTH" value={row.effects.lpenv} min={-1} max={1} step={0.01}
                onChange={(v) => change('lpenv', v)} size={36} color={color} defaultValue={1} formatValue={fmtDb} />
            </div>
          )}

          {/* LFO sub-section (collapsible) */}
          <button
            type="button"
            className="effect-subsection-toggle"
            onClick={() => setShowLfo(!showLfo)}
          >
            LFO {showLfo ? '\u25B4' : '\u25BE'}
          </button>
          {showLfo && (
            <div className="effect-knobs">
              <Knob label="RATE" value={row.effects.lprate ?? 1} min={0.1} max={20} step={0.1}
                logScale onChange={(v) => change('lprate', v)} size={36} color={color} defaultValue={1}
                formatValue={(v) => `${v.toFixed(1)}Hz`} />
              <Knob label="DEPTH" value={row.effects.lpdepth ?? 0} min={0} max={1} step={0.01}
                onChange={(v) => change('lpdepth', v)} size={36} color={color} defaultValue={0} formatValue={fmtPct} />
            </div>
          )}
        </div>

        {/* Connector */}
        <div className={`chain-connector${filterActive && delayActive ? ' active' : ''}`} />

        {/* ====== DELAY NODE ====== */}
        <div className={`effect-node${delayActive ? ' active' : ''}`} style={{ '--node-color': color }}>
          <div className="effect-node-header">
            <span className="effect-node-label">Delay</span>
            <ToggleSwitch
              active={row.effects.delay.active}
              onChange={(a) => {
                change('delay.active', a);
                if (a && row.effects.delay.value === 0) change('delay.value', 0.3);
              }}
              size={24}
              color={color}
            />
          </div>

          <div className="effect-knobs">
            <Knob
              label="MIX"
              value={row.effects.delay.value}
              min={EFFECT_RANGES.delay.min}
              max={EFFECT_RANGES.delay.max}
              step={EFFECT_RANGES.delay.step}
              onChange={(v) => change('delay.value', v)}
              size={48}
              color={color}
              defaultValue={0}
              formatValue={fmtPct}
            />

            {/* Sync toggle */}
            <div className="effect-segmented">
              <button
                type="button"
                className={`effect-seg-btn${row.effects.delaysync ? ' active' : ''}`}
                onClick={() => change('delaysync', true)}
              >
                SYNC
              </button>
              <button
                type="button"
                className={`effect-seg-btn${!row.effects.delaysync ? ' active' : ''}`}
                onClick={() => change('delaysync', false)}
              >
                FREE
              </button>
            </div>

            {row.effects.delaysync ? (
              /* Division selector when synced */
              <div className="effect-divisions">
                {DELAY_DIVISIONS.map((div) => (
                  <button
                    key={div.label}
                    type="button"
                    className={`effect-div-btn${row.effects.delaytime === div.value ? ' active' : ''}`}
                    onClick={() => change('delaytime', div.value)}
                  >
                    {div.label}
                  </button>
                ))}
              </div>
            ) : (
              /* Free time knob */
              <Knob
                label="TIME"
                value={row.effects.delaytime}
                min={EFFECT_RANGES.delaytime.min}
                max={EFFECT_RANGES.delaytime.max}
                step={EFFECT_RANGES.delaytime.step}
                onChange={(v) => change('delaytime', v)}
                size={48}
                color={color}
                defaultValue={0.25}
                formatValue={fmtSec}
              />
            )}

            <Knob
              label="FB"
              value={row.effects.delayfeedback}
              min={EFFECT_RANGES.delayfeedback.min}
              max={EFFECT_RANGES.delayfeedback.max}
              step={EFFECT_RANGES.delayfeedback.step}
              onChange={(v) => change('delayfeedback', v)}
              size={48}
              color={color}
              defaultValue={0.5}
              formatValue={fmtPct}
            />
          </div>
        </div>

        {/* Connector */}
        <div className={`chain-connector${delayActive && reverbActive ? ' active' : ''}`} />

        {/* ====== REVERB NODE ====== */}
        <div className={`effect-node${reverbActive ? ' active' : ''}`} style={{ '--node-color': color }}>
          <div className="effect-node-header">
            <span className="effect-node-label">Reverb</span>
            <ToggleSwitch
              active={row.effects.room.active}
              onChange={(a) => {
                change('room.active', a);
                if (a && row.effects.room.value === 0) change('room.value', 0.4);
              }}
              size={24}
              color={color}
            />
          </div>

          <div className="effect-knobs">
            <Knob
              label="MIX"
              value={row.effects.room.value}
              min={EFFECT_RANGES.room.min}
              max={EFFECT_RANGES.room.max}
              step={EFFECT_RANGES.room.step}
              onChange={(v) => change('room.value', v)}
              size={48}
              color={color}
              defaultValue={0}
              formatValue={fmtPct}
            />
            <Knob
              label="SIZE"
              value={row.effects.roomsize}
              min={EFFECT_RANGES.roomsize.min}
              max={EFFECT_RANGES.roomsize.max}
              step={EFFECT_RANGES.roomsize.step}
              onChange={(v) => change('roomsize', v)}
              size={48}
              color={color}
              defaultValue={2}
              formatValue={fmtDb}
            />
          </div>

          {/* Type toggle: ALGO vs CONV */}
          <div className="effect-segmented">
            <button
              type="button"
              className={`effect-seg-btn${!row.effects.ir ? ' active' : ''}`}
              onClick={() => change('ir', null)}
            >
              ALGO
            </button>
            <button
              type="button"
              className={`effect-seg-btn${row.effects.ir ? ' active' : ''}`}
              onClick={() => change('ir', row.effects.ir || 'cathedral')}
            >
              CONV
            </button>
          </div>

          {/* IR selector when convolution mode */}
          {row.effects.ir && (
            <div className="effect-segmented">
              {['cathedral', 'plate', 'spring'].map((irName) => (
                <button
                  key={irName}
                  type="button"
                  className={`effect-seg-btn${row.effects.ir === irName ? ' active' : ''}`}
                  onClick={() => change('ir', irName)}
                >
                  {irName.charAt(0).toUpperCase() + irName.slice(1)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Connector */}
        <div className={`chain-connector${reverbActive && distortActive ? ' active' : ''}`} />

        {/* ====== DISTORTION NODE ====== */}
        <div className={`effect-node${distortActive ? ' active' : ''}`} style={{ '--node-color': color }}>
          <div className="effect-node-header">
            <span className="effect-node-label">Distort</span>
            <ToggleSwitch
              active={row.effects.distort.active}
              onChange={(a) => {
                change('distort.active', a);
                if (a && row.effects.distort.value === 0) change('distort.value', 1);
              }}
              size={24}
              color={color}
            />
          </div>

          <div className="effect-knobs">
            <Knob
              label="AMOUNT"
              value={row.effects.distort.value}
              min={EFFECT_RANGES.distort.min}
              max={EFFECT_RANGES.distort.max}
              step={EFFECT_RANGES.distort.step}
              onChange={(v) => change('distort.value', v)}
              size={48}
              color={color}
              defaultValue={0}
              formatValue={fmtDb}
            />
          </div>

          {/* Algorithm selector */}
          <div className="effect-algo-selector">
            <span className="effect-algo-label">Type</span>
            <select
              className="effect-algo-select"
              value={row.effects.distorttype}
              onChange={(e) => change('distorttype', parseInt(e.target.value, 10))}
            >
              {DISTORTION_TYPES.map((name, i) => (
                <option key={i} value={i}>{name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Connector */}
        <div className={`chain-connector${distortActive && lofiActive ? ' active' : ''}`} />

        {/* ====== LO-FI NODE ====== */}
        <div className={`effect-node${lofiActive ? ' active' : ''}`} style={{ '--node-color': color }}>
          <div className="effect-node-header">
            <span className="effect-node-label">Lo-Fi</span>
            <ToggleSwitch
              active={lofiActive}
              onChange={(a) => {
                if (a) {
                  // Quick preset: crush=8, coarse=4
                  change('crush', 8);
                  change('coarse', 4);
                } else {
                  change('crush', null);
                  change('coarse', null);
                }
              }}
              size={24}
              color={color}
            />
          </div>

          <div className="effect-knobs">
            <Knob
              label="BITS"
              value={row.effects.crush ?? 16}
              min={EFFECT_RANGES.crush.min}
              max={EFFECT_RANGES.crush.max}
              step={EFFECT_RANGES.crush.step}
              onChange={(v) => change('crush', v)}
              size={48}
              color={color}
              defaultValue={16}
              formatValue={(v) => `${v}bit`}
            />
            <Knob
              label="RATE"
              value={row.effects.coarse ?? 1}
              min={EFFECT_RANGES.coarse.min}
              max={EFFECT_RANGES.coarse.max}
              step={EFFECT_RANGES.coarse.step}
              onChange={(v) => change('coarse', v)}
              size={48}
              color={color}
              defaultValue={1}
              formatValue={(v) => `${v}x`}
            />
          </div>
        </div>

        {/* Connector */}
        <div className="chain-connector" />

        {/* ====== PAN (end of chain) ====== */}
        <div className="effect-node pan-node" style={{ '--node-color': color }}>
          <div className="effect-node-header">
            <span className="effect-node-label">Pan</span>
          </div>
          <div className="effect-knobs">
            <Slider
              label="PAN"
              value={row.effects.pan}
              min={EFFECT_RANGES.pan.min}
              max={EFFECT_RANGES.pan.max}
              step={EFFECT_RANGES.pan.step}
              onChange={(v) => change('pan', v)}
              color={color}
              formatValue={(v) => {
                if (Math.abs(v - 0.5) < 0.02) return 'C';
                return v < 0.5 ? `L${Math.round((0.5 - v) * 200)}` : `R${Math.round((v - 0.5) * 200)}`;
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
