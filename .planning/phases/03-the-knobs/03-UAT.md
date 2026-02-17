---
status: testing
phase: 03-the-knobs
source: [03-01-SUMMARY.md, 03-02-SUMMARY.md, 03-03-SUMMARY.md, 03-04-SUMMARY.md, 03-05-SUMMARY.md, 03-06-SUMMARY.md, 03-07-SUMMARY.md, 03-08-SUMMARY.md]
started: 2026-02-17T12:00:00Z
updated: 2026-02-17T12:00:00Z
---

## Current Test

number: 1
name: 16-Row Sequencer with Collapsible Sections
expected: |
  SEQUENCE tab shows 16 instrument rows grouped into 5 sections (Drums, Percussion, Bass, Synths, Melodic).
  Drums section is expanded by default, others collapsed. Tapping a section header toggles collapse/expand
  with a chevron indicator. Active row count badge appears on sections with toggled cells.
  Toggling cells and hitting Play produces sound from the correct instruments.
awaiting: user response

## Tests

### 1. 16-Row Sequencer with Collapsible Sections
expected: SEQUENCE tab shows 16 rows in 5 collapsible sections. Drums expanded by default, others collapsed. Tap section header to toggle. Active count badge shown. Play produces correct sounds.
result: [pending]

### 2. Sound Browser — Browse and Swap Sounds
expected: Tap a row's sound name pill (below the grid row) to open a full-screen sound browser. 11 colorful category tiles shown. Drill into a category (e.g., Drum Machines) to see banks (TR-909, LinnDrum, etc.). Tap a sound to hear a preview. Double-tap or tap Select to commit it to the row. The row's sound name updates and the sequencer uses the new sound.
result: [pending]

### 3. Per-Row Effects Rack
expected: Tap the expand chevron on any row to reveal the effects rack. See signal chain nodes: Filter, Delay, Reverb, Distortion, Lo-Fi, Pan. Toggle an effect on (e.g., Reverb) — hear the effect immediately. Turn knobs (cutoff, delay time, etc.) — hear changes in real time. Try an effect preset (Clean, Gritty, Spacey, Lo-Fi). Mute button on the row silences it.
result: [pending]

### 4. Scale Picker with Visual Piano Keyboard
expected: Tap the scale toggle button in the control strip. A piano keyboard appears above the sequencer showing highlighted scale notes. Pick a root note (e.g., D) and scale (e.g., minor pentatonic). Melodic rows auto-transpose to the new key. Tap piano keys to hear note previews. Scale notes are labeled with degree numbers.
result: [pending]

### 5. Euclidean Rhythm Generator
expected: Expand a row's effects rack. In the rhythm section at the top, toggle from "Manual" to "Euclidean". An SVG ring visualization appears with active beats shown as colored dots. Adjust pulses (e.g., 3) and steps (e.g., 8) — hear the pattern change. Named rhythm hint appears (e.g., "Tresillo" for 3,8). Rotation shifts the pattern start point.
result: [pending]

### 6. Master Effects Strip
expected: A horizontal strip is always visible above the transport bar. Contains: featured DJ Filter knob (larger), Reverb (VERB) and Delay (ECHO) knobs, Swing and Probability (PROB) knobs, and a volume slider at the right. All knobs affect the entire mix in real time when playing.
result: [pending]

### 7. DJ Filter Sweep
expected: The DJ Filter knob in the master strip shows "FLAT" at center position. Turn it left — display shows "LP N%" and sound gets bass-heavy (warm color on knob). Turn it right — display shows "HP N%" and sound gets treble-heavy (cool color on knob). Double-tap resets to center (FLAT/bypass).
result: [pending]

### 8. 4x8 Pads with Bank Switching
expected: Switch to the PADS tab. See a grid of pads, each showing a sound name and colored to match its sequencer row. Tapping a pad triggers that row's sound as a one-shot. Bank A/B tabs at top switch between pad banks. All 16 sequencer row sounds are accessible.
result: [pending]

### 9. Session Persistence Across Reload
expected: Build a pattern: toggle some cells, change BPM, swap a sound via browser, adjust effects, change scale. Reload the page. After tapping "Tap to Start" (audio init), the UI shows the same pattern, BPM, sounds, effects, and scale settings. Music does NOT auto-play (must tap Play). Favorites and recents in the sound browser also persist.
result: [pending]

### 10. Code View Shows Full Phase 3 Code
expected: With a pattern playing that includes effects, scale, and/or euclidean rhythms — the code view panel shows complete Strudel code with: .cutoff(), .delay(), .room(), .euclid(), .scale() etc. on each row's line. Master effects (.djf, .room, .delay) appear on separate lines outside the stack(). Per-row lines have colored left borders. "Read-only" badge visible in header. Copy button copies valid Strudel code.
result: [pending]

### 11. Bonki Reacts to Effects and Sounds
expected: While playing, toggle reverb on a row — Bonki says something like "ooh, spacey!" or "floaty vibes". Change a sound via browser — Bonki reacts ("classic!", "buzzy!", etc.). Change the scale — Bonki comments. Reactions are throttled (no spam on rapid changes) and messages don't repeat back-to-back.
result: [pending]

### 12. Knobs Are Touch-Friendly
expected: All knobs and controls respond to vertical drag (up = increase, down = decrease). Touch targets are large enough to hit without precision. Double-tap resets a knob to its default. Sliders respond to drag. Toggle switches respond to tap.
result: [pending]

## Summary

total: 12
passed: 0
issues: 0
pending: 12
skipped: 0

## Gaps

[none yet]
