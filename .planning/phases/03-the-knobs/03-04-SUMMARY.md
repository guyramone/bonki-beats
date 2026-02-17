---
phase: 03-the-knobs
plan: 04
subsystem: ui, audio
tags: [react, effects-rack, signal-chain, knob, slider, toggle, touch, strudel, throttle]

# Dependency graph
requires:
  - phase: 03-the-knobs/01
    provides: "Row model, code generator, effect defaults, rAF-throttled evaluate"
  - phase: 03-the-knobs/02
    provides: "Knob, Slider, ToggleSwitch control components"
provides:
  - "RowControls.jsx — per-row inline strip (mute, sound name, volume slider, cutoff knob + bypass, expand chevron)"
  - "EffectsRack.jsx — full signal chain panel (Filter > Delay > Reverb > Distort > Lo-Fi > Pan) with all knobs, toggles, selectors"
  - "effects-rack.css — signal chain layout, glowing active nodes, mobile vertical stack, slide-down animation"
  - "App.jsx handlers: handleEffectChange (dotted path), handleTransformChange, handleRowVolumeChange, handleMuteToggle"
  - "Sequencer.jsx: expandedRows state, RowControls + EffectsRack integration per row"
affects: [03-the-knobs/05, 03-the-knobs/06, 03-the-knobs/07, 03-the-knobs/08]

# Tech tracking
tech-stack:
  added: []
  patterns: [dotted-path-effect-updates, signal-chain-node-layout, collapsible-subsections]

key-files:
  created:
    - homie-beats/src/components/RowControls.jsx
    - homie-beats/src/components/EffectsRack.jsx
    - homie-beats/src/styles/effects-rack.css
  modified:
    - homie-beats/src/App.jsx
    - homie-beats/src/components/Sequencer.jsx
    - homie-beats/src/main.jsx

key-decisions:
  - "Dotted path notation for effect changes (cutoff.value, cutoff.active) enables uniform callback signature across all effect parameters"
  - "Filter envelope and LFO sections are collapsible sub-areas within the filter node (not always visible) to reduce visual clutter"
  - "Delay auto-sets mix to 0.3 when toggle activated (prevents silent delay). Reverb auto-sets mix to 0.4. Distortion auto-sets amount to 1."
  - "RowControls placed below grid row (not inline with label) to preserve grid alignment and provide enough horizontal space for controls"
  - "Effect chain presets (Clean, Gritty, Spacey, Lo-Fi) directly call change() for each relevant parameter rather than replacing entire effects object"

patterns-established:
  - "Signal chain node layout: horizontal flex on tablet+, vertical stack on mobile, with glowing connectors between active nodes"
  - "Row wrapper pattern: .sequencer-row-wrapper contains grid + RowControls + optional EffectsRack"
  - "Effect handler delegation: App owns all effect state, passes handleEffectChange down through Sequencer to RowControls and EffectsRack"
  - "Randomize within musical ranges: cutoff 200-8000, resonance 0-15, delay 0.1-0.5, room 0.1-0.5, distort 0.5-3"

# Metrics
duration: 5m 16s
completed: 2026-02-17
---

# Phase 3 Plan 04: Per-Row Effects Rack Summary

**Full signal chain effects rack per sequencer row with 5 effect nodes (Filter/Delay/Reverb/Distort/Lo-Fi), inline controls strip (mute/volume/cutoff), 4 chain presets, and rAF-throttled evaluate pipeline**

## Performance

- **Duration:** 5m 16s (316s)
- **Started:** 2026-02-17T05:00:24Z
- **Completed:** 2026-02-17T05:05:40Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments
- RowControls inline strip per row: mute button, sound name selector, compact volume slider, featured cutoff knob with bypass toggle, expand/collapse chevron
- EffectsRack expanded panel with full signal chain: Filter (LP/HP/BP + cutoff/resonance + collapsible envelope ADSR + collapsible LFO), Delay (mix/time/feedback + SYNC/FREE toggle + division selector), Reverb (mix/size + ALGO/CONV toggle + IR selector), Distortion (amount + 9-algorithm dropdown), Lo-Fi (quick toggle + BITS/RATE knobs), Pan slider
- 4 effect chain presets (Clean, Gritty, Spacey, Lo-Fi) and randomize button for musical-range parameter exploration
- Complete App.jsx handler wiring: handleEffectChange with dotted path support, handleTransformChange, handleRowVolumeChange, handleMuteToggle -- all updating rowsRef and triggering throttled evaluate
- Signal chain visual: glowing active nodes, connector lines between nodes, slide-down animation on expand

## Task Commits

Each task was committed atomically:

1. **Task 1: Build RowControls inline strip and EffectsRack expanded panel** - `10b5620` (feat)
2. **Task 2: Wire EffectsRack into Sequencer and App with throttled evaluation** - `6e06f68` (feat)

## Files Created/Modified
- `homie-beats/src/components/RowControls.jsx` - Per-row inline control strip (mute, sound name, volume, cutoff knob, expand chevron)
- `homie-beats/src/components/EffectsRack.jsx` - Full signal chain effects panel with 5 effect nodes, presets, and randomize
- `homie-beats/src/styles/effects-rack.css` - Signal chain layout, node styling, connectors, presets, mobile responsive, row wrapper
- `homie-beats/src/App.jsx` - Added handleEffectChange (dotted path), handleTransformChange, handleRowVolumeChange, handleMuteToggle; wired to Sequencer
- `homie-beats/src/components/Sequencer.jsx` - Added expandedRows state, integrated RowControls + EffectsRack per row, row-wrapper styling
- `homie-beats/src/main.jsx` - Added effects-rack.css import

## Decisions Made
- **Dotted path notation:** `handleEffectChange(rowIndex, 'cutoff.value', v)` splits on '.' to update nested objects (cutoff/resonance/delay/room/distort all use {value, active} pattern). Simpler than separate handlers per effect.
- **Collapsible envelope/LFO:** Filter node shows cutoff + resonance by default. Envelope (ADSR + depth) and LFO (rate + depth) are collapsible sub-sections to avoid overwhelming kids with controls they don't need.
- **Auto-enable on toggle:** When delay/reverb/distortion toggle is activated and mix/amount is 0, auto-set to a sensible default (0.3/0.4/1) so the effect is immediately audible. Prevents "I turned it on but nothing happened" confusion.
- **RowControls below grid:** Placed controls strip below the step grid row rather than inline with label. This preserves the grid alignment (label + cells) and gives the controls strip full row width for volume slider and cutoff knob.
- **Preset implementation:** Each preset calls individual change() calls rather than replacing the entire effects object. This preserves any parameters not mentioned by the preset (e.g., pan stays at center).

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Effects rack fully operational for all 16 rows with complete parameter coverage
- All effect changes flow through the existing rAF-throttled evaluate pipeline (no audio glitches)
- Sound browser button (`onSoundBrowserOpen`) is wired but currently no-op (placeholder for Plan 03-05)
- Ready for Plans 03-05 (Sound Browser), 03-06 (Euclidean), 03-07 (Master Strip), 03-08 (Polish)

## Self-Check: PASSED

All 7 files verified present on disk. Both task commits (10b5620, 6e06f68) verified in git log. Build compiles cleanly (`npx vite build` succeeds).

---
*Phase: 03-the-knobs*
*Completed: 2026-02-17*
