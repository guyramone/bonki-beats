# Phase 1 Research: The Pad

**Date:** 2026-02-15
**Phase:** 1 - The Pad
**Researcher:** HOMIE (gsd-phase-researcher)

---

## Executive Summary

Phase 1 builds a self-contained, touch-optimized beatpad using Vite + React + @strudel/web, deployable to GitHub Pages as a PWA. This research covers the Strudel API surface, PWA architecture, responsive touch design, pixel art rendering, and deployment strategy needed to execute all 4 plans.

**Key finding:** @strudel/web provides a zero-config entry point (`initStrudel()`, `evaluate()`, `hush()`) that abstracts the complexity of Strudel's pattern engine, making it perfect for the beatpad UI. The architecture is client-side static — no backend required — which aligns perfectly with GitHub Pages deployment.

---

## 1. Strudel Integration

### Core API (from @strudel/web)

**Source:** `/Users/guyramone/strudel/packages/web/web.mjs`

The three functions you'll use:

```javascript
import { initStrudel, evaluate, hush } from '@strudel/web';

// 1. Initialize (call once, returns a Promise)
await initStrudel({
  prebake: () => samples('github:tidalcycles/dirt-samples')
});

// 2. Play patterns (from user actions)
await evaluate('s("bd sd hh sd")'); // autoplay = true by default

// 3. Stop everything
hush();
```

#### initStrudel(options)

- **Purpose:** Loads Strudel modules, registers synth sounds, initializes Web Audio, loads samples
- **Options:**
  - `prebake`: Async function to run after default initialization (e.g., loading sample banks)
  - `miniAllStrings`: Defaults to `true` — enables mini notation for all strings
- **Returns:** Promise that resolves when initialization is complete
- **Critical:** Must be called BEFORE any audio playback (requires user gesture due to browser autoplay policy)

#### evaluate(code, autoplay = true)

- **Purpose:** Takes Strudel pattern code string, transpiles it, and plays it
- **Parameters:**
  - `code`: String of Strudel pattern code (e.g., `'s("bd sd")'`)
  - `autoplay`: Boolean (default `true`) — whether to start playing immediately
- **Returns:** Promise
- **Use case:** Pads trigger this with pre-written patterns; sequencer builds patterns from UI state

#### hush()

- **Purpose:** Stops all sound immediately (panic button)
- **Implementation:** Calls `repl.stop()` under the hood
- **No parameters, no return value**

### Pattern API (JavaScript, not string evaluation)

**Source:** `/Users/guyramone/strudel/packages/web/web.mjs` (lines 50-58)

You can also build patterns directly in JavaScript:

```javascript
import { note, s } from '@strudel/web';

// Pattern.prototype.play() is added by @strudel/web
note('<c a f e>(3,8)').jux(rev).play();
s('bd sd').play();
```

**This is useful for:**
- Sequencer grid → generate pattern code from cell states
- Pad triggers → call `.play()` on pre-built patterns

### Sample Banks & Sounds

**Source:** Research of tidal-drum-machines.json + Strudel docs

#### Pre-loaded by default (via `registerSynthSounds()`):
- Waveforms: `sawtooth`, `square`, `triangle`, `sine`

#### Available via `samples()` in prebake:

**Tidal Drum Machines** (loaded from `https://raw.githubusercontent.com/felixroos/dough-samples/main/tidal-drum-machines.json`):

Pattern: `{ s: 'bd', bank: 'RolandTR808' }` = `{ s: 'RolandTR808_bd' }`

| Machine | Bass Drums | Snares | Hi-Hats (closed) | Other Sounds |
|---------|------------|--------|------------------|--------------|
| **RolandTR808** | 25 variations | 25 variations | 1 | Claps, toms (H/M/L), clave, cowbell, cymbals |
| **RolandTR909** | 4 variations | 15 variations | 4 variations | Toms (H/M/L - 8 each), ride, crash, claps |

