# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-15)

**Core value:** Anyone in the family can make music in 10 seconds — Bonki AI helps them go deeper
**Current focus:** Phase 3 — The Knobs (EXECUTING)

## Current Position

Phase: 3 of 5 (The Knobs)
Plan: 5 of 8 in current phase
Status: Executing Phase 3 plans. Plans 03-01 through 03-05 complete.
Last activity: 2026-02-17 — Completed Plan 03-05: Scale picker and euclidean rhythm controls.

Progress: [######....] 63% (Phase 3 — 5/8 plans complete)

## Accumulated Context

### Decisions (from discuss phase — see phases/01-the-pad/01-CONTEXT.md for full detail)

- Visual: Teenage Engineering + pixel art + Ghibli warmth
- Interaction: Hybrid step sequencer + pads, tabbed (SEQUENCE | PADS | AI)
- Users: Whole family, layered complexity. MVP = kids beat without help.
- AI: Bonki (Scottish Fold cat tribute), DJ partner, character + chat
- Sound: Eclectic — 808s to weird stuff
- Sequencer: 8-step default, expandable to 16
- Bonki: Present from Phase 1, vibing in corner
- Ecosystem: PWA on GitHub Pages + local dev. Mac, iPad, Linux, Watch (notifications)
- Access: One URL, always works. Zero friction.

### Execution Decisions (Phase 1)

- **Plan 01-01:** Updated vite-plugin-pwa to v1.2.0 for Vite 6 compatibility (auto-fix, Rule 3 - blocking issue)
- **Plan 01-02:** Used HTML entities for transport icons instead of icon library (zero new dependencies). Added ARIA toolbar/tabpanel roles for accessibility beyond plan spec.
- **Plan 01-03:** Pad taps replace current playback rather than layering (simpler mental model for kids). HUSH syncs both hush() and isPlaying UI state. Transport accepts children prop for composability.
- **Plan 01-04:** SVG pixel art approach for Bonki (rects in 32x32 viewBox) -- scalable, maintainable, no external file dependency. Added children prop to Transport for composable Bonki placement.

### Execution Decisions (Phase 2)

- **Plan 02-01:** HUSH clears all layers + stops (panic button). Transport HUSH handler lifted to App.jsx (onHush prop). Grid always 16 wide, stepCount slices view. Volume throttled 100ms, BPM not throttled. Pads add as layers instead of replacing playback.
- **Plan 02-02:** Preview (tap) vs Add (+) as distinct preset interactions. BonkiCovers use shared BaseBonki body with swapped accessories per genre. messageKey counter pattern for re-triggering identical BonkiSpeech messages. Touch-device "+" button always visible via @media (hover: none).
- **Plan 02-03:** Prism.highlight() string API (not DOM-based) for React compatibility. displayCode shows clean code without .gain() wrapper. Split-pane stacks on mobile, side-by-side on tablet+. Reused BonkiSpeech component from 02-02 with messageKey for re-trigger support.
- **Plan 02-04:** Functional setLayers pattern in handleBpmChange for current-state access (consistent with volume throttle). React key={stepCount} on Sequencer for guaranteed remount on step toggle.
- **Plan 02-05:** Inline styles on LayerChips dot for bulletproof color rendering (CSS specificity bypass). Beat tracking via JS setInterval approximation (not Strudel internal scheduler). Per-row colors via data-row attribute selectors.
- **Plan 02-06:** rAF + performance.now() for drift-free beat tracking (visual-only, not audio scheduler). CSS filter: brightness(1.4) for per-row color pulse (adapts to any bg color).
- **Plan 02-07:** Sound ordering follows real drum machine convention (core kit top, percussion bottom). Extended row colors use distinct hues (cyan, purple, rose, blue, amber) pairing with existing design tokens.
- **Plan 02-08:** Switched from performance.now() to Strudel scheduler.now() for audio-accurate beat tracking. trigger-pop keyframe with cubic-bezier overshoot. Downbeat markers on beats 1 and midpoint.
- **Plan 02-09:** Full CodeView rewrite — stack() parser splits into per-row lines with colored borders, pattern char parsing (x=bright, ~=dim), moving cursor with row-colored glow on hits.
- **Plan 02-10:** AnalyserNode tap via Object.defineProperty override on audioContext.destination. GainNode splits signal to real destination + analyser. Canvas waveform visualizer in transport bar.

### Execution Decisions (Phase 3)

- **Plan 03-01:** Row model as single source of truth (replacing grid+SOUNDS). 16 instruments in 5 collapsible sections. Pure code generator (rowsToStrudelCode/generateDisplayCode). Effect defaults with ranges. rAF-throttled evaluate pipeline. Overlay layers separated from sequencer. 36px cells + scrollable sequencer for 16 rows.
- **Plan 03-02:** Task 1 (Knob + knobs.css + react-knob-headless) already committed by parallel 03-01. Slider uses native range input with CSS gradient fill. ToggleSwitch uses CSS custom properties for per-instance color theming.
- **Plan 03-03:** Sound browser with 11-category visual grid, 20+ drum machines, 7 synth engines, 128 GM soundfonts. Three-level drill-down (Category > Bank > Sound). Tap-to-preview, double-tap-to-select. Favorites/recents in localStorage. Dice button with 2-tap confirm. Bonki category-based reactions. @strudel/soundfonts registered on audio init.
- **Plan 03-04:** Dotted path notation for effect parameter changes (cutoff.value, cutoff.active). Filter envelope/LFO as collapsible sub-sections. Auto-enable on toggle (delay/reverb/distort set sensible defaults when activated). RowControls placed below grid row. Effect chain presets call individual change() calls (preserve unmentioned params).
- **Plan 03-05:** Scale starts inactive (globalScale=null) until user interacts with scale picker -- no forced musical key on drum patterns. Bjorklund algorithm implemented locally (small, self-contained, avoids Strudel internal dependency). Named rhythm lookup via simple "pulses,steps" string key (10 common world rhythms). Root note auto-transpose preserves interval relationship from old root to new root for all melodic rows.

### Technical Reference

- Strudel: `~/strudel/`, API: initStrudel(), evaluate(), hush()
- Sounds: bd, sd, hh, oh, cp, cr, rd, ht, mt, lt, cb, tb + synths
- Banks: .bank("RolandTR808"), .bank("RolandTR909")
- Character spec: .planning/CHARACTER.md
- Reference photos: homie-beats/reference/

### Blockers/Concerns

- Claude API key needed for Phase 3

## Performance Metrics

| Plan | Duration | Tasks | Files | Completed |
|------|----------|-------|-------|-----------|
| 01-01 | 227s (3m 47s) | 2 | 8 | 2026-02-16 |
| 01-02 | 125s (2m 5s) | 2 | 3 | 2026-02-16 |
| 01-03 | 207s (3m 27s) | 2 | 6 | 2026-02-16 |
| 01-04 | 205s (3m 25s) | 2 | 5 | 2026-02-16 |
| 02-01 | 402s (6m 42s) | 2 | 10 | 2026-02-16 |
| 02-02 | 386s (6m 26s) | 2 | 7 | 2026-02-16 |
| 02-03 | 335s (5m 35s) | 2 | 6 | 2026-02-16 |
| 02-04 | 73s (1m 13s) | 2 | 1 | 2026-02-16 |
| 02-05 | 165s (2m 45s) | 2 | 5 | 2026-02-16 |
| 02-06 | 66s (1m 6s) | 2 | 2 | 2026-02-16 |
| 02-07 | 93s (1m 33s) | 2 | 2 | 2026-02-16 |
| 02-08 | — (cross-session) | 4 | 4 | 2026-02-16 |
| 02-09 | — (cross-session) | 3 | 3 | 2026-02-16 |
| 02-10 | — (cross-session) | 3 | 4 | 2026-02-16 |
| 03-01 | 404s (6m 44s) | 2 | 8 | 2026-02-17 |
| 03-02 | 253s (4m 13s) | 2 | 2 | 2026-02-17 |
| 03-03 | 431s (7m 11s) | 2 | 9 | 2026-02-17 |
| 03-04 | 316s (5m 16s) | 2 | 6 | 2026-02-17 |
| 03-05 | 481s (8m 1s) | 2 | 10 | 2026-02-17 |

## Session Continuity

Last session: 2026-02-17
Stopped at: Completed 03-05-PLAN.md (scale picker + euclidean rhythms). Plans 03-01 through 03-05 done (wave 3 in progress).
Resume file: .planning/phases/03-the-knobs/03-05-SUMMARY.md
