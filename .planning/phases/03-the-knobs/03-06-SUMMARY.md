---
phase: 03-the-knobs
plan: 06
status: complete
commit: bf6838b
---

# Plan 03-06 Summary: Master Effects Strip + Global Transforms

## What Was Built

### MasterStrip.jsx
Always-visible horizontal bar above the transport with:
- **DJ Filter** (featured, 56px knob): Single-knob LP-to-HP sweep using `.djf()`. Color interpolates warm (LP) to cool (HP). Shows "FLAT" at center, "LP N%" / "HP N%" at extremes.
- **Master FX**: Reverb (VERB) and Delay (ECHO) knobs, 40px each
- **Global Transforms**: Swing and Probability knobs, 40px each
- **Master Volume**: Slider at right edge
- Compact 60px height, scrollable middle section on mobile

### DJFilter.jsx
Specialized single-knob component wrapping Knob:
- Value 0-1 maps to `.djf()` (0=bass only, 0.5=bypass, 1=treble only)
- Color gradient: warm red/orange at LP, cool blue/cyan at HP
- Double-tap resets to 0.5 (bypass)

### TransformControls.jsx
Per-row pattern transform panel (renders inside EffectsRack):
- Swing (Knob, 0-1), Probability/degradeBy (Knob, 0-1), Speed (+/- stepped buttons), Reverse (ToggleSwitch)
- Shows "G" badge when using global default, no badge when overridden
- Double-tap overridden knob reverts to global

### master-strip.css
- Responsive layout with mobile/tablet/desktop breakpoints
- Hidden scrollbar for middle section
- Separator lines between control groups

### App.jsx Wiring
- `masterEffects` state: `{ djf: 0.5, room: 0, delay: 0, volume: 1 }`
- `globalTransforms` state: `{ swing: 0, degradeBy: 0, speed: 1, reverse: false }`
- `handleMasterEffectChange(param, value)` and `handleGlobalTransformChange(param, value)` handlers
- MasterStrip rendered above transport bar
- `globalTransforms` passed through Sequencer to EffectsRack to TransformControls

### codeGenerator.js Update
- `generateDisplayCode` now accepts and renders masterEffects
- Master effects (.djf, .room, .delay) appear on separate lines after stack()

## Files Changed
- `src/components/MasterStrip.jsx` (new)
- `src/components/DJFilter.jsx` (new)
- `src/components/TransformControls.jsx` (new)
- `src/styles/master-strip.css` (new)
- `src/App.jsx` (wiring)
- `src/main.jsx` (CSS import)
- `src/components/EffectsRack.jsx` (TransformControls section)
- `src/components/Sequencer.jsx` (globalTransforms passthrough)
- `src/utils/codeGenerator.js` (masterEffects in display code)
- `src/styles/effects-rack.css` (transform controls styles)

## Key Decisions
- DJ filter uses `.djf()` method applied outside `stack()` for whole-mix effect
- Per-row transforms override global with null-means-use-global pattern
- Speed control uses discrete steps (0.25, 0.5, 1, 2, 4) via +/- buttons instead of continuous knob
