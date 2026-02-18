# Bonki Beats

**A visual beatpad and synthboard for making music in the browser — named after a very good cat.**

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Strudel](https://img.shields.io/badge/Strudel-1.3-ff69b4)](https://strudel.cc)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL--3.0-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)

---

Bonki Beats wraps [Strudel](https://strudel.cc) — the live-coding music library by Felix Roos — in a visual instrument anyone can play. Toggle cells on a step sequencer, twist knobs, tap performance pads, browse hundreds of sounds. No code required to start. But the code is always there, generated in real time, if you want to learn what's happening under the hood.

Built by the Ramone family. Named after Bonki, our Scottish Fold cat (all black, golden eyes, folded ears, infinite personality) who passed away. Bonki lives on here as a pixel-art DJ partner who reacts to your beats. 🐱

---

## Features

### Sequencer
- **16-row step sequencer** organized in 5 collapsible sections: Drums, Percussion, Bass, Synths, and Melodic
- **8-step default grid**, expandable to 16 steps per row
- **Velocity control** and mute/solo per row
- **Inline mini-pads** for live triggering alongside the grid

### Sound Engine
- **Sound browser** with 11 categories spanning 20+ drum machines, synths, and soundfonts
- **Per-row effects rack** — lowpass filter, highpass filter, delay, reverb, distortion, lo-fi, and pan
- **Scale picker** for melodic rows with key and mode selection
- **Euclidean rhythm generator** with visual ring preview — algorithmically interesting beats in one click

### Performance
- **4x8 performance pads** with velocity-sensitive triggering
- **Master effects strip** with gain, compressor, and DJ filter (sweep from deep lowpass to sharp highpass)
- **Audio visualizer** — real-time waveform and spectrum analyzer driven by Web Audio's AnalyserNode
- **BPM control** with tap tempo

### Intelligence
- **Bonki** — a pixel-art Scottish Fold cat who sits in the corner and reacts to your music. Head bobs, eyes widen, opinions form. Not a gimmick — a companion.
- **Real-time code view** — see the Strudel code your beat generates, with syntax highlighting. Learn live-coding by playing.
- **Session persistence** — close the tab, come back tomorrow, your beat is still there. localStorage-backed state recovery.

### Platform
- **PWA-ready** — installable on any device, works offline after first load
- **Responsive** — plays well on phones, tablets, and desktops
- **GitHub Pages deployment** — zero infrastructure, free hosting

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- npm (comes with Node)

### Install and Run

```bash
git clone https://github.com/guyramone/HOMIES.git
cd HOMIES/homie-beats
npm install
npm run dev
```

Open `http://localhost:5173` in your browser. Tap **TAP TO START** to initialize the audio engine (required by browser autoplay policy). Then:

1. **Toggle cells** on the sequencer grid to build a pattern
2. **Browse sounds** — click any row's sound label to open the sound browser
3. **Twist knobs** on the effects rack to shape your sound
4. **Tap pads** on the PADS tab for live performance triggers
5. **Watch the code** — toggle the code view to see Strudel patterns generated in real time

### Build for Production

```bash
npm run build
npm run preview
```

---

## Architecture

```
src/
├── App.jsx                     # Main orchestrator — state management, Strudel eval loop
├── main.jsx                    # Audio initialization, Strudel setup, AnalyserNode tap
│
├── components/
│   ├── Sequencer.jsx           # 16-row step grid with collapsible sections
│   ├── Pads.jsx                # 4x8 performance pad grid
│   ├── EffectsRack.jsx         # Per-row FX controls (LPF, HPF, delay, reverb, etc.)
│   ├── MasterStrip.jsx         # Master gain, compressor, transport, BPM
│   ├── DJFilter.jsx            # Sweepable lowpass/highpass master filter
│   ├── SoundBrowser.jsx        # Categorized sound selection overlay
│   ├── ScalePicker.jsx         # Key + mode selection for melodic rows
│   ├── EuclideanControl.jsx    # Euclidean rhythm generator with ring visualization
│   ├── Bonki.jsx               # Pixel-art cat DJ — reactive animations
│   ├── BonkiSpeech.jsx         # Bonki's speech bubbles and reactions
│   ├── CodeView.jsx            # Live Strudel code display with Prism.js highlighting
│   ├── Visualizer.jsx          # Waveform + spectrum analyzer (Web Audio API)
│   ├── Knob.jsx                # Rotary knob control (react-knob-headless)
│   ├── TabBar.jsx              # SEQUENCE | PADS | AI navigation
│   └── ...                     # ControlStrip, LayerChips, PresetGallery, etc.
│
├── utils/
│   ├── codeGenerator.js        # Pure functions: UI state → Strudel code strings
│   ├── rowModel.js             # Row data model (sound, pattern, effects, transforms)
│   ├── soundCatalog.js         # Sound library: categories, machines, synths, soundfonts
│   ├── scaleData.js            # Musical scales, note names, transposition utilities
│   ├── layers.js               # Overlay layer composition (pads, presets)
│   ├── effectDefaults.js       # Default values for all effect parameters
│   └── presets.js              # Built-in beat presets
│
├── hooks/
│   ├── useSessionPersistence.js  # localStorage save/restore for full session state
│   └── useSoundBrowser.js        # Sound browser open/close and selection logic
│
└── styles/
    ├── index.css               # Base styles, layout, CSS reset
    ├── glassmorphism.css       # "Cosmic Glass" theme — backdrop-filter, glass panels
    ├── knobs.css               # Rotary knob styling
    ├── effects-rack.css        # Effects rack layout
    ├── master-strip.css        # Master strip styling
    ├── scale-picker.css        # Scale picker dropdown
    ├── sound-browser.css       # Sound browser overlay
    └── bonki.css               # Bonki character styles and animations
```

### How It Works

The app follows a unidirectional data flow:

1. **User interaction** (toggle a cell, turn a knob, tap a pad) updates React state in `App.jsx`
2. **Code generation** — `codeGenerator.js` takes the full row state and produces a Strudel code string
3. **Evaluation** — `evaluate(code)` from `@strudel/web` sends the pattern to Strudel's audio scheduler
4. **Audio output** — Strudel handles all audio synthesis, sampling, and scheduling via Web Audio API
5. **Visualization** — an `AnalyserNode` tapped into the audio graph feeds the waveform/spectrum display

State is persisted to `localStorage` on every meaningful change, so sessions survive page reloads and browser restarts.

---

## Built With

| Tech | Role |
|------|------|
| [React 18](https://react.dev) | UI framework |
| [Strudel](https://strudel.cc) | Live-coding music engine (@strudel/web, @strudel/core, @strudel/soundfonts) |
| [Vite 6](https://vitejs.dev) | Build tool and dev server |
| [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) | Service worker generation and PWA manifest |
| [Prism.js](https://prismjs.com) | Syntax highlighting for code view |
| [react-knob-headless](https://github.com/satelllte/react-knob-headless) | Accessible rotary knob controls |
| [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) | AnalyserNode for real-time visualization |
| CSS Custom Properties + `backdrop-filter` | Glassmorphism "Cosmic Glass" theme |

---

## Design Philosophy

Bonki Beats draws from three visual traditions:

- **Teenage Engineering** — functional minimalism, every element earns its place, whimsy in the details
- **Pixel art** — warmth and nostalgia, handcrafted feel, Ghibli energy (think Jiji from Kiki's Delivery Service)
- **Glassmorphism** — frosted glass panels, depth through layering, a cosmic nighttime palette

The interface uses the [Outfit](https://fonts.google.com/specimen/Outfit) typeface and a dark palette built around deep blacks, translucent glass layers, and amber accents (Bonki's golden eyes set the color temperature).

The core design test: *"Can the kids build a beat without asking for help?"* If a 7-year-old can tap pads and hear something good, we did our job. If a musician can open the code view and learn Strudel patterns from what they built, even better.

---

## Contributing

Contributions are welcome. Bonki Beats is a family project, but we'd love help making it better.

### How to Contribute

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Make your changes
4. Test locally with `npm run dev`
5. Commit with clear messages
6. Open a Pull Request

### Areas Where Help Is Appreciated

- **Accessibility** — screen reader support, keyboard navigation, ARIA labels
- **Sound design** — new preset patterns, interesting sample combinations
- **Mobile polish** — touch interaction improvements, responsive edge cases
- **Documentation** — tutorials, guides, example patterns
- **Bonki's personality** — new reaction animations, speech bubble text

Please be kind in issues and PRs. This project has a family behind it.

---

## Roadmap

- [ ] **Phase 4 — The Brain**: Bonki AI chat powered by Claude, natural-language beat generation, pattern suggestions
- [ ] **Phase 5 — The Stage**: Polish, sharing, export, public launch on GitHub Pages
- [ ] MIDI controller support
- [ ] Pattern sharing and community presets
- [ ] Audio export (WAV/MP3)

---

## License

This project is licensed under the [GNU Affero General Public License v3.0](https://www.gnu.org/licenses/agpl-3.0.html) — inherited from [Strudel](https://strudel.cc), the live-coding engine at its core.

You are free to use, modify, and distribute this software. If you run a modified version as a service, you must make the source available. See the [full license text](https://www.gnu.org/licenses/agpl-3.0.html) for details.

---

## Credits

Built by the **Ramone family** — [guyramone](https://github.com/guyramone)

Powered by **[Strudel](https://strudel.cc)** by [Felix Roos](https://github.com/felixroos) and contributors

AI pair-programmed with **[Claude](https://claude.ai)** by Anthropic

In memory of **Bonki** 🐱 — all black, golden eyes, folded ears, and a head tilt that said *"I'm listening."*
