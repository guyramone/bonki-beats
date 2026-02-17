/**
 * codeGenerator.js -- Pure functions converting row model to Strudel code
 *
 * This is the single source of truth for translating UI state into audio.
 * Every knob turn, cell toggle, and sound swap flows through here.
 *
 * Exports: rowToCodeLine, rowsToStrudelCode, generateDisplayCode
 */

/**
 * Convert one row model object to a Strudel code line.
 * Returns null if the row is muted or has no pattern.
 *
 * @param {Object} row - Row model object
 * @param {number} rowIndex - Index in the rows array (for orbit assignment)
 * @param {number} stepCount - Number of active steps (8 or 16)
 * @param {string|null} globalScale - Global scale string (e.g., "C:minor") or null
 * @returns {string|null} Strudel code string for this row, or null if muted/empty
 */
export function rowToCodeLine(row, rowIndex, stepCount, globalScale) {
  if (row.muted) return null;

  // Check if row has any active pattern
  const hasActiveSteps = row.pattern.steps.slice(0, stepCount).some(s => s);
  const hasEuclid = row.pattern.euclid !== null;
  if (!hasActiveSteps && !hasEuclid) return null;

  let code = '';

  // --- Sound source ---
  if (row.sound.type === 'sample') {
    code = `s("${row.sound.bank}_${row.sound.name}")`;
    if (row.sound.n > 0) code += `.n(${row.sound.n})`;
  } else if (row.sound.type === 'synth') {
    const noteStr = row.note || `c${row.octave}`;
    code = `note("${noteStr}").s("${row.sound.bank}")`;
  } else if (row.sound.type === 'soundfont') {
    const noteStr = row.note || `c${row.octave}`;
    code = `note("${noteStr}").s("${row.sound.bank}")`;
  }

  // --- Pattern ---
  if (hasEuclid) {
    const { pulses, steps, rotation } = row.pattern.euclid;
    if (rotation) {
      code += `.euclidRot(${pulses},${steps},${rotation})`;
    } else {
      code += `.euclid(${pulses},${steps})`;
    }
  } else {
    const steps = row.pattern.steps.slice(0, stepCount);
    const struct = steps.map(s => s ? 'x' : '~').join(' ');
    code += `.struct("${struct}")`;
  }

  // --- Effects (only emit active effects with non-default values) ---

  // Low-pass filter
  if (row.effects.cutoff.active) {
    code += `.cutoff(${row.effects.cutoff.value})`;
    if (row.effects.resonance.active && row.effects.resonance.value !== 1) {
      code += `.resonance(${row.effects.resonance.value})`;
    }
  }

  // High-pass filter
  if (row.effects.hcutoff.active) {
    code += `.hcutoff(${row.effects.hcutoff.value})`;
    if (row.effects.hresonance.active && row.effects.hresonance.value !== 1) {
      code += `.hresonance(${row.effects.hresonance.value})`;
    }
  }

  // Delay
  if (row.effects.delay.active && row.effects.delay.value > 0) {
    code += `.delay(${row.effects.delay.value})`;
    code += `.delaytime(${row.effects.delaytime})`;
    code += `.delayfeedback(${row.effects.delayfeedback})`;
  }

  // Reverb
  if (row.effects.room.active && row.effects.room.value > 0) {
    code += `.room(${row.effects.room.value})`;
    if (row.effects.roomsize !== 2) code += `.roomsize(${row.effects.roomsize})`;
    if (row.effects.ir) code += `.ir("${row.effects.ir}")`;
  }

  // Distortion
  if (row.effects.distort.active && row.effects.distort.value > 0) {
    code += `.distort(${row.effects.distort.value})`;
    if (row.effects.distorttype !== 0) code += `.distorttype(${row.effects.distorttype})`;
  }

  // Lo-fi
  if (row.effects.crush !== null) code += `.crush(${row.effects.crush})`;
  if (row.effects.coarse !== null) code += `.coarse(${row.effects.coarse})`;

  // Pan
  if (row.effects.pan !== 0.5) code += `.pan(${row.effects.pan})`;

  // --- Transforms ---
  if (row.transforms.reverse) code += `.rev()`;
  if (row.transforms.speed !== 1) code += `.fast(${row.transforms.speed})`;
  if (row.transforms.degradeBy !== null && row.transforms.degradeBy > 0) {
    code += `.degradeBy(${row.transforms.degradeBy})`;
  }
  if (row.transforms.swing !== null && row.transforms.swing > 0) {
    code += `.swing(${row.transforms.swing})`;
  }

  // --- Volume ---
  if (row.volume < 1.0) code += `.gain(${row.volume.toFixed(2)})`;

  // --- Scale (melodic rows) ---
  if (globalScale && (row.sound.type === 'synth' || row.sound.type === 'soundfont')) {
    code += `.scale("${globalScale}")`;
  }

  // --- Orbit (unique per row for isolated effect buses) ---
  code += `.orbit(${rowIndex + 1})`;

  return code;
}