**Sound abbreviations:**
- `bd` = Bass drum
- `sd` = Snare drum
- `hh` = Closed hi-hat
- `oh` = Open hi-hat
- `cp` = Clap
- `cr` = Crash cymbal
- `ht/mt/lt` = High/mid/low tom
- `rd` = Ride cymbal
- `rim` = Rimshot
- `cb` = Cowbell

**Example usage in patterns:**
```javascript
// Use default sample (index 0)
s('RolandTR808_bd RolandTR909_sd RolandTR808_hh')

// Use specific variation
s('RolandTR808_bd:3 RolandTR909_sd:5')

// Or use bank shorthand
s('bd sd hh').bank('RolandTR808')
```

#### Recommended prebake for Phase 1:

```javascript
initStrudel({
  prebake: async () => {
    await samples('https://raw.githubusercontent.com/felixroos/dough-samples/main/tidal-drum-machines.json');
  }
});
```

This loads the entire tidal-drum-machines library (~many MB), which includes TR-808, TR-909, and 20+ other classic drum machines. **Trade-off:** Large download, but rich eclectic sound palette from day one.

**Alternative (lightweight):** Load only specific sounds via custom sample map in prebake. Defer to Plan 01-01 for final decision.

---

## 2. PWA Architecture

### vite-plugin-pwa (Zero-Config PWA)

