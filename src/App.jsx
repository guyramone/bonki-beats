import React, { useState, useRef, useCallback, useEffect } from 'react';
import { evaluate, hush } from '@strudel/web';
import { initAudio, getScheduler } from './main.jsx';
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
import { sequencerToPattern, SOUNDS, DEFAULT_GRID } from './utils/patterns.js';
import { composeLayerCode, applyVolume, addLayer, removeLayer, toggleSolo, bpmToCps } from './utils/layers.js';

/**
 * App — HOMIE Beats instrument shell
 *
 * Layout: Audio init gate -> Tab bar -> Controls strip -> Layer chips -> Split pane (instrument + code view) -> Transport bar
 * Multi-layer architecture: sequencer + pads compose via stack() through the layer manager.
 * BPM via setcps(), volume via .gain(), step count toggles grid width.
 * Code view shows live Strudel code with syntax highlighting, always visible.
 */
function App() {
  // --- Audio State ---
  const [audioReady, setAudioReady] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioError, setAudioError] = useState(null);

  // --- UI State ---
  const [activeTab, setActiveTab] = useState('SEQUENCE');

  // --- Layer State ---
  const [layers, setLayers] = useState([]);
  const [grid, setGrid] = useState(DEFAULT_GRID);
  const [isPlaying, setIsPlaying] = useState(false);

  // --- Control State ---
  const [bpm, setBpm] = useState(120);
  const [volume, setVolume] = useState(1);
  const [stepCount, setStepCount] = useState(8);

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

  // --- Layer Evaluation Engine ---

  /**
   * Evaluate all active layers as a single composed Strudel pattern.
   * If no active layers, hush and stop. Otherwise, apply volume and evaluate.
   */
  const evaluateAllLayers = useCallback((currentLayers, currentVolume) => {
    const code = composeLayerCode(currentLayers);
    if (!code) {
      hush();
      setIsPlaying(false);
      return;
    }
    const finalCode = applyVolume(code, currentVolume);
    evaluate(finalCode);
    setIsPlaying(true);
  }, []);

  // --- Sequencer Controls ---

  const handleToggleCell = (row, step) => {
    setGrid(prev => {
      const next = prev.map(r => [...r]);
      next[row][step] = !next[row][step];

      // Generate pattern from updated grid
      const pattern = sequencerToPattern(next, SOUNDS, stepCount);

      // Update the sequencer layer
      const seqLayer = {
        id: 'sequencer',
        name: 'Sequencer',
        type: 'sequencer',
        code: pattern,
        active: true,
      };

      if (pattern) {
        setLayers(prevLayers => {
          const updatedLayers = addLayer(prevLayers, seqLayer);
          // Live rebuild: if playing, re-evaluate with all layers
          if (isPlaying) {
            evaluateAllLayers(updatedLayers, volume);
          }
          return updatedLayers;
        });
      } else {
        // No active cells in sequencer — remove the sequencer layer
        setLayers(prevLayers => {
          const updatedLayers = removeLayer(prevLayers, 'sequencer');
          if (isPlaying) {
            evaluateAllLayers(updatedLayers, volume);
          }
          return updatedLayers;
        });
      }

      // Flash the corresponding line in code view.
      // sequencerToPattern generates one line per sound row inside stack(),
      // so row 0 → line 1 (after "stack("), row N → line N+1.
      setFlashInfo({ line: row + 1, key: Date.now() });

      return next;
    });
  };

  const handlePlay = () => {
    const pattern = sequencerToPattern(grid, SOUNDS, stepCount);

    // Build the sequencer layer
    let currentLayers = layers;
    if (pattern) {
      const seqLayer = {
        id: 'sequencer',
        name: 'Sequencer',
        type: 'sequencer',
        code: pattern,
        active: true,
      };
      currentLayers = addLayer(layers, seqLayer);
      setLayers(currentLayers);
    }

    // Evaluate all layers (sequencer + any existing pad layers)
    if (currentLayers.length === 0 && !pattern) return; // Nothing to play
    evaluateAllLayers(currentLayers, volume);
  };

  const handleStop = () => {
    hush();
    setIsPlaying(false);
    // Keep layers — stop doesn't clear
  };

  const handleClearGrid = () => {
    setGrid(DEFAULT_GRID);
    // Remove the sequencer layer since all cells are now off
    setLayers(prevLayers => {
      const updatedLayers = removeLayer(prevLayers, 'sequencer');
      if (isPlaying) {
        evaluateAllLayers(updatedLayers, volume);
      }
      return updatedLayers;
    });
  };

  const handleHush = () => {
    // HUSH = panic button: clear everything
    hush();
    setLayers([]);
    setGrid(DEFAULT_GRID);
    setIsPlaying(false);
  };

  // --- Pad Controls ---

  const handlePadTap = (pad) => {
    // Add pad as a layer (layering, not replacing)
    const padLayer = {
      id: `pad-${pad.id}`,
      name: pad.label,
      type: 'pad',
      code: pad.pattern,
      active: true,
    };

    setLayers(prevLayers => {
      const updatedLayers = addLayer(prevLayers, padLayer);
      evaluateAllLayers(updatedLayers, volume);
      return updatedLayers;
    });
  };

  // --- Layer Chip Controls ---

  const handleRemoveLayer = (layerId) => {
    setLayers(prevLayers => {
      const updatedLayers = removeLayer(prevLayers, layerId);
      if (isPlaying) {
        evaluateAllLayers(updatedLayers, volume);
      }
      return updatedLayers;
    });
  };

  const handleToggleSolo = (layerId) => {
    setLayers(prevLayers => {
      const updatedLayers = toggleSolo(prevLayers, layerId);
      if (isPlaying) {
        evaluateAllLayers(updatedLayers, volume);
      }
      return updatedLayers;
    });
  };

  // --- Preset Controls ---

  /**
   * Preview a preset: plays the preset code immediately, sets BPM,
   * shows Bonki reaction. Does NOT add as a layer (just an audition).
   */
  const handlePresetSelect = (preset) => {
    // Set BPM to preset's ideal tempo
    setBpm(preset.bpm);
    evaluate(`setcps(${bpmToCps(preset.bpm)})`);

    // Preview: evaluate just the preset code (replaces current playback)
    evaluate(preset.code);
    setIsPlaying(true);

    // Bonki reacts
    showBonkiMessage(preset.bonkiLine);
  };

  /**
   * Add a preset as a layer on top of the current mix.
   * Sets BPM, adds layer, evaluates all layers, shows Bonki reaction.
   */
  const handlePresetAdd = (preset) => {
    // Set BPM to preset's ideal tempo
    setBpm(preset.bpm);
    evaluate(`setcps(${bpmToCps(preset.bpm)})`);

    // Add preset as a new layer
    const presetLayer = {
      id: `preset-${preset.id}`,
      name: preset.name,
      type: 'preset',
      code: preset.code,
      active: true,
    };

    setLayers(prevLayers => {
      const updatedLayers = addLayer(prevLayers, presetLayer);
      evaluateAllLayers(updatedLayers, volume);
      return updatedLayers;
    });

    // Bonki reacts
    showBonkiMessage(preset.bonkiLine);
  };

  // --- BPM Control ---

  const handleBpmChange = (newBpm) => {
    setBpm(newBpm);
    evaluate(`setcps(${bpmToCps(newBpm)})`);
    // Re-evaluate all layers so music continues at new tempo
    if (isPlaying) {
      setLayers(currentLayers => {
        evaluateAllLayers(currentLayers, volume);
        return currentLayers; // Don't modify layers
      });
    }
  };

  // --- Volume Control (throttled) ---

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);

    // Throttle re-evaluation to ~100ms since volume requires full pattern re-evaluate
    if (volumeThrottleRef.current) return;

    volumeThrottleRef.current = setTimeout(() => {
      volumeThrottleRef.current = null;
      if (isPlaying) {
        // Use functional state read to get current layers
        setLayers(currentLayers => {
          evaluateAllLayers(currentLayers, newVolume);
          return currentLayers; // Don't modify layers
        });
      }
    }, 100);
  };

  // --- Step Count Control ---

  const handleStepCountChange = (newCount) => {
    setStepCount(newCount);

    // If playing, re-evaluate with updated sequencer pattern
    if (isPlaying) {
      const pattern = sequencerToPattern(grid, SOUNDS, newCount);
      setLayers(prevLayers => {
        let updatedLayers = prevLayers;
        if (pattern) {
          const seqLayer = {
            id: 'sequencer',
            name: 'Sequencer',
            type: 'sequencer',
            code: pattern,
            active: true,
          };
          updatedLayers = addLayer(prevLayers, seqLayer);
        } else {
          updatedLayers = removeLayer(prevLayers, 'sequencer');
        }
        evaluateAllLayers(updatedLayers, volume);
        return updatedLayers;
      });
    }
  };

  // --- Beat Position Tracking (Strudel scheduler — audio-accurate) ---
  useEffect(() => {
    if (isPlaying) {
      const tick = () => {
        const scheduler = getScheduler();
        if (scheduler && scheduler.now) {
          // scheduler.now() returns cycle position (e.g., 0.0, 0.25, 0.5, 0.75, 1.0...)
          // Each cycle = 1 bar. Steps per cycle = stepCount.
          const cyclePos = scheduler.now();
          const fractional = cyclePos % 1; // 0-1 within current cycle
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

  // --- Code View: derive display code from layers (no volume wrapping — show clean code) ---
  const displayCode = composeLayerCode(layers);

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
              grid={grid}
              onToggleCell={handleToggleCell}
              stepCount={stepCount}
              onClear={handleClearGrid}
              beatStep={beatStep}
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
            <p>AI comes in Phase 3</p>
          </div>
        );
      default:
        return null;
    }
  };

  // --- Render ---

  return (
    <div className="app">
      {/* Audio Init Overlay — gates Strudel behind user gesture */}
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

      {/* Controls Strip — always visible across all tabs */}
      <ControlStrip
        bpm={bpm}
        onBpmChange={handleBpmChange}
        volume={volume}
        onVolumeChange={handleVolumeChange}
        stepCount={stepCount}
        onStepCountChange={handleStepCountChange}
        isPlaying={isPlaying}
      />

      {/* Layer Chips — visible when layers exist */}
      {layers.length > 0 && (
        <LayerChips
          layers={layers}
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

      {/* Bonki Speech Bubble — triggered by preset loads and code view click */}
      <BonkiSpeech message={bonkiMessage} messageKey={bonkiMessageKey} />

      {/* Transport Bar */}
      <Transport onPlay={handlePlay} onStop={handleStop} onHush={handleHush} isPlaying={isPlaying}>
        <div className="transport-spacer" />
        <Bonki state={isPlaying ? 'vibing' : 'idle'} bpm={bpm} />
      </Transport>
    </div>
  );
}

export default App;
