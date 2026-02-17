# Phase 3: The Knobs - Research

**Researched:** 2026-02-16
**Domain:** Strudel audio engine API (effects, synths, scales, euclidean, samples), touch-friendly knob UI components, React state architecture for real-time audio control
**Confidence:** HIGH

## Summary

Phase 3 transforms HOMIE Beats from an 8-row drum machine into a full instrument studio by exposing Strudel's deep audio engine through visual knobs, sliders, and selectors. The research confirms that **every feature in the CONTEXT.md decisions is directly supported by Strudel's API** -- effects (filter, delay, reverb, distortion, lo-fi), synth engines (saw, square, sine, triangle, supersaw), 92+ scales via @tonaljs/tonal, euclidean rhythms, 600+ drum machine samples, and General MIDI soundfonts. The main architectural challenge is designing a React state layer that translates knob turns into Strudel code strings at 60fps without audio glitches, and building a sound browser that lazy-loads from remote sample catalogs.

For the knob UI, `react-knob-headless` (v0.4.0) is the recommended library: headless, touch-friendly, ARIA-compliant, supports logarithmic mapping for filter cutoff, and vertical drag (Ableton-style) out of the box. For sliders (volume/mix levels), native `<input type="range">` with custom styling is sufficient and already proven in the codebase.

**Primary recommendation:** Build a code generation layer that sits between React state (knob values) and `evaluate()` calls, composing Strudel pattern strings from a declarative row model. Each row holds its sound source, effects chain, and pattern parameters. The code generator produces the full `stack()` expression on every change. Use `react-knob-headless` for rotary knobs and keep the existing slider pattern for linear controls.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **Claude's discretion** on where per-row controls appear (drawer, inline expand, or new tab) -- optimize for screen real estate and touch-friendliness
- **Key controls always visible** per row: sound selector, volume, and one prominent effect control. Expand for full rack.
- **Full rack on expand**: when a row is expanded, ALL controls are exposed (sound, full filter section, all effects, euclidean, pattern transforms). No sub-tabs -- everything at once.
- **16 sequencer rows** (double current 8). Rows organized in **collapsible sections by instrument type** (Drums, Bass, Synths, Melodic, etc.)
- **Per-row effects AND global master effects** (both, layered). Each row has its own effects chain. Master effects strip applies to the whole mix.
- **Master effects strip** lives as a bottom strip above the transport bar. Always visible. Includes DJ filter knob as a featured control.
- **Context-sensitive space allocation**: when editing a row's effects, the effects rack gets more space. When sequencing, the grid dominates. Space follows user focus.
- **Pads tab expands to 4x8 (32 pads)**. Each pad maps to one of the 16 sequencer rows, with two banks.
- **Code view auto-updates with everything** -- shows ALL Strudel code including effects, scales, euclidean params. Real-time mirror of every knob turn.
- **Code view is copy-only (export)** in Phase 3. Not editable. Editing comes in Phase 4 with AI assistance.
- **Visual category grid** when tapping sound selector -- big colorful tiles for categories (Drums, Keys, Strings, Synths, Weird, etc.)
- **Three-level drill-down**: Category > Bank > Sound (e.g., Drums > TR-808 > Kick)
- **Synths treated as another bank** alongside TR-808, TR-909, etc. Consistent mental model -- everything is a sound source.
- **Tap to preview, double-tap to select** -- single tap plays the sound, double-tap commits it to the row
- **All 128 General MIDI soundfonts exposed** -- full catalog, no curation
- **All 100+ Tidal Dirt sample banks available, lazy-loaded on browse** -- banks appear in browser but samples download on first selection
- **Favorites + Recents system** -- heart a sound to save, recents auto-tracked. Both at top of browser. Persistent across sessions (localStorage).
- **Colorful pixel-art style icons** per sound category (drum icon, piano icon, wavy synth icon, etc.)
- **Full session persistence** -- selected sounds, bank positions, favorites all saved to localStorage
- **Dice button (random sound)** -- picks a random sound from any category. Serendipity for kids.
- **Bonki reactions + suggestions** -- Bonki comments on sound choices AND occasionally suggests combos
- **Mix of knobs and sliders**: rotary knobs for effect parameters (cutoff, resonance, delay time), sliders for levels (volume, gain, mix)
- **Vertical drag for knobs**: drag up to increase, down to decrease. Like Ableton. Simple and reliable on touch.
- **Full animation on knobs**: knob rotates visually, trail/arc shows value range, glows when active, live number updates. Premium hardware feel.
- **Signal chain layout with glowing toggles**: effects displayed as a visual signal flow (left to right). Each effect node has a glowing toggle switch to activate/bypass.
- **Effect chain presets** for common signal chain orders: 'Clean', 'Gritty', 'Spacey', etc. Users pick a preset rather than manually reordering.
- **All 10 distortion algorithms exposed** in a selector, each with amount knob.
- **Full filter section per row**: cutoff, resonance, filter type (LP/HP/BP), PLUS envelope controls (ADSR) and LFO rate/depth
- **DJ filter featured in master strip**: single knob, sweeps from LP to HP (0=bass, 0.5=full, 1=treble).
- **Delay: full controls** -- time, feedback, mix knobs + sync toggle (free vs tempo-synced) + time division selector (1/4, 1/8, 1/16, dotted)
- **Reverb: both algorithmic (.room) and convolution (.ir)** -- default to algorithmic, toggle to convolution with named impulse responses
- **Lo-fi effects: both approaches** -- quick 'Lo-Fi' toggle for instant retro vibes, PLUS individual bitcrusher/coarse controls in the full effects chain
- **Gentle randomize button** per row: randomizes effect parameters within musical ranges.
- **Labels + live values on every knob**: parameter name below, current value above/inside. Educational.
- **Global defaults with per-row overrides** for pattern transforms (swing, probability, reverse, speed). Global strip sets baseline, individual rows can override.
- **Double-tap to reset any knob** to its default value.
- **Euclidean rhythm: number stepper buttons** (+/- for pulses and steps) with visual preview
- **Row = one note, multiple rows = melody**: each melodic row plays one fixed pitch.
- **Scale picker: visual keyboard + scale type selector**: mini piano keyboard shows which notes are in scale.
- **Note labels show both note name AND scale degree**: e.g., "C=1", "D=2", "E=3".
- **Auto-transpose on key change**: changing the root key transposes all melodic rows to match.
- **All 80+ scales available** (92 confirmed in @tonaljs/tonal)
- **Octave knob per melodic row**: each row has its own octave selector (C2-C6).
- **Playable keyboard preview**: tap keys on the visual keyboard to hear notes in the selected instrument sound.

