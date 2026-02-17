# Phase 3: The Knobs - Context

**Gathered:** 2026-02-16
**Status:** Ready for planning

<domain>
## Phase Boundary

Transform HOMIE Beats from a drum machine into a full instrument studio. Expose Strudel's synth engines, 30+ effects, 80+ scales, euclidean rhythms, and 800+ sample banks through hands-on knobs, selectors, and controls. Kids turn knobs, hear changes instantly. Progressive disclosure: simple on the surface, deep underneath.

This phase does NOT include: AI features (Phase 4), deployment (Phase 5), recording/sharing, custom sample uploads, chord rows, or per-step velocity.

</domain>

<decisions>
## Implementation Decisions

### Control Surface Layout
- **Claude's discretion** on where per-row controls appear (drawer, inline expand, or new tab) — optimize for screen real estate and touch-friendliness
- **Key controls always visible** per row: sound selector, volume, and one prominent effect control. Expand for full rack.
- **Full rack on expand**: when a row is expanded, ALL controls are exposed (sound, full filter section, all effects, euclidean, pattern transforms). No sub-tabs — everything at once.
- **16 sequencer rows** (double current 8). Rows organized in **collapsible sections by instrument type** (Drums, Bass, Synths, Melodic, etc.)
- **Per-row effects AND global master effects** (both, layered). Each row has its own effects chain. Master effects strip applies to the whole mix.
- **Master effects strip** lives as a bottom strip above the transport bar. Always visible. Includes DJ filter knob as a featured control.
- **Context-sensitive space allocation**: when editing a row's effects, the effects rack gets more space. When sequencing, the grid dominates. Space follows user focus.
- **Pads tab expands to 4x8 (32 pads)**. Each pad maps to one of the 16 sequencer rows, with two banks.
- **Code view auto-updates with everything** — shows ALL Strudel code including effects, scales, euclidean params. Real-time mirror of every knob turn.
- **Code view is copy-only (export)** in Phase 3. Not editable. Editing comes in Phase 4 with AI assistance.

### Sound & Bank Browsing
- **Visual category grid** when tapping sound selector — big colorful tiles for categories (Drums, Keys, Strings, Synths, Weird, etc.)
- **Three-level drill-down**: Category → Bank → Sound (e.g., Drums → TR-808 → Kick)
- **Synths treated as another bank** alongside TR-808, TR-909, etc. Consistent mental model — everything is a sound source.
- **Tap to preview, double-tap to select** — single tap plays the sound, double-tap commits it to the row
- **All 128 General MIDI soundfonts exposed** — full catalog, no curation
- **All 100+ Tidal Dirt sample banks available, lazy-loaded on browse** — banks appear in browser but samples download on first selection
- **Favorites + Recents system** — heart a sound to save, recents auto-tracked. Both at top of browser. Persistent across sessions (localStorage).
- **Colorful pixel-art style icons** per sound category (drum icon, piano icon, wavy synth icon, etc.)
- **Full session persistence** — selected sounds, bank positions, favorites all saved to localStorage
- **Dice button (random sound)** — picks a random sound from any category. Serendipity for kids.
- **Bonki reactions + suggestions** — Bonki comments on sound choices ("ooh, nasty!" for distorted, "classic!" for 808s) AND occasionally suggests combos ("that kick pairs nice with a supersaw bass...")

