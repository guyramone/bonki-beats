# Phase 2: The Board - Research

**Researched:** 2026-02-15
**Domain:** Real-time audio controls, preset system, code visualization, pattern layering (Strudel + Web Audio API + React)
**Confidence:** HIGH

## Summary

Phase 2 transforms HOMIE Beats from a simple tap-and-play instrument into a real music-making board with live controls (BPM, volume, step count), an eclectic preset library with Bonki album art, a live code view panel, and a full layering system where sequencer + pads + presets all stack simultaneously.

The core technical challenge is threefold: (1) wiring Strudel's `setCps()` and Web Audio API's `GainNode` for real-time BPM and volume control, (2) managing multiple concurrent pattern layers via Strudel's `stack()` and a React state layer manager, and (3) rendering live-updating Strudel code with syntax highlighting in a split-pane layout. All three are achievable with the existing `@strudel/web` API and zero new heavy dependencies -- Prism.js (2KB core) is the only meaningful addition.

**Primary recommendation:** Build on the existing `evaluate()` / `hush()` pattern from Phase 1 but introduce a layer manager in App state that composes all active layers into a single `stack()` call for each `evaluate()`. BPM uses `setcps()` via evaluate. Volume uses Strudel's `.gain()` control. The code view is a read-only `<pre>` block with Prism.js highlighting, not a full editor component.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

#### Controls feel
- **BPM:** Horizontal slider, 60-180 range, always-visible numeric readout ("120 BPM")
- **Volume:** Matching horizontal slider style, always-visible readout
- **Controls strip placement:** Dedicated strip above the content area, between tabs and sequencer/pads
- **Visible on ALL tabs** -- controls strip shows regardless of active tab
- **BPM changes are instant** -- live scrubbing, tempo changes in real time even mid-loop
- **BPM extreme feedback:** BOTH color shift on slider at edges AND Bonki's vibe animation speed syncs to tempo (slow nod at 60, head-banging at 180)

#### Preset personality
- **Genres:** ALL of them -- hip-hop, lo-fi, techno, ambient, weird, afrobeat, chiptune/8-bit, jazz, trap, ambient drone, breakbeat, cartoon bounce, space vibes, video game, dance party, chill. Go wide and eclectic.
- **Count:** 15+ presets minimum
- **Display:** Gallery of cards styled as mini album/CD covers -- horizontal scrollable, like flipping through a record crate
- **Album covers:** Pixel art SVGs featuring Bonki in different poses/outfits per genre. Animal Crossing K.K. Slider energy -- badass and cute.
- **Naming:** Fun character name + genre subtitle. E.g., "Midnight Purr" (lo-fi hip-hop), "Catnip Chaos" (breakbeat)
- **Loading behavior:** Tap to preview, add action to layer on top of current mix
- **BPM on load:** Auto-sets to preset's ideal tempo, but slider stays live for adjustment
- **Bonki reaction:** Tiny speech bubble with a one-liner when preset loads ("ooh, that's my jam", "spicy choice", etc.)
- **Gallery location:** Inside the SEQUENCE tab, above or alongside the sequencer grid

#### Code view design
- **Panel type:** Split pane -- instrument and code visible simultaneously
- **Orientation:** Responsive -- side by side on tablet/desktop, stacked top/bottom on mobile
- **Visibility:** Always visible (no toggle to hide). Code is always showing.
- **Code updates:** Live -- every cell toggle instantly updates the code view. Direct connection between grid and code.
- **Line highlighting:** When a cell is toggled, the corresponding Strudel line flashes/highlights briefly
- **Code depth:** Full Strudel code shown -- including stack() wrapper. Real code, nothing hidden.
- **All layers shown:** Code panel displays the complete combined Strudel code for all active layers
- **Styling:** Dark terminal aesthetic -- monospace font, darker background than app, standard dark syntax theme (Monokai/One Dark style)
- **Read-only hint:** If someone clicks in the code, Bonki speech bubble says "not yet, human -- I'll teach you soon" (teaser for Phase 3 editing)
- **Copy button:** Clipboard icon to copy current Strudel code for pasting into strudel.cc or elsewhere
- **Syntax highlighting:** Standard dark code theme colors (not app accent colors)

