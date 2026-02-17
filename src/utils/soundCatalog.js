/**
 * soundCatalog.js -- Static data structure for all available sounds
 *
 * Organizes drum machines, synth engines, and GM soundfonts into a browsable
 * category > bank > sound hierarchy. Used by the SoundBrowser component.
 *
 * Exports: SOUND_CATEGORIES, getSoundsForBank, getRandomSound, soundToLabel
 */

// --- Sound categories (11 total) ---

export const SOUND_CATEGORIES = [
  {
    id: 'drums',
    name: 'Drums',
    icon: '\u{1F941}',
    color: '#d97757',
    description: 'Drum machines and kits',
    banks: [
      { id: 'RolandTR808', name: 'TR-808', type: 'sample', sounds: [
        { id: 'bd', name: 'Bass Drum' }, { id: 'sd', name: 'Snare' }, { id: 'hh', name: 'Hi-Hat' },
        { id: 'oh', name: 'Open Hat' }, { id: 'cp', name: 'Clap' }, { id: 'cr', name: 'Crash' },
        { id: 'rd', name: 'Ride' }, { id: 'ht', name: 'High Tom' }, { id: 'mt', name: 'Mid Tom' },
        { id: 'lt', name: 'Low Tom' }, { id: 'cb', name: 'Cowbell' }, { id: 'rim', name: 'Rimshot' },
        { id: 'sh', name: 'Shaker' },
      ]},
      { id: 'RolandTR909', name: 'TR-909', type: 'sample', sounds: [
        { id: 'bd', name: 'Bass Drum' }, { id: 'sd', name: 'Snare' }, { id: 'hh', name: 'Hi-Hat' },
        { id: 'oh', name: 'Open Hat' }, { id: 'cp', name: 'Clap' }, { id: 'cr', name: 'Crash' },
        { id: 'rd', name: 'Ride' }, { id: 'ht', name: 'High Tom' }, { id: 'mt', name: 'Mid Tom' },
        { id: 'lt', name: 'Low Tom' }, { id: 'rim', name: 'Rimshot' },
      ]},
      { id: 'LinnDrum', name: 'LinnDrum', type: 'sample', sounds: [
        { id: 'bd', name: 'Bass Drum' }, { id: 'sd', name: 'Snare' }, { id: 'hh', name: 'Hi-Hat' },
        { id: 'oh', name: 'Open Hat' }, { id: 'cp', name: 'Clap' }, { id: 'cr', name: 'Crash' },
        { id: 'cb', name: 'Cowbell' }, { id: 'tb', name: 'Tambourine' },
      ]},
      { id: 'LinnLM1', name: 'Linn LM-1', type: 'sample', sounds: [
        { id: 'bd', name: 'Bass Drum' }, { id: 'sd', name: 'Snare' }, { id: 'hh', name: 'Hi-Hat' },
        { id: 'oh', name: 'Open Hat' }, { id: 'cp', name: 'Clap' }, { id: 'cb', name: 'Cowbell' },
        { id: 'tb', name: 'Tambourine' },
      ]},
      { id: 'RolandCR78', name: 'CR-78', type: 'sample', sounds: [
        { id: 'bd', name: 'Bass Drum' }, { id: 'sd', name: 'Snare' }, { id: 'hh', name: 'Hi-Hat' },
        { id: 'oh', name: 'Open Hat' }, { id: 'rim', name: 'Rimshot' },
      ]},
      { id: 'RolandTR606', name: 'TR-606', type: 'sample', sounds: [
        { id: 'bd', name: 'Bass Drum' }, { id: 'sd', name: 'Snare' }, { id: 'hh', name: 'Hi-Hat' },
        { id: 'oh', name: 'Open Hat' }, { id: 'ht', name: 'High Tom' }, { id: 'lt', name: 'Low Tom' },
      ]},
      { id: 'RolandTR707', name: 'TR-707', type: 'sample', sounds: [
        { id: 'bd', name: 'Bass Drum' }, { id: 'sd', name: 'Snare' }, { id: 'hh', name: 'Hi-Hat' },
        { id: 'oh', name: 'Open Hat' }, { id: 'cp', name: 'Clap' }, { id: 'cr', name: 'Crash' },
        { id: 'rd', name: 'Ride' }, { id: 'ht', name: 'High Tom' }, { id: 'mt', name: 'Mid Tom' },
        { id: 'lt', name: 'Low Tom' }, { id: 'cb', name: 'Cowbell' }, { id: 'tb', name: 'Tambourine' },
      ]},
      { id: 'RolandTR505', name: 'TR-505', type: 'sample', sounds: [
        { id: 'bd', name: 'Bass Drum' }, { id: 'sd', name: 'Snare' }, { id: 'hh', name: 'Hi-Hat' },
        { id: 'oh', name: 'Open Hat' }, { id: 'cp', name: 'Clap' }, { id: 'cr', name: 'Crash' },
        { id: 'rd', name: 'Ride' }, { id: 'ht', name: 'High Tom' }, { id: 'lt', name: 'Low Tom' },
        { id: 'cb', name: 'Cowbell' },
      ]},
      { id: 'RolandTR626', name: 'TR-626', type: 'sample', sounds: [
        { id: 'bd', name: 'Bass Drum' }, { id: 'sd', name: 'Snare' }, { id: 'hh', name: 'Hi-Hat' },
        { id: 'oh', name: 'Open Hat' }, { id: 'cp', name: 'Clap' }, { id: 'cr', name: 'Crash' },
        { id: 'rd', name: 'Ride' }, { id: 'cb', name: 'Cowbell' },
      ]},
      { id: 'RolandTR727', name: 'TR-727', type: 'sample', sounds: [
        { id: 'bd', name: 'Bass Drum' }, { id: 'sd', name: 'Snare' }, { id: 'hh', name: 'Hi-Hat' },
        { id: 'oh', name: 'Open Hat' }, { id: 'cb', name: 'Cowbell' },
      ]},
      { id: 'OberheimDMX', name: 'Oberheim DMX', type: 'sample', sounds: [
        { id: 'bd', name: 'Bass Drum' }, { id: 'sd', name: 'Snare' }, { id: 'hh', name: 'Hi-Hat' },
        { id: 'oh', name: 'Open Hat' }, { id: 'cp', name: 'Clap' }, { id: 'cr', name: 'Crash' },
        { id: 'rd', name: 'Ride' }, { id: 'ht', name: 'High Tom' }, { id: 'mt', name: 'Mid Tom' },
        { id: 'lt', name: 'Low Tom' },
      ]},
      { id: 'EmuSP12', name: 'E-mu SP-12', type: 'sample', sounds: [
        { id: 'bd', name: 'Bass Drum' }, { id: 'sd', name: 'Snare' }, { id: 'hh', name: 'Hi-Hat' },
        { id: 'oh', name: 'Open Hat' }, { id: 'cp', name: 'Clap' },
      ]},
      { id: 'EmuDrumulator', name: 'E-mu Drumulator', type: 'sample', sounds: [
        { id: 'bd', name: 'Bass Drum' }, { id: 'sd', name: 'Snare' }, { id: 'hh', name: 'Hi-Hat' },
        { id: 'oh', name: 'Open Hat' }, { id: 'cp', name: 'Clap' }, { id: 'cr', name: 'Crash' },
      ]},
      { id: 'BossDR110', name: 'Boss DR-110', type: 'sample', sounds: [
        { id: 'bd', name: 'Bass Drum' }, { id: 'sd', name: 'Snare' }, { id: 'hh', name: 'Hi-Hat' },
        { id: 'oh', name: 'Open Hat' }, { id: 'cp', name: 'Clap' },
      ]},
      { id: 'KorgKPR77', name: 'Korg KPR-77', type: 'sample', sounds: [
        { id: 'bd', name: 'Bass Drum' }, { id: 'sd', name: 'Snare' }, { id: 'hh', name: 'Hi-Hat' },
        { id: 'oh', name: 'Open Hat' }, { id: 'cp', name: 'Clap' },
      ]},
      { id: 'KorgMinipops', name: 'Korg Minipops', type: 'sample', sounds: [
        { id: 'bd', name: 'Bass Drum' }, { id: 'sd', name: 'Snare' }, { id: 'hh', name: 'Hi-Hat' },
        { id: 'cb', name: 'Cowbell' },
      ]},
      { id: 'AlesisHR16', name: 'Alesis HR-16', type: 'sample', sounds: [
        { id: 'bd', name: 'Bass Drum' }, { id: 'sd', name: 'Snare' }, { id: 'hh', name: 'Hi-Hat' },
        { id: 'oh', name: 'Open Hat' }, { id: 'cp', name: 'Clap' }, { id: 'cr', name: 'Crash' },
        { id: 'rd', name: 'Ride' },
      ]},
      { id: 'AlesisSR16', name: 'Alesis SR-16', type: 'sample', sounds: [
        { id: 'bd', name: 'Bass Drum' }, { id: 'sd', name: 'Snare' }, { id: 'hh', name: 'Hi-Hat' },
        { id: 'oh', name: 'Open Hat' }, { id: 'cp', name: 'Clap' }, { id: 'cr', name: 'Crash' },
      ]},
      { id: 'AkaiMPC60', name: 'Akai MPC60', type: 'sample', sounds: [
        { id: 'bd', name: 'Bass Drum' }, { id: 'sd', name: 'Snare' }, { id: 'hh', name: 'Hi-Hat' },
        { id: 'oh', name: 'Open Hat' }, { id: 'cp', name: 'Clap' },
      ]},
      { id: 'SimmonsSDS5', name: 'Simmons SDS-5', type: 'sample', sounds: [
        { id: 'bd', name: 'Bass Drum' }, { id: 'sd', name: 'Snare' }, { id: 'hh', name: 'Hi-Hat' },
        { id: 'ht', name: 'High Tom' }, { id: 'mt', name: 'Mid Tom' }, { id: 'lt', name: 'Low Tom' },
      ]},
    ],
  },
  {
    id: 'keys',
    name: 'Keys',
    icon: '\u{1F3B9}',
    color: '#5b8de8',
    description: 'Pianos, organs, and keyboards',
    banks: [
      { id: 'gm_piano', name: 'Acoustic Piano', type: 'soundfont', sounds: [
        { id: 'gm_piano', name: 'Acoustic Grand Piano', n: 0 },
        { id: 'gm_piano', name: 'Bright Acoustic', n: 1 },
        { id: 'gm_piano', name: 'Electric Grand', n: 2 },
        { id: 'gm_piano', name: 'Honky-tonk', n: 3 },
      ]},
      { id: 'gm_epiano1', name: 'Electric Piano 1', type: 'soundfont', sounds: [
        { id: 'gm_epiano1', name: 'Electric Piano 1', n: 0 },
      ]},
      { id: 'gm_epiano2', name: 'Electric Piano 2', type: 'soundfont', sounds: [
        { id: 'gm_epiano2', name: 'Electric Piano 2', n: 0 },
      ]},
      { id: 'gm_organ', name: 'Organ', type: 'soundfont', sounds: [
        { id: 'gm_organ', name: 'Drawbar Organ', n: 0 },
        { id: 'gm_organ', name: 'Percussive Organ', n: 1 },
        { id: 'gm_organ', name: 'Rock Organ', n: 2 },
        { id: 'gm_organ', name: 'Church Organ', n: 3 },
      ]},
      { id: 'gm_clavinet', name: 'Clavinet', type: 'soundfont', sounds: [
        { id: 'gm_clavinet', name: 'Clavinet', n: 0 },
      ]},
      { id: 'gm_harpsichord', name: 'Harpsichord', type: 'soundfont', sounds: [
        { id: 'gm_harpsichord', name: 'Harpsichord', n: 0 },
      ]},
    ],
  },
  {
    id: 'strings',
    name: 'Strings',
    icon: '\u{1F3BB}',
    color: '#9b59b6',
    description: 'Orchestral strings and ensembles',
    banks: [
      { id: 'gm_strings', name: 'String Ensemble', type: 'soundfont', sounds: [
        { id: 'gm_strings', name: 'String Ensemble 1', n: 0 },
        { id: 'gm_strings', name: 'String Ensemble 2', n: 1 },
      ]},
      { id: 'gm_pizzicato_strings', name: 'Pizzicato', type: 'soundfont', sounds: [
        { id: 'gm_pizzicato_strings', name: 'Pizzicato Strings', n: 0 },
      ]},
      { id: 'gm_fiddle', name: 'Fiddle', type: 'soundfont', sounds: [
        { id: 'gm_fiddle', name: 'Fiddle', n: 0 },
      ]},
      { id: 'gm_guitar', name: 'Guitar', type: 'soundfont', sounds: [
        { id: 'gm_guitar', name: 'Acoustic Guitar', n: 0 },
        { id: 'gm_guitar', name: 'Jazz Guitar', n: 1 },
        { id: 'gm_guitar', name: 'Clean Electric', n: 2 },
      ]},
      { id: 'gm_distortion_guitar', name: 'Distortion Guitar', type: 'soundfont', sounds: [
        { id: 'gm_distortion_guitar', name: 'Distortion Guitar', n: 0 },
      ]},
    ],
  },
  {
    id: 'bass',
    name: 'Bass',
    icon: '\u{1F3B8}',
    color: '#27ae60',
    description: 'Bass guitars and synth bass',
    banks: [
      { id: 'gm_bass', name: 'Acoustic Bass', type: 'soundfont', sounds: [
        { id: 'gm_bass', name: 'Acoustic Bass', n: 0 },
        { id: 'gm_bass', name: 'Finger Bass', n: 1 },
        { id: 'gm_bass', name: 'Pick Bass', n: 2 },
        { id: 'gm_bass', name: 'Fretless Bass', n: 3 },
        { id: 'gm_bass', name: 'Slap Bass 1', n: 4 },
        { id: 'gm_bass', name: 'Slap Bass 2', n: 5 },
      ]},
      { id: 'gm_synth_bass', name: 'Synth Bass', type: 'soundfont', sounds: [
        { id: 'gm_synth_bass', name: 'Synth Bass 1', n: 0 },
        { id: 'gm_synth_bass', name: 'Synth Bass 2', n: 1 },
      ]},
    ],
  },
  {
    id: 'brass',
    name: 'Brass',
    icon: '\u{1F3BA}',
    color: '#d4a843',
    description: 'Trumpets, trombones, and horns',
    banks: [
      { id: 'gm_trumpet', name: 'Trumpet', type: 'soundfont', sounds: [
        { id: 'gm_trumpet', name: 'Trumpet', n: 0 },
        { id: 'gm_trumpet', name: 'Muted Trumpet', n: 1 },
      ]},
      { id: 'gm_trombone', name: 'Trombone', type: 'soundfont', sounds: [
        { id: 'gm_trombone', name: 'Trombone', n: 0 },
      ]},
      { id: 'gm_french_horn', name: 'French Horn', type: 'soundfont', sounds: [
        { id: 'gm_french_horn', name: 'French Horn', n: 0 },
      ]},
      { id: 'gm_tuba', name: 'Tuba', type: 'soundfont', sounds: [
        { id: 'gm_tuba', name: 'Tuba', n: 0 },
      ]},
    ],
  },
  {
    id: 'woodwinds',
    name: 'Woodwinds',
    icon: '\u{1FA88}',
    color: '#1abc9c',
    description: 'Flutes, clarinets, and reeds',
    banks: [
      { id: 'gm_flute', name: 'Flute', type: 'soundfont', sounds: [
        { id: 'gm_flute', name: 'Flute', n: 0 },
      ]},
      { id: 'gm_piccolo', name: 'Piccolo', type: 'soundfont', sounds: [
        { id: 'gm_piccolo', name: 'Piccolo', n: 0 },
      ]},
      { id: 'gm_recorder', name: 'Recorder', type: 'soundfont', sounds: [
        { id: 'gm_recorder', name: 'Recorder', n: 0 },
      ]},
      { id: 'gm_clarinet', name: 'Clarinet', type: 'soundfont', sounds: [
        { id: 'gm_clarinet', name: 'Clarinet', n: 0 },
      ]},
      { id: 'gm_oboe', name: 'Oboe', type: 'soundfont', sounds: [
        { id: 'gm_oboe', name: 'Oboe', n: 0 },
      ]},
      { id: 'gm_sax', name: 'Saxophone', type: 'soundfont', sounds: [
        { id: 'gm_sax', name: 'Soprano Sax', n: 0 },
        { id: 'gm_sax', name: 'Alto Sax', n: 1 },
        { id: 'gm_sax', name: 'Tenor Sax', n: 2 },
        { id: 'gm_sax', name: 'Baritone Sax', n: 3 },
      ]},
    ],
  },
  {
    id: 'synths',
    name: 'Synths',
    icon: '\u{1F30A}',
    color: '#00bcd4',
    description: 'Synthesizer engines',
    banks: [
      { id: 'synth-engines', name: 'Synth Engines', type: 'synth', sounds: [
        { id: 'sawtooth', name: 'Sawtooth', type: 'synth' },
        { id: 'square', name: 'Square', type: 'synth' },
        { id: 'sine', name: 'Sine', type: 'synth' },
        { id: 'triangle', name: 'Triangle', type: 'synth' },
        { id: 'supersaw', name: 'Supersaw', type: 'synth' },
        { id: 'pink', name: 'Pink Noise', type: 'synth' },
        { id: 'white', name: 'White Noise', type: 'synth' },
      ]},
      { id: 'gm_synth_lead', name: 'Synth Lead', type: 'soundfont', sounds: [
        { id: 'gm_synth_lead', name: 'Square Lead', n: 0 },
        { id: 'gm_synth_lead', name: 'Saw Lead', n: 1 },
        { id: 'gm_synth_lead', name: 'Calliope', n: 2 },
        { id: 'gm_synth_lead', name: 'Chiff', n: 3 },
        { id: 'gm_synth_lead', name: 'Charang', n: 4 },
        { id: 'gm_synth_lead', name: 'Voice', n: 5 },
        { id: 'gm_synth_lead', name: 'Fifths', n: 6 },
        { id: 'gm_synth_lead', name: 'Bass+Lead', n: 7 },
      ]},
    ],
  },
  {
    id: 'pads',
    name: 'Pads',
    icon: '\u{2728}',
    color: '#5c6bc0',
    description: 'Ambient pads and textures',
    banks: [
      { id: 'gm_pad', name: 'Synth Pads', type: 'soundfont', sounds: [
        { id: 'gm_pad', name: 'New Age', n: 0 },
        { id: 'gm_pad', name: 'Warm', n: 1 },
        { id: 'gm_pad', name: 'Polysynth', n: 2 },
        { id: 'gm_pad', name: 'Choir', n: 3 },
        { id: 'gm_pad', name: 'Bowed', n: 4 },
        { id: 'gm_pad', name: 'Metallic', n: 5 },
        { id: 'gm_pad', name: 'Halo', n: 6 },
        { id: 'gm_pad', name: 'Sweep', n: 7 },
      ]},
      { id: 'gm_choir', name: 'Choir', type: 'soundfont', sounds: [
        { id: 'gm_choir', name: 'Choir Aahs', n: 0 },
        { id: 'gm_choir', name: 'Voice Oohs', n: 1 },
      ]},
    ],
  },
  {
    id: 'world',
    name: 'World',
    icon: '\u{1F30D}',
    color: '#e67e22',
    description: 'Global instruments and folk',
    banks: [
      { id: 'gm_sitar', name: 'Sitar', type: 'soundfont', sounds: [
        { id: 'gm_sitar', name: 'Sitar', n: 0 },
      ]},
      { id: 'gm_banjo', name: 'Banjo', type: 'soundfont', sounds: [
        { id: 'gm_banjo', name: 'Banjo', n: 0 },
      ]},
      { id: 'gm_shamisen', name: 'Shamisen', type: 'soundfont', sounds: [
        { id: 'gm_shamisen', name: 'Shamisen', n: 0 },
      ]},
      { id: 'gm_koto', name: 'Koto', type: 'soundfont', sounds: [
        { id: 'gm_koto', name: 'Koto', n: 0 },
      ]},
      { id: 'gm_kalimba', name: 'Kalimba', type: 'soundfont', sounds: [
        { id: 'gm_kalimba', name: 'Kalimba', n: 0 },
      ]},
      { id: 'gm_bagpipe', name: 'Bagpipe', type: 'soundfont', sounds: [
        { id: 'gm_bagpipe', name: 'Bagpipe', n: 0 },
      ]},
    ],
  },
  {
    id: 'weird',
    name: 'Weird',
    icon: '\u{1F47E}',
    color: '#e91e8a',
    description: 'Sound effects and the unexpected',
    banks: [
      { id: 'gm_fx', name: 'FX', type: 'soundfont', sounds: [
        { id: 'gm_fx', name: 'Rain', n: 0 },
        { id: 'gm_fx', name: 'Soundtrack', n: 1 },
        { id: 'gm_fx', name: 'Crystal', n: 2 },
        { id: 'gm_fx', name: 'Atmosphere', n: 3 },
        { id: 'gm_fx', name: 'Brightness', n: 4 },
        { id: 'gm_fx', name: 'Goblins', n: 5 },
        { id: 'gm_fx', name: 'Echoes', n: 6 },
        { id: 'gm_fx', name: 'Sci-Fi', n: 7 },
      ]},
      { id: 'gm_gunshot', name: 'Gunshot', type: 'soundfont', sounds: [
        { id: 'gm_gunshot', name: 'Gunshot', n: 0 },
      ]},
      { id: 'gm_helicopter', name: 'Helicopter', type: 'soundfont', sounds: [
        { id: 'gm_helicopter', name: 'Helicopter', n: 0 },
      ]},
      { id: 'gm_applause', name: 'Applause', type: 'soundfont', sounds: [
        { id: 'gm_applause', name: 'Applause', n: 0 },
      ]},
      { id: 'gm_telephone', name: 'Telephone', type: 'soundfont', sounds: [
        { id: 'gm_telephone', name: 'Telephone Ring', n: 0 },
      ]},
    ],
  },
  {
    id: 'percussion',
    name: 'Percussion',
    icon: '\u{1F514}',
    color: '#f39c12',
    description: 'Tuned and untuned percussion',
    banks: [
      { id: 'gm_timpani', name: 'Timpani', type: 'soundfont', sounds: [
        { id: 'gm_timpani', name: 'Timpani', n: 0 },
      ]},
      { id: 'gm_steel_drums', name: 'Steel Drums', type: 'soundfont', sounds: [
        { id: 'gm_steel_drums', name: 'Steel Drums', n: 0 },
      ]},
      { id: 'gm_woodblock', name: 'Woodblock', type: 'soundfont', sounds: [
        { id: 'gm_woodblock', name: 'Woodblock', n: 0 },
      ]},
      { id: 'gm_taiko', name: 'Taiko Drum', type: 'soundfont', sounds: [
        { id: 'gm_taiko', name: 'Taiko Drum', n: 0 },
      ]},
      { id: 'gm_orchestra_hit', name: 'Orchestra Hit', type: 'soundfont', sounds: [
        { id: 'gm_orchestra_hit', name: 'Orchestra Hit', n: 0 },
      ]},
    ],
  },
];

