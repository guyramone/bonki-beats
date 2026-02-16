---
phase: 02-the-board
plan: 03
subsystem: ui
tags: [react, prismjs, syntax-highlighting, code-view, split-pane, responsive, css-animation]

# Dependency graph
requires:
  - phase: 02-the-board
    plan: 01
    provides: "Layer manager (composeLayerCode), ControlStrip, LayerChips, multi-layer App architecture"
provides:
  - "CodeView component with Prism.js syntax highlighting (One Dark token colors)"
  - "Split-pane responsive layout (stacked mobile, side-by-side tablet+)"
  - "Live code display from composeLayerCode() — updates instantly on cell toggle"
  - "Per-line flash animation (golden glow 600ms) on cell toggle"
  - "Copy-to-clipboard with fallback"
  - "Read-only Bonki gatekeeping message on code click"
  - "Dark terminal aesthetic CSS (code-view.css)"
affects: [03-the-brain]

# Tech tracking
tech-stack:
  added: ["prismjs"]
  patterns: ["Prism.highlight() string-based API for React-compatible syntax coloring", "Split-pane responsive layout with flex-direction toggle", "Per-line rendering for targeted flash animation", "Code display derived from layer composition (no volume wrapping)"]

key-files:
  created:
    - "homie-beats/src/components/CodeView.jsx"
    - "homie-beats/src/styles/code-view.css"
  modified:
    - "homie-beats/src/App.jsx"
    - "homie-beats/src/styles/index.css"
    - "homie-beats/src/components/BonkiSpeech.jsx"
    - "homie-beats/package.json"

key-decisions:
  - "Used Prism.highlight() string API instead of DOM-based highlightElement() — avoids flicker with React virtual DOM"
  - "displayCode shows composeLayerCode() output WITHOUT .gain() wrapper — clean code for copy/paste to strudel.cc"
  - "Split pane stacks on mobile (200px fixed code panel height), goes side-by-side on tablet+ (340-400px width)"
  - "Used existing BonkiSpeech component from 02-02 with messageKey for repeated re-trigger instead of creating parallel bubble"
  - "Flash line maps row+1 (row 0 -> line 1 after stack() opening) for accurate code-to-grid correspondence"

patterns-established:
  - "CodeView as read-only display consuming derived code string from layer composition"
  - "Split-pane layout pattern: instrument main + code aside with responsive flex-direction toggle"
  - "showBonkiMessage() helper centralizes Bonki speech trigger with key-based re-trigger"

# Metrics
duration: 5min 35s
completed: 2026-02-16
---

# Phase 2 Plan 03: Code View Summary

**Live Prism.js syntax-highlighted code panel with One Dark token colors, split-pane responsive layout, per-line flash animation, copy-to-clipboard, and Bonki read-only gatekeeping message**

## Performance

- **Duration:** 5min 35s
- **Started:** 2026-02-16T18:33:38Z
- **Completed:** 2026-02-16T18:39:13Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments
- CodeView component renders composed Strudel code with Prism.js One Dark syntax highlighting (keywords purple, strings green, functions blue, operators cyan, numbers orange)
- Split-pane layout: stacked on mobile (200px code panel), side-by-side on tablet+ (340-400px code panel with border-left separator)
- Per-line flash animation: toggling a sequencer cell triggers a 600ms golden glow on the corresponding code line
- Copy button copies current Strudel code to clipboard with fallback for older browsers
- Clicking in the code triggers Bonki speech bubble: "not yet, human -- I'll teach you soon"
- Code view always visible (no toggle) showing full stack() code with nothing hidden
- Dark terminal aesthetic: #111111 background, monospace font, custom 4px scrollbar

## Task Commits

Each task was committed atomically:

1. **Task 1: Install Prism.js, create CodeView component with syntax highlighting and dark terminal CSS** - `6766054` (feat)
2. **Task 2: Wire CodeView into App with split-pane layout, live code generation, and read-only Bonki message** - `c1165bd` (feat)

## Files Created/Modified
- `homie-beats/src/components/CodeView.jsx` - Prism.js syntax-highlighted code panel with per-line flash, copy button, empty state
- `homie-beats/src/styles/code-view.css` - Dark terminal aesthetic, One Dark token colors, flash keyframe animation, custom scrollbar
- `homie-beats/src/App.jsx` - Split-pane layout, displayCode derivation, flashInfo state, handleCodeClick with showBonkiMessage
- `homie-beats/src/styles/index.css` - Split-pane CSS replacing tab-content, responsive breakpoints (mobile stacked, tablet+ side-by-side)
- `homie-beats/src/components/BonkiSpeech.jsx` - Added messageKey prop for repeated same-message re-trigger
- `homie-beats/package.json` - Added prismjs dependency

## Decisions Made
- **Prism string API over DOM API:** Used `Prism.highlight()` which returns an HTML string rather than `highlightElement()` which mutates DOM. The string approach avoids React reconciliation conflicts and flicker.
- **Clean code display (no volume):** `displayCode` uses `composeLayerCode()` output without the `.gain()` wrapper. Volume is a playback concern, not a code concern. Users get the real pattern code they'd paste into strudel.cc.
- **Reused BonkiSpeech from 02-02:** Rather than creating a new `.bonki-speech-bubble` element, integrated with the existing BonkiSpeech component. Added `messageKey` prop to handle repeated same-text messages (clicking code view multiple times).
- **Flash line mapping:** Row index + 1 maps to the code line inside `stack()`, since `sequencerToPattern` generates one line per sound row after the opening `stack(` line.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Integration] Used existing BonkiSpeech component instead of inline speech bubble**
- **Found during:** Task 2
- **Issue:** Plan specified adding `bonkiMessage` state with inline `<div>` for speech bubble. However, 02-02 (running in parallel) had already created the `BonkiSpeech` component with auto-dismiss and proper CSS.
- **Fix:** Used the existing BonkiSpeech component with `showBonkiMessage()` helper. Added `messageKey` prop/state so repeated code-clicks re-trigger the same message.
- **Files modified:** homie-beats/src/App.jsx, homie-beats/src/components/BonkiSpeech.jsx
- **Committed in:** c1165bd (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 integration fix)
**Impact on plan:** Better integration with parallel plan 02-02. No scope creep. BonkiSpeech reuse eliminates duplicate bubble implementations.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Code view is live and shows all composed layer code in real-time
- Phase 3 (The Brain) can use the code view to show AI-generated pattern code
- Bonki speech bubble is shared infrastructure for both preset reactions and code view gatekeeping
- Split-pane layout provides the reading space needed for understanding code patterns

## Self-Check: PASSED

- All 6 files verified present on disk
- Commit 6766054 (Task 1) verified in git log
- Commit c1165bd (Task 2) verified in git log
- Build passes with no errors

---
*Phase: 02-the-board*
*Completed: 2026-02-16*
