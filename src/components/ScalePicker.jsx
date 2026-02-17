import React, { useState } from 'react';
import {
  NOTE_NAMES,
  SCALE_GROUPS,
  SCALE_NAMES,
  ALL_SCALE_NAMES,
  getScaleNotes,
} from '../utils/scaleData.js';

/**
 * ScalePicker -- Visual keyboard + root/scale selectors for melodic sequencing.
 *
 * Layout (vertical stack, collapsible):
 *   1. Root note selector: 12 buttons in a row (C, C#, D, ..., B)
 *   2. Scale type dropdown: grouped <select> with curated scales + "Show all" toggle
 *   3. Visual keyboard: single-octave piano (CSS), in-scale notes highlighted, tappable
 *   4. Octave controls: per melodic row, showing row name + octave +/- stepper
 *
 * @param {Object} props
 * @param {string} props.rootNote - Current root note ('C', 'D#', etc.)
 * @param {string} props.scaleName - Current scale name ('major', 'minor pentatonic', etc.)
 * @param {function} props.onRootChange - Called with new root note name
 * @param {function} props.onScaleChange - Called with new scale name
 * @param {function} props.onNotePreview - Called with (noteName, octave) to preview a note
 * @param {Array} props.rows - Row model array (for melodic row octave controls)
 * @param {function} props.onOctaveChange - Called with (rowIndex, newOctave)
 * @param {Array} props.rowColors - ROW_COLORS array for per-row coloring
 * @param {function} props.getRowLabel - Function to get row display label
 */
function ScalePicker({
  rootNote,
  scaleName,
  onRootChange,
  onScaleChange,
  onNotePreview,
  rows,
  onOctaveChange,
  rowColors,
  getRowLabel: getLabel,
}) {
  const [showAllScales, setShowAllScales] = useState(false);

  // Compute scale notes for the visual keyboard
  const scaleNotes = getScaleNotes(rootNote, scaleName);

  // White and black key layout for a single octave piano
  // White keys: C D E F G A B (indices 0,2,4,5,7,9,11)
  // Black keys: C# D# F# G# A# (indices 1,3,6,8,10)
  const whiteKeyIndices = [0, 2, 4, 5, 7, 9, 11];
  const blackKeyPositions = [
    { index: 1, leftPercent: (1 / 7) * 100 - 5 },   // C#
    { index: 3, leftPercent: (2 / 7) * 100 - 5 },   // D#
    { index: 6, leftPercent: (4 / 7) * 100 - 5 },   // F#
    { index: 8, leftPercent: (5 / 7) * 100 - 5 },   // G#
    { index: 10, leftPercent: (6 / 7) * 100 - 5 },  // A#
  ];

  // Find melodic rows (synth or soundfont)
  const melodicRows = rows
    ? rows
        .map((row, index) => ({ row, index }))
        .filter(({ row }) => row.sound.type === 'synth' || row.sound.type === 'soundfont')
    : [];

  const handleKeyClick = (noteObj) => {
    if (onNotePreview) {
      // Use octave 4 for preview (middle of range)
      onNotePreview(noteObj.note, 4);
    }
  };

  return (
    <div className="scale-picker">
      {/* Root Note Selector */}
      <div className="scale-picker-section">
        <span className="scale-picker-label">Root</span>
        <div className="root-selector">
          {NOTE_NAMES.map((name) => (
            <button
              key={name}
              className={`root-btn${rootNote === name ? ' active' : ''}`}
              onClick={() => onRootChange(name)}
              type="button"
              aria-label={`Set root note to ${name}`}
              aria-pressed={rootNote === name}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* Scale Type Dropdown */}
      <div className="scale-picker-section">
        <span className="scale-picker-label">Scale</span>
        <div className="scale-dropdown-row">
          <select
            className="scale-dropdown"
            value={scaleName}
            onChange={(e) => onScaleChange(e.target.value)}
            aria-label="Select scale type"
          >
            {showAllScales ? (
              // Flat list of all scales
              ALL_SCALE_NAMES.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))
            ) : (
              // Grouped by category
              SCALE_GROUPS.map((group) => (
                <optgroup key={group.label} label={group.label}>
                  {group.scales.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </optgroup>
              ))
            )}
          </select>
          <button
            className={`show-all-btn${showAllScales ? ' active' : ''}`}
            onClick={() => setShowAllScales(!showAllScales)}
            type="button"
            aria-label={showAllScales ? 'Show curated scales' : 'Show all 92 scales'}
          >
            {showAllScales ? 'Less' : 'All'}
          </button>
        </div>
      </div>

      {/* Visual Piano Keyboard */}
      <div className="scale-picker-section">
        <span className="scale-picker-label">
          {rootNote} {scaleName}
        </span>
        <div className="piano-keyboard">
          {/* White keys */}
          {whiteKeyIndices.map((noteIndex) => {
            const noteObj = scaleNotes[noteIndex];
            return (
              <button
                key={noteIndex}
                className={`piano-key piano-white-key${noteObj.inScale ? ' in-scale' : ' out-of-scale'}`}
                onClick={() => handleKeyClick(noteObj)}
                type="button"
                aria-label={`${noteObj.note}${noteObj.inScale ? `, scale degree ${noteObj.degree}` : ''}`}
              >
                {noteObj.inScale && (
                  <span className="degree-label">{noteObj.degree}</span>
                )}
                <span className="note-label">{noteObj.note}</span>
              </button>
            );
          })}

          {/* Black keys (positioned absolutely) */}
          {blackKeyPositions.map(({ index, leftPercent }) => {
            const noteObj = scaleNotes[index];
            return (
              <button
                key={index}
                className={`piano-key piano-black-key${noteObj.inScale ? ' in-scale' : ' out-of-scale'}`}
                style={{ left: `${leftPercent}%` }}
                onClick={() => handleKeyClick(noteObj)}
                type="button"
                aria-label={`${noteObj.note}${noteObj.inScale ? `, scale degree ${noteObj.degree}` : ''}`}
              >
                {noteObj.inScale && (
                  <span className="degree-label">{noteObj.degree}</span>
                )}
                <span className="note-label">{noteObj.note}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Octave Controls per Melodic Row */}
      {melodicRows.length > 0 && (
        <div className="scale-picker-section">
          <span className="scale-picker-label">Octaves</span>
          <div className="octave-rows">
            {melodicRows.map(({ row, index }) => (
              <div key={row.id} className="octave-row">
                <span
                  className="octave-row-name"
                  style={{ color: rowColors ? rowColors[index] : '#a0a0a0' }}
                >
                  {getLabel ? getLabel(row, index) : `Row ${index + 1}`}
                </span>
                <span className="octave-row-note">
                  {row.note || `C${row.octave}`}
                </span>
                <div className="octave-stepper">
                  <button
                    className="octave-btn"
                    onClick={() => onOctaveChange && onOctaveChange(index, Math.max(2, row.octave - 1))}
                    type="button"
                    disabled={row.octave <= 2}
                    aria-label={`Decrease octave for ${getLabel ? getLabel(row, index) : `Row ${index + 1}`}`}
                  >
                    -
                  </button>
                  <span className="octave-value">C{row.octave}</span>
                  <button
                    className="octave-btn"
                    onClick={() => onOctaveChange && onOctaveChange(index, Math.min(6, row.octave + 1))}
                    type="button"
                    disabled={row.octave >= 6}
                    aria-label={`Increase octave for ${getLabel ? getLabel(row, index) : `Row ${index + 1}`}`}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ScalePicker;
