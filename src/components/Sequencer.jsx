import React, { useState, useEffect, useRef } from 'react';
import { ROW_COLORS, ROW_LABELS, getRowLabel } from '../utils/rowModel.js';
import RowControls from './RowControls.jsx';
import EffectsRack from './EffectsRack.jsx';

/**
 * Sequencer -- 16-row step grid with collapsible instrument sections,
 * per-row inline controls (RowControls), and expandable effects rack (EffectsRack).
 *
 * Each section (Drums, Percussion, Bass, Synths, Melodic) is a collapsible
 * group with a header row showing section name, chevron toggle, and active row count.
 * Each row shows: inline controls, step cells (with per-row colors), and optional expanded effects rack.
 * Beat position indicator, trigger-pop animation, and downbeat markers all preserved from Phase 2.
 *
 * @param {Object} props
 * @param {Array} props.rows - Array of row model objects (from rowModel.js)
 * @param {Array} props.sections - Array of section objects with { id, name, collapsed }
 * @param {function} props.onToggleCell - Called with (rowIndex, stepIndex)
 * @param {number} props.stepCount - Number of visible steps (8 or 16)
 * @param {function} props.onClear - Called to reset all sequencer cells
 * @param {number|null} props.beatStep - Current beat position (0-based) or null when stopped
 * @param {function} props.onToggleSection - Called with (sectionId) to toggle section collapse
 * @param {function} props.onEffectChange - Called with (rowIndex, paramPath, value)
 * @param {function} props.onTransformChange - Called with (rowIndex, param, value)
 * @param {function} props.onVolumeChange - Called with (rowIndex, value)
 * @param {function} props.onSoundBrowserOpen - Called with (rowIndex)
 * @param {function} props.onMuteToggle - Called with (rowIndex)
 */
