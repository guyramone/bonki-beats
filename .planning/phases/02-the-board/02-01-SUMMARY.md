---
phase: 02-the-board
plan: 01
subsystem: ui
tags: [react, strudel, layers, bpm, volume, sequencer, css-custom-properties]

# Dependency graph
requires:
  - phase: 01-the-pad
    provides: "Sequencer grid, pad system, Transport, Bonki character, Strudel evaluate/hush API"
provides:
  - "Layer manager utility (composeLayerCode, addLayer, removeLayer, toggleSolo, applyVolume)"
  - "ControlStrip component (BPM slider 60-180, volume slider 0-100%, 8/16 segmented control)"
  - "LayerChips component (color-coded chips with solo/remove interactions)"
  - "Multi-layer App architecture (layers state, evaluateAllLayers, stack() composition)"
  - "Bonki BPM-synced animation via CSS custom property"
  - "Dynamic 8/16 step sequencer via stepCount prop and CSS custom property"
affects: [02-02, 02-03, 03-the-brain]

# Tech tracking
tech-stack:
  added: []
  patterns: ["Layer composition via stack()", "BPM control via setcps()", "Volume via .gain() wrapper", "CSS custom properties for dynamic grid/animation", "Throttled volume re-evaluation"]

key-files:
  created:
    - "homie-beats/src/utils/layers.js"
    - "homie-beats/src/components/ControlStrip.jsx"
    - "homie-beats/src/components/LayerChips.jsx"
  modified:
    - "homie-beats/src/App.jsx"
    - "homie-beats/src/utils/patterns.js"
    - "homie-beats/src/components/Sequencer.jsx"
    - "homie-beats/src/components/Bonki.jsx"
    - "homie-beats/src/components/Transport.jsx"
    - "homie-beats/src/styles/index.css"
    - "homie-beats/src/styles/bonki.css"

key-decisions:
  - "HUSH clears all layers + stops (panic button, not just pause)"
  - "Transport HUSH handler lifted to App.jsx (onHush prop replaces internal hush() call)"
  - "Grid always 16 columns wide; stepCount slices view (no resize needed)"
  - "Volume throttled to 100ms; BPM not throttled (setcps is lightweight)"
  - "Pads add as layers (layering) instead of replacing current playback"

patterns-established:
  - "Layer state: {id, name, type, code, active} managed via pure utility functions"
  - "evaluateAllLayers(layers, volume) as central audio evaluation pipeline"
  - "CSS custom properties for dynamic values: --step-count, --bonki-vibe-speed, --bpm-hue"
  - "Functional state updates with setLayers(prev => ...) for atomic layer mutations"

# Metrics
duration: 6min 42s
completed: 2026-02-16
---

# Phase 2 Plan 01: Controls & Layers Summary

**Multi-layer architecture with BPM/volume/step controls, layer chips UI, and Bonki BPM-synced animation via stack() composition**

## Performance

- **Duration:** 6min 42s
- **Started:** 2026-02-16T07:19:28Z
- **Completed:** 2026-02-16T07:26:10Z
- **Tasks:** 2
- **Files modified:** 10

## Accomplishments
- Layer manager utility with 7 pure functions for composing multi-layer patterns into Strudel stack() calls
- ControlStrip with BPM slider (60-180, color shifts blue->green->red), volume slider (0-100%), and 8/16 segmented control
- LayerChips with color-coded type dots, solo (tap name) and remove (tap X) interactions, dimmed state for muted layers
- Full App refactor: layer state array, evaluateAllLayers pipeline, BPM via setcps(), throttled volume, dynamic step count
- Bonki head-bob animation speed syncs to BPM via CSS custom property (slow nod at 60, head-banging at 180)
- Sequencer renders dynamic 8 or 16 columns via CSS custom property

## Task Commits

Each task was committed atomically:

1. **Task 1: Layer manager, controls strip, App architecture** - `1342b26` (feat)
2. **Task 2: LayerChips, Bonki BPM sync, Sequencer stepCount** - `8e1e1bd` (feat)

## Files Created/Modified
- `homie-beats/src/utils/layers.js` - Layer management: composeLayerCode, applyVolume, addLayer, removeLayer, toggleSolo, bpmToCps, bpmToHue
- `homie-beats/src/components/ControlStrip.jsx` - BPM slider, volume slider, 8/16 segmented control strip
- `homie-beats/src/components/LayerChips.jsx` - Layer indicator chips with solo/remove interactions
- `homie-beats/src/utils/patterns.js` - Dynamic stepCount param, 16-wide DEFAULT_GRID, STEP_OPTIONS export
- `homie-beats/src/App.jsx` - Layer state architecture, evaluateAllLayers, BPM/volume/stepCount handlers, LayerChips wiring
- `homie-beats/src/components/Sequencer.jsx` - stepCount prop, grid slicing, --step-count CSS variable
- `homie-beats/src/components/Bonki.jsx` - bpm prop, --bonki-vibe-speed CSS variable
- `homie-beats/src/components/Transport.jsx` - onHush prop (HUSH handler lifted to App)
- `homie-beats/src/styles/index.css` - Controls strip, layer chips, BPM slider color, step toggle, responsive breakpoints
- `homie-beats/src/styles/bonki.css` - BPM-synced animation via var(--bonki-vibe-speed)

## Decisions Made
- **HUSH = full reset:** HUSH clears all layers and stops playback (panic button). Stop pauses without clearing. Per research recommendation: "Kids need HUSH to mean make it all go away."
- **Transport HUSH lifted to App:** Transport no longer imports hush() from @strudel/web. App owns all audio control through onHush prop. This enables HUSH to clear layer state.
- **Grid always 16 wide:** Grid data is always 16 columns; stepCount controls the viewed slice. No resize function needed. Simpler state management.
- **Pads add as layers:** Pads now layer on top of existing playback instead of replacing it. Full simultaneous sequencer + pad architecture.
- **Volume throttled, BPM not:** Volume requires full pattern re-evaluate (gain wrapper), throttled to 100ms. BPM uses lightweight setcps() which doesn't reparse patterns.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Transport HUSH handler needed lifting to App**
- **Found during:** Task 1
- **Issue:** Transport.jsx was calling hush() directly and then onStop(). With the new layer architecture, HUSH needs to also clear the layers state, which only App owns. The old approach would stop audio but leave stale layers in state.
- **Fix:** Added onHush prop to Transport, removed internal hush() call and @strudel/web import from Transport. App.jsx handleHush() calls hush(), setLayers([]), and setIsPlaying(false).
- **Files modified:** homie-beats/src/components/Transport.jsx, homie-beats/src/App.jsx
- **Verification:** Build passes, HUSH flow complete
- **Committed in:** 1342b26 (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 bug fix)
**Impact on plan:** Necessary for correctness. Transport's internal hush() would have left stale layer state. No scope creep.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Layer architecture is live and ready for 02-02 (presets) and 02-03 (code view)
- Presets will use addLayer() to stack on top of existing layers
- Code view will read from composeLayerCode() output
- All controls (BPM, volume, step count) are wired and functional

## Self-Check: PASSED

- All 10 files verified present on disk
- Commit 1342b26 (Task 1) verified in git log
- Commit 8e1e1bd (Task 2) verified in git log
- Build passes with no errors

---
*Phase: 02-the-board*
*Completed: 2026-02-16*
