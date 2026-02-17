---
phase: 03-the-knobs
plan: 05
subsystem: ui, audio
tags: [strudel, react, scale-picker, euclidean, piano-keyboard, bjorklund, music-theory]

# Dependency graph
requires:
  - phase: 03-the-knobs plan 01
    provides: "Row model with pattern.euclid field, code generator with .euclid()/.euclidRot() support, globalScale state"
  - phase: 03-the-knobs plan 02
    provides: "Knob, Slider, ToggleSwitch control components"
provides:
  - "ScalePicker component with visual piano keyboard, root/scale selectors, auto-transpose, octave controls"
  - "scaleData.js utility with 30+ curated scales, interval maps, note math, transpose function"
  - "EuclideanControl component with Bjorklund algorithm, SVG ring preview, named rhythm hints"
  - "Manual/Euclidean pattern mode toggle per row"
  - "Scale toggle button in ControlStrip"
affects: [03-06, 03-07, 03-08]

# Tech tracking
tech-stack:
  added: []
  patterns: ["Bjorklund algorithm for euclidean pattern generation", "Visual piano keyboard with CSS positioning for black keys", "Auto-transpose via interval preservation on root change"]

key-files:
  created:
    - "homie-beats/src/utils/scaleData.js"
    - "homie-beats/src/components/ScalePicker.jsx"
    - "homie-beats/src/styles/scale-picker.css"
    - "homie-beats/src/components/EuclideanControl.jsx"
  modified:
    - "homie-beats/src/App.jsx"
    - "homie-beats/src/main.jsx"
    - "homie-beats/src/components/ControlStrip.jsx"
    - "homie-beats/src/components/EffectsRack.jsx"
    - "homie-beats/src/components/Sequencer.jsx"
    - "homie-beats/src/styles/effects-rack.css"

key-decisions:
  - "Scale starts inactive (globalScale=null) until user interacts with scale picker -- no forced musical key on drum patterns"
  - "Bjorklund algorithm implemented locally rather than importing from Strudel core (keeps bundle dependency light, algorithm is small)"
  - "Named rhythm lookup via simple string key '3,8' -> 'Tresillo' (10 common world rhythms)"
  - "Root note auto-transpose preserves interval relationship from old root to new root for all melodic rows"

patterns-established:
  - "Scale data: SCALE_GROUPS -> SCALE_NAMES (curated 30) + ALL_SCALE_NAMES (92) for dropdown"
  - "Visual keyboard: white keys flex, black keys absolute-positioned at computed % offsets"
  - "Euclidean: bjorklund() + rotatePattern() + SVG ring with dot/line visualization"
  - "Manual/Euclidean toggle: row.pattern.euclid is null (manual) or { pulses, steps, rotation } (euclidean)"

# Metrics
duration: 481s (8m 1s)
completed: 2026-02-17
---

# Phase 3 Plan 05: Scale Picker and Euclidean Rhythm Summary

**Visual piano keyboard with 92 scales, auto-transpose on key change, and Bjorklund euclidean rhythm generator with SVG ring preview and named world rhythm hints**

## Performance

- **Duration:** 481s (8m 1s)
- **Started:** 2026-02-17T05:00:46Z
- **Completed:** 2026-02-17T05:08:47Z
- **Tasks:** 2
- **Files modified:** 10

## Accomplishments
- Scale picker with visual single-octave piano keyboard showing in-scale notes highlighted, degree labels ("C=1", "D=2"), and tappable key preview
- Root note selector (12 buttons), grouped scale dropdown (30 curated in 6 categories), "Show All" toggle for 92 scales from @tonaljs/tonal
- Auto-transpose: changing root key shifts all melodic row notes to maintain relative intervals in the new key
- Per-melodic-row octave stepper (C2-C6) with octave knob in ScalePicker section
- EuclideanControl with Bjorklund algorithm, SVG ring visualization (active dots large + colored, inactive small + dim, connecting lines between hits)
- Named rhythm hints for 10 known world patterns (Tresillo, Cinquillo, West African Bell, Turkish Aksak, Bossa Nova, etc.)
- Manual/Euclidean toggle in EffectsRack rhythm section header
- Scale toggle button in ControlStrip, collapsible ScalePicker above sequencer in SEQUENCE tab