**Sources:**
- [Vite Plugin PWA Guide](https://vite-pwa-org.netlify.app/guide/)
- [GitHub - vite-pwa/vite-plugin-pwa](https://github.com/vite-pwa/vite-plugin-pwa)
- Strudel's implementation: `/Users/guyramone/strudel/website/astro.config.mjs`

#### Installation:
```bash
npm i vite-plugin-pwa -D
```

#### Vite Config (from Strudel example):

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      workbox: {
        maximumFileSizeToCacheInBytes: 4194304, // 4MB (Strudel caches audio)
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,wav,mp3,ogg,ttf,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/raw\.githubusercontent\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'github-samples-cache',
              expiration: { maxEntries: 500, maxAgeSeconds: 60 * 60 * 24 * 30 }, // 30 days
            },
          },
        ],
      },
      manifest: {
        name: 'HOMIE Beats',
        short_name: 'Beats',
        description: 'Visual beatpad + DJ sidekick',
        theme_color: '#000000',
        background_color: '#000000',
        display: 'standalone',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
});
```

#### What this gives you:
- **Auto-generated manifest.json** in `/dist`
- **Service worker** that caches app shell and static assets
- **Auto-update behavior** (when you deploy a new version, SW updates on next visit)
- **Installable on iOS/Android/Desktop** ("Add to Home Screen")

#### iOS Safari specifics (from Strudel docs):
1. Open in Safari
2. Tap Share button → "Add to Home Screen"
3. App opens in fullscreen (no Safari chrome)
4. Cached for offline use

#### Runtime caching strategy:
- **App shell** (HTML/CSS/JS): Precached during SW install
- **GitHub-hosted samples**: CacheFirst (cache, then network if miss) — persists for 30 days
- **Everything else**: Network-first (or configure as needed)

**Key constraint:** Service workers require HTTPS. GitHub Pages provides this by default. Local dev can use `vite --host` (http://localhost works for SW in dev mode).

---

## 3. Responsive Touch Design

### Touch Target Standards

**Sources:**
- [UXPin: Responsive Design for Touch Devices](https://www.uxpin.com/studio/blog/responsive-design-touch-devices-key-considerations/)
- [LogRocket: All Accessible Touch Target Sizes](https://blog.logrocket.com/ux-design/all-accessible-touch-target-sizes/)
- [Smashing Magazine: Accessible Target Sizes Cheatsheet](https://www.smashingmagazine.com/2023/04/accessible-tap-target-sizes-rage-taps-clicks/)

#### Minimum touch target size:
- **Apple:** 44px × 44px
- **Google:** 48px × 48px
- **Recommendation for Phase 1:** **48px minimum** for all tappable elements (pads, buttons, tabs)

#### Implementation strategy (visual vs. tappable):
You can keep a sleek 24px icon while expanding its tappable area to 48px using padding:

```css
.pad {
  width: 24px;
  height: 24px;
  padding: 12px; /* Expands tappable area to 48px */
  background: var(--pad-color);
  border: none;
  cursor: pointer;
}
```

**Spacing:** Touch targets should be spaced about 8px apart (horizontally and vertically) to avoid accidental taps.

#### iPad Safari specifics:
- **Viewport meta tag required:**
  ```html
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  ```
  (Disable zoom if you want precise touch control, or allow zoom for accessibility — decide in Plan 01-02)

- **:active state activation:** Safari on iOS requires a `touchstart` listener on the body to properly activate `:active` pseudo-class. Add this to your main JS:
  ```javascript
  document.body.addEventListener('touchstart', () => {}, { passive: true });
  ```

#### Responsive breakpoints for Phase 1:
- **Mobile portrait (iPhone/small screens):** 320px - 767px
- **Tablet portrait (iPad):** 768px - 1024px
- **Desktop (Mac, Linux):** 1025px+

**Layout strategy:**
- Use CSS Grid for sequencer (scales with viewport)
- Use Flexbox for transport controls (stacks on mobile)
- Test on iPad Safari (primary device per context) + Mac/Linux browsers

---

## 4. Visual Design: Teenage Engineering Aesthetic

### Typography

**Source:** [Fonts In Use - Teenage Engineering](https://fontsinuse.com/designers/23611/teenage-engineering)

TE uses **Univers** font family — a classic geometric sans-serif. This is a commercial font, so you'll need a free alternative.

#### Free alternatives to Univers:
- **Inter** — modern, geometric, optimized for screens, variable font (recommended)
- **Space Grotesk** — geometric sans, slightly quirky warmth (fits Ghibli vibe)
- **DM Sans** — clean, geometric, good range of weights

**Recommendation for Phase 1:** Use **Inter** (loads from Google Fonts or self-host via npm). It's the closest free equivalent to Univers and is designed for UI.

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

```css
:root {
  --font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

body {
  font-family: var(--font-primary);
  font-weight: 400;
  font-size: 16px;
  line-height: 1.5;
}
```

#### Typography hierarchy (TE-inspired):
- **Large labels (tabs, titles):** 16px, font-weight 600, uppercase, letter-spacing 0.05em
- **Controls (buttons, labels):** 14px, font-weight 500
- **Small labels (hints, details):** 12px, font-weight 400

### Color Palette (TE-inspired dark theme)

TE products use:
- **Black backgrounds** (#000 or #0a0a0a)
- **White/light gray text** (#fff or #e0e0e0)
- **Accent colors:** Muted, functional (not neon) — think terracotta, sage green, dusty blue
- **High contrast for readability**

**Proposed palette for Phase 1:**

```css
:root {
  /* Backgrounds */
  --bg-primary: #0a0a0a;
  --bg-secondary: #1a1a1a;
  --bg-tertiary: #2a2a2a;

  /* Text */
  --text-primary: #ffffff;
  --text-secondary: #a0a0a0;
  --text-tertiary: #707070;

  /* Accents */
  --accent-primary: #f5a623; /* Bonki's golden eyes — use sparingly */
  --accent-warm: #d97757;    /* Terracotta — for active pads */
  --accent-cool: #6b9080;    /* Sage green — for transport controls */

  /* States */
  --state-active: var(--accent-warm);
  --state-inactive: var(--bg-tertiary);
  --state-hover: var(--bg-secondary);
}
```

**Design principles from TE:**
- **Minimal visual noise** — clean, purposeful layout
- **Functional color** — color indicates state, not decoration
- **Generous whitespace** — let elements breathe
- **Precise alignment** — everything on a grid

---

## 5. Pixel Art Character: Bonki

### Rendering Strategy (CSS vs. Canvas)

**Sources:**
- [CSS-Tricks: Fun Times With CSS Pixel Art](https://css-tricks.com/fun-times-css-pixel-art/)
- [LogRocket: Designing Pixel Art Using CSS Only](https://blog.logrocket.com/designing-pixel-art-css-only/)
- [Animating Sprites with CSS and React](https://alechorner.com/blog/animating-pixel-sprites-with-css)

#### Option A: CSS Pixel Art (Pure CSS, no images)
- Use `box-shadow` to draw individual pixels
- Each pixel = one box-shadow entry
- **Pros:** No image files, fully scalable, easy to animate states via CSS classes
- **Cons:** 32x32 sprite = 1024 pixels = massive CSS. Performance?

**Example (simplified):**
```css
.bonki-sprite {
  width: 1px;
  height: 1px;
  box-shadow:
    0 0 0 #1a1a1a,   /* pixel 1 */
    1px 0 0 #1a1a1a, /* pixel 2 */
    2px 0 0 #f5a623, /* pixel 3 (eye) */
    /* ...1021 more pixels */
  ;
  transform: scale(4); /* Scale up for visibility */
  image-rendering: pixelated;
}
```

**Verdict:** Possible but unwieldy for 32x32. Better for smaller sprites (8x8).

#### Option B: PNG Sprite Sheet (Recommended)
- Design Bonki in pixel art tool (Aseprite, Pixaki, Piskel)
- Export sprite sheet (e.g., 6 frames × 32x32 = 192x32 PNG)
- Animate via CSS `background-position`

**Example sprite sheet structure:**

```
[idle-1][idle-2][vibing-1][vibing-2][listening][thinking]
 32x32   32x32    32x32     32x32     32x32      32x32
```

**CSS animation:**
```css
.bonki {
  width: 32px;
  height: 32px;
  background-image: url('/bonki-sprite.png');
  background-size: 192px 32px; /* 6 frames × 32px */
  image-rendering: pixelated; /* CRITICAL for crisp pixels */
  transform: scale(2); /* Display at 64px */
}

.bonki.idle {
  animation: bonki-idle 1s steps(2) infinite;
}

@keyframes bonki-idle {
  from { background-position: 0 0; }
  to { background-position: -64px 0; } /* 2 frames × 32px */
}

.bonki.vibing {
  animation: bonki-vibing 0.5s steps(2) infinite;
}

@keyframes bonki-vibing {
  from { background-position: -64px 0; }
  to { background-position: -128px 0; }
}
```

**Key CSS property:** `image-rendering: pixelated;` — prevents browser from anti-aliasing when scaling (keeps sharp pixel edges).

**Verdict:** Best balance of file size, performance, and art flexibility. Defer sprite sheet creation to Plan 01-04.

#### Option C: Canvas Rendering
- Draw pixels directly to `<canvas>` via JavaScript
- **Pros:** Full programmatic control, could generate Bonki procedurally
- **Cons:** Overkill for static sprite. Use if you want real-time pixel manipulation (e.g., color shifting based on BPM)

**Verdict:** Not needed for Phase 1. Revisit in Phase 4 if you want advanced effects.

### Animation States (from CHARACTER.md)

Reference: `/Users/guyramone/Desktop/Desktop - Mac/HOMIES/homie-beats/.planning/CHARACTER.md`

**Phase 1 priority:**
1. **Idle** (default) — slow blink, occasional ear twitch (2 frames, loop)
2. **Vibing** (when playing) — head bob synced to BPM (2-4 frames, loop)

**Deferred to Phase 3+:**
- Listening, Excited, Thinking, Sleeping (require AI integration or advanced user interaction)

**Implementation note:** React state drives CSS class:
```javascript
const [bonkiState, setBonkiState] = useState('idle');

// When play button clicked:
setBonkiState('vibing');

// In render:
<div className={`bonki ${bonkiState}`} />
```

---

## 6. Sequencer + Pad Grid UI

### Sequencer: 8-Step Grid (4 Sounds)

**Layout:**
- 4 rows (sounds) × 8 columns (steps)
- Each cell = toggleable button (on/off)
- Cell state → pattern code

**Data structure:**
```javascript
const [sequencer, setSequencer] = useState([
  [false, false, false, false, false, false, false, false], // Row 1: Kick
  [false, false, false, false, false, false, false, false], // Row 2: Snare
  [false, false, false, false, false, false, false, false], // Row 3: Hi-hat
  [false, false, false, false, false, false, false, false], // Row 4: Clap
]);

// Sound mapping
const sounds = [
  { name: 'Kick', pattern: 'RolandTR808_bd' },
  { name: 'Snare', pattern: 'RolandTR909_sd' },
  { name: 'Hi-hat', pattern: 'RolandTR808_hh' },
  { name: 'Clap', pattern: 'RolandTR808_cp' },
];
```

**Pattern generation function:**
```javascript
function sequencerToPattern(grid, sounds) {
  const patterns = grid.map((row, i) => {
    const steps = row.map(active => active ? 'x' : '~').join(' ');
    return `s("${sounds[i].pattern}").struct("${steps}")`;
  });
  return `stack(${patterns.join(', ')})`;
}

// Example output for kick on 1,5 and snare on 3,7:
// stack(
//   s("RolandTR808_bd").struct("x ~ ~ ~ x ~ ~ ~"),
//   s("RolandTR909_sd").struct("~ ~ x ~ ~ ~ x ~"),
//   s("RolandTR808_hh").struct("~ ~ ~ ~ ~ ~ ~ ~"),
//   s("RolandTR808_cp").struct("~ ~ ~ ~ ~ ~ ~ ~")
// )
```

**Mini notation primer:**
- `x` = trigger sound on this step
- `~` = rest (silence) on this step
- `.struct()` = apply rhythmic structure to a sound

### Pads: 4×4 Grid (16 Pads)

**Layout:**
- 4 rows × 4 columns of tappable pads
- Each pad triggers a pre-built pattern instantly

**Data structure:**
```javascript
const pads = [
  { id: 0, label: 'Kick', pattern: 's("RolandTR808_bd")' },
  { id: 1, label: 'Snare', pattern: 's("RolandTR909_sd")' },
  { id: 2, label: 'Hi-hat', pattern: 's("RolandTR808_hh")' },
  { id: 3, label: 'Clap', pattern: 's("RolandTR808_cp")' },
  { id: 4, label: 'Kick Fill', pattern: 's("RolandTR808_bd(3,8)")' },
  // ...12 more pads
];
```

**Interaction:**
```javascript
function handlePadTap(pad) {
  evaluate(pad.pattern); // Strudel's evaluate()
}
```

**Visual feedback:**
- Active state: Apply `.active` class when tapped (CSS transitions)
- Use CSS `transform: scale(0.95)` on tap for tactile feel
- Color shift via CSS variables (e.g., `--state-active`)

**Accessibility:**
- Each pad = `<button>` element (keyboard accessible)
- ARIA labels: `aria-label={pad.label}`
- Touch target = 48px minimum (grid math: `calc((100vw - padding) / 4)` on mobile, larger on desktop)

---

## 7. Tabbed Navigation

### UI Structure

**Layout:**
```
┌─────────────────────────────────────┐
│ [SEQUENCE] [PADS] [AI]              │ ← Tab bar (sticky top)
├─────────────────────────────────────┤
│                                     │
│                                     │
│         Active tab content          │
│                                     │
│                                     │
├─────────────────────────────────────┤
│ [▶ Play] [⏹ Stop] [HUSH]  Bonki 🐈  │ ← Transport controls (sticky bottom)
└─────────────────────────────────────┘
```

**React state:**
```javascript
const [activeTab, setActiveTab] = useState('SEQUENCE');

function renderTab() {
  switch (activeTab) {
    case 'SEQUENCE': return <SequencerView />;
    case 'PADS': return <PadsView />;
    case 'AI': return <AIPlaceholder />; // Phase 1: "Coming soon"
  }
}
```

**CSS:**
- Tab bar = `position: sticky; top: 0;`
- Transport controls = `position: sticky; bottom: 0;`
- Main content = `flex: 1; overflow-y: auto;`

**Tab styling (TE-inspired):**
```css
.tab-button {
  padding: 12px 20px;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  font-size: 16px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.tab-button.active {
  color: var(--text-primary);
  border-bottom-color: var(--accent-primary);
}

.tab-button:hover {
  color: var(--text-primary);
}
```

---

## 8. Transport Controls

### Required Buttons (Phase 1)

1. **Play** — Start/resume playback
2. **Stop** — Pause playback (resume from same position on next play)
3. **HUSH** — Panic button (stops all sound immediately, resets pattern)

**Note:** Play/Stop use Strudel's internal scheduler state. HUSH calls `hush()` function.

**Implementation:**
```javascript
import { evaluate, hush } from '@strudel/web';

// Strudel manages play state internally via repl.setPattern()
// You don't need a manual "isPlaying" state for evaluate()

function handlePlay() {
  const pattern = sequencerToPattern(sequencer, sounds);
  evaluate(pattern); // Starts playing
}

function handleHush() {
  hush(); // Stops immediately
}
```

**CSS (TE-inspired minimal buttons):**
```css
.transport-button {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid var(--text-primary);
  background: transparent;
  color: var(--text-primary);
  font-size: 20px;
  cursor: pointer;
  transition: all 0.15s;
}

.transport-button:hover {
  background: var(--bg-secondary);
  transform: scale(1.05);
}

.transport-button:active {
  transform: scale(0.95);
}

.transport-button.hush {
  border-color: var(--accent-warm);
  color: var(--accent-warm);
}
```

**Layout:**
```javascript
<div className="transport-controls">
  <button className="transport-button" onClick={handlePlay} aria-label="Play">
    ▶
  </button>
  <button className="transport-button" onClick={hush} aria-label="Stop all sounds">
    ⏹
  </button>
  <button className="transport-button hush" onClick={hush} aria-label="Hush (panic stop)">
    HUSH
  </button>
</div>
```

---

## 9. GitHub Pages Deployment

### Vite Configuration for GitHub Pages

**Sources:**
- [Vite: Deploying a Static Site](https://vite.dev/guide/static-deploy)
- [Deploying Vite to GitHub Pages with a Single GitHub Action](https://savaslabs.com/blog/deploying-vite-github-pages-single-github-action)
- [Medium: Deploying Vite App to GitHub Pages](https://medium.com/@aishwaryaparab1/deploying-vite-deploying-vite-app-to-github-pages-166fff40ffd3)

**Critical:** GitHub Pages serves repos at `https://guyramone.github.io/HOMIES/` (not root), so Vite needs a base path.

**vite.config.js:**
```javascript
export default defineConfig({
  base: '/HOMIES/', // MUST match repo name
  plugins: [react(), VitePWA({ /* ... */ })],
});
```

**Build command:**
```bash
npm run build
# Output: dist/
```

**Deploy via GitHub Actions (recommended):**

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: ['main']
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

**One-time GitHub setup:**
1. Repo Settings → Pages → Source: "GitHub Actions"
2. Push to `main` → auto-deploy

**Test locally before deploy:**
```bash
npm run build
npm run preview # Serves dist/ with correct base path
```

**Domain:** App will be live at `https://guyramone.github.io/HOMIES/` (or `https://guyramone.github.io/homie-beats/` if you move it to its own repo later).

---

## 10. Vite Project Structure (Recommended)

```
homie-beats/
├── public/
│   ├── icon-192.png          # PWA icon (generated from Bonki pixel art)
│   ├── icon-512.png
│   └── bonki-sprite.png      # Pixel art sprite sheet
├── src/
│   ├── main.jsx              # Entry point: initStrudel() + React render
│   ├── App.jsx               # Main app shell (tabs, transport, Bonki)
│   ├── components/
│   │   ├── Sequencer.jsx     # 8-step grid
│   │   ├── Pads.jsx          # 4x4 pad grid
│   │   ├── Transport.jsx     # Play/stop/hush controls
│   │   ├── Bonki.jsx         # Pixel art character component
│   │   └── TabBar.jsx        # SEQUENCE | PADS | AI tabs
│   ├── styles/
│   │   ├── index.css         # Global styles + CSS variables
│   │   └── bonki.css         # Sprite animations
│   └── utils/
│       └── patterns.js       # sequencerToPattern(), pad presets
├── index.html
├── vite.config.js
├── package.json
└── .github/
    └── workflows/
        └── deploy.yml
```

---

## 11. Dependencies (package.json)

```json
{
  "name": "homie-beats",
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite --host",
    "build": "vite build",
    "preview": "vite preview --host"
  },
  "dependencies": {
    "@strudel/web": "^1.3.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^6.0.11",
    "vite-plugin-pwa": "^0.20.0"
  }
}
```

**Note:** Versions pulled from Strudel's current setup (as of research date). May need minor adjustments during build.

---

## 12. Open Questions / Decisions for Planning Phase

These are NOT blockers, but should be resolved in Plans 01-01 through 01-04:

### Plan 01-01 (Scaffold):
- ✅ **Confirmed:** Vite + React + @strudel/web
- ⚠️ **Decide:** Load full tidal-drum-machines (~large) or curated subset? (Recommend full — aligns with "eclectic" sound palette)
- ⚠️ **Decide:** Custom domain or GitHub Pages default URL? (Defer — can add custom domain later)

### Plan 01-02 (Tabbed UI):
- ⚠️ **Decide:** Enable pinch-zoom on iPad or disable for precise control? (Recommend disable for instrument-like feel)
- ⚠️ **Decide:** Tab animation (slide, fade, instant)? (Recommend instant for snappy feel)
- ⚠️ **Decide:** Font loading strategy (Google Fonts CDN or self-host Inter)? (Recommend self-host for PWA offline support)

### Plan 01-03 (Sequencer + Pads):
- ⚠️ **Decide:** Default sounds for 4 sequencer rows (808 kick, 909 snare, 808 hat, 808 clap confirmed in example — finalize in plan)
- ⚠️ **Decide:** 16 pad presets — what patterns? (Recommend: 4 drums, 4 fills, 4 synth stabs, 4 bass notes — define in plan)
- ⚠️ **Decide:** Grid sizing on iPad vs. desktop (dynamic or fixed?) (Recommend CSS Grid with `fr` units — scales naturally)

### Plan 01-04 (Bonki Integration):
- ⚠️ **Decide:** Who draws the pixel art? Chris, or placeholder PNG for Phase 1? (Recommend: Create simple 32x32 black cat silhouette as placeholder, iterate later)
- ⚠️ **Decide:** Bonki placement (bottom-left or bottom-right)? (Recommend bottom-right to balance transport controls on left)
- ⚠️ **Decide:** BPM sync for vibing animation — static speed or dynamic? (Recommend static 120 BPM for Phase 1, defer dynamic BPM to Phase 2)

---

## 13. Key Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Sample loading time too long** | App feels sluggish on first load | Use `prebake` progress callback to show loading UI (defer to Phase 2 if needed, or load samples lazily) |
| **Audio doesn't work on iOS Safari** | No sound on primary device (iPad) | Follow Strudel's example: `initAudioOnFirstClick()` + user gesture before first sound. Test early. |
| **PWA doesn't install on iPad** | Not accessible as home screen app | Verify manifest.json has correct `display: "standalone"` and 192/512px icons. Test install flow. |
| **Touch targets too small** | Kids can't tap accurately | Enforce 48px minimum in CSS, test on real iPad, not just browser DevTools emulation |
| **Sequencer pattern generation wrong** | Sounds don't play when expected | Write unit tests for `sequencerToPattern()` logic, compare output to known-good Strudel patterns |
| **GitHub Pages base path breaks app** | CSS/JS don't load after deploy | Test `npm run preview` locally with base path, verify all asset paths are relative or use Vite's asset imports |

---

## 14. Success Metrics (Phase 1)

From context doc: **"Kids build a beat without help"**

**Measurable criteria:**
1. ✅ Moony or Nene can open app on iPad, tap pads, hear sound **within 10 seconds**
2. ✅ They can switch to SEQUENCE tab and toggle cells **without asking what to do**
3. ✅ Play button makes the sequencer loop play
4. ✅ HUSH button stops all sound immediately (when they inevitably make chaos)
5. ✅ Bonki is visible and "vibing" when music plays (even if it's a placeholder sprite)
6. ✅ App works equally well on Mac and iPad (no device-specific bugs)
7. ✅ PWA installs on iPad home screen and works offline (after first load)

---

## 15. Recommended Next Steps

**For /gsd:plan-phase 1:**

1. **Plan 01-01:** Scaffold project, install deps, verify Strudel `initStrudel()` works, load samples, confirm PWA manifest generates
2. **Plan 01-02:** Build tabbed shell (HTML structure, CSS layout, responsive breakpoints, TE-inspired styling, Inter font)
3. **Plan 01-03:** Wire sequencer + pads to Strudel (pattern generation, evaluate() calls, transport controls, grid interactions)
4. **Plan 01-04:** Integrate Bonki sprite (create/source pixel art, CSS animation, state-driven class changes, placement in UI)

Each plan should reference this research doc for API details, code snippets, and design decisions.

---

## Sources

- [Vite Plugin PWA Guide](https://vite-pwa-org.netlify.app/guide/)
- [GitHub - vite-pwa/vite-plugin-pwa](https://github.com/vite-pwa/vite-plugin-pwa)
- [UXPin: Responsive Design for Touch Devices](https://www.uxpin.com/studio/blog/responsive-design-touch-devices-key-considerations/)
- [LogRocket: All Accessible Touch Target Sizes](https://blog.logrocket.com/ux-design/all-accessible-touch-target-sizes/)
- [Smashing Magazine: Accessible Target Sizes Cheatsheet](https://www.smashingmagazine.com/2023/04/accessible-tap-target-sizes-rage-taps-clicks/)
- [Fonts In Use - Teenage Engineering](https://fontsinuse.com/designers/23611/teenage-engineering)
- [CSS-Tricks: Fun Times With CSS Pixel Art](https://css-tricks.com/fun-times-css-pixel-art/)
- [LogRocket: Designing Pixel Art Using CSS Only](https://blog.logrocket.com/designing-pixel-art-css-only/)
- [Animating Sprites with CSS and React](https://alechorner.com/blog/animating-pixel-sprites-with-css)
- [Vite: Deploying a Static Site](https://vite.dev/guide/static-deploy)
- [Deploying Vite to GitHub Pages with a Single GitHub Action](https://savaslabs.com/blog/deploying-vite-github-pages-single-github-action)
- [Medium: Deploying Vite App to GitHub Pages](https://medium.com/@aishwaryaparab1/deploying-vite-deploying-vite-app-to-github-pages-166fff40ffd3)

---

**End of Research** — Ready for planning phase.
