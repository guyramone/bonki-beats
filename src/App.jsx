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
import { DEFAULT_ROWS, SECTIONS } from './utils/rowModel.js';
import { rowsToStrudelCode, generateDisplayCode } from './utils/codeGenerator.js';
import { composeLayerCode, applyVolume, addLayer, removeLayer, toggleSolo, bpmToCps } from './utils/layers.js';

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

  // --- Row Model State (primary sequencer state) ---
  const [rows, setRows] = useState(() => DEFAULT_ROWS.map(r => ({
    ...r,
    pattern: { ...r.pattern, steps: [...r.pattern.steps] },
    effects: { ...r.effects },
    transforms: { ...r.transforms },
    sound: { ...r.sound },
  })));
  const [sections, setSections] = useState(() => SECTIONS.map(s => ({ ...s })));

  // --- Overlay Layer State (pads + presets, separate from sequencer) ---
  const [overlayLayers, setOverlayLayers] = useState([]);

  // --- Playback State ---
  const [isPlaying, setIsPlaying] = useState(false);

  // --- Control State ---
  const [bpm, setBpm] = useState(120);
  const [volume, setVolume] = useState(1);
  const [stepCount, setStepCount] = useState(8);

  // --- Future Phase 3 state (initialized, wired in later plans) ---
  const [globalScale, setGlobalScale] = useState(null);
  const [masterEffects, setMasterEffects] = useState({ djf: 0.5, room: 0, delay: 0, volume: 1 });

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

  // --- Pad Controls ---

  const handlePadTap = (pad) => {
    const padLayer = {
      id: `pad-${pad.id}`,
      name: pad.label,
      type: 'pad',
      code: pad.pattern,
      active: true,
    };

    setOverlayLayers(prev => {
      const updated = addLayer(prev, padLayer);
      evaluateOverlayLayers(updated, volume);
      return updated;
    });
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
  const seqDisplayCode = generateDisplayCode(rows, stepCount, globalScale);
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
            <Sequencer
              key={stepCount}
              rows={rows}
              sections={sections}
              onToggleCell={handleToggleCell}
              stepCount={stepCount}
              onClear={handleClearGrid}
              beatStep={beatStep}
              onToggleSection={handleToggleSection}
            />
          </>
        );
      case 'PADS':
        return <Pads onPadTap={handlePadTap} />;
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
          />
        </aside>
      </div>

      {/* Bonki Speech Bubble -- triggered by preset loads and code view click */}
      <BonkiSpeech message={bonkiMessage} messageKey={bonkiMessageKey} />

      {/* Transport Bar */}
      <Transport onPlay={handlePlay} onStop={handleStop} onHush={handleHush} isPlaying={isPlaying}>
        <Visualizer analyser={getAnalyser()} isPlaying={isPlaying} />
        <Bonki state={isPlaying ? 'vibing' : 'idle'} bpm={bpm} />
      </Transport>
    </div>
  );
}

export default App;
