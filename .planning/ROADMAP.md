# Roadmap: HOMIE Beats

## Overview

Four phases that take us from "tap a pad, hear a sound" to "chat with HOMIE AI and build a jam together." Phase 1 is the skeleton — a working beatpad that makes noise. Each phase adds a layer: presets, code view, AI chat. By the end, HOMIE Beats is a full creative instrument the whole family can play.

## Phases

- [ ] **Phase 1: The Pad** - Working 4x4 beatpad with Strudel engine, play/stop, touch-ready
- [ ] **Phase 2: The Board** - Presets, BPM control, code view, pattern layering
- [ ] **Phase 3: The Brain** - HOMIE AI chat sidebar, natural language → patterns
- [ ] **Phase 4: The Polish** - AI teaching mode, effects suggestions, family jam UX

## Phase Details

### Phase 1: The Pad
**Goal**: A working 4x4 beatpad that triggers Strudel sounds, with play/stop and dark theme
**Depends on**: Nothing (first phase)
**Requirements**: PAD-01, PAD-02, PAD-03, PAD-05, CTL-01, CTL-04, ENG-01, ACC-01, ACC-02, ACC-03, ACC-04, ACC-05
**Success Criteria** (what must be TRUE):
  1. A 4x4 grid of pads is visible on screen with dark theme
  2. Tapping any pad triggers a sound via Strudel
  3. Play button starts a looping pattern, Stop/Hush stops it
  4. Layout works on iPad Safari with touch-sized targets
  5. Serves over LAN with --host flag
**Plans**: 3 plans

Plans:
- [ ] 01-01: Scaffold Vite project, install @strudel/web, initialize audio engine
- [ ] 01-02: Build 4x4 pad grid UI with CSS Grid, dark theme, tap handlers
- [ ] 01-03: Wire pads to Strudel evaluate(), add play/stop/hush, test on iPad

---

### Phase 2: The Board
**Goal**: Feels like a real instrument — presets, BPM control, layered patterns, code view
**Depends on**: Phase 1
**Requirements**: PAD-04, PAD-06, CTL-02, CTL-03, ENG-02, ENG-04, ENG-05
**Success Criteria** (what must be TRUE):
  1. BPM slider changes tempo in real time
  2. At least 5 preset patterns load and play immediately
  3. Code view panel shows Strudel code updating as pads are toggled
  4. Multiple pads can be active simultaneously (layered pattern)
  5. Volume control works
**Plans**: 3 plans

Plans:
- [ ] 02-01: Add BPM slider, volume control, and real-time pattern rebuilding
- [ ] 02-02: Build preset system — 5+ genre presets (hip-hop, lo-fi, techno, ambient, weird)
- [ ] 02-03: Add code view panel that displays and updates Strudel code in real time

---

### Phase 3: The Brain
**Goal**: HOMIE AI chat sidebar — natural language music creation and pattern explanation
**Depends on**: Phase 2
**Requirements**: AI-01, AI-02, AI-03, ENG-03
**Success Criteria** (what must be TRUE):
  1. Chat sidebar is visible and functional
  2. Typing "make a chill beat" generates and plays a valid Strudel pattern
  3. Asking "what does this pattern do?" gets a plain English explanation
  4. Code view is editable — changes apply when submitted
  5. AI responses include runnable pattern suggestions
**Plans**: 3 plans

Plans:
- [ ] 03-01: Build chat sidebar UI with message history and input
- [ ] 03-02: Connect to Claude API — prompt engineering for Strudel pattern generation
- [ ] 03-03: Wire AI-generated patterns to evaluate(), add "explain this pattern" feature

---

### Phase 4: The Polish
**Goal**: Teaching mode, smart suggestions, and family jam UX refinements
**Depends on**: Phase 3
**Requirements**: AI-04, AI-05
**Success Criteria** (what must be TRUE):
  1. HOMIE suggests pattern modifications based on what's currently playing
  2. HOMIE can teach music concepts when asked (BPM, time signatures, etc.)
  3. UI feels polished and premium — animations, transitions, visual feedback
  4. The whole family can use it without instruction
**Plans**: 2 plans

Plans:
- [ ] 04-01: Add contextual AI suggestions based on current pattern state
- [ ] 04-02: Teaching mode — HOMIE explains music concepts, UI polish pass

---

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. The Pad | 0/3 | Not started | - |
| 2. The Board | 0/3 | Not started | - |
| 3. The Brain | 0/3 | Not started | - |
| 4. The Polish | 0/2 | Not started | - |
