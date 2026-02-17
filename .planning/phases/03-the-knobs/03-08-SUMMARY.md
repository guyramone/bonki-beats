---
phase: 03-the-knobs
plan: 08
status: complete
commit: daebd6a
---

# Plan 03-08 Summary: Integration — CodeView Rewrite + Bonki Reactions

## What Was Built

### CodeView.jsx (Rewritten for Phase 3)
Full rewrite for positional row matching and Phase 3 code features:
- **Positional matching**: Uses `activeRowIndices` memo to map stack position to actual row index. No more string-matching sound names (which broke when users changed sounds via browser).
- **Master effects lines**: New `type: 'master'` parsed lines for `.djf()`, `.room()`, `.delay()` appearing after stack() close. Styled with purple-tinted border.
- **"Read-only" badge**: Small indicator in header between title and copy button.
- **Rows prop**: New `rows` prop for positional matching, passed from App.jsx.
- **Safety**: All innerHTML usage documented inline. Content comes exclusively from Prism.highlight() on internally-generated code strings and controlled pattern chars ('x' and '~'). No user-supplied content reaches innerHTML.

### code-view.css Updates
- `.code-line-master`: Purple-tinted left border, slightly reduced opacity for visual hierarchy
- `.code-view-readonly`: Small badge styling (uppercase, subtle background)

### Bonki Reaction System (App.jsx)
Comprehensive reaction triggers wired into handlers:
- **Effect activation**: reverb, delay, distortion, filter, lofi categories
- **Sound selection**: synth, soundfont, drumSwap categories
- **Scale changes**: scaleMinor, scaleMajor, scaleExotic based on scale type
- **Euclidean activation**: euclidean category
- **Master effects**: djFilter, reverb, delay categories
- **Throttling**: 3-second cooldown between reactions (bonkiCooldownRef)
- **No repeats**: Tracks last message to avoid back-to-back duplicates
- **Suggestions**: 20% chance after 5+ events, fires 4 seconds after the main reaction
- 14 reaction categories with 3-5 message variants each
- 6 suggestion messages for discovery/education

## Files Changed
- `src/components/CodeView.jsx` (rewritten)
- `src/styles/code-view.css` (master line + readonly badge)
- `src/App.jsx` (rows prop to CodeView, Bonki reaction triggers in 6 handlers)

## Key Decisions
- Positional matching over string matching for robustness with sound browser changes
- Bonki reaction triggers placed after state updates in handlers (React state queued before UI message)
- Cooldown is per-event (not per-category) to keep Bonki responsive but not spammy
- Master effect lines use a distinct purple color to visually separate from row-specific code
- Bonki's "excited" animation state deferred (minor, can be added in Phase 4 polish)

## Integration Status
All Phase 3 plans (03-01 through 03-08) are complete and committed. The codebase builds cleanly (112 modules, 0 errors). Key integration points verified:
- Row model flows through: App state -> codeGenerator -> evaluate() -> Strudel audio
- Effects rack: EffectsRack -> handleEffectChange -> rows state -> codeGenerator
- Master strip: MasterStrip -> handleMasterEffectChange -> masterEffects -> codeGenerator
- Code view: rows + masterEffects -> generateDisplayCode -> CodeView (positional matching)
- Session persistence: all state -> useSessionPersistence -> localStorage
- Bonki: handler events -> triggerBonkiReaction -> showBonkiMessage -> BonkiSpeech
