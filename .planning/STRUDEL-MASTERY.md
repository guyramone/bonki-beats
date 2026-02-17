# Strudel Mastery Reference — HOMIE Beats

> Complete API reference compiled from ~/strudel/ source code.
> For Phase 3 planning and beyond.

---

## Currently Used in HOMIE Beats (Phase 1-2)
- Basic `s()` with drum samples (TR-808 bank)
- Simple `struct()` patterns from sequencer grid
- `stack()` for layering
- `setcps()` for BPM
- `.gain()` for volume
- `samples()` to load tidal-drum-machines.json

**We're using ~5% of what Strudel can do.**

---

## 1. PATTERN TRANSFORMS

### Time/Speed
| Method | Description |
|--------|-------------|
| `.fast(n)` / `.density(n)` | Speed up by factor n |
| `.slow(n)` / `.sparsity(n)` | Slow down by factor n |
| `.hurry(n)` | Speed up pattern AND sample playback |
| `.early(n)` / `.late(n)` | Shift in time |
| `.rev()` | Reverse each cycle |
| `.palindrome()` | Forward/backward alternating |

### Structural
| Method | Description |
|--------|-------------|
| `.struct(pat)` | Apply binary structure |
| `.euclid(pulses, steps)` | Euclidean rhythm (Bjorklund) |
| `.euclidRot(p, s, r)` | Euclidean with rotation |
| `.euclidish(p, s, groove)` | Euclidean with morph (0=euclid, 1=even) |
| `.ply(n)` | Repeat each event n times |
| `.chop(n)` | Granular: cut sample into n parts |
| `.striate(n)` | Progressive granular |
| `.slice(n, indices)` | Slice sample by index |
| `.splice(n, indices)` | Slice + auto-fit duration |
| `.brak()` | Breakbeat feel |
| `.press()` / `.pressBy(n)` | Syncopation |
| `.swing(n)` / `.swingBy(a, n)` | Swing feel |
| `.linger(fraction)` | Loop a fraction |
| `.bite(n, slicePat)` | Slice pattern into n parts |

### Iteration/Cycling
| Method | Description |
|--------|-------------|
| `.iter(n)` | Phase through subdivisions |
| `.iterBack(n)` | Reverse iteration |
| `.chunk(n, fn)` | Apply fn to nth each cycle |
| `.repeatCycles(n)` | Repeat each cycle n times |

### Conditional/Probability
| Method | Description |
|--------|-------------|
| `.every(n, fn)` | Apply fn every n cycles |
| `.sometimes(fn)` | 50% probability |
| `.often(fn)` / `.rarely(fn)` | 75% / 25% |
| `.almostAlways(fn)` / `.almostNever(fn)` | 90% / 10% |
| `.sometimesBy(prob, fn)` | Custom probability |
| `.degradeBy(amount)` | Randomly remove events |
| `.degrade()` | Remove 50% randomly |

### Layering/Combining
| Method | Description |
|--------|-------------|
| `.superimpose(...fns)` | Layer transformed copies + original |
| `.layer(...fns)` | Layer without original |
| `.off(time, fn)` | Superimpose with delay |
| `.jux(fn)` | Apply to right channel only (stereo) |
| `.juxBy(width, fn)` | Jux with width control |
| `.echo(times, time, feedback)` | Repeat with decay |

### Top-Level Combiners
| Function | Description |
|----------|-------------|
| `stack(...pats)` | Play simultaneously |
| `sequence(...pats)` / `seq()` | Concatenate into one cycle |
| `cat(...pats)` | One pattern per cycle |
| `polymeter(...pats)` | Different lengths cycle |
| `arrange([n, pat], ...)` | Multi-cycle arrangement |

---

## 2. CONTINUOUS SIGNALS

| Signal | Range | Description |
|--------|-------|-------------|
| `sine` / `sine2` | 0-1 / -1 to 1 | Sine wave |
| `saw` / `isaw` | 0-1 / 1-0 | Sawtooth |
| `square` / `tri` | 0-1 | Square / Triangle |
| `rand` / `rand2` | 0-1 / -1 to 1 | Random |
| `irand(n)` | 0 to n-1 | Random integer |
| `perlin` | 0-1 | Smooth random (Perlin noise) |
| `run(n)` | 0 to n-1 | Counting pattern |
| `choose(...xs)` | - | Random selection |
| `shuffle(n)` | - | Random reorder |

---

## 3. SYNTH TYPES

### Oscillators
| Name | Aliases | Description |
|------|---------|-------------|
| `triangle` | `tri` | Triangle wave |
| `square` | `sqr` | Square wave |
| `sawtooth` | `saw` | Sawtooth wave |
| `sine` | `sin` | Sine wave |
| `supersaw` | - | Unison supersaw (AudioWorklet) |
| `pulse` | - | Pulse wave with PWM |
| `sbd` | - | Synthesized bass drum |

### Noise Sources
`white`, `pink`, `brown`, `crackle`

### FM Synthesis
Up to 8 operators: `.fm()`, `.fm1()` through `.fm8()`, `.fmh()` (harmonicity), `.fmenv()`, `.fmwave()`, full ADSR per operator, inter-operator modulation (`.fm12()`, `.fm21()`, etc.)

### Soundfonts (128 General MIDI instruments)
`gm_piano`, `gm_electric_piano_1`, `gm_organ`, `gm_guitar_nylon`, `gm_acoustic_bass`, `gm_violin`, `gm_trumpet`, `gm_flute`, `gm_synth_bass_1`, etc. — ALL 128 GM instruments available via `loadSoundfont()`

### Other Sources
- **Wavetable synthesis** via `.wt()` control
- **Kabelsalat** modular DSP via `.K()` method
- **ZZFX** chip-tune/retro sounds
- **Custom partials** via `.partials([magnitudes])`

