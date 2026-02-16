/**
 * presets.js — Eclectic preset library for HOMIE Beats
 *
 * 16 genre presets, each a complete Strudel pattern with ideal BPM,
 * Bonki one-liner, and album cover variant reference.
 *
 * Preset shape:
 *   { id, name, genre, bpm, code, bonkiLine, cover }
 *
 * Pattern design notes:
 *   - Each preset uses stack() with 2-4 voices
 *   - Banks from tidal-drum-machines: TR808, TR909, TR707, TR606, etc.
 *   - Synths: sawtooth, triangle, sine, square
 *   - Rhythms via .struct(), melodies via note(), texture via .cutoff()
 */

export const PRESETS = [
  // 1. Midnight Purr — Lo-fi Hip-hop
  {
    id: 'midnight-purr',
    name: 'Midnight Purr',
    genre: 'Lo-fi Hip-hop',
    bpm: 85,
    code: `stack(
  s("RolandTR808_bd").struct("x ~ ~ ~ x ~ ~ ~").gain(0.9),
  s("RolandTR808_sd").struct("~ ~ x ~ ~ ~ x ~").gain(0.6),
  s("RolandTR808_hh").struct("x x x x x x x x").gain(0.3),
  note("c2 ~ eb2 ~").s("sawtooth").cutoff(400).gain(0.5)
).slow(2)`,
    bonkiLine: "ooh, that's my jam",
    cover: 'lofi',
  },

  // 2. Catnip Chaos — Breakbeat
  {
    id: 'catnip-chaos',
    name: 'Catnip Chaos',
    genre: 'Breakbeat',
    bpm: 140,
    code: `stack(
  s("RolandTR606_bd").struct("x ~ x ~ ~ x ~ x"),
  s("RolandTR606_sd").struct("~ ~ x ~ ~ x x ~").gain(0.8),
  s("RolandTR606_hh").struct("x x ~ x x ~ x x").gain(0.5),
  s("RolandTR606_oh").struct("~ ~ ~ x ~ ~ ~ x").gain(0.4)
)`,
    bonkiLine: 'total chaos... purr-fect',
    cover: 'breakbeat',
  },

  // 3. Nap Time — Ambient
  {
    id: 'nap-time',
    name: 'Nap Time',
    genre: 'Ambient',
    bpm: 70,
    code: `stack(
  s("KorgMinipops_bd").struct("x ~ ~ ~ ~ ~ ~ ~").gain(0.4),
  s("KorgMinipops_hh").struct("~ ~ x ~ ~ ~ x ~").gain(0.2),
  note("c4 e4 g4 b4").s("sine").cutoff(600).gain(0.3).slow(2),
  note("g3 ~ ~ e3").s("triangle").cutoff(300).gain(0.25).slow(4)
).slow(2)`,
    bonkiLine: 'zzz... beautiful zzz...',
    cover: 'ambient',
  },

  // 4. Paw Stomp — Hip-hop
  {
    id: 'paw-stomp',
    name: 'Paw Stomp',
    genre: 'Hip-hop',
    bpm: 95,
    code: `stack(
  s("AkaiMPC60_bd").struct("x ~ ~ x x ~ ~ ~").gain(0.9),
  s("AkaiMPC60_sd").struct("~ ~ x ~ ~ ~ x ~").gain(0.7),
  s("AkaiMPC60_hh").struct("x x x x x x x x").gain(0.35),
  note("c2 ~ c2 eb2 ~ ~ g1 ~").s("sawtooth").cutoff(350).gain(0.6)
)`,
    bonkiLine: 'stomp stomp stomp!',
    cover: 'hiphop',
  },

  // 5. Whisker Techno — Techno
  {
    id: 'whisker-techno',
    name: 'Whisker Techno',
    genre: 'Techno',
    bpm: 130,
    code: `stack(
  s("RolandTR909_bd").struct("x ~ ~ ~ x ~ ~ ~").gain(0.9),
  s("RolandTR909_sd").struct("~ ~ ~ ~ x ~ ~ ~").gain(0.6),
  s("RolandTR909_hh").struct("~ x ~ x ~ x ~ x").gain(0.4),
  s("RolandTR909_oh").struct("~ ~ ~ ~ ~ ~ ~ x").gain(0.35)
).fast(2)`,
    bonkiLine: 'untz untz untz untz',
    cover: 'techno',
  },

  // 6. Fur Ball Funk — Afrobeat
  {
    id: 'fur-ball-funk',
    name: 'Fur Ball Funk',
    genre: 'Afrobeat',
    bpm: 110,
    code: `stack(
  s("KorgKPR77_bd").struct("x ~ ~ x ~ ~ x ~").gain(0.8),
  s("KorgKPR77_sd").struct("~ ~ x ~ ~ x ~ ~").gain(0.6),
  s("RolandTR727_hh").struct("x x x x x x x x").gain(0.35),
  s("RolandTR727_cp").struct("~ ~ ~ x ~ ~ ~ x").gain(0.5)
)`,
    bonkiLine: 'feeling the groove in my whiskers',
    cover: 'afrobeat',
  },

  // 7. Pixel Pounce — Chiptune / 8-bit
  {
    id: 'pixel-pounce',
    name: 'Pixel Pounce',
    genre: 'Chiptune',
    bpm: 150,
    code: `stack(
  s("CasioSK1_bd").struct("x ~ x ~ x ~ x ~").gain(0.7),
  s("CasioSK1_sd").struct("~ ~ x ~ ~ ~ x ~").gain(0.6),
  note("c5 e5 g5 c6 g5 e5 c5 e5").s("square").cutoff(2000).gain(0.35),
  note("c3 c3 g2 g2 a2 a2 g2 ~").s("square").cutoff(800).gain(0.4)
).fast(2)`,
    bonkiLine: 'bleep bloop power-up!',
    cover: 'chiptune',
  },

  // 8. Cool Cat Jazz — Jazz
  {
    id: 'cool-cat-jazz',
    name: 'Cool Cat Jazz',
    genre: 'Jazz',
    bpm: 100,
    code: `stack(
  s("LinnDrum_bd").struct("x ~ ~ ~ x ~ ~ ~").gain(0.6),
  s("LinnDrum_sd").struct("~ ~ x ~ ~ ~ x ~").gain(0.5),
  s("LinnDrum_hh").struct("x ~ x x ~ x x ~").gain(0.3),
  note("c3 e3 g3 bb3 a3 g3 e3 d3").s("triangle").cutoff(700).gain(0.4).slow(2)
)`,
    bonkiLine: 'snap snap... real smooth',
    cover: 'jazz',
  },

  // 9. Laser Whiskers — Trap
  {
    id: 'laser-whiskers',
    name: 'Laser Whiskers',
    genre: 'Trap',
    bpm: 140,
    code: `stack(
  s("RolandTR808_bd").struct("x ~ ~ ~ ~ ~ x ~").gain(0.95),
  s("RolandTR808_sd").struct("~ ~ ~ ~ x ~ ~ ~").gain(0.7),
  s("RolandTR808_hh").struct("x x x x x x x x").fast(2).gain(0.35),
  note("c1 ~ ~ c1 ~ ~ c1 ~").s("sine").cutoff(200).gain(0.8)
)`,
    bonkiLine: 'skrrt skrrt meow',
    cover: 'trap',
  },

  // 10. Purr-adise — Chill
  {
    id: 'purr-adise',
    name: 'Purr-adise',
    genre: 'Chill',
    bpm: 90,
    code: `stack(
  s("EmuSP12_bd").struct("x ~ ~ ~ x ~ ~ ~").gain(0.6),
  s("EmuSP12_sd").struct("~ ~ x ~ ~ ~ ~ x").gain(0.45),
  s("EmuSP12_hh").struct("x ~ x ~ x ~ x ~").gain(0.25),
  note("e4 ~ g4 ~ a4 ~ g4 e4").s("triangle").cutoff(500).gain(0.35).slow(2)
).slow(2)`,
    bonkiLine: "pure vibes... don't move",
    cover: 'chill',
  },

  // 11. Void Stare — Ambient Drone
  {
    id: 'void-stare',
    name: 'Void Stare',
    genre: 'Ambient Drone',
    bpm: 60,
    code: `stack(
  note("c2").s("sine").cutoff(150).gain(0.4).slow(8),
  note("g2").s("sine").cutoff(200).gain(0.3).slow(8),
  note("eb3").s("triangle").cutoff(100).gain(0.2).slow(16),
  s("KorgMinipops_hh").struct("~ ~ ~ ~ ~ ~ ~ x").gain(0.15).slow(2)
)`,
    bonkiLine: '...staring into the void...',
    cover: 'drone',
  },

  // 12. Zoomies! — Dance Party
  {
    id: 'zoomies',
    name: 'Zoomies!',
    genre: 'Dance Party',
    bpm: 128,
    code: `stack(
  s("RolandTR707_bd").struct("x ~ ~ ~ x ~ ~ ~").fast(2).gain(0.85),
  s("RolandTR707_sd").struct("~ ~ ~ ~ x ~ ~ ~").fast(2).gain(0.6),
  s("RolandTR707_hh").struct("~ x ~ x ~ x ~ x").fast(2).gain(0.4),
  s("RolandTR707_oh").struct("~ ~ ~ ~ ~ ~ ~ x").fast(2).gain(0.35)
)`,
    bonkiLine: 'ZOOMIES! catch me if you can!',
    cover: 'dance',
  },

  // 13. Tail Whip — Cartoon Bounce
  {
    id: 'tail-whip',
    name: 'Tail Whip',
    genre: 'Cartoon Bounce',
    bpm: 120,
    code: `stack(
  s("CasioSK1_bd").struct("x ~ x ~ x x ~ x").gain(0.7),
  s("CasioSK1_sd").struct("~ x ~ x ~ ~ x ~").gain(0.6),
  note("c4 e4 c4 g4 c4 e4 g4 c5").s("square").cutoff(1500).gain(0.35),
  note("c3 ~ g2 ~ c3 ~ g2 ~").s("triangle").cutoff(600).gain(0.45)
)`,
    bonkiLine: 'boing boing boing!',
    cover: 'cartoon',
  },

  // 14. Star Gazer — Space Vibes
  {
    id: 'star-gazer',
    name: 'Star Gazer',
    genre: 'Space Vibes',
    bpm: 100,
    code: `stack(
  s("SimmonsSDS5_bd").struct("x ~ ~ ~ ~ ~ x ~").gain(0.5),
  s("SimmonsSDS5_sd").struct("~ ~ ~ x ~ ~ ~ ~").gain(0.4),
  note("e4 ~ b4 ~ g4 ~ d5 ~").s("triangle").cutoff(400).gain(0.3).slow(2),
  note("c3 ~ ~ g3 ~ ~ c3 ~").s("sine").cutoff(250).gain(0.35).slow(4)
).slow(2)`,
    bonkiLine: 'one small pounce for cat-kind...',
    cover: 'space',
  },

  // 15. Boss Level — Video Game
  {
    id: 'boss-level',
    name: 'Boss Level',
    genre: 'Video Game',
    bpm: 160,
    code: `stack(
  s("RolandTR505_bd").struct("x ~ x ~ x ~ x ~").gain(0.8),
  s("RolandTR505_sd").struct("~ ~ x ~ ~ x ~ x").gain(0.65),
  note("e4 e4 ~ e4 c4 ~ e4 g4").s("square").cutoff(2500).gain(0.35).fast(2),
  note("c3 ~ c3 ~ g2 ~ g2 ~").s("square").cutoff(600).gain(0.45)
)`,
    bonkiLine: 'BOSS FIGHT! mash those pads!',
    cover: 'videogame',
  },

  // 16. Bonki's Lullaby — Lo-fi
  {
    id: 'bonkis-lullaby',
    name: "Bonki's Lullaby",
    genre: 'Lo-fi',
    bpm: 75,
    code: `stack(
  s("EmuSP12_bd").struct("x ~ ~ ~ x ~ ~ ~").gain(0.4),
  s("EmuSP12_sd").struct("~ ~ ~ x ~ ~ ~ x").gain(0.3),
  note("c4 e4 g4 e4 d4 f4 a4 f4").s("sine").cutoff(400).gain(0.3).slow(2),
  note("c3 ~ g2 ~ c3 ~ g2 ~").s("triangle").cutoff(250).gain(0.25).slow(4)
).slow(2)`,
    bonkiLine: 'shh... this one is for dreaming',
    cover: 'lullaby',
  },
];
