import React, { useState, useRef, useCallback, useEffect } from 'react';
import { evaluate, hush } from '@strudel/web';
import { initAudio, getScheduler, getAnalyser } from './main.jsx';
import Visualizer from './components/Visualizer.jsx';
import TabBar from './components/TabBar.jsx';
import Sequencer from './components/Sequencer.jsx';
import Pads from './components/Pads.jsx';
import Transport from './components/Transport.jsx';
import Bonki from './components/Bonki.jsx';
import ControlStrip from './components/ControlStrip.jsx';
import LayerChips from './components/LayerChips.jsx';
import CodeView from './components/CodeView.jsx';
import PresetGallery from './components/PresetGallery.jsx';
import BonkiSpeech from './components/BonkiSpeech.jsx';
import ScalePicker from './components/ScalePicker.jsx';
import SoundBrowser from './components/SoundBrowser.jsx';
import MasterStrip from './components/MasterStrip.jsx';
import { DEFAULT_ROWS, SECTIONS, ROW_COLORS, getRowLabel } from './utils/rowModel.js';
import { rowsToStrudelCode, generateDisplayCode } from './utils/codeGenerator.js';
import { composeLayerCode, applyVolume, addLayer, removeLayer, toggleSolo, bpmToCps } from './utils/layers.js';
import { transposeNote, noteNameToIndex, NOTE_NAMES } from './utils/scaleData.js';
import { useSessionPersistence, loadInitialState, clearSession } from './hooks/useSessionPersistence.js';

/**
 * App -- HOMIE Beats instrument shell (Phase 3 row model architecture)
 *
 * Layout: Audio init gate -> Tab bar -> Controls strip -> Layer chips -> Split pane (instrument + code view) -> Transport bar
 *
 * State architecture:
 * - `rows` = primary sequencer state (array of row model objects from rowModel.js)
 * - `sections` = collapsible section state
 * - `overlayLayers` = pad and preset layers (separate from sequencer rows)
 * - Code generator produces Strudel code from rows + overlay layers
 * - BPM via setcps(), volume via .gain(), step count toggles grid width
 */