#### Layer behavior
- **Full layering:** Sequencer loop + pad sounds + preset layers all play simultaneously
- **No layer limit** -- stack as many as you want. HUSH is the reset button.
- **Pad behavior:** Pads can loop too (pattern pads like 4-on-floor, hi-hat groove loop on top of sequencer)
- **Layer indicator chips:** Shown above the content area, thin dedicated row
- **Chip interactions:** Tap chip name to solo/un-solo that layer, tap X to remove it entirely
- **Code view:** Shows all active layers' code combined in one view

### Claude's Discretion
- 8/16 step toggle widget style (toggle button vs segmented control)
- 8->16 step expansion behavior (pad with empty vs double the pattern)
- Controls strip visual identity (label, dividers, etc.)
- Volume scope (master vs sequencer-only)
- HUSH behavior with layers (clear all vs stop-but-remember)
- Sequencer editing scope with active layers

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

## Standard Stack

### Core (already installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `@strudel/web` | `^1.3.0` | Audio engine, pattern evaluation, tempo control | Already the engine. Re-exports `@strudel/core` (setCps, stack, evaluate), `@strudel/webaudio` (getAudioContext), all needed APIs. |
| `react` | `^18.2.0` | UI components, state management | Already installed. Layer state, controls state, code string generation all fit React state model. |
| `vite` | `^6.0.11` | Dev server, build | Already installed. No changes needed. |

