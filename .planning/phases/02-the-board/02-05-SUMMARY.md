---
phase: 02-the-board
plan: 05
subsystem: ui
tags: [css, react, sequencer, code-view, bonki, layer-chips, beat-flash, gap-closure]

# Dependency graph
requires:
  - phase: 02-the-board/02-04
    provides: "BPM slider fix, HUSH grid reset, step toggle remount"
  - phase: 02-the-board/02-01
    provides: "Multi-layer architecture, evaluateAllLayers, DEFAULT_GRID, removeLayer"
provides:
  - "Scrollable code view with line wrapping (no truncation)"
  - "Per-type color dots on layer chips (sage/terracotta/gold)"
  - "Bonki speech bubble positioned near Bonki in transport bar"
  - "Sequencer Clear button to reset all cells"
  - "Per-row sequencer colors (terracotta/sage/gold/purple)"
  - "Beat position flash indicator during playback"
affects: [UAT, 03-the-brain]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "useEffect-based BPM-synced interval for visual beat tracking"
    - "Inline styles for CSS specificity bypass on dynamic component props"
    - "data-row attribute selectors for per-row color variants"

key-files:
  created: []
  modified:
    - "homie-beats/src/styles/index.css"
    - "homie-beats/src/styles/code-view.css"
    - "homie-beats/src/components/LayerChips.jsx"
    - "homie-beats/src/App.jsx"
    - "homie-beats/src/components/Sequencer.jsx"

key-decisions:
  - "Used inline styles on LayerChips dot to bypass CSS specificity issues (design tokens still referenced)"
  - "Beat tracking via JS setInterval approximation (not Strudel internal scheduler) — good enough for visual feedback"
  - "Per-row colors via data-row attribute selectors rather than individual CSS classes"

patterns-established:
  - "data-attribute selectors: Use data-row for row-based style variants in grid components"
  - "BPM interval: useEffect with isPlaying/bpm/stepCount deps for beat-synced UI updates"

# Metrics
duration: 165s
completed: 2026-02-16
---

# Phase 2 Plan 5: Gap Closure - Visual & UX Fixes Summary

**Scrollable code view with line wrapping, per-type layer chip colors, repositioned Bonki speech bubble, sequencer Clear button, per-row cell colors, and beat position flash indicator**

## Performance

- **Duration:** 165s (2m 45s)
- **Started:** 2026-02-16T19:21:02Z
- **Completed:** 2026-02-16T19:23:54Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments
- Code view panel is fully scrollable with long-line wrapping — Strudel code is never truncated
- Layer chip dots show distinct colors per type: sage (sequencer), terracotta (pad), gold (preset)
- Bonki speech bubble appears near Bonki in the transport bar, not at viewport bottom-right corner
- Sequencer has a Clear button that resets all toggled cells and removes the sequencer layer
- Active sequencer cells show per-row colors: terracotta kick, sage snare, gold hi-hat, purple clap
- Beat position indicator sweeps across the sequencer grid during playback with a white inner glow

## Task Commits

Each task was committed atomically:

1. **Task 1: Fix code view truncation, layer chip colors, and Bonki speech positioning** - `a1cb06a` (fix)
2. **Task 2: Add sequencer clear button, per-row colors, and beat flash animation** - `9f63d0d` (feat)

## Files Created/Modified
- `homie-beats/src/styles/index.css` - split-pane-code overflow fix, bonki-speech repositioning, per-row sequencer colors, beat flash, clear button styles, tablet media query for speech
- `homie-beats/src/styles/code-view.css` - code-line white-space pre-wrap and word-break for long lines
- `homie-beats/src/components/LayerChips.jsx` - Inline style on dot for bulletproof per-type colors
- `homie-beats/src/App.jsx` - handleClearGrid, beatStep state, useEffect beat interval, onClear/beatStep props to Sequencer
- `homie-beats/src/components/Sequencer.jsx` - Clear button header, data-row attribute, on-beat class, onClear/beatStep props

## Decisions Made
- Used inline styles on LayerChips dot instead of relying on CSS class specificity — bulletproof color rendering while still using design tokens
- Beat tracking uses a JS setInterval approximation synced to BPM, not Strudel's internal audio scheduler — perfect visual sync would require hooking into Strudel internals which is out of scope, and the approximation is good enough for visual feedback
- Per-row colors use data-row attribute selectors — cleaner than adding individual class names per sound row

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All 5 UAT gap closure issues resolved (code view, layer chips, bonki speech, clear button, per-row colors + beat flash)
- Phase 2 (The Board) is now complete — all plans executed, all UAT gaps closed
- Build passes clean, no new warnings
- Ready for Phase 3 (The Brain) — AI integration with Claude API

## Self-Check: PASSED

- [x] homie-beats/src/styles/index.css exists
- [x] homie-beats/src/styles/code-view.css exists
- [x] homie-beats/src/components/LayerChips.jsx exists
- [x] homie-beats/src/App.jsx exists
- [x] homie-beats/src/components/Sequencer.jsx exists
- [x] 02-05-SUMMARY.md exists
- [x] Commit a1cb06a found
- [x] Commit 9f63d0d found

---
*Phase: 02-the-board*
*Completed: 2026-02-16*
