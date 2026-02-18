/**
 * codeGenerator.js -- Pure functions converting row model to Strudel code
 *
 * This is the single source of truth for translating UI state into audio.
 * Every knob turn, cell toggle, and sound swap flows through here.
 *
 * Exports: rowToCodeLine, rowsToStrudelCode, generateDisplayCode
 */

/** Round a numeric value to N decimal places, stripping trailing zeros */
function r(v, d) { return parseFloat(v.toFixed(d)); }

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
    code = `s("${row.sound.bank}").note("${noteStr}")`;
  } else if (row.sound.type === 'soundfont') {
    const noteStr = row.note || `c${row.octave}`;
    code = `s("${row.sound.bank}").note("${noteStr}")`;
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
  // All values rounded to match UI step precision (safety net for float drift)

  // Low-pass filter
  if (row.effects.cutoff.active) {
    code += `.cutoff(${r(row.effects.cutoff.value, 0)})`;
    if (row.effects.resonance.active && row.effects.resonance.value !== 1) {
      code += `.resonance(${r(row.effects.resonance.value, 1)})`;
    }
  }

  // High-pass filter
  if (row.effects.hcutoff.active) {
    code += `.hcutoff(${r(row.effects.hcutoff.value, 0)})`;
    if (row.effects.hresonance.active && row.effects.hresonance.value !== 1) {
      code += `.hresonance(${r(row.effects.hresonance.value, 1)})`;
    }
  }

  // Delay
  if (row.effects.delay.active && row.effects.delay.value > 0) {
    code += `.delay(${r(row.effects.delay.value, 2)})`;
    code += `.delaytime(${r(row.effects.delaytime, 4)})`;
    code += `.delayfeedback(${r(row.effects.delayfeedback, 2)})`;
  }

  // Reverb
  if (row.effects.room.active && row.effects.room.value > 0) {
    code += `.room(${r(row.effects.room.value, 2)})`;
    if (row.effects.roomsize !== 2) code += `.roomsize(${r(row.effects.roomsize, 1)})`;
    if (row.effects.ir) code += `.ir("${row.effects.ir}")`;
  }

  // Distortion
  if (row.effects.distort.active && row.effects.distort.value > 0) {
    code += `.distort(${r(row.effects.distort.value, 1)})`;
    if (row.effects.distorttype !== 0) code += `.distorttype(${row.effects.distorttype})`;
  }

  // Lo-fi
  if (row.effects.crush !== null) code += `.crush(${r(row.effects.crush, 0)})`;
  if (row.effects.coarse !== null) code += `.coarse(${r(row.effects.coarse, 0)})`;

  // Pan
  if (row.effects.pan !== 0.5) code += `.pan(${r(row.effects.pan, 2)})`;

  // --- Transforms ---
  if (row.transforms.reverse) code += `.rev()`;
  if (row.transforms.speed !== 1) code += `.fast(${r(row.transforms.speed, 2)})`;
  if (row.transforms.degradeBy !== null && row.transforms.degradeBy > 0) {
    code += `.degradeBy(${r(row.transforms.degradeBy, 2)})`;
  }
  if (row.transforms.swing !== null && row.transforms.swing > 0) {
    code += `.swing(${r(row.transforms.swing, 2)})`;
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
export function rowsToStrudelCode(rows, stepCount, globalScale, masterEffects = {}, globalTransforms = {}) {
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
    code = `(${code}).djf(${r(masterEffects.djf, 2)})`;
  }
  if (masterEffects.room && masterEffects.room > 0) {
    code = `(${code}).room(${r(masterEffects.room, 2)})`;
  }
  if (masterEffects.delay && masterEffects.delay > 0) {
    code = `(${code}).delay(${r(masterEffects.delay, 2)})`;
  }
  if (masterEffects.volume !== undefined && masterEffects.volume < 1) {
    code = `(${code}).gain(${masterEffects.volume.toFixed(2)})`;
  }

  // Apply global transforms outside the stack
  if (globalTransforms.swing && globalTransforms.swing > 0) {
    code = `(${code}).swing(${r(globalTransforms.swing, 2)})`;
  }
  if (globalTransforms.degradeBy && globalTransforms.degradeBy > 0) {
    code = `(${code}).degradeBy(${r(globalTransforms.degradeBy, 2)})`;
  }
  if (globalTransforms.speed && globalTransforms.speed !== 1) {
    code = `(${code}).fast(${r(globalTransforms.speed, 2)})`;
  }
  if (globalTransforms.reverse) {
    code = `(${code}).rev()`;
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
        code = `s("${row.sound.bank}").note("${noteStr}")`;
      } else if (row.sound.type === 'soundfont') {
        const noteStr = row.note || `c${row.octave}`;
        code = `s("${row.sound.bank}").note("${noteStr}")`;
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

      // Effects (rounded to match UI step precision)
      if (row.effects.cutoff.active) {
        code += `.cutoff(${r(row.effects.cutoff.value, 0)})`;
        if (row.effects.resonance.active && row.effects.resonance.value !== 1) {
          code += `.resonance(${r(row.effects.resonance.value, 1)})`;
        }
      }
      if (row.effects.hcutoff.active) {
        code += `.hcutoff(${r(row.effects.hcutoff.value, 0)})`;
        if (row.effects.hresonance.active && row.effects.hresonance.value !== 1) {
          code += `.hresonance(${r(row.effects.hresonance.value, 1)})`;
        }
      }
      if (row.effects.delay.active && row.effects.delay.value > 0) {
        code += `.delay(${r(row.effects.delay.value, 2)})`;
        code += `.delaytime(${r(row.effects.delaytime, 4)})`;
        code += `.delayfeedback(${r(row.effects.delayfeedback, 2)})`;
      }
      if (row.effects.room.active && row.effects.room.value > 0) {
        code += `.room(${r(row.effects.room.value, 2)})`;
        if (row.effects.roomsize !== 2) code += `.roomsize(${r(row.effects.roomsize, 1)})`;
        if (row.effects.ir) code += `.ir("${row.effects.ir}")`;
      }
      if (row.effects.distort.active && row.effects.distort.value > 0) {
        code += `.distort(${r(row.effects.distort.value, 1)})`;
        if (row.effects.distorttype !== 0) code += `.distorttype(${row.effects.distorttype})`;
      }
      if (row.effects.crush !== null) code += `.crush(${r(row.effects.crush, 0)})`;
      if (row.effects.coarse !== null) code += `.coarse(${r(row.effects.coarse, 0)})`;
      if (row.effects.pan !== 0.5) code += `.pan(${r(row.effects.pan, 2)})`;

      // Transforms
      if (row.transforms.reverse) code += `.rev()`;
      if (row.transforms.speed !== 1) code += `.fast(${r(row.transforms.speed, 2)})`;
      if (row.transforms.degradeBy !== null && row.transforms.degradeBy > 0) {
        code += `.degradeBy(${r(row.transforms.degradeBy, 2)})`;
      }
      if (row.transforms.swing !== null && row.transforms.swing > 0) {
        code += `.swing(${r(row.transforms.swing, 2)})`;
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
    code += `\n  .djf(${r(masterEffects.djf, 2)})`;
  }
  if (masterEffects.room && masterEffects.room > 0) {
    code += `\n  .room(${r(masterEffects.room, 2)})`;
  }
  if (masterEffects.delay && masterEffects.delay > 0) {
    code += `\n  .delay(${r(masterEffects.delay, 2)})`;
  }

  return code;
}