### Claude's Discretion
- Exact control panel placement (drawer vs. inline vs. tab) -- optimize for real estate and touch
- Row section default names and grouping assignments
- Knob sizing and spacing for iPad touch targets (must be 48px+)
- Effect chain preset definitions and naming
- Sound category organization and icon design details
- Exactly how context-sensitive space allocation transitions (animation, threshold)
- Master effects strip layout and control arrangement
- Bonki reaction messages and suggestion logic (pre-AI, hardcoded)

### Deferred Ideas (OUT OF SCOPE)
- Recording & sharing recordings -- entirely new capability, deserves its own phase
- Custom audio file upload (drag & drop .wav) -- defer to Phase 5 or later
- Chord rows (playing Cm7, Fm7, etc.) -- defer to Phase 4 with AI assistance
- Per-step velocity (dynamic emphasis per cell) -- defer to Phase 5 polish
- User-renameable row groups -- progressive enhancement beyond Phase 3 defaults
- Role-based sound grouping (Rhythm/Tone/Texture views) -- progressive enhancement
</user_constraints>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @strudel/web | ^1.3.0 | Audio engine, pattern API, scales, synths | Already in project. Bundles @strudel/core, @strudel/tonal, @strudel/webaudio, @strudel/mini, @strudel/edo |
| react-knob-headless | 0.4.0 | Headless rotary knob component | Touch+mouse, vertical drag, ARIA slider, log/exp mapping, unstyled (we style it TE) |
| @strudel/soundfonts | ^1.3.0 | General MIDI soundfont playback | Needed for the 128 GM instruments (piano, strings, brass, etc.). Currently NOT re-exported from @strudel/web (commented out in web.mjs) -- must import separately |
| @tonaljs/tonal | (transitive via @strudel/tonal) | Scale names, note math | 92 scale types available. Already bundled via @strudel/web |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @use-gesture/react | (peer dep of react-knob-headless) | Touch/mouse gesture handling | Installed alongside react-knob-headless |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| react-knob-headless | Hand-rolled SVG knob | More control but 2-3x dev time, miss ARIA/gesture edge cases |
| react-knob-headless | react-dial-knob | Pre-styled (harder to TE-ify), last updated 5 years ago |
| @strudel/soundfonts | Direct WebAudioFont loading | Soundfonts package handles buffer management, pitch mapping, and GM catalog |

**Installation:**
```bash
npm install --save-exact react-knob-headless@0.4.0 @strudel/soundfonts@1.3.0
```

Note: `@use-gesture/react` will be installed as a peer dependency of `react-knob-headless`.

## Architecture Patterns

### Recommended Project Structure
```
src/
├── components/
│   ├── Sequencer.jsx           # Expanded: 16 rows, collapsible sections, inline controls
│   ├── RowControls.jsx         # NEW: Per-row control strip (sound selector, vol, featured effect)
│   ├── EffectsRack.jsx         # NEW: Full effects chain view (signal flow layout)
│   ├── Knob.jsx                # NEW: Styled wrapper around react-knob-headless
│   ├── Slider.jsx              # NEW: Styled range slider (volume/mix levels)
│   ├── ToggleSwitch.jsx        # NEW: Glowing bypass toggle for effects nodes
│   ├── SoundBrowser.jsx        # NEW: Category > Bank > Sound drill-down modal
│   ├── SoundCategoryGrid.jsx   # NEW: Big colorful tiles for sound categories
│   ├── ScalePicker.jsx         # NEW: Visual keyboard + scale type selector
│   ├── EuclideanControl.jsx    # NEW: Pulses/steps steppers with visual preview
│   ├── MasterStrip.jsx         # NEW: Global effects strip above transport
│   ├── DJFilter.jsx            # NEW: Single knob LP-to-HP sweep
│   ├── Pads.jsx                # Updated: 4x8 grid, two banks
│   ├── CodeView.jsx            # Updated: Shows effects, scales, euclidean in code
│   ├── Transport.jsx           # Existing
│   ├── Bonki.jsx               # Existing
│   ├── BonkiSpeech.jsx         # Updated: Sound-choice reactions
│   └── ...
├── utils/
│   ├── patterns.js             # EXPANDED: 16 sounds, effects code gen, scale/euclid
│   ├── layers.js               # Existing (may need minor updates)
│   ├── codeGenerator.js        # NEW: Declarative row model -> Strudel code string
│   ├── soundCatalog.js         # NEW: Sample bank catalog, categories, lazy loading
│   ├── effectDefaults.js       # NEW: Default values, ranges, chain presets
│   ├── scaleData.js            # NEW: Scale names from @tonaljs/tonal, note math
│   └── localStorage.js         # NEW: Favorites, recents, session persistence
├── hooks/
│   ├── useKnob.js              # NEW: Knob state + throttled evaluate
│   ├── useSoundBrowser.js      # NEW: Category/bank/sound navigation state
│   └── useSessionPersistence.js # NEW: localStorage save/restore
└── styles/
    ├── knobs.css               # NEW: Knob animations, arcs, glows
    ├── effects-rack.css        # NEW: Signal chain layout, node styling
    ├── sound-browser.css       # NEW: Category grid, drill-down panels
    └── ...
```

