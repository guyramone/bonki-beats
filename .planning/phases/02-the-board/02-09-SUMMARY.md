---
phase: 02-the-board
plan: 09
status: complete
---

# 02-09 Summary: Alive Code View

## What Was Built
- Exported ROW_COLORS array from patterns.js (single source of truth for row coloring)
- Complete CodeView rewrite with per-line color borders matching sequencer rows
- Pattern character parsing: x = bright/bold white, ~ = dim/faded gray
- Moving cursor highlights current step position within pattern strings
- Cursor on hit (x) shows colored glow matching the row color via CSS custom property
- Bounce animation (translateY) when a row triggers on beat
- Prism syntax highlighting preserved for non-pattern code parts

## Files Modified
- `homie-beats/src/utils/patterns.js` — ROW_COLORS export
- `homie-beats/src/components/CodeView.jsx` — full rewrite with alive animations
- `homie-beats/src/styles/code-view.css` — bounce keyframe, pattern char styling, cursor glow

## Key Decisions
- Stack parser splits code into individual sound statements for per-line rendering
- innerHTML usage is safe: only Prism.highlight() output and controlled pattern char spans
- Bounce triggers when beatStep matches an 'x' in the row's pattern
- CSS custom property --char-color passes row color to cursor-hit glow