## Task Commits

Each task was committed atomically:

1. **Task 1: Build scale data utilities and ScalePicker component** - `b3f70c3` (feat)
2. **Task 2: Build EuclideanControl with visual preview and wire to row model** - `be32751` (feat)

## Files Created/Modified
- `homie-beats/src/utils/scaleData.js` - NOTE_NAMES, SCALE_GROUPS, SCALE_INTERVALS (30+ scales), getScaleNotes(), transposeNote(), noteNameToIndex()
- `homie-beats/src/components/ScalePicker.jsx` - Visual keyboard + root selector + scale dropdown + octave controls per melodic row
- `homie-beats/src/styles/scale-picker.css` - Piano keyboard CSS (white/black keys), root buttons, scale dropdown, octave stepper styles
- `homie-beats/src/components/EuclideanControl.jsx` - Bjorklund algorithm, SVG ring preview, +/- steppers for pulses/steps/rotation, NAMED_RHYTHMS
- `homie-beats/src/App.jsx` - rootNote/scaleName/scaleActive state, handleRootChange (with auto-transpose), handleScaleChange, handleNotePreview, handleOctaveChange, handleEuclideanChange, handleSwitchToEuclid/Manual
- `homie-beats/src/main.jsx` - Added scale-picker.css import
- `homie-beats/src/components/ControlStrip.jsx` - Scale toggle button with active state
- `homie-beats/src/components/EffectsRack.jsx` - EuclideanControl import, rhythm section with Manual/Euclidean toggle at top of rack
- `homie-beats/src/components/Sequencer.jsx` - Passes euclidean handler props through to EffectsRack
- `homie-beats/src/styles/effects-rack.css` - Euclidean section styles (ring, steppers, rhythm name, switch button)

## Decisions Made
- **Scale starts inactive:** globalScale is null until user first interacts with the scale picker. This means drum-only patterns are not affected by any scale. Once the user picks a root or scale, it activates and persists. This avoids confusing behavior where drums "have a key" before melodic rows are used.
- **Local Bjorklund algorithm:** Implemented the euclidean rhythm algorithm directly in EuclideanControl.jsx rather than importing from @strudel/core. The algorithm is small (~30 lines), self-contained, and avoids adding a dependency on Strudel's internal module structure for a simple math function.
- **Named rhythms as simple lookup:** 10 well-known rhythms mapped by "pulses,steps" string key. This keeps it light and educational without requiring a music theory database.
- **Auto-transpose preserves intervals:** When root changes from C to D, a note at E (interval 4 semitones from C) becomes F# (interval 4 semitones from D). This maintains the melodic relationship across key changes.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

Parallel plan execution (03-03 Sound Browser and 03-04 Effects Rack) modified App.jsx and Sequencer.jsx concurrently. The euclidean handlers added by this plan were picked up and committed by plan 03-04's final commit to App.jsx. This was non-blocking -- the Task 2 commit captured the remaining EuclideanControl component, EffectsRack integration, and CSS additions that were unique to this plan.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Scale system fully operational -- ScalePicker, scaleData.js, and globalScale wiring complete
- Euclidean rhythms ready to use -- toggle in EffectsRack, visual preview, Strudel .euclid() code generation (from 03-01)
- Master effects strip (03-06) can build on this foundation
- All Phase 2 and Phase 3 (01-04) functionality preserved

## Self-Check: PASSED

All 10 files verified present. Both task commits (b3f70c3, be32751) verified in git log. Build compiles cleanly (`npx vite build` succeeds).

---
*Phase: 03-the-knobs*
*Completed: 2026-02-17*