// --- Lookup helpers ---

// Build a flat bank index for fast lookups
const _bankIndex = {};
SOUND_CATEGORIES.forEach(cat => {
  cat.banks.forEach(bank => {
    _bankIndex[bank.id] = bank;
  });
});

/**
 * Get the sounds array for a given bank ID.
 * @param {string} bankId - The bank ID
 * @returns {Array} Sounds array, or empty array if not found
 */
export function getSoundsForBank(bankId) {
  const bank = _bankIndex[bankId];
  return bank ? bank.sounds : [];
}

/**
 * Pick a random sound from any category/bank.
 * Returns an object matching the row.sound shape:
 *   { type: 'sample'|'synth'|'soundfont', bank: string, name: string, n: number }
 *
 * @returns {Object} Random sound object
 */
export function getRandomSound() {
  const cat = SOUND_CATEGORIES[Math.floor(Math.random() * SOUND_CATEGORIES.length)];
  const bank = cat.banks[Math.floor(Math.random() * cat.banks.length)];
  const sound = bank.sounds[Math.floor(Math.random() * bank.sounds.length)];

  if (bank.type === 'synth' || sound.type === 'synth') {
    return { type: 'synth', bank: sound.id, name: sound.name, n: 0 };
  }
  if (bank.type === 'soundfont') {
    return { type: 'soundfont', bank: sound.id, name: sound.name, n: sound.n || 0 };
  }
  // sample (drum machines)
  return { type: 'sample', bank: bank.id, name: sound.id, n: 0 };
}