### Pattern 1: Declarative Row Model -> Code Generation
**What:** Each sequencer row is represented as a data object containing: sound source, effects chain values, pattern parameters (euclid, swing, degrade), and scale/note info. A pure function converts the full row model array into a Strudel `stack()` code string.
**When to use:** Every time any control changes (knob turn, sound swap, toggle)
**Why:** Separates UI state from code generation. The code generator is testable, the UI just updates a data model.

```javascript
// Row model shape
const rowModel = {
  id: 'row-0',
  sound: { type: 'sample', bank: 'RolandTR808', name: 'bd', n: 0 },
  // OR: { type: 'synth', engine: 'supersaw' }
  // OR: { type: 'soundfont', name: 'gm_piano', n: 0 }
  pattern: {
    steps: [true, false, false, true, false, false, true, false],
    euclid: null, // { pulses: 3, steps: 8, rotation: 0 }
  },
  effects: {
    cutoff: { value: 2000, active: true },
    resonance: { value: 5, active: true },
    filterType: 'lowpass', // 'lowpass' | 'highpass' | 'bandpass'
    lpattack: 0, lpdecay: 0.14, lpsustain: 0, lprelease: 0.1,
    lfoRate: null, lfoDepth: null,
    delay: { value: 0, active: false },
    delaytime: 0.25,
    delayfeedback: 0.5,
    delaysync: true,
    room: { value: 0, active: false },
    roomsize: 2,
    ir: null, // null = algorithmic, string = convolution IR name
    distort: { value: 0, active: false },
    distorttype: 0, // 0-8 = algorithm index
    crush: null, // bitcrusher (1-16)
    coarse: null, // sample rate reduction
    shape: null, // waveshaping
    pan: 0.5,
  },
  transforms: {
    swing: null, // overrides global if set
    degradeBy: null,
    speed: 1,
    reverse: false,
  },
  volume: 0.8,
  muted: false,
  // Melodic rows only:
  note: null, // e.g. 'C3' or scale step number
  octave: 3,
};

// Code generation (pure function)
function rowToStrudelCode(row, stepCount, globalScale) {
  if (row.muted) return null;
  let code = '';

  // Sound source
  if (row.sound.type === 'sample') {
    code = `s("${row.sound.bank}_${row.sound.name}")`;
  } else if (row.sound.type === 'synth') {
    code = `note("${row.note}").s("${row.sound.engine}")`;
  } else if (row.sound.type === 'soundfont') {
    code = `note("${row.note}").s("${row.sound.name}")`;
  }

  // Pattern structure
  if (row.pattern.euclid) {
    const { pulses, steps, rotation } = row.pattern.euclid;
    code += rotation ? `.euclidRot(${pulses},${steps},${rotation})` : `.euclid(${pulses},${steps})`;
  } else {
    const steps = row.pattern.steps.slice(0, stepCount);
    const struct = steps.map(s => s ? 'x' : '~').join(' ');
    code += `.struct("${struct}")`;
  }

  // Effects chain
  if (row.effects.cutoff.active) {
    code += `.cutoff(${row.effects.cutoff.value})`;
    if (row.effects.resonance.value !== 1) code += `.resonance(${row.effects.resonance.value})`;
  }
  if (row.effects.delay.active && row.effects.delay.value > 0) {
    code += `.delay(${row.effects.delay.value})`;
    code += `.delaytime(${row.effects.delaytime})`;
    code += `.delayfeedback(${row.effects.delayfeedback})`;
  }
  if (row.effects.room.active && row.effects.room.value > 0) {
    code += `.room(${row.effects.room.value})`;
    if (row.effects.ir) code += `.ir("${row.effects.ir}")`;
  }
  if (row.effects.distort.active && row.effects.distort.value > 0) {
    code += `.distort(${row.effects.distort.value})`;
    code += `.distorttype(${row.effects.distorttype})`;
  }
  if (row.effects.crush) code += `.crush(${row.effects.crush})`;
  if (row.effects.coarse) code += `.coarse(${row.effects.coarse})`;
  if (row.effects.pan !== 0.5) code += `.pan(${row.effects.pan})`;

  // Transforms
  if (row.transforms.reverse) code += `.rev()`;
  if (row.transforms.speed !== 1) code += `.fast(${row.transforms.speed})`;
  if (row.transforms.degradeBy) code += `.degradeBy(${row.transforms.degradeBy})`;
  if (row.transforms.swing) code += `.swing(${row.transforms.swing})`;

  // Volume
  if (row.volume < 1) code += `.gain(${row.volume.toFixed(2)})`;

  // Scale (melodic rows)
  if (globalScale) code += `.scale("${globalScale}")`;

  return code;
}
```

### Pattern 2: Throttled Evaluate Pipeline
**What:** Knob turns fire at 60fps but `evaluate()` is expensive. Use a requestAnimationFrame-throttled pipeline: knob updates React state instantly (for visual feedback), but the code regeneration + evaluate() call is batched to once per animation frame.
**When to use:** Any continuous control (knob drag, slider drag)

