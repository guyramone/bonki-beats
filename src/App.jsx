import React, { useState, useRef, useCallback } from 'react';
import { evaluate, hush } from '@strudel/web';
import { initAudio } from './main.jsx';
import TabBar from './components/TabBar.jsx';
import Sequencer from './components/Sequencer.jsx';
import Pads from './components/Pads.jsx';
import Transport from './components/Transport.jsx';
import Bonki from './components/Bonki.jsx';
import ControlStrip from './components/ControlStrip.jsx';
import LayerChips from './components/LayerChips.jsx';
import { sequencerToPattern, SOUNDS, DEFAULT_GRID } from './utils/patterns.js';
import { composeLayerCode, applyVolume, addLayer, removeLayer, toggleSolo, bpmToCps } from './utils/layers.js';

/**
 * App — HOMIE Beats instrument shell
 *
 * Layout: Audio init gate -> Tab bar -> Controls strip -> Layer chips -> Content area -> Transport bar
 * Multi-layer architecture: sequencer + pads compose via stack() through the layer manager.
 * BPM via setcps(), volume via .gain(), step count toggles grid width.
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

  const handleHush = () => {
    // HUSH = panic button: clear everything
    hush();
    setLayers([]);
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

  // --- BPM Control ---

  const handleBpmChange = (newBpm) => {
    setBpm(newBpm);
    // setcps is lightweight — no pattern reparse needed
    evaluate(`setcps(${bpmToCps(newBpm)})`);
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

  // --- Tab Content Routing ---

  const renderTabContent = () => {
    switch (activeTab) {
      case 'SEQUENCE':
        return <Sequencer grid={grid} onToggleCell={handleToggleCell} stepCount={stepCount} />;
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

      {/* Content Area */}
      <main className="tab-content" role="tabpanel" aria-label={`${activeTab} panel`}>
        {renderTabContent()}
      </main>

      {/* Transport Bar */}
      <Transport onPlay={handlePlay} onStop={handleStop} onHush={handleHush} isPlaying={isPlaying}>
        <div className="transport-spacer" />
        <Bonki state={isPlaying ? 'vibing' : 'idle'} bpm={bpm} />
      </Transport>
    </div>
  );
}

export default App;
