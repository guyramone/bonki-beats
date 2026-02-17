# Roadmap: HOMIE Beats

## Overview

Five phases building from "tap a pad, hear a sound, see Bonki vibe" to "jam with Bonki AI as a family on any device." Phase 1 delivers a working instrument. Phase 2 adds controls and presets. Phase 3 exposes Strudel's full power through knobs, selectors, and effects — turning HOMIE Beats from a drum machine into a real instrument studio. Phase 4 adds Bonki AI as copilot. Phase 5 ships it to the world.

## Phases

- [x] **Phase 1: The Pad** - Working instrument: tabbed sequencer + pads, Bonki sprite, TE aesthetic, PWA shell
- [x] **Phase 2: The Board** - Presets, BPM control, code view, eclectic sound banks
- [ ] **Phase 3: The Knobs** - Full Strudel power: synth selector, effects rack, scales, euclidean rhythms, sample browser
- [ ] **Phase 4: The Brain** - Bonki AI chat sidebar, natural language pattern generation + teaching mode
- [ ] **Phase 5: The Stage** - GitHub Pages deploy, cross-device polish, family jam UX

## Phase Details

### Phase 1: The Pad
**Goal**: A working instrument with tabbed navigation (SEQUENCE | PADS), Bonki pixel sprite vibing, TE-inspired design. PWA-ready. Kids can build a beat without help.
**Depends on**: Nothing (first phase)
**Requirements**: PAD-01, PAD-02, PAD-03, PAD-05, CTL-01, CTL-04, ENG-01, ACC-01 through ACC-05, CHAR-01
**Success Criteria** (what must be TRUE):
  1. Tabbed UI with SEQUENCE and PADS views, TE-inspired dark aesthetic
  2. SEQUENCE tab: 8-step sequencer grid with 4 sound rows, toggleable cells
  3. PADS tab: 4x4 pad grid for live triggering
  4. Play/stop/hush transport controls work
  5. Pixel art Bonki sits in corner, idle animation, reacts to playback
  6. Layout works on iPad Safari, Mac, and Linux desktop (responsive, touch targets 48px+)
  7. PWA manifest and service worker shell in place (installable on iPad)
  8. Serves over LAN with --host
**Plans**: 4 plans

Plans:
- [ ] 01-01-PLAN.md — Scaffold Vite + React project, install @strudel/web, PWA manifest + service worker (Wave 1)
- [ ] 01-02-PLAN.md — Build tabbed UI shell (SEQUENCE | PADS | AI), TE-inspired CSS, responsive layout (Wave 2)
- [ ] 01-03-PLAN.md — Build 8-step sequencer + 4x4 pad grid, wire to Strudel evaluate(), transport controls (Wave 3)
- [ ] 01-04-PLAN.md — Create Bonki pixel art character, idle + vibing animations, integrate into transport bar (Wave 3)

<task type="checkpoint:human-verify" gate="blocking">
  <what-built>HOMIE Beats Phase 1 — working instrument with sequencer, pads, Bonki, TE design</what-built>
  <how-to-verify>
    1. Open http://localhost:5555 on Mac — verify TE-inspired design, dark theme, tabs work
    2. SEQUENCE tab: toggle cells in 8-step grid, hit play, hear pattern loop
    3. PADS tab: tap pads, hear sounds trigger
    4. Bonki: visible in corner, idle animation, reacts when music plays
    5. HUSH button: kills all sound immediately
    6. Open on iPad via LAN IP — verify touch works, layout is responsive, targets are big enough
    7. "Add to Home Screen" on iPad — verify PWA installs with icon
    8. Hand iPad to Moony or Nene — can they build a beat without instruction?
  </how-to-verify>
  <resume-signal>Type "approved" or describe issues</resume-signal>
</task>

---

