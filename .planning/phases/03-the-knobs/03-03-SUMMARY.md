---
phase: 03-the-knobs
plan: 03
subsystem: ui, audio
tags: [sound-browser, categories, soundfonts, drum-machines, synth-engines, favorites, recents, localStorage]

# Dependency graph
requires:
  - phase: 03-the-knobs
    provides: "Row model with sound object (type/bank/name/n shape)"
provides:
  - "SoundBrowser modal with 3-level drill-down (Category > Bank > Sound)"
  - "SoundCategoryGrid with 11 colorful category tiles"
  - "soundCatalog.js: SOUND_CATEGORIES, getSoundsForBank, getRandomSound, soundToLabel, soundToKey"
  - "useSoundBrowser hook: navigation state, favorites, recents with localStorage persistence"
  - "@strudel/soundfonts registered on audio init (128 GM instruments available)"
  - "Tap-to-preview and double-tap-to-select interaction pattern"
  - "Dice button for random sound discovery"
  - "Bonki category-based reactions on sound selection"
affects: [03-04, 03-05, 03-06, 03-07, 03-08]

# Tech tracking
tech-stack:
  added: ["@strudel/soundfonts@1.3.0"]
  patterns: ["Three-level drill-down modal", "Tap/double-tap interaction", "localStorage-persisted favorites/recents", "Category-based Bonki reaction pools"]

key-files:
  created:
    - "homie-beats/src/utils/soundCatalog.js"
    - "homie-beats/src/hooks/useSoundBrowser.js"
    - "homie-beats/src/components/SoundBrowser.jsx"
    - "homie-beats/src/components/SoundCategoryGrid.jsx"
    - "homie-beats/src/styles/sound-browser.css"
  modified:
    - "homie-beats/src/main.jsx"
    - "homie-beats/src/App.jsx"
    - "homie-beats/src/components/RowControls.jsx"
    - "homie-beats/package.json"

key-decisions:
  - "Sound selector pill on RowControls shows soundToLabel() (actual source name) instead of row instrument label"
  - "Favorites stored as Set of soundToKey strings (type:bank:name:n format) for fast lookup"
  - "Recents cap at 20 entries, deduped on push, stored as sound objects in localStorage"
  - "Dice button uses 2-tap pattern: first tap = preview random, second tap = confirm selection"
  - "Category-based Bonki reaction pools with 3-5 phrases per category for variety"

patterns-established:
  - "soundToKey format: 'type:bank:name:n' -- canonical sound identifier for favorites/recents"
  - "Sound object shape: { type: 'sample'|'synth'|'soundfont', bank: string, name: string, n: number }"
  - "Modal slide-up animation: @keyframes slideUp from translateY(100%) to translateY(0)"
  - "hooks/ directory created for custom React hooks (useSoundBrowser first entry)"

# Metrics
duration: 431s (7m 11s)
completed: 2026-02-17
---

# Phase 3 Plan 03: Sound Browser Summary

**Full-screen sound browser modal with 11-category visual grid, 20+ drum machines, 7 synth engines, 128 GM soundfonts, tap-to-preview/double-tap-to-select, favorites, recents, and dice button**

## Performance

- **Duration:** 431s (7m 11s)
- **Started:** 2026-02-17T05:00:21Z
- **Completed:** 2026-02-17T05:07:32Z
- **Tasks:** 2
- **Files modified:** 9

## Accomplishments
- 11-category sound catalog with 20+ drum machines (TR-808, TR-909, LinnDrum, DMX, SP-12, etc.), 7 synth engines (sawtooth, square, sine, triangle, supersaw, pink/white noise), and 128 GM soundfonts across Keys, Strings, Bass, Brass, Woodwinds, Pads, World, Weird, Percussion
- Full-screen modal with three-level drill-down: colorful category tiles > bank list > sound items
- Tap-to-preview plays one-shot, double-tap-to-select commits to row and closes browser
- Favorites (heart toggle) and Recents (auto-tracked last 20) with localStorage persistence
- Dice button for random sound discovery with 2-tap confirm pattern
- Bonki category-based personality reactions ("classic!", "buzzy!", "bonkers!", etc.)
- @strudel/soundfonts registered on audio init (GM instruments lazy-load from CDN on first use)
- RowControls sound selector pill shows actual sound source name via soundToLabel()

## Task Commits

Each task was committed atomically:

1. **Task 1: Build sound catalog data and browser hook** - `891d2d2` (feat)
2. **Task 2: Build SoundBrowser modal and SoundCategoryGrid components** - `26d10aa` (feat)

## Files Created/Modified
- `homie-beats/src/utils/soundCatalog.js` - SOUND_CATEGORIES (11 categories), getSoundsForBank, getRandomSound, soundToLabel, soundToKey, getCategoryForBank
- `homie-beats/src/hooks/useSoundBrowser.js` - Custom hook: 3-level navigation, favorites Set, recents array, localStorage persistence
- `homie-beats/src/components/SoundBrowser.jsx` - Full-screen modal: category grid, bank list, sound items with preview/select/favorite/dice
- `homie-beats/src/components/SoundCategoryGrid.jsx` - Responsive CSS grid of colorful category tiles
- `homie-beats/src/styles/sound-browser.css` - Modal overlay, slide-up animation, category tiles, bank rows, sound items, dice button
- `homie-beats/src/main.jsx` - @strudel/soundfonts registration on audio init + sound-browser.css import
- `homie-beats/src/App.jsx` - SoundBrowser state (open/rowIndex), handleOpenSoundBrowser, handleSoundSelect, handleCloseSoundBrowser
- `homie-beats/src/components/RowControls.jsx` - Sound selector pill shows soundToLabel() instead of row label
- `homie-beats/package.json` - Added @strudel/soundfonts@1.3.0

## Decisions Made
- **Sound selector pill shows soundToLabel():** The pill on each row shows the actual sound source (e.g., "TR-808 Bass Drum") rather than the instrument role label ("Kick"). This makes it clear what bank/sound is loaded and hints that tapping it opens the browser.
- **Favorites as Set<string>:** Using a Set with soundToKey strings ("type:bank:name:n") for O(1) lookup. Persisted as JSON array in localStorage.
- **Recents cap at 20:** Keeps the recents section manageable. New selections push to front, duplicates removed.
- **Dice 2-tap pattern:** First dice tap = preview random sound + show Bonki reaction. Second tap = confirm and select. Prevents accidental sound replacement.
- **Category-based Bonki reactions:** 11 reaction pools with 3-5 phrases each (drums="classic!", synths="buzzy!", weird="bonkers!") for personality variety without AI.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Sound browser fully wired into sequencer rows via App state
- Any row's sound can be swapped to any of 600+ drum samples, 7 synth engines, or 128 GM soundfonts
- Favorites and recents persist across sessions
- Code generator in codeGenerator.js already handles all three sound types (sample, synth, soundfont)
- Ready for effects rack (03-04), scale picker (03-05), euclidean control (03-06), and master strip (03-07)

## Self-Check: PASSED

All 6 key files verified present. Both task commits (891d2d2, 26d10aa) verified in git log. Build compiles cleanly (`npx vite build` succeeds).

---
*Phase: 03-the-knobs*
*Completed: 2026-02-17*
