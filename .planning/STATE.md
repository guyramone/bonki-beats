# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-15)

**Core value:** Anyone in the family can make music in 10 seconds — Bonki AI helps them go deeper
**Current focus:** Phase 1 — The Pad

## Current Position

Phase: 1 of 4 (The Pad)
Plan: 2 of 4 in current phase
Status: Executing Phase 1 plans
Last activity: 2026-02-16 — Completed 01-02-PLAN.md (Tabbed UI Shell + TE Design System)

Progress: [#####.....] 50%

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

### Technical Reference

- Strudel: `~/strudel/`, API: initStrudel(), evaluate(), hush()
- Sounds: bd, sd, hh, oh, cp, cr, rd, ht, mt, lt, cb, tb + synths
- Banks: .bank("RolandTR808"), .bank("RolandTR909")
- Character spec: .planning/CHARACTER.md
- Reference photos: homie-beats/reference/

### Blockers/Concerns

- Claude API key needed for Phase 3
- Pixel art Bonki needs to be created (CSS pixel art or sprite sheet — decide in Plan 01-04)

## Performance Metrics

| Plan | Duration | Tasks | Files | Completed |
|------|----------|-------|-------|-----------|
| 01-01 | 227s (3m 47s) | 2 | 8 | 2026-02-16 |
| 01-02 | 125s (2m 5s) | 2 | 3 | 2026-02-16 |

## Session Continuity

Last session: 2026-02-16
Stopped at: Completed 01-the-pad/01-02-PLAN.md (Tabbed UI Shell + TE Design System)
Resume file: None