### Phase 2: The Board
**Goal**: Feels like a real instrument — presets, BPM control, eclectic sound banks, code view panel
**Depends on**: Phase 1
**Requirements**: PAD-04, PAD-06, CTL-02, CTL-03, ENG-02, ENG-04, ENG-05
**Success Criteria** (what must be TRUE):
  1. BPM slider changes tempo in real time (60-180)
  2. At least 5 eclectic preset patterns load and play immediately
  3. Code view panel shows live Strudel code as pads/sequencer are toggled
  4. Multiple layers can be active simultaneously
  5. Volume control works
  6. 8-step ↔ 16-step toggle works
**Plans**: 10 plans

Plans:
- [x] 02-01-PLAN.md — Layer manager, controls strip (BPM/volume/8-16 toggle), layer chips, Bonki BPM sync (Wave 1)
- [x] 02-02-PLAN.md — 16+ eclectic presets with Bonki album cover SVGs, horizontal scroll gallery, speech bubbles (Wave 2)
- [x] 02-03-PLAN.md — Code view panel with Prism.js syntax highlighting, split-pane layout, copy + line flash (Wave 2)
- [x] 02-04-PLAN.md — [GAP CLOSURE] Fix BPM real-time tempo, 8/16 toggle blank cells, HUSH grid reset (Wave 3)
- [x] 02-05-PLAN.md — [GAP CLOSURE] Fix code view truncation, layer chip colors, Bonki speech position, sequencer clear + beat flash (Wave 4)
- [x] 02-06-PLAN.md — [GAP CLOSURE] Fix beat sync drift (rAF + performance.now), color pulse on beat (Wave 5)
- [x] 02-07-PLAN.md — [GAP CLOSURE] Expand sequencer to 8 sound rows with per-row colors (Wave 6)
- [x] 02-08-PLAN.md — [GAP CLOSURE] True audio sync via scheduler.now(), column playhead, trigger-pop animation (Wave 7)
- [x] 02-09-PLAN.md — [GAP CLOSURE] Alive code view: per-line bounce, pattern char cursor, color borders (Wave 7)
- [x] 02-10-PLAN.md — [GAP CLOSURE] Canvas audio visualizer in transport bar (Wave 8)

---

### Phase 3: The Knobs
**Goal**: Transform HOMIE Beats from a drum machine into a full instrument studio. Expose Strudel's 70+ pattern transforms, synth engines, 30+ effects, 80+ scales, and 800+ sample banks through hands-on knobs, selectors, and controls. Kids turn knobs, hear changes instantly. Progressive disclosure: simple on the surface, deep underneath.
**Depends on**: Phase 2
**Requirements**: KNOB-01 through KNOB-06 (defined during discuss phase)
**Success Criteria** (what must be TRUE):
  1. Sound selector per sequencer row — swap between drum samples, synths (saw/square/sine/supersaw), and soundfonts (piano, bass, etc.)
  2. Effects panel with real knobs/sliders — at minimum: reverb, delay, filter (LP cutoff + resonance), distortion
  3. Scale/key picker — choose root note and scale type, unlocking melodic sequencing with note rows
  4. Euclidean rhythm generator — set pulses + steps per row, hear world rhythms instantly
  5. Sample bank browser — browse beyond TR-808 (TR-909, LinnDrum, Tidal Dirt Samples, soundfonts)
  6. Pattern transform controls — at minimum: swing, probability (degrade), reverse, speed (fast/slow)
  7. All controls update the live code view in real time
  8. Bonki reacts to new sounds/effects with personality ("ooh, spacey!" when reverb goes up)
  9. Works on iPad with touch-friendly knobs (48px+ targets, rotary or slider)
**Plans**: 8 plans