```javascript
// useThrottledEvaluate hook concept
function useThrottledEvaluate(rows, stepCount, volume, globalScale) {
  const pendingRef = useRef(false);
  const rowsRef = useRef(rows);
  rowsRef.current = rows;

  const scheduleEvaluate = useCallback(() => {
    if (pendingRef.current) return;
    pendingRef.current = true;
    requestAnimationFrame(() => {
      const code = generateFullCode(rowsRef.current, stepCount, volume, globalScale);
      if (code) evaluate(code);
      pendingRef.current = false;
    });
  }, [stepCount, volume, globalScale]);

  return scheduleEvaluate;
}
```

### Pattern 3: Sound Browser as Modal Overlay
**What:** Sound browser opens as a full-screen or large modal overlay (not inline) to maximize browsing space. Three-level drill-down: Category tiles -> Bank list -> Sound list with preview. Closes on double-tap select, returning the chosen sound to the row.
**When to use:** When user taps the sound selector on any row

### Pattern 4: Global + Per-Row Effects Layering
**What:** Master effects (djf, global reverb, etc.) are applied OUTSIDE the `stack()` wrapper. Per-row effects are chained INSIDE each row's code string. This matches Strudel's orbit-based architecture where global effects route through the orbit bus.
**When to use:** Always -- this is how Strudel's audio routing works

```javascript
// Full code structure
function generateMasterCode(stackCode, masterEffects) {
  let code = stackCode;
  if (masterEffects.djf !== null && masterEffects.djf !== 0.5) {
    code = `(${code}).djf(${masterEffects.djf.toFixed(2)})`;
  }
  if (masterEffects.room > 0) code = `(${code}).room(${masterEffects.room})`;
  if (masterEffects.delay > 0) code = `(${code}).delay(${masterEffects.delay})`;
  if (masterEffects.volume < 1) code = `(${code}).gain(${masterEffects.volume.toFixed(2)})`;
  return code;
}
```

### Anti-Patterns to Avoid
- **Evaluating on every knob tick:** Strudel's `evaluate()` parses and schedules a new pattern. At 60fps knob drag, this will cause audio glitches. MUST throttle to ~15-20 evaluate calls/sec max (every 50-66ms).
- **Storing code strings as primary state:** Code strings are OUTPUT, not state. Row model objects are the single source of truth. Code is derived.
- **Blocking audio init on sample catalog load:** The sample catalog JSON files (tidal-drum-machines.json, etc.) are large. Load the index (names) eagerly but load actual audio buffers lazily on first play.
- **One giant component:** The effects rack alone has 20+ controls. Must decompose into small, memoized components to avoid re-render cascading.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Rotary knob interaction | SVG drag math + touch handling | react-knob-headless | Gesture edge cases (momentum, drift, multi-touch), ARIA compliance, cross-browser |
| Logarithmic frequency mapping | Manual log/exp math | react-knob-headless's mapTo01/mapFrom01 | Filter cutoff needs log scale (20Hz-20kHz). Library handles the normalization |
| Scale note resolution | Manual interval math | @tonaljs/tonal via Strudel's .scale() | 92 scales, octave wrapping, enharmonic correctness all handled |
| Euclidean pattern generation | Bjorklund algorithm | Strudel's .euclid(pulses, steps) | Strudel's implementation includes rotation variant, legato variant, and morphing |
| Soundfont loading/playback | Manual SF2 parsing | @strudel/soundfonts registerSoundfonts() | Buffer management, pitch mapping, zone selection, loop points |
| Sample lazy-loading | Custom fetch/cache | Strudel's samples() function | Already handles JSON catalog, base URL resolution, GitHub path expansion |