---

## 4. EFFECTS CATALOG

### Filters (each with full ADSR envelope + LFO)
| Effect | Aliases | Description |
|--------|---------|-------------|
| `.cutoff(freq)` | `.lpf()`, `.lp()` | Low-pass filter |
| `.hcutoff(freq)` | `.hpf()`, `.hp()` | High-pass filter |
| `.bandf(freq)` | `.bpf()`, `.bp()` | Band-pass filter |
| `.djf(val)` | - | DJ filter (0-1 sweep) |

Filter extras: `.resonance()`, `.lpenv()`, `.lpattack()`, `.lpdecay()`, `.lpsustain()`, `.lprelease()`, `.lprate()`, `.lpdepth()`, `.ftype('12db'/'ladder'/'24db')`, `.drive()`

### Distortion (10 algorithms!)
`.distort()`, `.shape()`, `.soft()`, `.hard()`, `.cubic()`, `.diode()`, `.asym()`, `.fold()`, `.sinefold()`, `.chebyshev()`

### Time-Based
| Effect | Description |
|--------|-------------|
| `.delay(wet)` | + `.delaytime()`, `.delayfeedback()`, `.delaysync()` |
| `.room(wet)` | Reverb + `.roomsize()`, `.roomfade()`, `.roomlp()`, `.roomdim()` |
| `.ir(name)` | Convolution reverb with impulse response |

### Modulation
| Effect | Description |
|--------|-------------|
| `.tremolo(rate)` | AM + depth, skew, phase, shape, sync |
| `.phaserrate(rate)` | Phaser + depth, center, sweep |

### Lo-Fi
`.crush(bits)` — Bit crusher
`.coarse(n)` — Sample rate reduction

### Dynamics
`.compressor(threshold)` + ratio, knee, attack, release
`.duck(orbit)` — Sidechain ducking

### Amplitude/Pan
`.gain()`, `.velocity()`, `.postgain()`, `.pan()`, `.dry()`

### Sample Controls
`.speed()`, `.begin()`, `.end()`, `.loop()`, `.cut()`, `.clip()`, `.stretch()`, `.accelerate()`, `.bank()`

---

## 5. MINI-NOTATION

| Syntax | Example | Description |
|--------|---------|-------------|
| `"a b c"` | `"bd sd hh"` | Sequence |
| `"[a b] c"` | `"[bd sd] hh"` | Sub-group |
| `"a , b"` | `"bd , hh*4"` | Stack (simultaneous) |
| `"<a b c>"` | `"<bd sd hh>"` | One per cycle |
| `"a*n"` | `"hh*8"` | Speed up / repeat |
| `"a/n"` | `"bd/2"` | Slow down |
| `"~"` | `"bd ~ sd ~"` | Rest |
| `"a(p,s)"` | `"bd(3,8)"` | Euclidean rhythm |
| `"a?"` | `"hh?"` | Random 50% |
| `"{a b, c d e}"` | - | Polymeter |

---

## 6. TONAL / MUSIC THEORY

### Scales (80+ types)
`.scale("C:major")`, `.scale("D4:minor")`, `.scale("F#:pentatonic")`, `.scale("Bb3:dorian")`

Types: major, minor, dorian, phrygian, lydian, mixolydian, aeolian, locrian, pentatonic, blues, bebop, diminished, whole tone, chromatic, harmonic minor, melodic minor, hungarian minor, spanish, arabic, persian, egyptian, prometheus, augmented, altered, etc.

### Chords & Voicings
`.chord("Cm7")`, `.voicing()` — Smart voice-led chord voicings
50+ chord types: major, minor, 7th, 9th, 11th, 13th, sus, dim, aug, etc.

### Transpose
`.scaleTranspose(n)` — Move within scale
`.transpose(n)` — Move by semitones

---

## 7. SAMPLE BANKS

| Source | Command | Description |
|--------|---------|-------------|
| Tidal Dirt Samples | `samples('github:tidalcycles/dirt-samples')` | 800+ sounds, 100+ banks |
| Drum Machines | `samples('...tidal-drum-machines.json')` | TR-808, TR-909, LinnDrum (current) |
| Bubo packs | `samples('bubo:reponame')` | Community sample packs |
| General MIDI | `loadSoundfont()` | 128 instruments |
| Custom | `samples({ name: ['url'] })` | Any audio files |

---

## Phase 3 Opportunities (Bonki AI)

### Kid-Friendly Power Moves
1. **Mini-notation is the key** — `"bd(3,8)"` = Cuban tresillo. `"hh*8"` = hi-hats. Kids tweak numbers.
2. **Scales make melody easy** — `n("0 2 4 7").scale("C:pentatonic")` = instant melody
3. **Effects are one-liners** — `.room(0.5)` = reverb, `.delay(0.3)` = delay, `.crush(4)` = lo-fi
4. **Euclidean rhythms** — Kids explore world music with `(pulses, steps)` notation
5. **Soundfonts** — Piano, guitar, flute, trumpet... no sample loading needed
6. **Probability** — `.sometimes(x => x.crush(4))` = surprise effects

### What Bonki Could Generate
- "make a chill beat" → `stack(s("bd(3,8)").bank("RolandTR808"), s("hh*8").gain(0.3), n("0 2 4 7").scale("C4:pentatonic").s("gm_electric_piano_1")).slow(2)`
- "add some reverb" → append `.room(0.5).roomsize(3)`
- "make it weird" → append `.sometimes(x => x.crush(4).speed(2))`
- "play a chord" → `chord("<Cm7 Fm7 Bb7 Eb7>").voicing().s("gm_piano")`