Plans:
- [ ] 03-01-PLAN.md -- Row model, code generator, 16-row sequencer with collapsible sections (Wave 1)
- [ ] 03-02-PLAN.md -- Knob, Slider, ToggleSwitch UI components with react-knob-headless (Wave 1)
- [ ] 03-03-PLAN.md -- Sound browser: category grid, 3-level drill-down, favorites, recents, dice (Wave 2)
- [ ] 03-04-PLAN.md -- Per-row effects rack: filter, delay, reverb, distortion, lo-fi with signal chain layout (Wave 2)
- [ ] 03-05-PLAN.md -- Scale picker with visual keyboard + euclidean rhythm generator (Wave 2)
- [ ] 03-06-PLAN.md -- Master effects strip with DJ filter, global transforms, per-row overrides (Wave 3)
- [ ] 03-07-PLAN.md -- 4x8 pads with two banks + full session persistence (Wave 3)
- [ ] 03-08-PLAN.md -- Integration: code view update, Bonki reactions, iPad verification (Wave 4)

<task type="checkpoint:human-verify" gate="blocking">
  <what-built>HOMIE Beats Phase 3 — full Strudel power exposed through knobs and controls</what-built>
  <how-to-verify>
    1. Open on Mac — change a sequencer row from TR-808 kick to supersaw synth. Hear the difference.
    2. Open effects panel — turn up reverb, hear it wash. Sweep the filter cutoff.
    3. Pick C minor pentatonic scale — toggle cells, hear a melody instead of just drums.
    4. Set a row to euclidean (3,8) — hear a tresillo rhythm.
    5. Browse sample banks — load TR-909, LinnDrum, or a piano soundfont.
    6. Apply swing — feel the groove shift.
    7. Check code view — see all changes reflected in real Strudel code.
    8. Open on iPad — verify knobs are touch-friendly, everything works.
    9. Hand to Moony — can they make a melody without instruction?
    10. Hand to Nene — can they make something "weird" with effects?
  </how-to-verify>
  <resume-signal>Type "approved" or describe issues</resume-signal>
</task>

---

### Phase 4: The Brain
**Goal**: Bonki AI comes alive — chat sidebar for natural language music creation, pattern explanation, and teaching. Bonki can now reference ALL the controls from Phase 3 ("try turning up the reverb" or "switch row 3 to a supersaw").
**Depends on**: Phase 3
**Requirements**: AI-01 through AI-05 (defined during discuss phase)
**Success Criteria** (what must be TRUE):
  1. AI tab opens Bonki chat sidebar with message history
  2. "make a chill beat" generates and plays a valid Strudel pattern using the full feature set
  3. "what does this pattern do?" gets a plain English explanation in Bonki's voice
  4. Bonki can suggest specific control changes ("try euclidean 5,8 on the hi-hat")
  5. Code view becomes editable — changes apply on submit
  6. Bonki teaches music concepts when asked (scales, time signatures, what's a euclidean rhythm?)
  7. Bonki character animates during AI thinking
**Plans**: TBD

Plans:
- [ ] 04-01 through 04-XX: To be planned via /gsd:plan-phase 4

---

### Phase 5: The Stage
**Goal**: Ship it. Deploy to GitHub Pages, cross-device testing, performance polish, family jam UX.
**Depends on**: Phase 4 (or can be pulled earlier if AI is deferred)
**Requirements**: DEPLOY-01, DEPLOY-02 (defined during discuss phase)
**Success Criteria** (what must be TRUE):
  1. HOMIE Beats is live on GitHub Pages at a public URL
  2. PWA installs correctly from the hosted URL on all family devices
  3. Performance: loads in <3s on iPad, no audio glitches
  4. Glassmorphism theme fully integrated and polished
  5. The whole family can use it without instruction
  6. Watch notification fires when someone starts a jam session (stretch goal)
**Plans**: TBD

Plans:
- [ ] 05-01 through 05-XX: To be planned via /gsd:plan-phase 5

---

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. The Pad | 4/4 | Complete | 2026-02-16 |
| 2. The Board | 10/10 | Complete | 2026-02-16 |
| 3. The Knobs | 0/8 | Planned | - |
| 4. The Brain | 0/TBD | Not started | - |
| 5. The Stage | 0/TBD | Not started | - |