/**
 * Convert all rows to a full Strudel code string.
 * Filters out muted rows and rows with no pattern, wraps in stack(),
 * and applies master effects outside the stack.
 *
 * @param {Array} rows - Array of row model objects
 * @param {number} stepCount - Number of active steps (8 or 16)
 * @param {string|null} globalScale - Global scale string or null
 * @param {Object} masterEffects - Master effects: { djf, room, delay, volume }
 * @returns {string} Complete Strudel code string, or empty string if nothing to play
 */
export function rowsToStrudelCode(rows, stepCount, globalScale, masterEffects = {}) {
  const lines = rows
    .map((row, i) => rowToCodeLine(row, i, stepCount, globalScale))
    .filter(line => line !== null);

  if (lines.length === 0) return '';

  // Wrap in stack()
  let code;
  if (lines.length === 1) {
    code = lines[0];
  } else {
    code = `stack(\n  ${lines.join(',\n  ')}\n)`;
  }

  // Apply master effects outside the stack
  if (masterEffects.djf !== undefined && masterEffects.djf !== null && masterEffects.djf !== 0.5) {
    code = `(${code}).djf(${masterEffects.djf.toFixed(2)})`;
  }
  if (masterEffects.room && masterEffects.room > 0) {
    code = `(${code}).room(${masterEffects.room})`;
  }
  if (masterEffects.delay && masterEffects.delay > 0) {
    code = `(${code}).delay(${masterEffects.delay})`;
  }
  if (masterEffects.volume !== undefined && masterEffects.volume < 1) {
    code = `(${code}).gain(${masterEffects.volume.toFixed(2)})`;
  }

  return code;
}

/**
 * Generate display code for the code view, including master effects.
 * This is what users see and can copy/paste into Strudel REPL.
 *
 * @param {Array} rows - Array of row model objects
 * @param {number} stepCount - Number of active steps (8 or 16)
 * @param {string|null} globalScale - Global scale string or null
 * @param {Object} [masterEffects] - Master effects for display (djf, room, delay)
 * @returns {string} Clean Strudel code string for display
 */
