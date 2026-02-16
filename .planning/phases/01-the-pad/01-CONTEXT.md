# Phase 1 Context: HOMIE Beats

## Design Decisions (from discuss phase)

### Visual Direction
- **Primary reference:** Teenage Engineering — fun and campy without being obnoxious, purposeful with whimsy
- **Secondary reference:** Retro pixel art + anime/Studio Ghibli style animations
- **Result:** Clean, minimal Scandinavian layout (TE) with hand-drawn pixel art warmth (Ghibli). The interface is precise and functional, but the artwork has soul.
- **NOT:** Generic dark-mode music app. NOT childish/cartoony. NOT sterile/clinical.

### Interaction Model
- **Hybrid:** Step sequencer for building patterns + pad triggers for live jamming
- **Navigation:** Tabbed views — SEQUENCE | PADS | AI
- **Philosophy:** Simple on the surface, depth underneath for those who dig

### Primary User
- **The whole family equally** — layers of complexity
- **MVP proof-of-concept moment:** "Moony or Nene sit down, figure it out without help, and make something they're proud of"

### HOMIE AI Personality
- **Role:** DJ partner — active collaborator, not a teacher or tool
- **Presence:** Pixel art Bonki character + chat panel (both)
- **Character:** Based on Bonki, the family's late Scottish Fold cat
  - All black, fold ears, big golden eyes, headphones
  - Jiji from Kiki's Delivery Service energy
  - Cool, warm, not overly chatty
  - Has opinions about beats
  - Never annoying, never in the way

### Sound Palette
- **Eclectic / everything** — 808 kicks, acoustic samples, synths, weird sounds
- Something for every mood. Let the user explore.

### Name
- **HOMIE Beats** — confirmed

### Ecosystem & Distribution
- **Devices:** macOS (Macs), iPads, Apple Watch, Linux gaming desktop
- **Access:** Both — hosted version (GitHub Pages) for everyday use + local dev version for hacking
- **PWA required:** Must install as home screen app on iPad, desktop bookmark on Mac/Linux
- **Apple Watch:** Notifications only (e.g. "someone started a jam session"). Not a control surface.
- **Principle:** Everything works harmoniously across the whole HOMIE household. Zero friction.
- **Deployment:** Static site on GitHub Pages = works everywhere with a browser. No server dependency.

### Step Sequencer
- **8 steps default** with option to expand to 16 for those who want it (progressive disclosure)

### Bonki Character
- **Present from Phase 1** — visible from day one, reacting to music
- Full AI chat comes in Phase 3, but Bonki is already vibing in the corner

## Gray Areas to Resolve During Build

- Exact tab layout and proportions (resolve in Phase 1 build)
- How Bonki character is rendered (CSS pixel art? PNG sprite sheet? Canvas?)
- Exact font choices (TE uses Univers — we need something similar but free)
- PWA manifest and service worker scope (resolve in build)
- GitHub Pages deploy config (resolve at end of Phase 1)

## Success Criteria for Phase 1
From Chris directly: **"Kids build a beat without help"**

This means the UI must be:
1. Self-explanatory — no instruction needed
2. Immediately rewarding — sound happens fast
3. Forgiving — no wrong moves, everything sounds at least okay
4. Beautiful — it should make them WANT to touch it
5. Works on every device in the house — Mac, iPad, Linux desktop
6. Installable as a PWA on iPad home screen
