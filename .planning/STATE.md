# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-15)

**Core value:** Anyone in the family can make music in 10 seconds — Bonki AI helps them go deeper
**Current focus:** Phase 2 — The Board

## Current Position

Phase: 2 of 4 (The Board)
Plan: 4 of 5 in current phase
Status: Executing Phase 2
Last activity: 2026-02-16 — Completed 02-04-PLAN.md (Gap Closure: Playback Bug Fixes)

Progress: [########--] 80% (Phase 2)

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

## Session Continuity

Last session: 2026-02-16
Stopped at: Completed 02-the-board/02-04-PLAN.md (Gap Closure: Playback Bug Fixes)
Resume file: None
