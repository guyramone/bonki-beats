# Requirements: HOMIE Beats

**Defined:** 2026-02-15
**Core Value:** Anyone in the family can make music in 10 seconds by tapping a pad

## v1 Requirements

### Beatpad UI

- [ ] **PAD-01**: 4x4 grid of tappable pads displayed on screen
- [ ] **PAD-02**: Each pad triggers a distinct Strudel sound/pattern when tapped
- [ ] **PAD-03**: Pads show visual feedback (light up/animate) when active
- [ ] **PAD-04**: Pads can be toggled on/off to build layered patterns
- [ ] **PAD-05**: Default pad layout includes: kicks, snares, hi-hats, claps, synth stabs, bass notes
- [ ] **PAD-06**: Tapping a pad while pattern is playing adds/removes it from the loop

### Transport & Controls

- [ ] **CTL-01**: Play/stop button for the main pattern
- [ ] **CTL-02**: BPM slider (60-180 range) that updates in real time
- [ ] **CTL-03**: Volume control for master output
- [ ] **CTL-04**: "Hush" panic button that stops all sound immediately

### Pattern Engine

- [ ] **ENG-01**: Pads generate valid Strudel pattern code under the hood
- [ ] **ENG-02**: Code view panel shows the current Strudel code in real time
- [ ] **ENG-03**: Users can edit the code directly and hear changes
- [ ] **ENG-04**: Pre-built pattern presets (hip-hop, lo-fi, techno, ambient, weird)
- [ ] **ENG-05**: Pattern presets load instantly and sound good immediately

### HOMIE AI Sidekick

- [ ] **AI-01**: Chat sidebar where users can ask HOMIE for music help
- [ ] **AI-02**: HOMIE can generate Strudel patterns from natural language ("make a chill beat")
- [ ] **AI-03**: HOMIE can explain what the current pattern does in plain English
- [ ] **AI-04**: HOMIE suggests modifications ("try adding reverb", "speed it up")
- [ ] **AI-05**: HOMIE teaches music concepts inline (what's BPM? what's a hi-hat pattern?)

### Accessibility & Platform

- [ ] **ACC-01**: Responsive layout works on iPad Safari (touch-optimized)
- [ ] **ACC-02**: Serves over local network (any device on LAN can access)
- [ ] **ACC-03**: Touch targets are large enough for kids' fingers (minimum 48px)
- [ ] **ACC-04**: Dark theme by default (looks like a real instrument)
- [ ] **ACC-05**: Works without HOMIE AI (AI is enhancement, not dependency)

## v2 Requirements

### Advanced Features

- **ADV-01**: Keyboard shortcuts for pads (A-Z keys map to pads)
- **ADV-02**: Record and playback sessions
- **ADV-03**: Export pattern code to share with others
- **ADV-04**: Sound bank browser with categories and preview
- **ADV-05**: Effects rack (reverb, delay, distortion, filter)
- **ADV-06**: Integration with game projects (make soundtracks for Ramone games)
- **ADV-07**: MIDI input support for external controllers
- **ADV-08**: Multi-user jam session over LAN

## Out of Scope

| Feature | Reason |
|---------|--------|
| DAW-level recording/mixing | This is a jam tool, not Ableton |
| Custom sample upload | Strudel's built-in library is massive enough |
| User accounts | Local family tool, no auth needed |
| Audio file export | Live performance focus for v1 |
| Complex music theory UI | HOMIE AI handles education conversationally |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| PAD-01 | Phase 1 | Pending |
| PAD-02 | Phase 1 | Pending |
| PAD-03 | Phase 1 | Pending |
| PAD-04 | Phase 2 | Pending |
| PAD-05 | Phase 1 | Pending |
| PAD-06 | Phase 2 | Pending |
| CTL-01 | Phase 1 | Pending |
| CTL-02 | Phase 2 | Pending |
| CTL-03 | Phase 2 | Pending |
| CTL-04 | Phase 1 | Pending |
| ENG-01 | Phase 1 | Pending |
| ENG-02 | Phase 2 | Pending |
| ENG-03 | Phase 3 | Pending |
| ENG-04 | Phase 2 | Pending |
| ENG-05 | Phase 2 | Pending |
| AI-01 | Phase 3 | Pending |
| AI-02 | Phase 3 | Pending |
| AI-03 | Phase 3 | Pending |
| AI-04 | Phase 4 | Pending |
| AI-05 | Phase 4 | Pending |
| ACC-01 | Phase 1 | Pending |
| ACC-02 | Phase 1 | Pending |
| ACC-03 | Phase 1 | Pending |
| ACC-04 | Phase 1 | Pending |
| ACC-05 | Phase 1 | Pending |

**Coverage:**
- v1 requirements: 25 total
- Mapped to phases: 25
- Unmapped: 0

---
*Requirements defined: 2026-02-15*
*Last updated: 2026-02-15 after initial definition*
