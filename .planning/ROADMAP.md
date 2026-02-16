# Roadmap: HOMIE Beats

## Overview

Four phases building from "tap a pad, hear a sound, see Bonki vibe" to "chat with Bonki AI and jam together as a family." Phase 1 delivers a working instrument with TE-inspired design, tabbed navigation, and Bonki vibing in the corner. Each phase adds a layer. By Phase 4, HOMIE Beats is deployed as a PWA the whole household uses daily.

## Phases

- [ ] **Phase 1: The Pad** - Working instrument: tabbed sequencer + pads, Bonki sprite, TE aesthetic, PWA shell
- [ ] **Phase 2: The Board** - Presets, BPM control, code view, eclectic sound banks
- [ ] **Phase 3: The Brain** - Bonki AI chat sidebar, natural language pattern generation
- [ ] **Phase 4: The Polish** - AI teaching mode, smart suggestions, GitHub Pages deploy

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
**Plans**: 5 plans

Plans:
- [ ] 02-01-PLAN.md — Layer manager, controls strip (BPM/volume/8-16 toggle), layer chips, Bonki BPM sync (Wave 1)
- [ ] 02-02-PLAN.md — 16+ eclectic presets with Bonki album cover SVGs, horizontal scroll gallery, speech bubbles (Wave 2)
- [ ] 02-03-PLAN.md — Code view panel with Prism.js syntax highlighting, split-pane layout, copy + line flash (Wave 2)
- [ ] 02-04-PLAN.md — [GAP CLOSURE] Fix BPM real-time tempo, 8/16 toggle blank cells, HUSH grid reset (Wave 3)
- [ ] 02-05-PLAN.md — [GAP CLOSURE] Fix code view truncation, layer chip colors, Bonki speech position, sequencer clear + beat flash (Wave 4)

---

### Phase 3: The Brain
**Goal**: Bonki AI chat sidebar — natural language music creation and pattern explanation
**Depends on**: Phase 2
**Requirements**: AI-01, AI-02, AI-03, ENG-03
**Success Criteria** (what must be TRUE):
  1. AI tab opens Bonki chat sidebar with message history
  2. "make a chill beat" generates and plays a valid Strudel pattern
  3. "what does this pattern do?" gets a plain English explanation in Bonki's voice
  4. Code view becomes editable — changes apply on submit
  5. Bonki character animates during AI thinking (eyes half-closed, slight sway)
**Plans**: 3 plans

Plans:
- [ ] 03-01: Build chat sidebar UI with Bonki avatar, message history, input
- [ ] 03-02: Claude API integration — prompt engineering for Strudel pattern generation in Bonki's voice
- [ ] 03-03: Wire AI patterns to evaluate(), "explain pattern" feature, editable code view

---

### Phase 4: The Polish
**Goal**: Deploy to GitHub Pages, smart AI suggestions, teaching mode, family jam UX
**Depends on**: Phase 3
**Requirements**: AI-04, AI-05, DEPLOY-01, DEPLOY-02
**Success Criteria** (what must be TRUE):
  1. HOMIE Beats is live on GitHub Pages at a public URL
  2. PWA installs correctly from the hosted URL on all family devices
  3. Bonki suggests pattern modifications based on what's currently playing
  4. Bonki can teach music concepts when asked
  5. Watch notification fires when someone starts a jam session (stretch goal)
  6. The whole family can use it without instruction
**Plans**: 3 plans

Plans:
- [ ] 04-01: GitHub Pages deployment config, production build, service worker caching
- [ ] 04-02: Contextual AI suggestions, teaching mode (BPM, time signatures, etc.)
- [ ] 04-03: Final polish pass — animations, transitions, cross-device testing, family jam test

---

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. The Pad | 4/4 | Complete | 2026-02-16 |
| 2. The Board | 3/5 | Gap closure (2 fix plans) | - |
| 3. The Brain | 0/3 | Not started | - |
| 4. The Polish | 0/3 | Not started | - |