function Sequencer({
  rows,
  sections,
  onToggleCell,
  stepCount = 8,
  onClear,
  beatStep = null,
  onToggleSection,
  onEffectChange,
  onTransformChange,
  onVolumeChange,
  onSoundBrowserOpen,
  onMuteToggle,
  onEuclideanChange,
  onSwitchToEuclid,
  onSwitchToManual,
  globalTransforms,
}) {
  // Track which cells just triggered (for pop animation)
  const [triggeredCells, setTriggeredCells] = useState(new Set());
  const prevBeatRef = useRef(null);

  // Track which rows have effects rack expanded
  const [expandedRows, setExpandedRows] = useState(new Set());

  const handleToggleExpand = (rowIndex) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      if (next.has(rowIndex)) {
        next.delete(rowIndex);
      } else {
        next.add(rowIndex);
      }
      return next;
    });
  };

  useEffect(() => {
    if (beatStep !== null && beatStep !== prevBeatRef.current) {
      // Find all active cells in the new beat column
      const newTriggers = new Set();
      rows.forEach((row, rowIndex) => {
        if (row.pattern.steps[beatStep]) {
          newTriggers.add(`${rowIndex}-${beatStep}`);
        }
      });
      setTriggeredCells(newTriggers);

      // Clear triggered state after animation completes
      const timer = setTimeout(() => setTriggeredCells(new Set()), 200);
      prevBeatRef.current = beatStep;
      return () => clearTimeout(timer);
    }
  }, [beatStep, rows]);

  // Build section-to-rows mapping (preserving global row index)
  const sectionRows = {};
  rows.forEach((row, globalIndex) => {
    if (!sectionRows[row.sectionId]) sectionRows[row.sectionId] = [];
    sectionRows[row.sectionId].push({ row, globalIndex });
  });

  return (
    <div className="sequencer" style={{ '--step-count': stepCount }}>
      <div className="sequencer-header">
        {onClear && (
          <button
            className="sequencer-clear-btn"
            onClick={onClear}
            type="button"
            aria-label="Clear all sequencer cells"
          >
            Clear
          </button>
        )}
      </div>

      {sections.map((section) => {
        const sectionEntries = sectionRows[section.id] || [];
        const activeCount = sectionEntries.filter(e =>
          e.row.pattern.steps.slice(0, stepCount).some(s => s) || e.row.pattern.euclid !== null
        ).length;

        return (
          <div
            key={section.id}
            className={`sequencer-section${section.collapsed ? ' collapsed' : ''}`}
          >
            {/* Section Header */}
            <button
              className="sequencer-section-header"
              onClick={() => onToggleSection && onToggleSection(section.id)}
              type="button"
              aria-expanded={!section.collapsed}
              aria-label={`${section.name} section, ${section.collapsed ? 'expand' : 'collapse'}`}
            >
              <span className={`sequencer-section-chevron${section.collapsed ? ' collapsed' : ''}`}>
                {'\u25B6'}
              </span>
              <span className="sequencer-section-name">{section.name}</span>
              {activeCount > 0 && (
                <span className="sequencer-section-badge">{activeCount}</span>
              )}
              <span className="sequencer-section-count">{sectionEntries.length}</span>
            </button>

            {/* Section Rows (hidden when collapsed) */}
            <div className="sequencer-section-rows" style={{ display: section.collapsed ? 'none' : 'block' }}>
              {sectionEntries.map(({ row, globalIndex }) => {
                const isExpanded = expandedRows.has(globalIndex);
                const rowColor = ROW_COLORS[globalIndex] || '#a0a0a0';

                return (
                  <div
                    className={`sequencer-row-wrapper${isExpanded ? ' expanded' : ''}${row.muted ? ' muted' : ''}`}
                    key={row.id}
                    style={isExpanded ? { '--row-edit-color': rowColor } : undefined}
                  >
                    {/* Grid row: label + cells */}
                    <div className="sequencer-grid">
                      <span className="sequencer-label" style={{ color: rowColor }}>
                        {getRowLabel(row, globalIndex)}
                      </span>
                      {row.pattern.steps.slice(0, stepCount).map((active, stepIndex) => {
                        const isOnBeat = beatStep === stepIndex;
                        const isTriggered = triggeredCells.has(`${globalIndex}-${stepIndex}`);
                        const isDownbeat = stepIndex === 0 || stepIndex === Math.floor(stepCount / 2);

                        return (
                          <button
                            key={stepIndex}
                            className={[
                              'sequencer-cell',
                              active ? 'active' : '',
                              isOnBeat ? 'on-beat' : '',
                              isTriggered ? 'triggered' : '',
                              isDownbeat ? 'downbeat' : '',
                            ].filter(Boolean).join(' ')}
                            data-row={globalIndex}
                            onClick={() => onToggleCell(globalIndex, stepIndex)}
                            aria-label={`${getRowLabel(row, globalIndex)} step ${stepIndex + 1}`}
                            aria-pressed={active}
                            type="button"
                          />
                        );
                      })}
                    </div>

                    {/* Inline row controls (below grid row) */}
                    <RowControls
                      row={row}
                      rowIndex={globalIndex}
                      onSoundBrowserOpen={onSoundBrowserOpen}
                      onVolumeChange={onVolumeChange}
                      onEffectChange={onEffectChange}
                      onToggleExpand={handleToggleExpand}
                      onMuteToggle={onMuteToggle}
                      isExpanded={isExpanded}
                      color={rowColor}
                    />

                    {/* Expanded effects rack */}
                    {isExpanded && (
                      <EffectsRack
                        row={row}
                        rowIndex={globalIndex}
                        onEffectChange={onEffectChange}
                        onTransformChange={onTransformChange}
                        color={rowColor}
                        onEuclideanChange={onEuclideanChange}
                        onSwitchToEuclid={onSwitchToEuclid}
                        onSwitchToManual={onSwitchToManual}
                        globalTransforms={globalTransforms}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Column playhead overlay */}
      {beatStep !== null && (
        <div
          className="sequencer-playhead"
          style={{
            '--playhead-col': beatStep,
            '--total-steps': stepCount,
          }}
        />
      )}
    </div>
  );
}

export default Sequencer;