export function generateDisplayCode(rows, stepCount, globalScale, masterEffects = {}) {
  const lines = rows
    .map((row, i) => {
      if (row.muted) return null;

      const hasActiveSteps = row.pattern.steps.slice(0, stepCount).some(s => s);
      const hasEuclid = row.pattern.euclid !== null;
      if (!hasActiveSteps && !hasEuclid) return null;

      // Build code line same as rowToCodeLine but WITHOUT .gain() and .orbit()
      let code = '';

      // Sound source
      if (row.sound.type === 'sample') {
        code = `s("${row.sound.bank}_${row.sound.name}")`;
        if (row.sound.n > 0) code += `.n(${row.sound.n})`;
      } else if (row.sound.type === 'synth') {
        const noteStr = row.note || `c${row.octave}`;
        code = `note("${noteStr}").s("${row.sound.bank}")`;
      } else if (row.sound.type === 'soundfont') {
        const noteStr = row.note || `c${row.octave}`;
        code = `note("${noteStr}").s("${row.sound.bank}")`;
      }

      // Pattern
      if (hasEuclid) {
        const { pulses, steps, rotation } = row.pattern.euclid;
        if (rotation) {
          code += `.euclidRot(${pulses},${steps},${rotation})`;
        } else {
          code += `.euclid(${pulses},${steps})`;
        }
      } else {
        const steps = row.pattern.steps.slice(0, stepCount);
        const struct = steps.map(s => s ? 'x' : '~').join(' ');
        code += `.struct("${struct}")`;
      }

      // Effects (same as rowToCodeLine)
      if (row.effects.cutoff.active) {
        code += `.cutoff(${row.effects.cutoff.value})`;
        if (row.effects.resonance.active && row.effects.resonance.value !== 1) {
          code += `.resonance(${row.effects.resonance.value})`;
        }
      }
      if (row.effects.hcutoff.active) {
        code += `.hcutoff(${row.effects.hcutoff.value})`;
        if (row.effects.hresonance.active && row.effects.hresonance.value !== 1) {
          code += `.hresonance(${row.effects.hresonance.value})`;
        }
      }
      if (row.effects.delay.active && row.effects.delay.value > 0) {
        code += `.delay(${row.effects.delay.value})`;
        code += `.delaytime(${row.effects.delaytime})`;
        code += `.delayfeedback(${row.effects.delayfeedback})`;
      }
      if (row.effects.room.active && row.effects.room.value > 0) {
        code += `.room(${row.effects.room.value})`;
        if (row.effects.roomsize !== 2) code += `.roomsize(${row.effects.roomsize})`;
        if (row.effects.ir) code += `.ir("${row.effects.ir}")`;
      }
      if (row.effects.distort.active && row.effects.distort.value > 0) {
        code += `.distort(${row.effects.distort.value})`;
        if (row.effects.distorttype !== 0) code += `.distorttype(${row.effects.distorttype})`;
      }
      if (row.effects.crush !== null) code += `.crush(${row.effects.crush})`;
      if (row.effects.coarse !== null) code += `.coarse(${row.effects.coarse})`;
      if (row.effects.pan !== 0.5) code += `.pan(${row.effects.pan})`;

      // Transforms
      if (row.transforms.reverse) code += `.rev()`;
      if (row.transforms.speed !== 1) code += `.fast(${row.transforms.speed})`;
      if (row.transforms.degradeBy !== null && row.transforms.degradeBy > 0) {
        code += `.degradeBy(${row.transforms.degradeBy})`;
      }
      if (row.transforms.swing !== null && row.transforms.swing > 0) {
        code += `.swing(${row.transforms.swing})`;
      }

      // Scale (melodic rows)
      if (globalScale && (row.sound.type === 'synth' || row.sound.type === 'soundfont')) {
        code += `.scale("${globalScale}")`;
      }

      return code;
    })
    .filter(line => line !== null);

  if (lines.length === 0) return '';

  let code;
  if (lines.length === 1) {
    code = lines[0];
  } else {
    code = `stack(\n  ${lines.join(',\n  ')}\n)`;
  }

  // Append master effects for display (so copy-paste produces full code)
  if (masterEffects.djf !== undefined && masterEffects.djf !== null && masterEffects.djf !== 0.5) {
    code += `\n  .djf(${masterEffects.djf.toFixed(2)})`;
  }
  if (masterEffects.room && masterEffects.room > 0) {
    code += `\n  .room(${masterEffects.room})`;
  }
  if (masterEffects.delay && masterEffects.delay > 0) {
    code += `\n  .delay(${masterEffects.delay})`;
  }

  return code;
}
