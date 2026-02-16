# Phase 2: The Board - Context

**Gathered:** 2026-02-15
**Status:** Ready for planning

<domain>
## Phase Boundary

Make HOMIE Beats feel like a real instrument: BPM control, volume, 8/16 step toggle, 15+ eclectic preset patterns with Bonki album covers, a live code view panel, and a full layering system where sequencer + pads + presets all stack. Code view is read-only in this phase (editing comes in Phase 3).

</domain>

<decisions>
## Implementation Decisions

### Controls feel
- **BPM:** Horizontal slider, 60-180 range, always-visible numeric readout ("120 BPM")
- **Volume:** Matching horizontal slider style, always-visible readout
- **8/16 step toggle:** Claude's discretion on toggle vs segmented control — pick what fits the controls strip
- **Controls strip placement:** Dedicated strip above the content area, between tabs and sequencer/pads
- **Visible on ALL tabs** — controls strip shows regardless of active tab
- **BPM changes are instant** — live scrubbing, tempo changes in real time even mid-loop
- **8→16 step expansion behavior:** Claude's discretion — pick the most intuitive for kids (pad with empty steps or double the pattern)
- **BPM extreme feedback:** BOTH color shift on slider at edges AND Bonki's vibe animation speed syncs to tempo (slow nod at 60, head-banging at 180)
- **Volume scope:** Claude's discretion — master volume vs sequencer-only, whichever is simpler and more intuitive
- **Controls strip visual identity:** Claude's discretion — match existing TE aesthetic

### Preset personality
- **Genres:** ALL of them — hip-hop, lo-fi, techno, ambient, weird, afrobeat, chiptune/8-bit, jazz, trap, ambient drone, breakbeat, cartoon bounce, space vibes, video game, dance party, chill. Go wide and eclectic.
- **Count:** 15+ presets minimum
- **Display:** Gallery of cards styled as mini album/CD covers — horizontal scrollable, like flipping through a record crate
- **Album covers:** Pixel art SVGs featuring Bonki in different poses/outfits per genre. Animal Crossing K.K. Slider energy — badass and cute.
- **Naming:** Fun character name + genre subtitle. E.g., "Midnight Purr" (lo-fi hip-hop), "Catnip Chaos" (breakbeat)
- **Loading behavior:** Tap to preview, add action to layer on top of current mix
- **BPM on load:** Auto-sets to preset's ideal tempo, but slider stays live for adjustment
- **Bonki reaction:** Tiny speech bubble with a one-liner when preset loads ("ooh, that's my jam", "spicy choice", etc.)
- **Gallery location:** Inside the SEQUENCE tab, above or alongside the sequencer grid

### Code view design
- **Panel type:** Split pane — instrument and code visible simultaneously
- **Orientation:** Responsive — side by side on tablet/desktop, stacked top/bottom on mobile
- **Visibility:** Always visible (no toggle to hide). Code is always showing.
- **Code updates:** Live — every cell toggle instantly updates the code view. Direct connection between grid and code.
- **Line highlighting:** When a cell is toggled, the corresponding Strudel line flashes/highlights briefly
- **Code depth:** Full Strudel code shown — including stack() wrapper. Real code, nothing hidden.
- **All layers shown:** Code panel displays the complete combined Strudel code for all active layers
- **Styling:** Dark terminal aesthetic — monospace font, darker background than app, standard dark syntax theme (Monokai/One Dark style)
- **Read-only hint:** If someone clicks in the code, Bonki speech bubble says "not yet, human — I'll teach you soon" (teaser for Phase 3 editing)
- **Copy button:** Clipboard icon to copy current Strudel code for pasting into strudel.cc or elsewhere
- **Syntax highlighting:** Standard dark code theme colors (not app accent colors)

### Layer behavior
- **Full layering:** Sequencer loop + pad sounds + preset layers all play simultaneously
- **No layer limit** — stack as many as you want. HUSH is the reset button.
- **Pad behavior:** Pads can loop too (pattern pads like 4-on-floor, hi-hat groove loop on top of sequencer)
- **Layer indicator chips:** Shown above the content area, thin dedicated row
- **Chip interactions:** Tap chip name to solo/un-solo that layer, tap X to remove it entirely
- **Sequencer editing scope:** Claude's discretion — toggling cells should affect just the sequencer layer (presets are separate)
- **HUSH behavior:** Claude's discretion — clear everything vs stop-but-remember, whichever is most intuitive
- **Code view:** Shows all active layers' code combined in one view

### Claude's Discretion
- 8/16 step toggle widget style (toggle button vs segmented control)
- 8→16 step expansion behavior (pad with empty vs double the pattern)
- Controls strip visual identity (label, dividers, etc.)
- Volume scope (master vs sequencer-only)
- HUSH behavior with layers (clear all vs stop-but-remember)
- Sequencer editing scope with active layers

</decisions>

<specifics>
## Specific Ideas

- Preset gallery should feel like flipping through a record crate — horizontal scroll, album cover art as the star
- Bonki album covers in the style of Animal Crossing's K.K. Slider albums — each genre gets Bonki in a different pose/outfit looking badass and cute
- "Midnight Purr", "Catnip Chaos" naming energy — fun character names with genre subtitles
- Code view as dark terminal aesthetic — feels like peeking under the hood
- Bonki gatekeeping the code editor: "not yet, human — I'll teach you soon"
- Bonki's vibe animation speed should sync to BPM — head-banging at 180, slow nod at 60
- Layer chips with solo/remove are like a mini mixer

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-the-board*
*Context gathered: 2026-02-15*