function App() {
  // --- Audio State ---
  const [audioReady, setAudioReady] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioError, setAudioError] = useState(null);

  // --- UI State ---
  const [activeTab, setActiveTab] = useState('SEQUENCE');

  // --- Session Restore (from localStorage) ---
  const savedSession = useRef(loadInitialState()).current;

  // --- Row Model State (primary sequencer state) ---
  const [rows, setRows] = useState(() => {
    if (savedSession?.rows) {
      // Merge saved rows with DEFAULT_ROWS structure (fill missing fields)
      return DEFAULT_ROWS.map((def, i) => {
        const saved = savedSession.rows[i];
        if (!saved) return { ...def, pattern: { ...def.pattern, steps: [...def.pattern.steps] }, effects: { ...def.effects }, transforms: { ...def.transforms }, sound: { ...def.sound } };
        return {
          ...def,
          ...saved,
          pattern: { ...def.pattern, ...saved.pattern, steps: saved.pattern?.steps ? [...saved.pattern.steps] : [...def.pattern.steps] },
          effects: { ...def.effects, ...saved.effects },
          transforms: { ...def.transforms, ...saved.transforms },
          sound: { ...def.sound, ...saved.sound },
        };
      });
    }
    return DEFAULT_ROWS.map(r => ({
      ...r,
      pattern: { ...r.pattern, steps: [...r.pattern.steps] },
      effects: { ...r.effects },
      transforms: { ...r.transforms },
      sound: { ...r.sound },
    }));
  });
  const [sections, setSections] = useState(() => SECTIONS.map(s => ({ ...s })));

  // --- Overlay Layer State (pads + presets, separate from sequencer) ---
  const [overlayLayers, setOverlayLayers] = useState([]);

  // --- Playback State ---
  const [isPlaying, setIsPlaying] = useState(false);

  // --- Control State ---
  const [bpm, setBpm] = useState(savedSession?.bpm ?? 120);
  const [volume, setVolume] = useState(savedSession?.volume ?? 1);
  const [stepCount, setStepCount] = useState(savedSession?.stepCount ?? 8);

  // --- Scale State ---
  const [rootNote, setRootNote] = useState(savedSession?.rootNote ?? 'C');
  const [scaleName, setScaleName] = useState(savedSession?.scaleName ?? 'major');
  const [scalePickerOpen, setScalePickerOpen] = useState(false);

  // --- Pad Bank State ---
  const [padBank, setPadBank] = useState('A');

  // --- Sound Browser State ---
  const [soundBrowserOpen, setSoundBrowserOpen] = useState(false);
  const [soundBrowserRowIndex, setSoundBrowserRowIndex] = useState(null);

  // Compute globalScale from rootNote + scaleName
  // (null means no scale applied -- only non-null when scale picker has been used)
  const [scaleActive, setScaleActive] = useState(savedSession?.scaleActive ?? false);
  const globalScale = scaleActive ? `${rootNote}:${scaleName}` : null;

  // --- Master Effects State ---
  const [masterEffects, setMasterEffects] = useState(
    savedSession?.masterEffects ?? { djf: 0.5, room: 0, delay: 0, volume: 1 }
  );

  // --- Global Transforms State ---
  const [globalTransforms, setGlobalTransforms] = useState(
    savedSession?.globalTransforms ?? { swing: 0, degradeBy: 0, speed: 1, reverse: false }
  );

  // --- Beat Position State ---
  const [beatStep, setBeatStep] = useState(null);
  const rafRef = useRef(null);

  // --- Code View State ---
  const [flashInfo, setFlashInfo] = useState(null);
  const [bonkiMessage, setBonkiMessage] = useState(null);
  const [bonkiMessageKey, setBonkiMessageKey] = useState(0);

  // --- Bonki Speech Helper ---
  const showBonkiMessage = (text) => {
    setBonkiMessage(text);
    setBonkiMessageKey(k => k + 1);
  };

  // --- Volume Throttle Ref ---
  const volumeThrottleRef = useRef(null);

  // --- Evaluate Throttle Ref (rAF-based for smooth knob interaction) ---
  const evalPendingRef = useRef(false);
  const rowsRef = useRef(rows);
  rowsRef.current = rows;

  // --- Audio Initialization ---

  const handleInit = async () => {
    if (audioLoading || audioReady) return;

    setAudioLoading(true);
    setAudioError(null);

    try {
      await initAudio();
      setAudioReady(true);
    } catch (err) {
      setAudioError(err.message);
      setAudioLoading(false);
    }
  };

  // --- Evaluation Engine ---

  /**
   * Schedule a throttled evaluate call (rAF-based).
   * Reads latest rows from ref to avoid stale closures.
   */
  const scheduleEvaluate = useCallback(() => {
    if (evalPendingRef.current) return;
    evalPendingRef.current = true;
    requestAnimationFrame(() => {
      evalPendingRef.current = false;
      const currentRows = rowsRef.current;
      const seqCode = rowsToStrudelCode(currentRows, stepCount, globalScale, masterEffects);

      // Compose sequencer code + overlay layers
      let finalCode = '';
      const overlayCodes = overlayLayers.filter(l => l.active).map(l => l.code);

      if (seqCode && overlayCodes.length > 0) {
        finalCode = `stack(\n  ${seqCode},\n  ${overlayCodes.join(',\n  ')}\n)`;
      } else if (seqCode) {
        finalCode = seqCode;
      } else if (overlayCodes.length === 1) {
        finalCode = overlayCodes[0];
      } else if (overlayCodes.length > 1) {
        finalCode = `stack(\n  ${overlayCodes.join(',\n  ')}\n)`;
      }

      if (!finalCode) {
        hush();
        setIsPlaying(false);
        return;
      }

      const volumeCode = applyVolume(finalCode, volume);
      evaluate(volumeCode);
      setIsPlaying(true);
    });
  }, [stepCount, globalScale, masterEffects, overlayLayers, volume]);

  /**
   * Evaluate all layers (overlay only -- for when sequencer is not involved).
   * Kept for pad/preset layer management compatibility.
   */
  const evaluateOverlayLayers = useCallback((currentOverlays, currentVolume) => {
    const seqCode = rowsToStrudelCode(rowsRef.current, stepCount, globalScale, masterEffects);
    const overlayCodes = currentOverlays.filter(l => l.active).map(l => l.code);

    let finalCode = '';
    if (seqCode && overlayCodes.length > 0) {
      finalCode = `stack(\n  ${seqCode},\n  ${overlayCodes.join(',\n  ')}\n)`;
    } else if (seqCode) {
      finalCode = seqCode;
    } else if (overlayCodes.length === 1) {
      finalCode = overlayCodes[0];
    } else if (overlayCodes.length > 1) {
      finalCode = `stack(\n  ${overlayCodes.join(',\n  ')}\n)`;
    }

    if (!finalCode) {
      hush();
      setIsPlaying(false);
      return;
    }

    const volumeCode = applyVolume(finalCode, currentVolume);
    evaluate(volumeCode);
    setIsPlaying(true);
  }, [stepCount, globalScale, masterEffects]);

  // --- Sequencer Controls ---

  const handleToggleCell = (rowIndex, stepIndex) => {
    setRows(prev => {
      const next = prev.map((r, i) => {
        if (i !== rowIndex) return r;
        const newSteps = [...r.pattern.steps];
        newSteps[stepIndex] = !newSteps[stepIndex];
        return { ...r, pattern: { ...r.pattern, steps: newSteps } };
      });

      // Update ref immediately for rAF callback
      rowsRef.current = next;

      // Schedule evaluate if playing
      if (isPlaying) {
        scheduleEvaluate();
      }

      // Flash the corresponding line in code view
      setFlashInfo({ line: rowIndex + 1, key: Date.now() });

      return next;
    });
  };

  const handlePlay = () => {
    scheduleEvaluate();
  };

  const handleStop = () => {
    hush();
    setIsPlaying(false);
    // Keep state -- stop doesn't clear
  };

  const handleClearGrid = () => {
    setRows(prev => {
      const next = prev.map(r => ({
        ...r,
        pattern: { ...r.pattern, steps: Array(16).fill(false), euclid: null },
      }));
      rowsRef.current = next;
      return next;
    });

    if (isPlaying) {
      // If overlays exist, re-evaluate without sequencer
      if (overlayLayers.length > 0) {
        evaluateOverlayLayers(overlayLayers, volume);
      } else {
        hush();
        setIsPlaying(false);
      }
    }
  };

  const handleHush = () => {
    // HUSH = panic button: clear everything
    hush();
    setRows(prev => {
      const next = prev.map(r => ({
        ...r,
        pattern: { ...r.pattern, steps: Array(16).fill(false), euclid: null },
      }));
      rowsRef.current = next;
      return next;
    });
    setOverlayLayers([]);
    setIsPlaying(false);
  };

  // --- Section Toggle ---

  const handleToggleSection = (sectionId) => {
    setSections(prev => prev.map(s =>
      s.id === sectionId ? { ...s, collapsed: !s.collapsed } : s
    ));
  };

  // --- Per-Row Effect/Transform/Volume/Mute Handlers (Plan 03-04) ---

  /**
   * Handle effect parameter change from EffectsRack or RowControls.
   * paramPath supports dotted notation: 'cutoff.value', 'cutoff.active', 'filterType', etc.
   */
  const handleEffectChange = (rowIndex, paramPath, value) => {
    setRows(prev => {
      const next = prev.map((r, i) => {
        if (i !== rowIndex) return r;
        const newEffects = { ...r.effects };

        // Handle dotted paths like 'cutoff.value', 'cutoff.active', 'resonance.value'
        const parts = paramPath.split('.');
        if (parts.length === 2) {
          const [param, field] = parts;
          if (typeof newEffects[param] === 'object' && newEffects[param] !== null) {
            newEffects[param] = { ...newEffects[param], [field]: value };
          } else {
            newEffects[param] = value;
          }
        } else {
          newEffects[paramPath] = value;
        }

        return { ...r, effects: newEffects };
      });

      rowsRef.current = next;

      if (isPlaying) {
        scheduleEvaluate();
      }

      // Bonki reacts to effect activation
      const baseParam = paramPath.split('.')[0];
      if (paramPath.endsWith('.active') && value) {
        if (baseParam === 'room') triggerBonkiReaction('reverb');
        else if (baseParam === 'delay') triggerBonkiReaction('delay');
        else if (baseParam === 'distort') triggerBonkiReaction('distortion');
        else if (baseParam === 'cutoff' || baseParam === 'hcutoff') triggerBonkiReaction('filter');
      }
      if (baseParam === 'crush' || baseParam === 'coarse') triggerBonkiReaction('lofi');

      return next;
    });
  };

  /**
   * Handle transform parameter change (swing, degradeBy, speed, reverse).
   */
  const handleTransformChange = (rowIndex, param, value) => {
    setRows(prev => {
      const next = prev.map((r, i) => {
        if (i !== rowIndex) return r;
        return { ...r, transforms: { ...r.transforms, [param]: value } };
      });

      rowsRef.current = next;

      if (isPlaying) {
        scheduleEvaluate();
      }

      return next;
    });
  };

  /**
   * Handle per-row volume change from RowControls.
   */
  const handleRowVolumeChange = (rowIndex, value) => {
    setRows(prev => {
      const next = prev.map((r, i) => {
        if (i !== rowIndex) return r;
        return { ...r, volume: value };
      });

      rowsRef.current = next;

      if (isPlaying) {
        scheduleEvaluate();
      }

      return next;
    });
  };

  /**
   * Handle mute toggle from RowControls.
   */
  const handleMuteToggle = (rowIndex) => {
    setRows(prev => {
      const next = prev.map((r, i) => {
        if (i !== rowIndex) return r;
        return { ...r, muted: !r.muted };
      });

      rowsRef.current = next;

      if (isPlaying) {
        scheduleEvaluate();
      }

      return next;
    });
  };

  // --- Sound Browser ---

  const handleOpenSoundBrowser = (rowIndex) => {
    setSoundBrowserRowIndex(rowIndex);
    setSoundBrowserOpen(true);
  };

  const handleSoundSelect = (sound) => {
    if (soundBrowserRowIndex === null) return;

    setRows(prev => {
      const next = prev.map((r, i) => {
        if (i !== soundBrowserRowIndex) return r;

        // If switching to/from synth/soundfont, update note/octave defaults
        const needsNote = sound.type === 'synth' || sound.type === 'soundfont';
        const hadNote = r.sound.type === 'synth' || r.sound.type === 'soundfont';
        const note = needsNote ? (r.note || `c${r.octave}`) : r.note;

        return { ...r, sound: { ...sound }, note };
      });
      rowsRef.current = next;
      return next;
    });

    setSoundBrowserOpen(false);
    setSoundBrowserRowIndex(null);

    if (isPlaying) {
      scheduleEvaluate();
    }

    // Bonki reacts to sound type
    if (sound.type === 'synth') triggerBonkiReaction('synth');
    else if (sound.type === 'soundfont') triggerBonkiReaction('soundfont');
    else triggerBonkiReaction('drumSwap');
  };

  const handleCloseSoundBrowser = () => {
    setSoundBrowserOpen(false);
    setSoundBrowserRowIndex(null);
  };

  // --- Euclidean Pattern Control ---

  const handleEuclideanChange = (rowIndex, euclid) => {
    setRows(prev => {
      const next = prev.map((r, i) => {
        if (i !== rowIndex) return r;
        return { ...r, pattern: { ...r.pattern, euclid } };
      });
      rowsRef.current = next;
      if (isPlaying) scheduleEvaluate();
      return next;
    });
    triggerBonkiReaction('euclidean');
  };

  const handleSwitchToEuclid = (rowIndex) => {
    setRows(prev => {
      const next = prev.map((r, i) => {
        if (i !== rowIndex) return r;
        return {
          ...r,
          pattern: {
            ...r.pattern,
            euclid: { pulses: 3, steps: 8, rotation: 0 },
            steps: Array(16).fill(false),
          },
        };
      });
      rowsRef.current = next;
      if (isPlaying) scheduleEvaluate();
      return next;
    });
  };

  const handleSwitchToManual = (rowIndex) => {
    setRows(prev => {
      const next = prev.map((r, i) => {
        if (i !== rowIndex) return r;
        return { ...r, pattern: { ...r.pattern, euclid: null } };
      });
      rowsRef.current = next;
      if (isPlaying) scheduleEvaluate();
      return next;
    });
  };

  // --- Pad Controls ---

  /**
   * Trigger a one-shot sound for the given row index.
   * Evaluates a single note/sample as a quick fire-and-forget, independent of sequencer.
   */
  const handlePadTap = (rowIndex) => {
    const row = rows[rowIndex];
    if (!row) return;

    let oneShotCode = '';

    if (row.sound.type === 'sample') {
      oneShotCode = `s("${row.sound.bank}_${row.sound.name}")`;
      if (row.sound.n > 0) oneShotCode += `.n(${row.sound.n})`;
    } else if (row.sound.type === 'synth') {
      const noteStr = row.note || `c${row.octave}`;
      oneShotCode = `note("${noteStr}").s("${row.sound.bank}").release(0.3)`;
    } else if (row.sound.type === 'soundfont') {
      const noteStr = row.note || `c${row.octave}`;
      oneShotCode = `note("${noteStr}").s("${row.sound.bank}").release(0.3)`;
    }

    if (oneShotCode) {
      oneShotCode += `.gain(${row.volume.toFixed(2)})`;
      evaluate(oneShotCode);
    }
  };

  // --- Layer Chip Controls ---

  const handleRemoveLayer = (layerId) => {
    setOverlayLayers(prev => {
      const updated = removeLayer(prev, layerId);
      if (isPlaying) {
        evaluateOverlayLayers(updated, volume);
      }
      return updated;
    });
  };

  const handleToggleSolo = (layerId) => {
    setOverlayLayers(prev => {
      const updated = toggleSolo(prev, layerId);
      if (isPlaying) {
        evaluateOverlayLayers(updated, volume);
      }
      return updated;
    });
  };

  // --- Preset Controls ---

  const handlePresetSelect = (preset) => {
    setBpm(preset.bpm);
    evaluate(`setcps(${bpmToCps(preset.bpm)})`);
    evaluate(preset.code);
    setIsPlaying(true);
    showBonkiMessage(preset.bonkiLine);
  };

  const handlePresetAdd = (preset) => {
    setBpm(preset.bpm);
    evaluate(`setcps(${bpmToCps(preset.bpm)})`);

    const presetLayer = {
      id: `preset-${preset.id}`,
      name: preset.name,
      type: 'preset',
      code: preset.code,
      active: true,
    };

    setOverlayLayers(prev => {
      const updated = addLayer(prev, presetLayer);
      evaluateOverlayLayers(updated, volume);
      return updated;
    });

    showBonkiMessage(preset.bonkiLine);
  };

  // --- BPM Control ---

  const handleBpmChange = (newBpm) => {
    setBpm(newBpm);
    evaluate(`setcps(${bpmToCps(newBpm)})`);
    if (isPlaying) {
      scheduleEvaluate();
    }
  };

  // --- Volume Control (throttled) ---

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);

    if (volumeThrottleRef.current) return;

    volumeThrottleRef.current = setTimeout(() => {
      volumeThrottleRef.current = null;
      if (isPlaying) {
        scheduleEvaluate();
      }
    }, 100);
  };

  // --- Step Count Control ---

  const handleStepCountChange = (newCount) => {
    setStepCount(newCount);
    if (isPlaying) {
      // scheduleEvaluate will pick up new stepCount on next rAF
      // (but stepCount is captured in closure -- need to trigger re-evaluate)
      // Use setTimeout to let React state update first
      setTimeout(() => scheduleEvaluate(), 0);
    }
  };

  // --- Scale Controls ---

  const handleRootChange = (newRoot) => {
    const oldRoot = rootNote;
    setRootNote(newRoot);
    if (!scaleActive) setScaleActive(true);

    // Auto-transpose melodic rows to maintain relative intervals in new key
    setRows(prev => {
      const next = prev.map(r => {
        if (r.sound.type !== 'synth' && r.sound.type !== 'soundfont') return r;
        if (!r.note) return r;
        // Extract note name (strip octave number)
        const noteName = r.note.replace(/[0-9]/g, '');
        const octaveMatch = r.note.match(/[0-9]/);
        const octave = octaveMatch ? octaveMatch[0] : r.octave;
        const transposed = transposeNote(noteName, oldRoot, newRoot);
        return {
          ...r,
          note: `${transposed.toLowerCase()}${octave}`,
        };
      });
      rowsRef.current = next;
      return next;
    });

    if (isPlaying) {
      setTimeout(() => scheduleEvaluate(), 0);
    }
  };

  const handleScaleChange = (newScale) => {
    setScaleName(newScale);
    if (!scaleActive) setScaleActive(true);
    if (isPlaying) {
      setTimeout(() => scheduleEvaluate(), 0);
    }

    // Bonki reacts to scale type
    if (newScale === 'minor' || newScale === 'dorian' || newScale === 'phrygian') {
      triggerBonkiReaction('scaleMinor');
    } else if (newScale === 'major' || newScale === 'mixolydian' || newScale === 'lydian') {
      triggerBonkiReaction('scaleMajor');
    } else {
      triggerBonkiReaction('scaleExotic');
    }
  };

  const handleNotePreview = (noteName, octave) => {
    // Find first melodic row to determine instrument sound
    const melodicRow = rows.find(r => r.sound.type === 'synth' || r.sound.type === 'soundfont');
    const soundName = melodicRow ? melodicRow.sound.bank : 'sawtooth';
    // Play a one-shot note preview
    evaluate(`note("${noteName.toLowerCase()}${octave}").s("${soundName}").release(0.3).gain(0.5)`);
  };

  const handleOctaveChange = (rowIndex, newOctave) => {
    setRows(prev => {
      const next = prev.map((r, i) => {
        if (i !== rowIndex) return r;
        const noteName = r.note ? r.note.replace(/[0-9]/g, '') : 'c';
        return {
          ...r,
          octave: newOctave,
          note: `${noteName}${newOctave}`,
        };
      });
      rowsRef.current = next;
      return next;
    });
    if (isPlaying) {
      scheduleEvaluate();
    }
  };

  const handleScalePickerToggle = () => {
    setScalePickerOpen(prev => !prev);
  };

  // --- Master Effect Controls ---

  const handleMasterEffectChange = (param, value) => {
    setMasterEffects(prev => ({ ...prev, [param]: value }));
    if (isPlaying) {
      setTimeout(() => scheduleEvaluate(), 0);
    }

    if (param === 'djf' && value !== 0.5) triggerBonkiReaction('djFilter');
    else if (param === 'room' && value > 0) triggerBonkiReaction('reverb');
    else if (param === 'delay' && value > 0) triggerBonkiReaction('delay');
  };

  const handleGlobalTransformChange = (param, value) => {
    setGlobalTransforms(prev => ({ ...prev, [param]: value }));
    if (isPlaying) {
      setTimeout(() => scheduleEvaluate(), 0);
    }
  };

  // --- New Session ---

  const handleNewSession = () => {
    clearSession();
    setRows(DEFAULT_ROWS.map(r => ({
      ...r,
      pattern: { ...r.pattern, steps: [...r.pattern.steps] },
      effects: { ...r.effects },
      transforms: { ...r.transforms },
      sound: { ...r.sound },
    })));
    setBpm(120);
    setVolume(1);
    setStepCount(8);
    setRootNote('C');
    setScaleName('major');
    setScaleActive(false);
    setMasterEffects({ djf: 0.5, room: 0, delay: 0, volume: 1 });
    setGlobalTransforms({ swing: 0, degradeBy: 0, speed: 1, reverse: false });
    setOverlayLayers([]);
    hush();
    setIsPlaying(false);
    showBonkiMessage("fresh start! let's make something new");
  };

  // --- Bonki Reaction System (throttled, randomized) ---

  const bonkiCooldownRef = useRef(0);
  const lastBonkiMsgRef = useRef('');
  const bonkiEventCountRef = useRef(0);

  const BONKI_REACTIONS = {
    reverb: ["ooh, spacey!", "floaty vibes", "big room energy", "dreamy!"],
    delay: ["echo echo echo...", "that's got bounce", "trippy!", "delayed gratification"],
    distortion: ["crunch time!", "now we're cooking", "gnarly!", "raw power!"],
    lofi: ["Game Boy vibes!", "retro!", "perfectly imperfect", "lo-fi chill"],
    filter: ["sweep it!", "wah wah!", "filtered!", "smooth operator"],
    synth: ["synthesized!", "buzzy!", "phat!", "electronic vibes"],
    soundfont: ["fancy!", "orchestral!", "classy choice", "going acoustic"],
    drumSwap: ["classic!", "fresh kit!", "nice swap", "new flavor"],
    scaleMinor: ["ooh, minor vibes", "moody!", "dark side energy"],
    scaleMajor: ["major key energy!", "bright and happy", "sunshine vibes"],
    scaleExotic: ["getting exotic!", "world sounds!", "adventurous!"],
    euclidean: ["world rhythm!", "mathematical!", "Bjorklund approved"],
    djFilter: ["dropping it!", "filter time!", "sweep sweep!"],
    randomize: ["surprise me!", "controlled chaos!", "what did we get?"],
  };

  const BONKI_SUGGESTIONS = [
    "try adding some reverb to the mix!",
    "that kick pairs nice with a supersaw bass...",
    "try euclidean 5,16 for a Bossa Nova feel",
    "sweep the DJ filter for a drop!",
    "try the Lo-Fi preset for chill vibes",
    "add some delay for extra bounce",
  ];

  const triggerBonkiReaction = useCallback((category) => {
    const now = Date.now();
    if (now - bonkiCooldownRef.current < 3000) return;

    const messages = BONKI_REACTIONS[category];
    if (!messages) return;

    // Pick random, avoid repeat
    let msg;
    do {
      msg = messages[Math.floor(Math.random() * messages.length)];
    } while (msg === lastBonkiMsgRef.current && messages.length > 1);

    bonkiCooldownRef.current = now;
    lastBonkiMsgRef.current = msg;
    showBonkiMessage(msg);

    // Occasional suggestion (20% chance after 5+ events)
    bonkiEventCountRef.current++;
    if (bonkiEventCountRef.current > 5 && Math.random() < 0.2) {
      setTimeout(() => {
        const suggestion = BONKI_SUGGESTIONS[Math.floor(Math.random() * BONKI_SUGGESTIONS.length)];
        showBonkiMessage(suggestion);
      }, 4000);
    }
  }, []);

  // --- Session Persistence ---
  useSessionPersistence({
    rows, bpm, stepCount, volume, rootNote, scaleName,
    scaleActive, masterEffects, globalTransforms,
  });

  // --- Beat Position Tracking (Strudel scheduler -- audio-accurate) ---
  useEffect(() => {
    if (isPlaying) {
      const tick = () => {
        const scheduler = getScheduler();
        if (scheduler && scheduler.now) {
          const cyclePos = scheduler.now();
          const fractional = cyclePos % 1;
          const currentStep = Math.floor(fractional * stepCount);
          setBeatStep(currentStep);
        }
        rafRef.current = requestAnimationFrame(tick);
      };

      rafRef.current = requestAnimationFrame(tick);

      return () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      };
    } else {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      setBeatStep(null);
    }
  }, [isPlaying, stepCount]);

  // --- Code View: derive display code from rows + overlay layers ---
  const seqDisplayCode = generateDisplayCode(rows, stepCount, globalScale, masterEffects);
  const overlayCodes = overlayLayers.filter(l => l.active).map(l => l.code);
  let displayCode = '';
  if (seqDisplayCode && overlayCodes.length > 0) {
    displayCode = `stack(\n  ${seqDisplayCode},\n  ${overlayCodes.join(',\n  ')}\n)`;
  } else if (seqDisplayCode) {
    displayCode = seqDisplayCode;
  } else if (overlayCodes.length === 1) {
    displayCode = overlayCodes[0];
  } else if (overlayCodes.length > 1) {
    displayCode = `stack(\n  ${overlayCodes.join(',\n  ')}\n)`;
  }

  // --- Code Click: read-only gatekeeping via Bonki ---
  const handleCodeClick = () => {
    showBonkiMessage("not yet, human -- I'll teach you soon");
  };

  // --- Tab Content Routing ---

  const renderTabContent = () => {
    switch (activeTab) {
      case 'SEQUENCE':
        return (
          <>
            <PresetGallery
              onPresetSelect={handlePresetSelect}
              onPresetAdd={handlePresetAdd}
            />
            {scalePickerOpen && (
              <ScalePicker
                rootNote={rootNote}
                scaleName={scaleName}
                onRootChange={handleRootChange}
                onScaleChange={handleScaleChange}
                onNotePreview={handleNotePreview}
                rows={rows}
                onOctaveChange={handleOctaveChange}
                rowColors={ROW_COLORS}
                getRowLabel={getRowLabel}
              />
            )}
            <Sequencer
              key={stepCount}
              rows={rows}
              sections={sections}
              onToggleCell={handleToggleCell}
              stepCount={stepCount}
              onClear={handleClearGrid}
              beatStep={beatStep}
              onToggleSection={handleToggleSection}
              onEffectChange={handleEffectChange}
              onTransformChange={handleTransformChange}
              onVolumeChange={handleRowVolumeChange}
              onSoundBrowserOpen={handleOpenSoundBrowser}
              onMuteToggle={handleMuteToggle}
              onEuclideanChange={handleEuclideanChange}
              onSwitchToEuclid={handleSwitchToEuclid}
              onSwitchToManual={handleSwitchToManual}
              globalTransforms={globalTransforms}
            />
          </>
        );
      case 'PADS':
        return (
          <Pads
            rows={rows}
            onPadTap={handlePadTap}
            activeBank={padBank}
            onBankChange={setPadBank}
          />
        );
      case 'AI':
        return (
          <div className="ai-placeholder">
            <span className="placeholder-icon">&#128564;</span>
            <p className="placeholder-title">Bonki is napping...</p>
            <p>AI comes in Phase 4</p>
          </div>
        );
      default:
        return null;
    }
  };

  // --- Render ---

  return (
    <div className="app">
      {/* Audio Init Overlay -- gates Strudel behind user gesture */}
      {!audioReady && (
        <div className="init-overlay">
          <h1>HOMIE Beats</h1>
          <p className="init-subtitle">A Strudel beatpad</p>
          <button
            className="init-button"
            onClick={handleInit}
            disabled={audioLoading}
            aria-label="Initialize audio engine"
          >
            {audioLoading ? 'Loading...' : 'Tap to Start'}
          </button>
          {audioError && (
            <p className="init-error">Error: {audioError}</p>
          )}
        </div>
      )}

      {/* Tab Navigation */}
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Controls Strip -- always visible across all tabs */}
      <ControlStrip
        bpm={bpm}
        onBpmChange={handleBpmChange}
        volume={volume}
        onVolumeChange={handleVolumeChange}
        stepCount={stepCount}
        onStepCountChange={handleStepCountChange}
        isPlaying={isPlaying}
        scalePickerOpen={scalePickerOpen}
        onScaleToggle={handleScalePickerToggle}
      />

      {/* Layer Chips -- visible when overlay layers exist */}
      {overlayLayers.length > 0 && (
        <LayerChips
          layers={overlayLayers}
          onRemove={handleRemoveLayer}
          onToggleSolo={handleToggleSolo}
        />
      )}

      {/* Split Pane: Instrument + Code View */}
      <div className="split-pane">
        <main className="split-pane-instrument" role="tabpanel" aria-label={`${activeTab} panel`}>
          {renderTabContent()}
        </main>
        <aside className="split-pane-code">
          <CodeView
            code={displayCode}
            onCodeClick={handleCodeClick}
            flashLine={flashInfo?.line}
            flashKey={flashInfo?.key}
            beatStep={beatStep}
            stepCount={stepCount}
            rows={rows}
          />
        </aside>
      </div>

      {/* Sound Browser Modal */}
      <SoundBrowser
        isOpen={soundBrowserOpen}
        onClose={handleCloseSoundBrowser}
        onSelect={handleSoundSelect}
        currentSound={soundBrowserRowIndex !== null ? rows[soundBrowserRowIndex]?.sound : null}
        onBonkiReaction={showBonkiMessage}
      />

      {/* Bonki Speech Bubble -- triggered by preset loads and code view click */}
      <BonkiSpeech message={bonkiMessage} messageKey={bonkiMessageKey} />

      {/* Master Effects Strip -- always visible above transport */}
      <MasterStrip
        masterEffects={masterEffects}
        onMasterEffectChange={handleMasterEffectChange}
        globalTransforms={globalTransforms}
        onGlobalTransformChange={handleGlobalTransformChange}
      />

      {/* Transport Bar */}
      <Transport onPlay={handlePlay} onStop={handleStop} onHush={handleHush} isPlaying={isPlaying}>
        <Visualizer analyser={getAnalyser()} isPlaying={isPlaying} />
        <Bonki state={isPlaying ? 'vibing' : 'idle'} bpm={bpm} />
      </Transport>
    </div>
  );
}

export default App;