**Key insight:** Strudel already handles ALL the audio complexity. Our job is purely UI -> code string -> evaluate(). We should never touch Web Audio nodes directly for effects (the Phase 2 analyser tap is the one exception, and that's read-only).

## Strudel API Reference (Verified from Source)

### Synth Engines (from superdough/synth.mjs)
Available via `.s("engineName")`:

| Engine | Code | Description |
|--------|------|-------------|
| Triangle | `s("triangle")` or `s("tri")` | Smooth, muted tone |
| Square | `s("square")` or `s("sqr")` | Hollow, buzzy, 8-bit feel |
| Sawtooth | `s("sawtooth")` or `s("saw")` | Bright, rich harmonics |
| Sine | `s("sine")` or `s("sin")` | Pure tone, no harmonics |
| Supersaw | `s("supersaw")` | Detuned unison saws (params: unison=5, spread=0.6, detune=0.18) |
| User | `s("user")` | Custom wavetable via .partials() |
| Noise | `s("pink")` / `s("white")` / `s("brown")` / `s("crackle")` | Noise generators |

Synths require `note()` to set pitch: `note("c3").s("supersaw")`

### Effects Chain (from superdough/superdough.mjs, verified in source)

#### Low-Pass Filter
```javascript
.cutoff(2000)          // LP cutoff frequency (Hz) - DEFAULT: none (bypassed when undefined)
.resonance(10)         // LP resonance (Q factor) - DEFAULT: 1
.lpattack(0.01)        // Filter envelope attack
.lpdecay(0.14)         // Filter envelope decay
.lpsustain(0)          // Filter envelope sustain
.lprelease(0.1)        // Filter envelope release
.lpenv(1)              // Envelope depth (can be negative for inverted)
.fanchor(0)            // Envelope anchor point
.ftype(0)              // Filter model: 0=12dB, 1=ladder, 2=24dB
.drive(0.69)           // Ladder filter drive (only for ftype=1)
.lprate(1)             // LFO rate for cutoff modulation
.lpdepth(1)            // LFO depth for cutoff modulation
.lpshape(0)            // LFO shape: 0=tri, 1=sine, 2=ramp, 3=saw, 4=square
```

#### High-Pass Filter
```javascript
.hcutoff(200)          // HP cutoff frequency (Hz)
.hresonance(5)         // HP resonance
// Same envelope/LFO params with hp- prefix: .hpattack, .hpdecay, etc.
```

#### Band-Pass Filter
```javascript
.bandf(1000)           // BP center frequency (Hz)
.bandq(5)              // BP Q/bandwidth
// Same envelope/LFO params with bp- prefix
```

#### DJ Filter (single knob LP-to-HP sweep)
```javascript
.djf(0.5)             // 0 = full LP, 0.5 = bypass, 1 = full HP
// Implemented as AudioWorklet (djf-processor)
// Applied at orbit level (global), not per-sound
```

#### Delay
```javascript
.delay(0.5)            // Delay wet mix (0-1) - DEFAULT: 0
.delaytime(0.25)       // Delay time in seconds (when not synced)
.delayfeedback(0.5)    // Feedback amount (0-0.98, clamped) - DEFAULT: 0.5
.delaysync(3/16)       // Delay time as fraction of cycle (tempo-synced) - DEFAULT: 3/16
// Note: delaytime overrides delaysync when both set
// Delay routes through orbit bus (shared per orbit)
```

#### Reverb
```javascript
// Algorithmic reverb
.room(0.5)             // Reverb wet mix (0-1)
.roomsize(2)           // Room size parameter
.roomfade(undefined)   // Fade time
.roomlp(undefined)     // Low-pass damping
.roomdim(undefined)    // High-frequency damping

// Convolution reverb (use alongside .room())
.ir("impulse_name")    // Name of impulse response sample (must be loaded via samples())
.irspeed(undefined)    // IR playback speed
.irbegin(undefined)    // IR start offset
// Reverb routes through orbit bus (shared per orbit)
```

#### Distortion
```javascript
.distort(2)            // Distortion amount
.distorttype(0)        // Algorithm selector (0-8, wraps)
// Available algorithms (from superdough/helpers.mjs distortionAlgorithms):
// 0: scurve    - S-curve soft saturation
// 1: soft      - Tanh soft clipping
// 2: hard      - Hard clipping
// 3: cubic     - Cubic polynomial
// 4: diode     - Diode simulation (asymmetric)
// 5: asym      - Asymmetric diode
// 6: fold      - Wavefolding
// 7: sinefold  - Sine wavefolding
// 8: chebyshev - Chebyshev polynomial waveshaping

.shape(0.5)            // Waveshaping (alternative to distort)
.shapevol(1)           // Post-shape gain - DEFAULT: 1
```

#### Lo-Fi / Bitcrusher
```javascript
.crush(4)              // Bit depth reduction (1=extreme, 16=subtle)
.coarse(8)             // Sample rate reduction factor
```

#### Other Effects
```javascript
.pan(0.5)              // Stereo pan (0=left, 0.5=center, 1=right)
.tremolo(4)            // Tremolo rate (Hz)
.tremolodepth(1)       // Tremolo depth (0-1) - DEFAULT: 1
.tremolosync(4)        // Tremolo rate synced to cycles
.phaserrate(1)         // Phaser LFO rate
.phaserdepth(0.75)     // Phaser depth - DEFAULT: 0.75
.phasercenter(1000)    // Phaser center frequency
.vowel("a")            // Vowel filter (a, e, i, o, u)
.compressor(-3)        // Dynamics compressor threshold
.gain(0.8)             // Per-event gain - DEFAULT: 0.8
.postgain(1)           // Post-FX gain - DEFAULT: 1
.velocity(1)           // Velocity multiplier - DEFAULT: 1
.orbit(1)              // Effect bus routing (shared delay/reverb per orbit) - DEFAULT: 1
```

### Scales (from @strudel/tonal via @tonaljs/tonal)
```javascript
// Usage: numbers become scale degrees
n("0 2 4 6").scale("C:major")

// Or quantize existing notes to nearest scale note
note("c d e f g").scale("C:minor")
```

92 scales confirmed in @tonaljs/tonal scale-type/data.ts, including:
- **Common:** major, minor, harmonic minor, melodic minor, dorian, mixolydian, lydian, phrygian, locrian
- **Pentatonic:** major pentatonic, minor pentatonic, blues (major/minor), ritusen, egyptian, pelog, hirajoshi, iwato, in-sen
- **Jazz:** bebop, bebop minor, bebop major, altered, lydian dominant
- **World:** hungarian minor, hungarian major, flamenco, persian, oriental, balinese, todi raga, purvi raga, kafi raga
- **Exotic:** whole tone, chromatic, diminished, half-whole diminished, enigmatic
- **Messiaen:** modes 3, 4, 5, 6, 7

Scale format: `"Root:ScaleName"` where Root = C, C#, Db, D, etc. with optional octave (defaults to 3).

### Euclidean Rhythms (from core/euclid.mjs)
```javascript
// Basic euclidean
s("bd").euclid(3, 8)                    // Cuban tresillo
s("bd").euclid(5, 8)                    // Cuban cinquillo
s("bd").euclidRot(3, 8, 2)             // With rotation
s("bd").euclidLegato(3, 8)             // Held notes (no gaps)
s("bd").euclidLegatoRot(3, 8, 2)       // Legato with rotation
// Named rhythm examples from source comments:
// euclid(3,8)  - Cuban tresillo
// euclid(5,8)  - Cuban cinquillo
// euclid(7,12) - West African bell
// euclid(4,9)  - Turkish Aksak
// euclid(5,16) - Bossa Nova
```

### Pattern Transforms (from core/pattern.mjs and core/signal.mjs)
```javascript
.fast(2)               // Speed up (multiply events)
.slow(2)               // Slow down
.rev()                 // Reverse pattern
.hurry(2)              // Speed up pattern AND playback rate
.swing(4)              // Swing at subdivision 4 (1/3 swing amount)
.swingBy(1/3, 4)       // Custom swing amount at subdivision
.degradeBy(0.3)        // Randomly remove 30% of events
.degrade()             // Remove 50% randomly
.sometimes(rev)        // Apply transform 50% of the time
.often(rev)            // Apply transform 75%
.rarely(rev)           // Apply transform 25%
.almostAlways(rev)     // Apply transform 90%
.almostNever(rev)      // Apply transform 10%
.jux(rev)              // Apply to right channel only (spatial)
```

### Sample Banks

#### Drum Machines (tidal-drum-machines.json)
600+ individual samples across 40+ machines. Sample naming: `MachineName_type` where type = bd, sd, hh, oh, cp, cr, rd, ht, mt, lt, cb, rim, sh, tb, perc, misc, fx.

Key machines:
- **Roland:** TR-808, TR-909, TR-606, TR-707, TR-505, TR-626, TR-727
- **Linn:** LinnDrum, LinnLM1, LinnLM2, Linn9000, AkaiLinn
- **Korg:** KPR-77, KR-55, M1, DDM-110, Minipops, Poly-800
- **Akai:** MPC60, XR10
- **Other:** Alesis HR16/SR16, Boss DR-110/220/550, Casio RZ1/SK1, Emu SP12/Drumulator, Oberheim DMX, Simmons SDS5

**Loading:** Already loaded in current `initAudio()` via `samples('https://raw.githubusercontent.com/felixroos/dough-samples/main/tidal-drum-machines.json')`

#### Dirt Samples
9 banks: casio, crow, insect, wind, jazz, metal, east, space, numbers

#### Soundfonts (General MIDI)
Available via @strudel/soundfonts `registerSoundfonts()`. Categories from gm.mjs:
- **Piano:** gm_piano (Acoustic Grand, Bright, Electric Grand, Honky-tonk, EP1, EP2, Harpsichord, Clavinet)
- **E-Piano:** gm_epiano1, gm_epiano2
- **Organ:** gm_organ
- **Guitar:** gm_guitar, gm_distortion_guitar
- **Bass:** gm_bass, gm_synth_bass
- **Strings:** gm_strings, gm_pizzicato_strings
- **Ensemble:** gm_choir, gm_orchestra_hit
- **Brass:** gm_trumpet, gm_trombone, gm_french_horn, gm_tuba
- **Reed:** gm_sax, gm_oboe, gm_clarinet
- **Pipe:** gm_flute, gm_piccolo, gm_recorder
- **Synth Lead:** gm_synth_lead (square, saw, calliope, chiff, charang, voice, fifths, bass+lead)
- **Synth Pad:** gm_pad (new age, warm, polysynth, choir, bowed, metallic, halo, sweep)
- **Synth Effects:** gm_fx (rain, soundtrack, crystal, atmosphere, brightness, goblins, echoes, sci-fi)
- **Ethnic:** gm_sitar, gm_banjo, gm_shamisen, gm_koto, gm_kalimba, gm_bagpipe, gm_fiddle
- **Percussive:** gm_timpani, gm_steel_drums, gm_woodblock, gm_taiko
- **Sound FX:** gm_gunshot, gm_helicopter, gm_applause, gm_telephone

**Loading:** Must call `registerSoundfonts()` separately (not included in @strudel/web bundle). Fonts load lazily from CDN on first use. The fontloader.mjs fetches JS files from the WebAudioFont CDN and dynamically processes them to extract zone/buffer data.

## Common Pitfalls

### Pitfall 1: Audio Glitch on Rapid Evaluate Calls
**What goes wrong:** Calling `evaluate()` on every knob tick (60fps) causes overlapping pattern scheduling, creating audio artifacts (clicks, doubled notes, timing drift).
**Why it happens:** Each `evaluate()` call parses the code string, creates a new pattern, and schedules it. If the previous pattern hasn't finished its current cycle, events can overlap.
**How to avoid:** Throttle `evaluate()` calls to ~15-20/sec (50-66ms). Use requestAnimationFrame for visual updates, separate timer for audio evaluate. Consider `evaluate()` only on drag-end for non-time-critical params (distortion type, filter model).
**Warning signs:** Clicking sounds during knob sweeps, notes firing twice, tempo drift during interaction.

### Pitfall 2: Soundfont Dynamic Import Failure
**What goes wrong:** `@strudel/soundfonts` uses dynamic code loading internally to parse font data from JS files on the WebAudioFont CDN. This can be blocked by strict CSP (Content Security Policy) headers.
**Why it happens:** The WebAudioFont data format is JavaScript, not JSON. The loader dynamically processes it.
**How to avoid:** Vite dev server is permissive by default, so this works in development. For production (GitHub Pages), ensure CSP allows dynamic script processing or use the sfumato-based loader (alternative path in @strudel/soundfonts).
**Warning signs:** Soundfonts load in dev but fail silently in production build.

### Pitfall 3: Stale Closures in Throttled Callbacks
**What goes wrong:** Throttled evaluate callbacks capture stale row state, playing outdated patterns.
**Why it happens:** React's functional updates create closures. When throttle delays the evaluate, the closure references old state.
**How to avoid:** Use refs (`useRef`) for the latest row model, read from ref in the throttled callback rather than from closure-captured state.
**Warning signs:** Knob changes "lag behind" or revert momentarily after rapid tweaking.

### Pitfall 4: Bundle Size Explosion from Soundfont Catalog
**What goes wrong:** Importing the full soundfont list/metadata statically increases bundle size dramatically.
**Why it happens:** gm.mjs in @strudel/soundfonts contains hundreds of font file references.
**How to avoid:** Dynamic import `@strudel/soundfonts` only when user opens the sound browser. The actual audio data already lazy-loads from CDN per-note -- just need to lazy-load the catalog metadata too.
**Warning signs:** Initial bundle size >2MB, slow first load.

### Pitfall 5: Orbit Collision for Per-Row Effects
**What goes wrong:** Multiple rows with delay/reverb share the same orbit bus, causing their effect sends to blend.
**Why it happens:** Strudel's delay and reverb route through orbit buses (`.orbit(N)`). Default orbit is 1 for all.
**How to avoid:** Assign each row to a unique orbit: `.orbit(rowIndex + 1)`. This gives each row its own delay/reverb bus. Strudel supports many orbits. Alternatively, use per-event effects (inline in the FX chain) instead of orbit-bus effects for delay/reverb.
**Warning signs:** All rows sharing the same reverb tail, delay feedback from one row bleeding into another.

### Pitfall 6: Filter Cutoff Knob Feels Wrong Without Log Scale
**What goes wrong:** A linear knob for filter cutoff (20-20000 Hz) makes the bottom 90% of the range sound like "nothing happens" and the top 10% sweeps through all the interesting frequencies.
**Why it happens:** Human hearing is logarithmic. Equal knob rotation should equal perceptual change.
**How to avoid:** Use react-knob-headless's `mapTo01` / `mapFrom01` props with exponential mapping:
```javascript
const mapTo01 = (value) => Math.log(value / 20) / Math.log(20000 / 20);
const mapFrom01 = (norm) => 20 * Math.pow(20000 / 20, norm);
```
**Warning signs:** Users complain the filter knob "doesn't do anything" in the first half of rotation.

## Code Examples

### Initializing Soundfonts (alongside existing audio init)
```javascript
// In main.jsx, extend initAudio():
export async function initAudio() {
  // ... existing Strudel init ...

  // Register soundfont playback (fonts load lazily from CDN on first use)
  try {
    const { registerSoundfonts } = await import('@strudel/soundfonts');
    await registerSoundfonts();
    console.log('Soundfonts registered');
  } catch (err) {
    console.warn('Soundfont registration failed (non-fatal):', err.message);
  }
}
```

### Full Row with Effects -> Strudel Code
```javascript
// What the code generator produces for a filtered supersaw with delay:
`note("c3").s("supersaw").cutoff(800).resonance(10).lpenv(1).lpdecay(0.3)
  .delay(0.4).delaytime(0.25).delayfeedback(0.6)
  .room(0.3).gain(0.7).orbit(2)`

// Euclidean kick with distortion:
`s("RolandTR808_bd").euclid(3,8).distort(2).distorttype(6).crush(8).gain(0.9).orbit(1)`

// Melodic row with scale:
`n("0").scale("C:minor pentatonic").s("gm_piano").octave(4)
  .cutoff(2000).room(0.2).gain(0.6).orbit(5)`
```

### DJ Filter Knob Implementation
```javascript
// DJ filter maps single knob (0-1) to LP/HP sweep
// 0 = full LP (bass only), 0.5 = bypass, 1 = full HP (treble only)
// Strudel's .djf() handles this natively via djf-processor worklet
// Applied at orbit level (global master)

function generateMasterCode(stackCode, masterEffects) {
  let code = stackCode;
  if (masterEffects.djf !== null && masterEffects.djf !== 0.5) {
    code = `(${code}).djf(${masterEffects.djf.toFixed(2)})`;
  }
  return code;
}
```

### Knob Component (react-knob-headless wrapper)
```jsx
import { KnobHeadless, KnobHeadlessLabel, KnobHeadlessOutput } from 'react-knob-headless';

function Knob({ label, value, min, max, onChange, unit, logScale, size = 48 }) {
  const mapTo01 = logScale
    ? (v) => Math.log(v / min) / Math.log(max / min)
    : (v) => (v - min) / (max - min);
  const mapFrom01 = logScale
    ? (n) => min * Math.pow(max / min, n)
    : (n) => min + n * (max - min);

  const angle = mapTo01(value) * 270 - 135; // -135 to +135 degrees

  return (
    <div className="knob-container">
      <KnobHeadlessLabel id={`knob-${label}`}>{label}</KnobHeadlessLabel>
      <KnobHeadless
        valueRaw={value}
        valueMin={min}
        valueMax={max}
        dragSensitivity={0.006}
        valueRawRoundFn={Math.round}
        valueRawDisplayFn={(v) => `${v}${unit || ''}`}
        mapTo01={mapTo01}
        mapFrom01={mapFrom01}
        onValueRawChange={onChange}
        aria-labelledby={`knob-${label}`}
        className="knob-interactive"
        style={{ width: size, height: size }}
      >
        {/* SVG knob visual */}
        <svg viewBox="0 0 48 48" className="knob-svg">
          <circle cx="24" cy="24" r="20" className="knob-track" />
          <path d={arcPath(mapTo01(value))} className="knob-arc" />
          <line
            x1="24" y1="24"
            x2={24 + 14 * Math.sin(angle * Math.PI / 180)}
            y2={24 - 14 * Math.cos(angle * Math.PI / 180)}
            className="knob-indicator"
          />
        </svg>
      </KnobHeadless>
      <KnobHeadlessOutput htmlFor={`knob-${label}`}>
        {value}{unit}
      </KnobHeadlessOutput>
    </div>
  );
}
```

### Euclidean Visual Preview
```javascript
// Generate a visual ring from euclidean pattern
// bjorklund available from @strudel/core
function EuclideanPreview({ pulses, steps, size = 48 }) {
  const pattern = bjorklund(pulses, steps);
  const angleStep = (2 * Math.PI) / steps;

  return (
    <svg viewBox="0 0 48 48" width={size} height={size}>
      <circle cx="24" cy="24" r="18" fill="none" stroke="#2a2a2a" strokeWidth="1" />
      {pattern.map((hit, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const x = 24 + 16 * Math.cos(angle);
        const y = 24 + 16 * Math.sin(angle);
        return (
          <circle
            key={i}
            cx={x} cy={y} r={hit ? 4 : 2}
            fill={hit ? '#f5a623' : '#2a2a2a'}
          />
        );
      })}
    </svg>
  );
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Strudel used `audioContext.destination` override for analysis | getSuperdoughAudioController().output.destinationGain tap | @strudel/web 1.3.0 | Phase 2 already uses this -- continue using it |
| Manual sample URL construction | samples() with JSON catalog + lazy loading | Strudel 1.x | Standard approach for all sample loading |
| CSS-only range sliders for audio params | Headless knob components with ARIA | 2024-2025 | Better UX for rotary controls, accessibility |
| Inline effects in pattern string | Orbit-based effect routing | Strudel architecture | Per-orbit shared delay/reverb buses -- assign orbits per row |

**Deprecated/outdated:**
- `@strudel/soundfonts` export from `@strudel/web` is commented out (`//export * from '@strudel/soundfonts'`). Must import directly.
- The soundfont list in `list.mjs` is marked "this list is not used anymore" -- the actual GM mapping is in `gm.mjs`.

## Open Questions

1. **Evaluate throttle rate sweet spot**
   - What we know: 60fps is too fast, evaluate() involves pattern scheduling. Current BPM control doesn't throttle, volume throttles at 100ms.
   - What's unclear: Exact threshold where audio glitches start. May vary by device (iPad vs Mac).
   - Recommendation: Start with 50ms throttle (20 calls/sec), test on iPad, adjust if needed. Consider separate rates for "continuous" (filter sweep) vs "discrete" (distortion type selector) controls.

2. **Orbit count limits**
   - What we know: Strudel creates orbit buses on demand. Each orbit has its own delay and reverb nodes.
   - What's unclear: Performance impact of 16 orbits (one per row) each with active delay + reverb on iPad.
   - Recommendation: Start with unique orbits per row. If performance suffers, fall back to shared orbits grouped by section (Drums share orbit 1, Bass share orbit 2, etc.).

3. **Soundfont catalog discovery API**
   - What we know: gm.mjs maps category names to font file arrays. registerSoundfonts() makes them available via `.s("fontName")`.
   - What's unclear: How to enumerate all registered soundfont names at runtime for the browser UI. May need to import gm.mjs directly for the catalog.
   - Recommendation: Import the gm.mjs catalog as a static data structure for the sound browser. The actual font data loads lazily.

4. **Dirt-Samples full catalog**
   - What we know: dough-samples repo has Dirt-Samples.json with only 9 banks. The full Tidal Dirt Samples collection has 100+ banks.
   - What's unclear: Whether the full Dirt Samples catalog is available via a different JSON endpoint or if it requires additional `samples()` calls.
   - Recommendation: Research the full Dirt Samples catalog location. May need to load from `github:tidalcycles/Dirt-Samples` or use the strudel.cc CDN. For Phase 3, the 40+ drum machines + 9 Dirt banks + soundfonts is already a massive library. Full Dirt can be added incrementally.

5. **Context-sensitive layout transitions**
   - What we know: CONTEXT.md says "space follows user focus" -- effects rack gets more space when editing.
   - What's unclear: Exact UX mechanic -- CSS transition? Drawer push? Accordion expand?
   - Recommendation (Claude's discretion): Use accordion expand on the row itself. When a row is expanded, it grows to show the full effects rack. Other rows collapse to compact view (just the grid + inline controls). CSS transition with 200ms ease. On iPad, expanded row takes ~60% of viewport height.

## Sources

### Primary (HIGH confidence)
- Strudel source code at `~/strudel/` -- packages/superdough/superdough.mjs (effects chain), packages/superdough/helpers.mjs (distortion algorithms, filter, ADSR), packages/superdough/synth.mjs (synth engines), packages/core/euclid.mjs (euclidean rhythms), packages/tonal/tonal.mjs (scale API), packages/soundfonts/ (GM soundfonts)
- Strudel `@strudel/web` v1.3.0 package.json -- confirms bundle composition
- @tonaljs/tonal scale-type/data.ts -- 92 scale names (https://github.com/tonaljs/tonal/blob/main/packages/scale-type/data.ts)
- react-knob-headless v0.4.0 -- https://react-knob-headless.pages.dev/ and https://github.com/satelllte/react-knob-headless
- dough-samples tidal-drum-machines.json -- 600+ samples across 40+ machines (https://raw.githubusercontent.com/felixroos/dough-samples/main/tidal-drum-machines.json)

### Secondary (MEDIUM confidence)
- @strudel/soundfonts gm.mjs -- GM instrument categories and font file mappings (verified in source)
- Strudel prebake.mjs -- standard sample loading pattern (verified in source)

### Tertiary (LOW confidence)
- Full Tidal Dirt Samples catalog size (100+ banks claimed in CONTEXT.md, only 9 confirmed in dough-samples/Dirt-Samples.json). The full collection may be available elsewhere.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- react-knob-headless verified active (v0.4.0 June 2025), all Strudel APIs verified in source code
- Architecture: HIGH -- code generation pattern is proven (current codebase already uses sequencerToPattern), just needs expansion
- Pitfalls: HIGH -- identified from actual source code analysis (orbit routing, evaluate throttling, soundfont loading)
- Sound catalog: MEDIUM -- drum machines fully verified (600+ samples), soundfonts verified (gm.mjs), Dirt Samples partially verified (9 banks confirmed, 100+ claimed)

**Research date:** 2026-02-16
**Valid until:** 2026-03-16 (Strudel 1.3.0 is stable, react-knob-headless is pre-1.0 but API is small)
