# HOMIE Beats

## What This Is

A visual beatpad/synthboard PWA that wraps Strudel's live coding engine with a Teenage Engineering-inspired interface. Hybrid step sequencer + pad triggers with tabbed navigation. Features Bonki — a pixel art Scottish Fold cat DJ partner powered by AI — who helps the family build jams through natural language chat. Designed for the whole Ramone household: Macs, iPads, Linux desktop, with Watch notifications.

## Core Value

Anyone in the family can make music in 10 seconds by tapping a pad — and Bonki AI helps them go deeper.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Hybrid interaction: step sequencer (8-step, expandable to 16) + live pad triggers
- [ ] Tabbed navigation: SEQUENCE | PADS | AI
- [ ] Teenage Engineering aesthetic: minimal, purposeful, whimsical. Pixel art + Ghibli warmth.
- [ ] Bonki character: pixel art Scottish Fold cat DJ, present from Phase 1, reacts to music
- [ ] Bonki AI: DJ partner chat sidebar, generates patterns from natural language
- [ ] Eclectic sound palette: 808s, acoustic, synths, weird sounds — something for every mood
- [ ] PWA: installable on iPad home screen, works offline after first load
- [ ] Cross-platform: Mac, iPad, Linux desktop via GitHub Pages. Watch notifications.
- [ ] Progressive complexity: simple surface, depth underneath for those who dig
- [ ] Pattern code visible and editable (learn by seeing what pads generate)

### Out of Scope

- DAW-level recording/mixing — this is a jam tool, not a production suite
- MIDI controller input — v1 is touch/mouse only
- User accounts/login — local family tool, no auth needed
- Audio file export — v1 is live performance only
- Custom sample upload — using Strudel's built-in sample library
- Apple Watch control surface — Watch is notifications only

## Context

- Strudel installed at `~/strudel/`, @strudel/web package exposes full programmatic API
- Key API: `initStrudel()`, `evaluate(code)`, `hush()`, `Pattern.prototype.play()`
- Bonki is based on the family's late Scottish Fold cat. All black, fold ears, big golden eyes.
- Reference photos in `homie-beats/reference/`. Character spec in `.planning/CHARACTER.md`
- Teenage Engineering design language: functional minimalism, unexpected playful visuals, clean typography
- MVP test (from Chris): "Kids build a beat without help"
- Family devices: macOS (Apple Silicon), iPads, Apple Watch, Linux gaming desktop
- Deployment: GitHub Pages (hosted) + local dev (hacking). Both always available.

## Constraints

- **Engine**: Strudel @strudel/web — no custom audio engine
- **Stack**: Vite + vanilla JS. Keep bundle small and fast.
- **Touch**: All interactions work on iPad touchscreen. Min 48px targets.
- **Ecosystem**: PWA on GitHub Pages = works everywhere with a browser. No server dependency.
- **License**: AGPL-3.0 (inherits from Strudel). Open source.
- **AI**: Claude API for Bonki chat (Phase 3). Pre-built suggestions as fallback.
- **Design**: TE-inspired. NOT generic dark-mode music app. NOT childish. NOT sterile.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Wrap Strudel, don't fork | Leverage existing engine, stay upstream-compatible | -- Pending |
| Teenage Engineering + pixel art + Ghibli | Chris's vision: purposeful whimsy, not obnoxious | -- Pending |
| Hybrid sequencer + pads, tabbed | Full family: simple pads for kids, sequencer for depth | -- Pending |
| Bonki as mascot/AI character | Tribute to family's late Scottish Fold cat | -- Pending |
| PWA on GitHub Pages | Works on all family devices, zero friction, free hosting | -- Pending |
| 8-step default, expandable to 16 | Progressive disclosure: simple start, depth when ready | -- Pending |
| Bonki present from Phase 1 | Sets the tone immediately, even before AI chat exists | -- Pending |

---
*Last updated: 2026-02-15 after discuss phase with Chris*
