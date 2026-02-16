---
phase: 02-the-board
plan: 02
subsystem: ui
tags: [react, strudel, presets, svg, pixel-art, gallery, scroll-snap, speech-bubble, bonki]

# Dependency graph
requires:
  - phase: 02-the-board
    plan: 01
    provides: "Layer manager (addLayer, composeLayerCode), evaluateAllLayers pipeline, BPM via setcps()"
provides:
  - "16 eclectic preset definitions with Strudel pattern code, ideal BPM, Bonki one-liners, and cover variant"
  - "BonkiCovers component with 16 genre-specific SVG album art variants"
  - "PresetGallery horizontal scroll-snap gallery with PresetCard components"
  - "BonkiSpeech auto-dismissing speech bubble with messageKey re-trigger support"
  - "Preset select (preview) and preset add (layer) handlers in App"
  - "Preset-to-layer pipeline: preset code becomes layer via addLayer()"
affects: [02-03, 03-the-brain]

# Tech tracking
tech-stack:
  added: []
  patterns: ["CSS scroll-snap for horizontal gallery", "SVG component composition (shared base + variant accessories)", "messageKey pattern for re-triggering identical React state"]

key-files:
  created:
    - "homie-beats/src/utils/presets.js"
    - "homie-beats/src/components/BonkiCovers.jsx"
    - "homie-beats/src/components/PresetCard.jsx"
    - "homie-beats/src/components/PresetGallery.jsx"
    - "homie-beats/src/components/BonkiSpeech.jsx"
  modified:
    - "homie-beats/src/App.jsx"
    - "homie-beats/src/styles/index.css"

key-decisions:
  - "Preview (tap card) replaces current playback; Add (+) layers preset on top of existing mix"
  - "BonkiCovers use shared BaseBonki body with swapped Accessories per genre (not 16 separate full SVGs)"
  - "messageKey counter pattern in App for re-triggering BonkiSpeech on repeated identical messages"
  - "Touch device '+' button always visible via @media (hover: none)"

patterns-established:
  - "Preset data shape: {id, name, genre, bpm, code, bonkiLine, cover}"
  - "showBonkiMessage() helper increments messageKey to force useEffect re-trigger"
  - "BonkiCover variant system: theme colors + base body + accessories + background extras"
  - "PresetCard: tap=onSelect (preview), +=onAdd (layer)"

# Metrics
duration: 6min 26s
completed: 2026-02-16
---

# Phase 2 Plan 02: Presets & Gallery Summary

**16 eclectic preset patterns with Bonki album cover SVGs in a horizontal scroll-snap gallery, wired to layer system with BPM auto-set and Bonki speech bubble reactions**

## Performance

- **Duration:** 6min 26s
- **Started:** 2026-02-16T18:33:35Z
- **Completed:** 2026-02-16T18:40:01Z
- **Tasks:** 2
- **Files modified:** 7

## Accomplishments
- 16 preset patterns spanning lo-fi, hip-hop, techno, ambient, trap, jazz, chiptune, afrobeat, breakbeat, chill, drone, dance, cartoon bounce, space vibes, video game, and lullaby -- each with complete Strudel stack() code, ideal BPM, and Bonki one-liner
- BonkiCovers component rendering 16 genre-specific album art SVGs using shared base body with swapped accessories (headphones, cap, goggles, top hat, sleep cap, shades, etc.)
- Horizontal CSS scroll-snap gallery with K.K. Slider record-crate energy
- BonkiSpeech auto-dismissing speech bubble with messageKey re-trigger support
- Full preset-to-layer pipeline: tap to preview, "+" to add as layer, BPM auto-set, Bonki reacts

## Task Commits

Each task was committed atomically:

1. **Task 1: Create preset data, Bonki album covers, gallery UI, and speech bubble** - `b6e14dc` (feat)
2. **Task 2: Wire preset system into App -- layer integration, BPM auto-set, Bonki reactions** - `c1165bd` (feat, shared with 02-03 parallel execution)

## Files Created/Modified
- `homie-beats/src/utils/presets.js` - 16 preset definitions with pattern code, BPM, Bonki one-liners, cover variant keys
- `homie-beats/src/components/BonkiCovers.jsx` - Genre-themed album cover SVGs with shared BaseBonki body + variant Accessories
- `homie-beats/src/components/PresetCard.jsx` - Individual album card: cover art, name, genre, tap-to-preview, +-to-add
- `homie-beats/src/components/PresetGallery.jsx` - Horizontal scrollable gallery mapping over PRESETS array
- `homie-beats/src/components/BonkiSpeech.jsx` - Speech bubble overlay with 3s auto-dismiss and messageKey prop
- `homie-beats/src/App.jsx` - PresetGallery + BonkiSpeech imports, handlePresetSelect/handlePresetAdd handlers, showBonkiMessage helper, gallery in SEQUENCE tab
- `homie-beats/src/styles/index.css` - Preset gallery, card, add button, speech bubble, touch device CSS

## Decisions Made
- **Preview vs Add as distinct interactions:** Tapping a preset card previews it (replaces current playback for audition). The "+" button adds it as a layer on top of the existing mix. This gives users two clear modes: "try it" and "add it."
- **Shared base SVG with variant accessories:** Rather than 16 completely separate SVG Bonki drawings, all covers share a BaseBonki body component and swap only accessories/colors per genre. Reduces code duplication and keeps the K.K. Slider album cover charm.
- **messageKey counter for speech re-trigger:** Since React won't re-fire useEffect when the same string is set again, a monotonic counter (bonkiMessageKey) forces the BonkiSpeech to re-animate even on repeated identical messages (e.g., clicking code view multiple times).
- **Touch device always-visible "+" button:** Since hover doesn't exist on touch devices, the add button uses @media (hover: none) to stay permanently visible.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Task 2 changes merged into parallel 02-03 commit**
- **Found during:** Task 2
- **Issue:** Plan 02-03 was executing in parallel and committed App.jsx changes (split pane, code view) at the same time Task 2 was editing App.jsx. The 02-03 commit `c1165bd` captured both 02-03 code view changes and 02-02 preset wiring changes.
- **Fix:** No separate Task 2 commit needed -- all changes are captured in `c1165bd`. Verified all preset handlers, gallery rendering, and BonkiSpeech wiring are present in the committed code.
- **Files affected:** homie-beats/src/App.jsx, homie-beats/src/components/BonkiSpeech.jsx
- **Verification:** Build passes, all preset-related code present in App.jsx (handlePresetSelect, handlePresetAdd, PresetGallery in SEQUENCE tab, BonkiSpeech with messageKey)

---

**Total deviations:** 1 (parallel execution commit merge)
**Impact on plan:** No functional impact. All planned functionality delivered. Commit attribution is shared with 02-03 due to parallel execution.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Preset system is live and fully integrated with the layer architecture from 02-01
- Code view (02-03) will show preset patterns in the live code panel
- Phase 3 AI integration can reference preset patterns for Bonki suggestions
- All 16 presets produce complete Strudel patterns ready for audio playback

## Self-Check: PASSED

- All 7 files verified present on disk
- Commit b6e14dc (Task 1) verified in git log
- Commit c1165bd (Task 2 / shared with 02-03) verified in git log
- Build passes with no errors

---
*Phase: 02-the-board*
*Completed: 2026-02-16*
