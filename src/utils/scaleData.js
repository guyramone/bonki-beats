/**
 * scaleData.js -- Scale data, note math, and degree labels for the ScalePicker.
 *
 * Provides curated scale names organized by category, interval maps for
 * computing which chromatic notes belong to a scale, degree labels,
 * and note-to-string utilities.
 *
 * Exports: NOTE_NAMES, SCALE_GROUPS, SCALE_NAMES, ALL_SCALE_NAMES,
 *          SCALE_INTERVALS, getScaleNotes, noteToString, getScaleDegreeLabel
 */

// --- Chromatic note names ---
export const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Flat enharmonic names (for display in certain scales)
const FLAT_NAMES = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

// --- Scale intervals (semitone offsets from root) ---
// Each array lists the semitone positions of in-scale notes.

export const SCALE_INTERVALS = {
  // Common
  'major': [0, 2, 4, 5, 7, 9, 11],
  'minor': [0, 2, 3, 5, 7, 8, 10],
  'harmonic minor': [0, 2, 3, 5, 7, 8, 11],
  'melodic minor': [0, 2, 3, 5, 7, 9, 11],

  // Pentatonic
  'major pentatonic': [0, 2, 4, 7, 9],
  'minor pentatonic': [0, 3, 5, 7, 10],
  'blues': [0, 3, 5, 6, 7, 10],

  // Modal
  'dorian': [0, 2, 3, 5, 7, 9, 10],
  'phrygian': [0, 1, 3, 5, 7, 8, 10],
  'lydian': [0, 2, 4, 6, 7, 9, 11],
  'mixolydian': [0, 2, 4, 5, 7, 9, 10],
  'locrian': [0, 1, 3, 5, 6, 8, 10],
  'aeolian': [0, 2, 3, 5, 7, 8, 10],

  // Jazz
  'bebop': [0, 2, 4, 5, 7, 9, 10, 11],
  'altered': [0, 1, 3, 4, 6, 8, 10],
  'lydian dominant': [0, 2, 4, 6, 7, 9, 10],
  'whole tone': [0, 2, 4, 6, 8, 10],

  // World
  'hungarian minor': [0, 2, 3, 6, 7, 8, 11],
  'flamenco': [0, 1, 4, 5, 7, 8, 11],
  'persian': [0, 1, 4, 5, 6, 8, 11],
  'arabic': [0, 2, 4, 5, 6, 8, 10],
  'egyptian': [0, 2, 5, 7, 10],
  'hirajoshi': [0, 4, 6, 7, 11],
  'pelog': [0, 1, 3, 7, 8],
  'in-sen': [0, 1, 5, 7, 10],

  // Exotic
  'chromatic': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  'diminished': [0, 2, 3, 5, 6, 8, 9, 11],
  'half-whole diminished': [0, 1, 3, 4, 6, 7, 9, 10],
  'enigmatic': [0, 1, 4, 6, 8, 10, 11],
};

// --- Curated scale groups for the dropdown ---

export const SCALE_GROUPS = [
  {
    label: 'Common',
    scales: ['major', 'minor', 'harmonic minor', 'melodic minor'],
  },
  {
    label: 'Pentatonic',
    scales: ['major pentatonic', 'minor pentatonic', 'blues'],
  },
  {
    label: 'Modal',
    scales: ['dorian', 'phrygian', 'lydian', 'mixolydian', 'locrian', 'aeolian'],
  },
  {
    label: 'Jazz',
    scales: ['bebop', 'altered', 'lydian dominant', 'whole tone'],
  },
  {
    label: 'World',
    scales: ['hungarian minor', 'flamenco', 'persian', 'arabic', 'egyptian', 'hirajoshi', 'pelog', 'in-sen'],
  },
  {
    label: 'Exotic',
    scales: ['chromatic', 'diminished', 'half-whole diminished', 'enigmatic'],
  },
];

// Flat list of curated scale names (for quick lookup)
export const SCALE_NAMES = SCALE_GROUPS.flatMap(g => g.scales);

// Full list of 92 scales from @tonaljs/tonal (extended set — shown via "Show all" toggle).
// Includes the curated set above plus many more.
export const ALL_SCALE_NAMES = [
  ...SCALE_NAMES,
  // Additional scales available in @tonaljs/tonal (not in curated groups)
  'ionian', 'phrygian dominant', 'double harmonic major', 'double harmonic lydian',
  'hungarian major', 'neapolitan minor', 'neapolitan major',
  'balinese', 'todi raga', 'purvi raga', 'kafi raga',
  'bebop minor', 'bebop major', 'bebop dominant',
  'iwato', 'ritusen', 'scriabin',
  'oriental', 'prometheus', 'prometheus neapolitan',
  'six tone symmetric', 'augmented', 'augmented heptatonic',
  'leading whole tone', 'lydian augmented', 'lydian minor',
  'lydian diminished', 'major flat two pentatonic', 'minor six pentatonic',
  'minor hexatonic', 'major augmented', 'major pentatonic',
  'composite blues', 'mystery #1',
  'super locrian pentatonic', 'minor #7M pentatonic',
  'locrian pentatonic', 'ichikosucho',
  'minor bebop', 'minor six diminished',
  'lydian #5P pentatonic', 'lydian #9',
  'messiaen mode 3', 'messiaen mode 4', 'messiaen mode 5',
  'messiaen mode 6', 'messiaen mode 7',
  'piongio', 'kumoi',
  'malkos raga', 'puriya dhanashri',
].filter((name, i, arr) => arr.indexOf(name) === i); // deduplicate

