# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-15)

**Core value:** Anyone in the family can make music in 10 seconds — Bonki AI helps them go deeper
**Current focus:** Phase 1 — The Pad

## Current Position

Phase: 1 of 4 (The Pad)
Plan: 4 of 4 in current phase
Status: Phase 1 complete
Last activity: 2026-02-16 — Completed 01-04-PLAN.md (Bonki Character)

Progress: [##########] 100% (Phase 1)

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

## Session Continuity

Last session: 2026-02-16
Stopped at: Completed 01-the-pad/01-03-PLAN.md (Sequencer + Pads + Transport) and 01-04-PLAN.md (Bonki Character) in parallel
Resume file: None
