---
status: diagnosed
phase: 02-the-board
source: [02-01-SUMMARY.md, 02-02-SUMMARY.md, 02-03-SUMMARY.md]
started: 2026-02-16T19:00:00Z
updated: 2026-02-16T20:10:00Z
---

## Current Test

[testing complete]

## Tests

### 1. BPM Slider
expected: Controls strip visible between tab bar and content. BPM slider ranges 60-180 with numeric readout. Dragging changes tempo in real time while music plays. Slider color shifts from blue (60) through green (120) to red (180).
result: issue
reported: "BPM slider stops the music that is playing and is not real time"
severity: major

### 2. Volume Slider
expected: Volume slider with percentage readout (0-100%). Dragging adjusts master volume of all playing sounds in real time.
result: pass

### 3. 8/16 Step Toggle
expected: Segmented control with "8" and "16" buttons. Active one is highlighted. Clicking "16" expands sequencer grid to 16 columns. Clicking "8" shrinks back. If playing, the pattern updates to match.
result: issue
reported: "it continues to play and can hear the beats doubling but the pads are showing blank still"
severity: major

### 4. Multi-Layer Playback
expected: Toggle some sequencer cells and hit Play. Then switch to PADS tab and tap a pad. Both the sequencer pattern AND the pad sound play simultaneously (layered, not replacing).
result: pass

### 5. Layer Chips
expected: When layers are active, colored chips appear below the controls strip. Each chip shows a name and color dot (sage=sequencer, terracotta=pad, gold=preset). Tapping a chip name solos that layer (others dim). Tapping X removes it.
result: issue
reported: "the little bullet is not changing colors — all chip dots appear the same color regardless of layer type"
severity: cosmetic

### 6. HUSH Nuclear Button
expected: With multiple layers playing, hit HUSH. ALL sound stops immediately. All layer chips disappear. Total silence. Panic button.
result: issue
reported: "hush works but the sequencer pads are still lit — grid cells stay toggled visually after HUSH"
severity: minor

### 7. Bonki BPM Animation Sync
expected: Set BPM to 60 — Bonki nods slowly. Set to 120 — normal bob. Set to 180 — head-banging fast. Speed changes are smooth and match the BPM.
result: pass

### 8. Preset Gallery Visible
expected: In the SEQUENCE tab, a horizontal scrollable gallery of preset cards appears ABOVE the sequencer grid. At least 15 presets visible by scrolling. Each card shows a Bonki album cover with genre-specific art.
result: pass
note: Confirmed visible in screenshot with genre-themed Bonki album covers. Gallery present above sequencer.

### 9. Preset Preview (Tap)
expected: Tapping a preset card plays the preset sound immediately. BPM slider auto-adjusts to the preset's ideal tempo. Music starts.
result: pass

### 10. Preset Add as Layer (+)
expected: The "+" button on a preset card adds it as a layer ON TOP of existing playback. A new layer chip appears. The preset plays alongside whatever was already going.
result: pass

### 11. Bonki Speech Bubble
expected: When a preset loads, Bonki shows a speech bubble with a one-liner (e.g. "ooh, that's my jam"). Bubble auto-dismisses after ~3 seconds.
result: issue
reported: "speech bubble over Bonki is not in the right placement on the page — positioned at bottom-right corner instead of floating near Bonki"
severity: cosmetic

### 12. Code View Panel
expected: A dark terminal-style code panel is always visible — showing syntax-highlighted Strudel code. On desktop/tablet, it sits side-by-side with the instrument. On mobile, stacked below.
result: issue
reported: "the code shown is being truncated off and we can't see the full code -- one of the most important aspects of this build will be the interactive bonki and code -- that's how we get the kids to pay attention and care about the product and about the code"
severity: major

### 13. Live Code Updates
expected: Toggle a sequencer cell — the code view instantly updates to show the new pattern code. Toggle more cells — each change reflects immediately.
result: pass
note: Code-verified — displayCode derived from composeLayerCode(layers) on every render. Code updates visible in screenshot.

### 14. Code Line Flash
expected: When you toggle a sequencer cell, the corresponding line in the code view briefly flashes with a golden glow (~0.6 seconds).
result: pass

### 15. Copy Code Button
expected: Click the copy button in the code view header. The Strudel code is copied to clipboard. Paste it somewhere to verify.
result: pass
note: Code-verified — clipboard API with fallback implemented, button visible in screenshot.

### 16. Code Click Bonki Message
expected: Click anywhere in the code text area. Bonki speech bubble appears: "not yet, human -- I'll teach you soon" (or similar gatekeeping message).
result: pass
note: Confirmed in screenshot — "not yet, human -- I'll teach you soon" bubble visible.

## Summary

total: 16
passed: 10
issues: 6
pending: 0
skipped: 0

## Gaps

- truth: "BPM slider changes tempo in real time during playback (60-180)"
  status: failed
  reason: "User reported: BPM slider stops the music that is playing and is not real time"
  severity: major
  test: 1
  root_cause: "handleBpmChange calls evaluate(setcps(...)) which replaces current pattern instead of adjusting tempo — must re-evaluate all layers after setcps"
  artifacts:
    - path: "homie-beats/src/App.jsx"
      issue: "handleBpmChange only sets CPS, doesn't re-evaluate layers"
  missing:
    - "After setcps, call evaluateAllLayers(layers, volume) to resume playback at new tempo"