/**
 * Get which note index (0-11) corresponds to a given note name.
 * @param {string} name - Note name (e.g., 'C', 'C#', 'Db', 'Eb')
 * @returns {number} Semitone index (0-11)
 */
export function noteNameToIndex(name) {
  const sharp = NOTE_NAMES.indexOf(name);
  if (sharp >= 0) return sharp;
  const flat = FLAT_NAMES.indexOf(name);
  if (flat >= 0) return flat;
  // Handle lowercase
  const upper = name.charAt(0).toUpperCase() + name.slice(1);
  const sharpU = NOTE_NAMES.indexOf(upper);
  if (sharpU >= 0) return sharpU;
  const flatU = FLAT_NAMES.indexOf(upper);
  if (flatU >= 0) return flatU;
  return 0; // fallback
}

/**
 * Determine if a scale "wants" flat note names or sharp note names.
 * Scales in flat keys (F, Bb, Eb, Ab, Db, Gb) prefer flats.
 * @param {string} root - Root note name
 * @returns {boolean} true if flats are preferred
 */
function prefersFlats(root) {
  const flatRoots = ['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb'];
  return flatRoots.includes(root);
}

/**
 * Get the 12 chromatic notes with scale membership info for a given root + scale.
 * Returns array of 12 note objects for one octave.
 *
 * @param {string} root - Root note name (e.g., 'C', 'D#', 'Eb')
 * @param {string} scaleName - Scale name (e.g., 'minor pentatonic')
 * @returns {Array<{note: string, index: number, degree: number|null, inScale: boolean, isBlack: boolean}>}
 */
export function getScaleNotes(root, scaleName) {
  const rootIndex = noteNameToIndex(root);
  const intervals = SCALE_INTERVALS[scaleName];
  const useFlats = prefersFlats(root);
  const names = useFlats ? FLAT_NAMES : NOTE_NAMES;

  // Compute which chromatic positions are in the scale
  const inScaleSet = new Set();
  const degreeMap = new Map();

  if (intervals) {
    intervals.forEach((semitone, i) => {
      const pos = (rootIndex + semitone) % 12;
      inScaleSet.add(pos);
      degreeMap.set(pos, i + 1);
    });
  }

  // Build 12 note objects
  const notes = [];
  for (let i = 0; i < 12; i++) {
    const isInScale = inScaleSet.has(i);
    const isBlack = [1, 3, 6, 8, 10].includes(i); // C#, D#, F#, G#, A#
    notes.push({
      note: names[i],
      index: i,
      degree: isInScale ? degreeMap.get(i) : null,
      inScale: isInScale,
      isBlack,
    });
  }

  return notes;
}

/**
 * Convert a note name + octave to a string like "C3" or "D#4".
 * @param {string} noteName - Note name
 * @param {number} octave - Octave number
 * @returns {string}
 */
export function noteToString(noteName, octave) {
  return `${noteName}${octave}`;
}

/**
 * Get a display label showing note name and scale degree.
 * Returns "C=1" for the root, "D=2" for the second degree, etc.
 * Returns null for out-of-scale notes.
 *
 * @param {string} noteName - Note name
 * @param {string} root - Root note name
 * @param {string} scaleName - Scale name
 * @returns {string|null}
 */
export function getScaleDegreeLabel(noteName, root, scaleName) {
  const noteIndex = noteNameToIndex(noteName);
  const rootIndex = noteNameToIndex(root);
  const intervals = SCALE_INTERVALS[scaleName];
  if (!intervals) return null;

  const semitone = (noteIndex - rootIndex + 12) % 12;
  const degreeIndex = intervals.indexOf(semitone);
  if (degreeIndex < 0) return null;

  return `${noteName}=${degreeIndex + 1}`;
}

/**
 * Compute the transposed note when changing root key.
 * Maintains the interval relationship from the old root.
 *
 * @param {string} currentNote - Current note name (e.g., 'C', 'D#')
 * @param {string} oldRoot - Previous root note name
 * @param {string} newRoot - New root note name
 * @returns {string} Transposed note name
 */
export function transposeNote(currentNote, oldRoot, newRoot) {
  const noteIdx = noteNameToIndex(currentNote);
  const oldIdx = noteNameToIndex(oldRoot);
  const newIdx = noteNameToIndex(newRoot);
  const interval = (noteIdx - oldIdx + 12) % 12;
  const newNoteIdx = (newIdx + interval) % 12;
  return NOTE_NAMES[newNoteIdx];
}