### Knob Interaction Model
- **Mix of knobs and sliders**: rotary knobs for effect parameters (cutoff, resonance, delay time), sliders for levels (volume, gain, mix)
- **Vertical drag for knobs**: drag up to increase, down to decrease. Like Ableton. Simple and reliable on touch.
- **Full animation on knobs**: knob rotates visually, trail/arc shows value range, glows when active, live number updates. Premium hardware feel.
- **Signal chain layout with glowing toggles**: effects displayed as a visual signal flow (left to right). Each effect node has a glowing toggle switch to activate/bypass.
- **Effect chain presets** for common signal chain orders: 'Clean', 'Gritty', 'Spacey', etc. Users pick a preset rather than manually reordering.
- **All 10 distortion algorithms exposed** in a selector, each with amount knob. From soft clip to chebyshev waveshaping.
- **Full filter section per row**: cutoff, resonance, filter type (LP/HP/BP), PLUS envelope controls (ADSR) and LFO rate/depth
- **DJ filter featured in master strip**: single knob, sweeps from LP to HP (0=bass, 0.5=full, 1=treble). The crowd-pleaser.
- **Delay: full controls** — time, feedback, mix knobs + sync toggle (free vs tempo-synced) + time division selector (1/4, 1/8, 1/16, dotted)
- **Reverb: both algorithmic (.room) and convolution (.ir)** — default to algorithmic, toggle to convolution with named impulse responses ('Cathedral', 'Plate', 'Spring')
- **Lo-fi effects: both approaches** — quick 'Lo-Fi' toggle for instant retro vibes, PLUS individual bitcrusher/coarse controls in the full effects chain
- **Gentle randomize button** per row: randomizes effect parameters within musical ranges. Won't crank to extremes. Controlled chaos.
- **Labels + live values on every knob**: parameter name below (e.g., 'CUTOFF'), current value above/inside (e.g., '2.4kHz'). Educational.
- **Global defaults with per-row overrides** for pattern transforms (swing, probability, reverse, speed). Global strip sets baseline, individual rows can override.
- **Double-tap to reset any knob** to its default value. No undo/redo system.
- **Euclidean rhythm: number stepper buttons** (+/- for pulses and steps) with visual preview of the resulting pattern

### Melodic Sequencing
- **Row = one note, multiple rows = melody**: each melodic row plays one fixed pitch. Stack rows tuned to different scale degrees to build melodies. Consistent with drum sequencer paradigm.
- **Scale picker: visual keyboard + scale type selector**: mini piano keyboard shows which notes are in scale (highlighted keys). Root note selector and scale type dropdown above. Both informative and visual.
- **Note labels show both note name AND scale degree**: e.g., "C=1", "D=2", "E=3". Maximum educational value.
- **Auto-transpose on key change**: changing the root key transposes all melodic rows to match. Melody keeps its shape in the new key.
- **All 80+ scales available**: major, minor, pentatonic, blues, dorian, phrygian, hungarian minor, arabic, persian, egyptian — the full Strudel catalog
- **Octave knob per melodic row**: each row has its own octave selector (C2-C6). Bass, mid, high at your fingertips.
- **Playable keyboard preview**: tap keys on the visual keyboard to hear notes in the selected instrument sound. Helps kids choose before assigning to rows.

### Claude's Discretion
- Exact control panel placement (drawer vs. inline vs. tab) — optimize for real estate and touch
- Row section default names and grouping assignments
- Knob sizing and spacing for iPad touch targets (must be 48px+)
- Effect chain preset definitions and naming
- Sound category organization and icon design details
- Exactly how context-sensitive space allocation transitions (animation, threshold)
- Master effects strip layout and control arrangement
- Bonki reaction messages and suggestion logic (pre-AI, hardcoded)

</decisions>

<specifics>
## Specific Ideas

- Row groups start organized by **instrument type** (Drums, Bass, Synths, Melodic) — with a vision to eventually add role-based grouping (Rhythm, Tone, Texture) and user-renameable groups as progressive enhancements
- Effects signal chain should **look** like a real signal flow — visual nodes connected by lines, each node glowable
- Sound browser should feel like **browsing an app store** — big tiles, colorful, fun to explore
- DJ filter is the **crowd-pleaser** — big, prominent, fun to sweep
- Lo-fi/bitcrusher will make things **sound like a Game Boy** — kids will love this
- Scale keyboard should be **educational** — kids learn real music theory by seeing note names, scale degrees, and which keys light up

</specifics>

<deferred>
## Deferred Ideas

- **Recording & sharing recordings** — entirely new capability, deserves its own phase (possibly Phase 6)
- **Custom audio file upload** (drag & drop .wav) — defer to Phase 5 or later
- **Chord rows** (playing Cm7, Fm7, etc.) — defer to Phase 4 with AI assistance
- **Per-step velocity** (dynamic emphasis per cell) — defer to Phase 5 polish
- **User-renameable row groups** — progressive enhancement beyond Phase 3 defaults
- **Role-based sound grouping** (Rhythm/Tone/Texture views) — progressive enhancement

</deferred>

---

*Phase: 03-the-knobs*
*Context gathered: 2026-02-16*
