---
phase: 03-the-knobs
plan: 01
subsystem: ui, audio
tags: [strudel, react, sequencer, row-model, code-generation, effects]

# Dependency graph
requires:
  - phase: 02-the-grid
    provides: "8-row sequencer, transport, code view, beat tracking, layer system"
provides:
  - "Row model factory (createRow) and DEFAULT_ROWS (16 instruments in 5 sections)"
  - "Code generator (rowsToStrudelCode, generateDisplayCode) — pure functions from row model to Strudel code"
  - "Effect defaults and ranges (EFFECT_DEFAULTS, EFFECT_RANGES, DISTORTION_TYPES, FILTER_TYPES, DELAY_DIVISIONS)"
  - "16-row sequencer with 5 collapsible sections (Drums, Percussion, Bass, Synths, Melodic)"
  - "Row model as single source of truth for sequencer state (replacing grid + SOUNDS)"
  - "rAF-throttled evaluate pipeline (scheduleEvaluate)"
  - "globalScale and masterEffects state stubs (wired for later plans)"
affects: [03-02, 03-03, 03-04, 03-05, 03-06, 03-07, 03-08]

# Tech tracking
tech-stack:
  added: []
  patterns: ["Declarative row model -> code generation", "rAF-throttled evaluate pipeline", "Section-based collapsible UI grouping"]

key-files:
  created:
    - "homie-beats/src/utils/rowModel.js"
    - "homie-beats/src/utils/codeGenerator.js"
    - "homie-beats/src/utils/effectDefaults.js"
  modified:
    - "homie-beats/src/App.jsx"
    - "homie-beats/src/components/Sequencer.jsx"
    - "homie-beats/src/components/CodeView.jsx"
    - "homie-beats/src/utils/patterns.js"
    - "homie-beats/src/styles/index.css"

key-decisions:
  - "Row model is the single source of truth: all sequencer state lives in rows array, not grid+SOUNDS"
  - "Overlay layers (pads/presets) kept as separate array from sequencer rows for clean separation"
  - "rAF-throttled evaluate using refs to avoid stale closures"
  - "Cells reduced from 48px to 36px min-height to accommodate 16 rows on screen"
  - "Sequencer container scrollable (max-height: 65vh) for when all sections expanded"

patterns-established:
  - "Row model shape: id, sound, pattern, effects, transforms, volume, muted, note, octave, sectionId"
  - "Code generation: rowToCodeLine() per row, rowsToStrudelCode() composes stack() with master effects"
  - "Display code: generateDisplayCode() — same as audio code but without .gain()/.orbit() for clean copy/paste"
  - "Section toggle: setSections with collapsed boolean toggle"

# Metrics
duration: 404s (6m 44s)
completed: 2026-02-17
---

# Phase 3 Plan 01: Row Model and Code Generator Foundation Summary

**Declarative 16-row model with pure code generator converting UI state to Strudel stack() code, plus collapsible instrument sections (Drums/Percussion/Bass/Synths/Melodic)**

## Performance

- **Duration:** 404s (6m 44s)
- **Started:** 2026-02-17T04:50:41Z
- **Completed:** 2026-02-17T04:57:25Z
- **Tasks:** 2
- **Files modified:** 8

## Accomplishments
- Row model factory (`createRow`) with 16 default instruments across 5 collapsible sections
- Pure code generator producing valid Strudel `stack()` code from row model — handles samples, synths, soundfonts, effects, transforms, scales, per-row orbits
- Effect defaults and ranges for all Strudel parameters (cutoff, delay, reverb, distortion, lo-fi, pan, etc.)
- App.jsx migrated from grid+SOUNDS to row model as primary state, with overlay layers for pads/presets
- Sequencer expanded to 16 rows with collapsible sections (Drums expanded by default, others collapsed)
- rAF-throttled evaluate pipeline replacing direct evaluate() calls

## Task Commits

Each task was committed atomically:

1. **Task 1: Create row model, effect defaults, and code generator** - `2e39ec5` (feat)
2. **Task 2: Expand Sequencer to 16 rows with collapsible sections, wire new row model into App** - `7e58cad` (feat)

## Files Created/Modified
- `homie-beats/src/utils/rowModel.js` - Row model factory, DEFAULT_ROWS (16), SECTIONS (5), ROW_COLORS (16), ROW_LABELS, getRowsBySection()
- `homie-beats/src/utils/codeGenerator.js` - rowToCodeLine(), rowsToStrudelCode(), generateDisplayCode() — pure row-to-Strudel conversion
- `homie-beats/src/utils/effectDefaults.js` - EFFECT_DEFAULTS, EFFECT_RANGES, DISTORTION_TYPES, FILTER_TYPES, DELAY_DIVISIONS
- `homie-beats/src/App.jsx` - Migrated to row model state, overlay layers, scheduleEvaluate(), globalScale + masterEffects stubs
- `homie-beats/src/components/Sequencer.jsx` - Rewritten for row model with collapsible sections, section headers with chevrons
- `homie-beats/src/components/CodeView.jsx` - Updated imports to ROW_COLORS from rowModel.js, extended findSoundIndex for 16 rows
- `homie-beats/src/utils/patterns.js` - SOUNDS/PADS retained, ROW_COLORS re-exported from rowModel, DEFAULT_GRID deprecated
- `homie-beats/src/styles/index.css` - Section header styles, 16 row colors + on-beat glows, scrollable sequencer, smaller cells

## Decisions Made
- **Row model as single source of truth:** All sequencer state lives in `rows` array (replacing `grid` + `SOUNDS`). Each row is a complete data object with sound, pattern, effects, transforms, volume. This is the foundation every subsequent plan builds on.
- **Overlay layers separate from sequencer:** Pads and presets are separate `overlayLayers` array, composed with sequencer code at evaluate time. Clean separation of concerns.
- **rAF-throttled evaluate pipeline:** `scheduleEvaluate()` uses `requestAnimationFrame` with a ref to latest rows, avoiding stale closures and batching rapid changes.
- **36px cell min-height:** Reduced from 48px to fit 16 rows on screen without excessive scrolling. Still touch-friendly on iPad.
- **Scrollable sequencer:** `max-height: 65vh` with `overflow-y: auto` for when all 5 sections are expanded simultaneously.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Row model foundation complete - all subsequent Phase 3 plans (effects rack, sound browser, scale picker, euclidean, master strip) read/write to this model
- Code generator is the single bridge between UI state and Strudel audio engine
- globalScale and masterEffects state stubs are wired and ready for later plans to populate
- All Phase 2 functionality preserved (play/stop/hush/BPM/volume/step count/presets/pads)

## Self-Check: PASSED

All 9 files verified present. Both task commits (2e39ec5, 7e58cad) verified in git log. Build compiles cleanly (`npx vite build` succeeds). Dev server starts and serves page without errors.

---
*Phase: 03-the-knobs*
*Completed: 2026-02-17*