/**
 * Convert a sound object to a human-readable label.
 * @param {Object} sound - Sound object with { type, bank, name, n }
 * @returns {string} Human-readable name
 */
export function soundToLabel(sound) {
  if (!sound) return 'None';

  if (sound.type === 'sample') {
    // Find the bank and sound name from catalog
    const bank = _bankIndex[sound.bank];
    if (bank) {
      const entry = bank.sounds.find(s => s.id === sound.name);
      if (entry) return `${bank.name} ${entry.name}`;
      return `${bank.name} ${sound.name}`;
    }
    return `${sound.bank} ${sound.name}`;
  }

  if (sound.type === 'synth') {
    // Synth engines -- just use the name
    return sound.name || sound.bank;
  }

  if (sound.type === 'soundfont') {
    return sound.name || sound.bank;
  }

  return sound.name || 'Unknown';
}

/**
 * Create a serializable key for a sound (used for favorites).
 * Format: "type:bank:name:n"
 * @param {Object} sound - Sound object
 * @returns {string} Serializable key
 */
export function soundToKey(sound) {
  return `${sound.type}:${sound.bank}:${sound.name}:${sound.n || 0}`;
}

/**
 * Find which category a bank belongs to.
 * @param {string} bankId - The bank ID
 * @returns {Object|null} Category object or null
 */
export function getCategoryForBank(bankId) {
  return SOUND_CATEGORIES.find(cat => cat.banks.some(b => b.id === bankId)) || null;
}