- truth: "8/16 step toggle updates grid display and pattern correctly"
  status: failed
  reason: "User reported: it continues to play and can hear the beats doubling but the pads are showing blank still"
  severity: major
  test: 3
  root_cause: "handleStepCountChange updates pattern but React doesn't re-render Sequencer because grid reference hasn't changed — cells 9-16 show blank"
  artifacts:
    - path: "homie-beats/src/App.jsx"
      issue: "Step count change doesn't trigger grid re-render"
    - path: "homie-beats/src/components/Sequencer.jsx"
      issue: "Grid slice may not trigger re-render without stepCount in dependency"
  missing:
    - "Force Sequencer re-render on stepCount change, possibly via key prop or ensuring Sequencer properly responds to stepCount prop changes"

- truth: "Code view panel shows full Strudel code without truncation"
  status: failed
  reason: "User reported: the code shown is being truncated off and we can't see the full code"
  severity: major
  test: 12
  root_cause: ".split-pane-code has overflow:hidden which prevents code-view-pre from scrolling, and code lines use white-space:pre causing horizontal overflow"
  artifacts:
    - path: "homie-beats/src/styles/index.css"
      issue: ".split-pane-code overflow:hidden blocks scrolling"
    - path: "homie-beats/src/styles/code-view.css"
      issue: ".code-line white-space:pre causes horizontal overflow"
  missing:
    - "Change .split-pane-code overflow to auto or visible"
    - "Change .code-line white-space to pre-wrap for line wrapping"

- truth: "Layer chip color dots differentiate by type (sage=sequencer, terracotta=pad, gold=preset)"
  status: failed
  reason: "User reported: all chip dots appear the same color regardless of layer type"
  severity: cosmetic
  test: 5
  root_cause: "CSS color rules for .layer-chip-dot.type-sequencer etc. may have insufficient specificity or layer.type values don't match class names exactly"
  artifacts:
    - path: "homie-beats/src/styles/index.css"
      issue: "Type color CSS rules may be overridden or not matching"
    - path: "homie-beats/src/components/LayerChips.jsx"
      issue: "Verify type-${layer.type} class generation matches CSS selectors"
  missing:
    - "Debug specificity or type string matching, ensure colors apply"

- truth: "Bonki speech bubble positioned near Bonki character"
  status: failed
  reason: "User reported: speech bubble positioned at bottom-right corner instead of floating near Bonki"
  severity: cosmetic
  test: 11
  root_cause: ".bonki-speech uses position:fixed with bottom:70px right:16px — positions relative to viewport, not relative to Bonki's location in Transport bar"
  artifacts:
    - path: "homie-beats/src/styles/index.css"
      issue: ".bonki-speech fixed positioning doesn't track Bonki"
    - path: "homie-beats/src/components/BonkiSpeech.jsx"
      issue: "No positional relationship to Bonki element"
  missing:
    - "Move BonkiSpeech inside Transport/Bonki wrapper with relative positioning, or use absolute positioning relative to Bonki's container"

- truth: "HUSH clears sequencer grid cells in addition to stopping sound and clearing layers"
  status: failed
  reason: "User reported: hush works but sequencer pads are still lit"
  severity: minor
  test: 6
  root_cause: "handleHush clears layers and stops playback but doesn't call setGrid(DEFAULT_GRID) to reset the sequencer grid visual state"
  artifacts:
    - path: "homie-beats/src/App.jsx"
      issue: "handleHush missing setGrid(DEFAULT_GRID)"
  missing:
    - "Add setGrid(DEFAULT_GRID) to handleHush"

- truth: "Sequencer grid should have a way to clear all toggled cells"
  status: failed
  reason: "User reported: there should be a way to clear the sequencer buttons"
  severity: minor
  test: 0
  root_cause: "No clear/reset UI control exists for the sequencer grid"
  artifacts:
    - path: "homie-beats/src/components/Sequencer.jsx"
      issue: "No clear button in component"
    - path: "homie-beats/src/App.jsx"
      issue: "No handleClearGrid function"
  missing:
    - "Add Clear button to Sequencer component"
    - "Create handleClearGrid in App that resets grid and removes sequencer layer"

- truth: "Sequencer cells should flash on the beat and use different colors per sound row"
  status: failed
  reason: "User reported: sequencer buttons should flash and should be different colors"
  severity: minor
  test: 0
  root_cause: "Sequencer cells have no beat-synchronized animation and use a single color for all active cells"
  artifacts:
    - path: "homie-beats/src/styles/index.css"
      issue: "No per-row color variants for .sequencer-cell"
    - path: "homie-beats/src/components/Sequencer.jsx"
      issue: "No playback position tracking or beat sync"
  missing:
    - "Add per-row color CSS using data-row attribute or row-specific classes"
    - "Add beat-synced playback position tracking via BPM-based interval timer"
    - "Add .sequencer-cell.playing flash animation on current beat column"