### New Addition
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `prismjs` | `^1.29.0` | Syntax highlighting for code view | Code view panel needs JavaScript syntax coloring. 2KB core + JS grammar. |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Prism.js | highlight.js | highlight.js auto-detects language (unnecessary -- we always know it's JS/Strudel). Prism is smaller, more explicit. |
| Prism.js | react-syntax-highlighter | Wraps Prism/highlight.js in React component. Adds 15KB+ bundle. Overkill for a read-only `<pre>` block. |
| Prism.js | Manual regex highlighting | Fragile, misses edge cases. Prism handles it in 2KB. |
| Prism.js | No highlighting (plain monospace) | Functional but misses the "dark terminal aesthetic" feel. Worth the 2KB. |

**Installation:**
```bash
npm install prismjs
```

## Architecture Patterns

### Recommended Project Structure (Phase 2 additions)
```
src/
  components/
    ControlStrip.jsx     # BPM slider + volume slider + 8/16 toggle
    PresetGallery.jsx     # Horizontal scrollable preset cards
    PresetCard.jsx        # Individual album cover card
    CodeView.jsx          # Read-only syntax-highlighted code panel
    LayerChips.jsx        # Layer indicator strip with solo/remove
    BonkiSpeech.jsx       # Speech bubble overlay for Bonki reactions
    Sequencer.jsx         # (modified: accept stepCount prop, 8 or 16)
    Bonki.jsx             # (modified: accept bpm prop for animation speed)
    Transport.jsx         # (modified: HUSH clears layers)
  utils/
    patterns.js           # (modified: sequencerToPattern accepts stepCount)
    presets.js             # 15+ preset definitions with pattern code, BPM, Bonki lines
    layers.js             # Layer manager: add, remove, solo, compose to stack()
  styles/
    index.css             # (modified: controls strip, layer chips, split pane layout)
    bonki.css             # (modified: BPM-synced animation duration)
    code-view.css         # Dark terminal theme for code panel
    presets.css            # Album cover cards, horizontal scroll gallery
  App.jsx                 # (modified: layer state, controls state, split pane layout)
```

### Pattern 1: Layer Manager (State Composition Pattern)
**What:** Centralized layer state that composes multiple active patterns into a single `stack()` call for `evaluate()`.
**When to use:** Every time any layer changes (add, remove, toggle, sequencer edit).
**Example:**
```javascript
// Source: Verified from @strudel/core/pattern.mjs line 1449 and @strudel/web/web.mjs line 66

// Layer state shape
const [layers, setLayers] = useState([]);
// Each layer: { id, name, type: 'sequencer'|'pad'|'preset', code: string, active: true }

// Compose all active layers into a single Strudel pattern
function composeLayerCode(layers) {
  const activeCodes = layers.filter(l => l.active).map(l => l.code);
  if (activeCodes.length === 0) return '';
  if (activeCodes.length === 1) return activeCodes[0];
  return `stack(\n  ${activeCodes.join(',\n  ')}\n)`;
}

// When any layer changes:
const fullCode = composeLayerCode(layers);
if (fullCode) {
  evaluate(fullCode);
} else {
  hush();
}
```

### Pattern 2: BPM Control via setCps (Direct Scheduler Access)
**What:** Convert BPM to Strudel's CPS (cycles per second) and set it on the scheduler. Changes take effect immediately, even mid-loop.
**When to use:** Every time the BPM slider value changes.
**Example:**
```javascript
// Source: Verified from @strudel/core/cyclist.mjs line 129-135 and repl.mjs line 285-288

// CRITICAL: Strudel uses CPS (cycles per second), not BPM.
// BPM / 60 / 4 = CPS for 4/4 time (1 cycle = 1 bar = 4 beats)
// Default CPS is 0.5 (= 120 BPM in 4/4)

// The repl object returned by initStrudel() has .scheduler.setCps()
// BUT it is module-internal. The exported setcps function is
// injected into evalScope for use in code strings.

// APPROACH: Include setcps in the evaluated code string.
// This works because setcps is available in evalScope after initStrudel().
function bpmToCps(bpm) {
  return bpm / 60 / 4;
}

// Lightweight tempo change (no pattern reparse, returns silence):
evaluate(`setcps(${bpmToCps(newBpm)})`);
```

### Pattern 3: Volume via Pattern-Level Gain
**What:** Apply `.gain()` modifier to the composed pattern code for master volume control.
**When to use:** When volume slider changes.
**Example:**
```javascript
// Source: Verified from @strudel/core/controls.mjs line 467 (.gain() control)
// .gain() is a Strudel control that sets per-event amplitude (0 to 1 range)

function applyVolume(code, volume) {
  if (volume >= 1) return code;
  return `(${code}).gain(${volume.toFixed(2)})`;
}

// Usage in evaluate flow:
let fullCode = composeLayerCode(layers);
fullCode = applyVolume(fullCode, volume);
evaluate(fullCode);
```

### Pattern 4: Dynamic Bonki Animation Speed
**What:** Sync Bonki's vibing animation duration to BPM for visual tempo feedback.
**When to use:** Whenever BPM changes.
**Example:**
```css
/* bonki.css -- animation duration as CSS custom property */
.bonki-vibing {
  animation: bonki-vibe var(--bonki-vibe-speed, 500ms) ease-in-out infinite;
}
```
```javascript
// In Bonki.jsx or parent: set CSS variable based on BPM
// 120 BPM = 500ms per beat. 60 BPM = 1000ms. 180 BPM = 333ms.
const vibeSpeed = Math.round(60000 / bpm); // ms per beat
// Pass via inline style on wrapper element
<div style={{ '--bonki-vibe-speed': `${vibeSpeed}ms` }}>
  <Bonki state={isPlaying ? 'vibing' : 'idle'} />
</div>
```

### Pattern 5: Horizontal Scroll Gallery (CSS Snap)
**What:** Horizontal scrollable preset gallery with snap points, like flipping through a record crate.
**When to use:** Preset gallery display.
**Example:**
```css
/* CSS scroll snap for record crate feel */
.preset-gallery {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  padding: 8px 0;
  scrollbar-width: none; /* Firefox */
}
.preset-gallery::-webkit-scrollbar { display: none; }

.preset-card {
  flex-shrink: 0;
  width: 120px;
  scroll-snap-align: start;
}
```

### Pattern 6: Prism.js String-Based Highlighting
**What:** Use Prism's pure-function API to generate highlighted HTML strings, letting React handle DOM updates.
**When to use:** Code view panel rendering.
**Example:**
```javascript
// Source: Prism.js official API -- prismjs.com

import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';

function CodeView({ code, onCodeClick }) {
  // Prism.highlight() returns a string of HTML with <span> tags
  // for syntax tokens. This is safe because the input (code) is
  // our own generated Strudel pattern code, never arbitrary user HTML.
  // The output only contains Prism's class-based <span> wrappers.
  const highlighted = Prism.highlight(
    code || '// no pattern',
    Prism.languages.javascript,
    'javascript'
  );

  return (
    <div className="code-view" onClick={onCodeClick}>
      <pre className="code-pre">
        <code
          className="language-javascript"
          // Safe: input is our own generated Strudel code, not user HTML.
          // Prism output contains only <span class="token ..."> wrappers.
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      </pre>
    </div>
  );
}
```

### Anti-Patterns to Avoid
- **Re-evaluating the full pattern on every BPM change:** BPM is a scheduler property (`setCps`), not a pattern property. Changing BPM does NOT require re-evaluating the pattern code. Use a separate `evaluate(\`setcps(...)\`)` call which is lightweight.
- **Multiple concurrent `evaluate()` calls for layers:** Never call `evaluate()` per-layer. Strudel's `evaluate()` replaces the current pattern entirely (calls `hush()` internally first -- verified at repl.mjs line 406-407). Always compose all layers into ONE `stack()` call and `evaluate()` that single combined string.
- **Using CodeMirror or Monaco for read-only code view:** These are full editors (100KB+). For a read-only display with highlighting, Prism.js at 2KB is the right tool.
- **Storing layer state as pattern strings only:** Store structured layer data (id, name, type, code, active, solo) and generate the combined code string on the fly. This enables solo/mute/remove without string parsing.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Syntax highlighting | Custom regex-based colorizer | Prism.js | JS/Strudel syntax has edge cases (template literals, method chaining, string patterns). Prism handles them in 2KB. |
| Tempo control | Custom clock/timer | Strudel's `setcps()` via evaluate | The Cyclist scheduler already handles CPS changes mid-loop with correct phase tracking (see cyclist.mjs lines 38-44). |
| Pattern stacking | Custom audio mixer | Strudel's `stack()` function | `stack()` is Strudel's native way to combine patterns. Handles timing, phase alignment, polyphony. |
| Horizontal scroll with snap | Custom scroll handler with JS | CSS `scroll-snap-type` | Native browser API, works on all targets (iPad Safari, Chrome, Firefox). No JS needed. |
| Audio volume control | Custom gain processing | Strudel `.gain()` control | Built-in control. Don't build custom DSP. |

**Key insight:** Phase 2's complexity is almost entirely in STATE MANAGEMENT (layers, controls) and LAYOUT (split pane, controls strip, preset gallery). The audio engine (Strudel) and browser APIs (Web Audio, CSS scroll-snap) handle the hard technical work.

## Common Pitfalls

### Pitfall 1: evaluate() Replaces, It Doesn't Stack
**What goes wrong:** Calling `evaluate(preset.code)` when a sequencer pattern is already playing silently kills the sequencer pattern. The user thinks they're layering but they're replacing.
**Why it happens:** `evaluate()` in `@strudel/web` calls `repl.evaluate()` which calls `hush()` internally before setting the new pattern (see repl.mjs line 406-407: `hush()` is called, then the new pattern is set). Each `evaluate()` is a full replacement.
**How to avoid:** ALWAYS compose all active layers into a single `stack()` code string and call `evaluate()` once with the combined code. The layer manager pattern (Pattern 1 above) prevents this.
**Warning signs:** Audio drops out momentarily when loading a preset. Only the most recently activated layer is audible.

### Pitfall 2: BPM is not CPS -- The Conversion Trap
**What goes wrong:** Setting `setCps(120)` thinking it means 120 BPM. Actually sets 120 cycles per second, which is absurdly fast.
**Why it happens:** Strudel uses CPS (cycles per second), inherited from TidalCycles. Musical BPM must be converted: `CPS = BPM / 60 / beatsPerCycle`.
**How to avoid:** For an 8-step sequencer where 1 cycle = 1 bar of 4 beats: `CPS = BPM / 60 / 4`. So 120 BPM = 0.5 CPS. Always wrap the conversion in a named function: `bpmToCps(bpm) => bpm / 60 / 4`.
**Warning signs:** Everything plays insanely fast or slow. Default CPS is 0.5 (= 120 BPM in 4/4).

### Pitfall 3: Slider onChange Fires Continuously -- Evaluate Throttling
**What goes wrong:** BPM slider's `onChange` fires on every pixel of drag. If wired to full pattern `evaluate()`, this causes hundreds of re-evaluations per second, causing audio crackling and UI freezing.
**Why it happens:** HTML range inputs fire `input` events continuously during drag.
**How to avoid:** For BPM: use `evaluate(\`setcps(${cps})\`)` which is lightweight (no pattern reparse). For volume: since volume requires re-evaluating the full pattern with `.gain()`, throttle to ~100ms. Use a ref-based throttle, not debounce (debounce delays; throttle rate-limits while staying responsive).
**Warning signs:** Audio glitches during slider drag. UI becomes unresponsive while dragging.

### Pitfall 4: CSS Grid Column Count Change Without Grid Data Resize
**What goes wrong:** Toggling from 8 to 16 steps updates the CSS grid columns but the `grid` state array still has 8 entries per row. Rendering breaks -- cells don't match positions.
**Why it happens:** The sequencer grid CSS (`repeat(8, 1fr)`) and the data model (`Array(STEP_COUNT).fill(false)`) must change together.
**How to avoid:** When step count changes: (1) update the state arrays (pad with `false` or double the pattern), (2) update the CSS grid template via CSS custom property, (3) re-evaluate the pattern if playing. Keep `stepCount` in React state and derive both CSS and data from it.
**Warning signs:** Cells appear in wrong positions after toggle. Last cells are inaccessible. Pattern sounds different than grid shows.

### Pitfall 5: Split Pane Layout on Mobile
**What goes wrong:** Side-by-side layout for instrument + code view doesn't fit on phone-width screens. Code panel either overflows or crushes the instrument to unusable size.
**Why it happens:** Trying to split 375px horizontally gives ~187px per pane -- too narrow for either.
**How to avoid:** CSS media query: side-by-side above 768px, stacked (instrument on top, code below) at mobile widths. The code panel can be a shorter fixed-height panel on mobile that scrolls independently. Decision is already locked: "Responsive -- side by side on tablet/desktop, stacked top/bottom on mobile."
**Warning signs:** Sequencer cells become tiny. Code text wraps absurdly. Touch targets fall below 48px.

### Pitfall 6: Prism.js Re-highlighting on Every State Change
**What goes wrong:** Calling `Prism.highlightElement()` on every cell toggle causes visible flicker and layout thrashing.
**Why it happens:** Prism's DOM-based API operates on real elements, causing reflows.
**How to avoid:** Use `Prism.highlight(code, grammar, 'javascript')` (the pure string function) instead of DOM-based `highlightElement()`. This returns an HTML string that React can diff efficiently.
**Warning signs:** Code panel flickers when cells are toggled. Brief flash of unstyled code.

## Code Examples

### BPM-to-CPS Conversion
```javascript
// Source: Verified from @strudel/core/cyclist.mjs (default CPS = 0.5 = 120 BPM)
// and @strudel/core/repl.mjs setCpm function (line 301-303: cpm / 60)

/**
 * Convert BPM to Strudel CPS.
 * Assumes 4/4 time where 1 cycle = 1 bar = 4 beats.
 * Default: 120 BPM = 0.5 CPS
 */
function bpmToCps(bpm) {
  return bpm / 60 / 4;
}

// To change BPM in real time without re-evaluating the pattern:
evaluate(`setcps(${bpmToCps(newBpm)})`);
```

### Layer Composition
```javascript
// Source: Verified from @strudel/core/pattern.mjs stack() export (line 1449)

const layers = [
  {
    id: 'seq',
    name: 'Sequencer',
    code: 'stack(s("RolandTR808_bd").struct("x ~ ~ ~ x ~ ~ ~"), s("RolandTR808_hh").struct("x x x x x x x x"))',
    active: true,
  },
  {
    id: 'preset-1',
    name: 'Midnight Purr',
    code: 'stack(s("RolandTR808_bd").struct("x ~ x ~"), note("c2 ~ eb2 ~").s("sawtooth").cutoff(400)).slow(2)',
    active: true,
  },
];

const activeCodes = layers.filter(l => l.active).map(l => l.code);
const combined = activeCodes.length === 1
  ? activeCodes[0]
  : `stack(\n  ${activeCodes.join(',\n  ')}\n)`;

evaluate(combined);
```

### 8/16 Step Toggle (Grid Resize)
```javascript
// Pad with empty steps (recommended -- most intuitive for kids)
function resizeGrid(grid, newStepCount) {
  return grid.map(row => {
    if (row.length === newStepCount) return row;
    if (newStepCount > row.length) {
      // Expanding: add false cells to the end
      return [...row, ...Array(newStepCount - row.length).fill(false)];
    }
    // Shrinking: truncate from the end
    return row.slice(0, newStepCount);
  });
}
```

### Sequencer Grid with Dynamic Step Count
```javascript
// Modified from Phase 1 Sequencer.jsx
function Sequencer({ grid, stepCount, onToggleCell }) {
  return (
    <div className="sequencer" style={{ '--step-count': stepCount }}>
      {SOUNDS.map((sound, rowIndex) => (
        <div className="sequencer-grid" key={sound.name}>
          <span className="sequencer-label">{sound.name}</span>
          {grid[rowIndex].slice(0, stepCount).map((active, stepIndex) => (
            <button
              key={stepIndex}
              className={`sequencer-cell${active ? ' active' : ''}`}
              onClick={() => onToggleCell(rowIndex, stepIndex)}
              aria-label={`${sound.name} step ${stepIndex + 1}`}
              aria-pressed={active}
              type="button"
            />
          ))}
        </div>
      ))}
    </div>
  );
}
```
```css
.sequencer-grid {
  grid-template-columns: 60px repeat(var(--step-count, 8), 1fr);
}
```

### Volume Control via Pattern-Level Gain
```javascript
// Source: Verified from @strudel/core/controls.mjs line 467 (.gain() control)

// Wraps the composed layer code with a .gain() modifier
// Volume range: 0 to 1
function applyVolume(code, volume) {
  if (volume >= 1) return code;
  return `(${code}).gain(${volume.toFixed(2)})`;
}

// Usage in evaluate flow:
let fullCode = composeLayerCode(layers);
fullCode = applyVolume(fullCode, volume);
evaluate(fullCode);
```

### Preset Data Structure
```javascript
// Each preset is a self-contained pattern definition
export const PRESETS = [
  {
    id: 'midnight-purr',
    name: 'Midnight Purr',
    genre: 'Lo-fi Hip-hop',
    bpm: 85,
    code: `stack(
  s("RolandTR808_bd").struct("x ~ ~ ~ x ~ ~ ~"),
  s("RolandTR808_sd").struct("~ ~ x ~ ~ ~ x ~"),
  s("RolandTR808_hh").struct("x x x x x x x x").gain(0.4),
  note("c2 ~ eb2 ~").s("sawtooth").cutoff(400).gain(0.6)
)`,
    bonkiLine: "ooh, that's my jam",
    // SVG component or icon reference for album cover
    cover: 'bonki-lofi', // maps to a Bonki pose variant
  },
  // ... 14+ more
];
```

### BPM Slider Color Shift at Extremes
```css
/* CSS custom property approach for BPM slider styling */
.bpm-slider {
  --bpm-hue: 0; /* set via JS: green at center, blue at low, red at high */
  accent-color: hsl(var(--bpm-hue), 60%, 50%);
}
```
```javascript
// Map BPM to hue: 60 BPM = blue (220), 120 BPM = green (140), 180 BPM = red (0)
function bpmToHue(bpm) {
  // Linear interpolation: 60 -> 220, 120 -> 140, 180 -> 0
  const normalized = (bpm - 60) / 120; // 0 at 60, 1 at 180
  return Math.round(220 - normalized * 220);
}
```

## Discretion Recommendations

### 8/16 Step Toggle: Segmented Control
**Recommendation:** Segmented control (two buttons: "8" and "16" side by side, active one highlighted).
**Why:** More visually clear than a toggle switch. Kids can see both options at once. Matches TE aesthetic of labeled buttons. A toggle switch implies binary on/off, but 8/16 is a mode choice, not an on/off.

### 8->16 Expansion: Pad with Empty Steps
**Recommendation:** Pad with empty (false) steps. When going 16->8, truncate from end.
**Why:** Doubling the pattern would confuse kids -- "I didn't make that beat!" Padding preserves their work and adds blank space to fill. When shrinking back to 8, steps 9-16 are lost (warned via Bonki: "chopping the tail off!").

### Volume Scope: Master Volume (All Output)
**Recommendation:** Master volume applied to the entire `stack()` output via `.gain()`.
**Why:** Simpler mental model -- one volume slider, controls everything. Per-layer volume is a Phase 3/4 feature if ever needed. "Turn it down" should turn everything down.

### HUSH Behavior: Clear Everything (Stop + Reset Layers)
**Recommendation:** HUSH = stop playback AND clear all layers. A full panic reset.
**Why:** HUSH is the "oh no" button. If it only stops but remembers layers, pressing Play again would restart a chaotic 10-layer stack. Kids need HUSH to mean "make it all go away." This matches the current Phase 1 behavior where HUSH is a hard stop. If users want to stop without losing work, they use the Stop button. Stop = pause, HUSH = nuke.

### Sequencer Editing Scope: Sequencer Layer Only
**Recommendation:** Toggling sequencer cells affects only the sequencer layer. Presets are read-only layers that can be removed via layer chips but not edited cell-by-cell.
**Why:** Editing preset patterns cell-by-cell would require reverse-engineering the preset's pattern string into grid state -- complex, fragile, and confusing. The sequencer is the user's creation; presets are Bonki's contributions. Clear ownership.

### Controls Strip Visual Identity
**Recommendation:** Horizontal strip with subtle `--bg-secondary` background, thin top and bottom borders, slight vertical padding. Labels in uppercase 11px like sequencer labels. Controls spaced evenly with flex. No heavy dividers -- the background color difference from tab bar and content area provides enough separation.

## Available Sound Banks

Verified from the tidal-drum-machines.json sample pack loaded in `main.jsx`:

| Bank | Style | Good For |
|------|-------|----------|
| RolandTR808 | Classic hip-hop/trap drums | Hip-hop, trap, lo-fi presets |
| RolandTR909 | House/techno drums | Techno, dance, house presets |
| RolandTR707 | Clean electronic drums | Dance party, chiptune presets |
| RolandTR606 | Raw analog drums | Breakbeat, weird presets |
| LinnDrum | 80s digital drums | Jazz, chill presets |
| KorgMinipops | Vintage rhythm box | Ambient, space presets |
| KorgKPR77 | Funky analog drums | Afrobeat, funk presets |
| CasioSK1 | Lo-fi sampling keyboard | Cartoon bounce, video game presets |
| AkaiMPC60 | Classic sampler drums | Hip-hop, boom-bap presets |
| EmuSP12 | 12-bit gritty sampler | Lo-fi, ambient drone presets |
| KorgM1 | Classic synth/drums | Space vibes, ambient presets |
| RolandTR505 | Budget TR machine | Chiptune, video game presets |
| RolandTR727 | Latin percussion | Afrobeat, world presets |
| YamahaRM50 | 90s drum module | Jazz, ambient presets |
| SimmonsSDS5 | Iconic 80s electronic toms | Weird, space presets |

Plus built-in Strudel synths: `sawtooth`, `triangle`, `sine`, `square` -- for bass, synth, and melodic elements in presets.

Total available banks: 67 drum machines. Synths are unlimited (oscillator types + note patterns).

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `repl.setCps()` direct call | `setcps()` / `setCpm()` via evalScope | Strudel ~v1.0 | CPS must be set via evaluated code or accessed from the repl return value. Not a direct import. |
| Web Audio API ScriptProcessor for volume | GainNode on destination | Always (ScriptProcessor deprecated 2014) | GainNode is the correct modern approach for volume control |
| Manual scroll listeners for galleries | CSS `scroll-snap-type` | Safari 11+ (2017) | Native smooth scrolling with snap points, no JS needed |
| DOM-based Prism.highlightElement() | String-based Prism.highlight() | Always available | Better for React -- avoids DOM manipulation, works with virtual DOM diffing |

**Deprecated/outdated:**
- ScriptProcessorNode: Deprecated in favor of AudioWorkletNode. Not relevant -- we use GainNode.
- `window.webkitAudioContext`: Replaced by standard `AudioContext`. Strudel handles this internally via superdough.

## Open Questions

1. **Strudel `setcps()` accessibility from outside evaluate()**
   - What we know: The repl object returned by `initStrudel()` has `.scheduler.setCps()`. The `setcps()` function is injected into evalScope for use inside `evaluate()` code strings. The `initStrudel()` promise returns the repl object (web.mjs line 41: `return repl`).
   - What's unclear: Can we store the repl reference from the `initStrudel()` return value and call `repl.scheduler.setCps()` directly from React? This would avoid the evaluate() overhead for BPM changes.
   - Recommendation: Start with `evaluate(\`setcps(${cps})\`)` for simplicity. If slider scrubbing feels sluggish, capture the repl from `await initStrudel()` and call `repl.scheduler.setCps(cps)` / `repl.setCps(cps)` directly. The repl object exposes `setCps` as a direct method (repl.mjs line 553).

2. **Bonki album cover SVG complexity**
   - What we know: Phase 1's Bonki is 134 lines of SVG. 15+ genre variants with different poses/outfits could be 2000+ lines total.
   - What's unclear: Performance impact of 15+ inline SVGs in the preset gallery.
   - Recommendation: Use lazy rendering -- only render visible preset cards (viewport intersection or virtualization). Each Bonki variant should be a separate small SVG component. Consider sharing a base body SVG and swapping only outfit/accessory elements per genre to reduce code duplication.

3. **Pattern-level `.gain()` vs Web Audio API master volume**
   - What we know: `.gain()` is a Strudel control (controls.mjs line 467). It modifies per-event gain. Web Audio GainNode modifies the final output. Strudel's internal chain goes: orbits -> channelMerger -> destinationGain -> audioContext.destination (superdoughoutput.mjs lines 146-148).
   - What's unclear: Does `.gain()` applied to a `stack()` affect all sub-patterns uniformly? Could there be interaction with preset-internal `.gain()` values (multiplicative stacking)?
   - Recommendation: Start with pattern-level `.gain()` as it's simpler and requires no internal chain manipulation. If it causes issues (presets with their own `.gain()` getting double-attenuated), switch to Web Audio GainNode approach by capturing the AudioContext via `getAudioContext()` from `@strudel/web` and inserting a master gain node between Strudel's destination and the speakers. The `.gain()` approach means volume changes require a full pattern re-evaluate, but with throttling this is acceptable.

## Sources

### Primary (HIGH confidence)
- `@strudel/web/web.mjs` -- Direct source reading. evaluate(), hush(), initStrudel() API verified.
- `@strudel/core/repl.mjs` -- Direct source reading. setCps(), setcps/setCpm injection, evaluate() flow, hush() behavior (line 201-210), stack pattern composition (line 253), repl return API (line 553) verified.
- `@strudel/core/cyclist.mjs` -- Direct source reading. CPS default (0.5), setCps() method (line 129-135), real-time CPS change handling (lines 38-44) verified.
- `@strudel/core/pattern.mjs` -- Direct source reading. stack() function export (line 1449) verified.
- `@strudel/core/controls.mjs` -- Direct source reading. gain control (line 467), sound/bank control (line 111) verified.
- `superdough/superdoughoutput.mjs` -- Direct source reading. Audio destination chain (GainNode -> AudioContext.destination, lines 146-148) verified.
- `superdough/audioContext.mjs` -- Direct source reading. getAudioContext() export (line 22) verified.
- `@strudel/webaudio/index.mjs` -- Direct source reading. Re-exports superdough (line 11), confirming getAudioContext available from @strudel/web.
- Phase 1 source code (App.jsx, patterns.js, Sequencer.jsx, Pads.jsx, Transport.jsx, Bonki.jsx, bonki.css, index.css) -- Direct reading. Current architecture fully documented.
- tidal-drum-machines.json -- Direct fetch via WebFetch. 67 drum machine banks verified with full list.

### Secondary (MEDIUM confidence)
- [Strudel samples documentation](https://strudel.cc/learn/samples/) -- Sample loading and bank naming conventions.
- [Prism.js](https://prismjs.com/) -- 2KB core, JavaScript grammar support, `Prism.highlight()` string-based API.
- [Strudel cheatsheet](https://eggg.uk/strudel/cheatsheet/) -- Pattern syntax reference, method chaining conventions.

### Tertiary (LOW confidence)
- None. All findings verified against source code.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- All APIs verified by reading Strudel source code directly. No guesswork.
- Architecture: HIGH -- Patterns derived from verified Strudel API behavior and existing Phase 1 codebase.
- Pitfalls: HIGH -- Each pitfall verified against source (e.g., evaluate() calling hush() confirmed at repl.mjs line 406).
- Discretion recommendations: MEDIUM -- Based on UX judgment for kid-friendliness, not empirical testing.

**Research date:** 2026-02-15
**Valid until:** 2026-03-15 (Strudel API stable; Phase 2 execution expected within days)
