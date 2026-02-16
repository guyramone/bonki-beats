import React, { useState } from 'react';
import { evaluate, hush } from '@strudel/web';
import { initAudio } from './main.jsx';
import TabBar from './components/TabBar.jsx';
import Sequencer from './components/Sequencer.jsx';
import Pads from './components/Pads.jsx';
import Transport from './components/Transport.jsx';
import Bonki from './components/Bonki.jsx';
import { sequencerToPattern, SOUNDS, DEFAULT_GRID } from './utils/patterns.js';

/**
 * App — HOMIE Beats instrument shell
 *
 * Layout: Audio init gate -> Tab bar -> Content area -> Transport bar
 * Sequencer and Pads are wired to Strudel via evaluate() and hush().
 */
function App() {
  const [audioReady, setAudioReady] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioError, setAudioError] = useState(null);
  const [activeTab, setActiveTab] = useState('SEQUENCE');
  const [grid, setGrid] = useState(DEFAULT_GRID);
  const [isPlaying, setIsPlaying] = useState(false);

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

  // --- Sequencer Controls ---

  const handleToggleCell = (row, step) => {
    setGrid(prev => {
      const next = prev.map(r => [...r]);
      next[row][step] = !next[row][step];

      // Live rebuild: if playing, re-evaluate with updated grid
      if (isPlaying) {
        const pattern = sequencerToPattern(next, SOUNDS);
        if (pattern) {
          evaluate(pattern);
        } else {
          hush();
          setIsPlaying(false);
        }
      }

      return next;
    });
  };

  const handlePlay = () => {
    const pattern = sequencerToPattern(grid, SOUNDS);
    if (!pattern) return; // Nothing to play if grid is empty
    evaluate(pattern);
    setIsPlaying(true);
  };

  const handleStop = () => {
    hush();
    setIsPlaying(false);
  };

  // --- Pad Controls ---

  const handlePadTap = (pad) => {
    evaluate(pad.pattern);
  };

  // --- Tab Content Routing ---

  const renderTabContent = () => {
    switch (activeTab) {
      case 'SEQUENCE':
        return <Sequencer grid={grid} onToggleCell={handleToggleCell} />;
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

      {/* Content Area */}
      <main className="tab-content" role="tabpanel" aria-label={`${activeTab} panel`}>
        {renderTabContent()}
      </main>

      {/* Transport Bar */}
      <Transport onPlay={handlePlay} onStop={handleStop} isPlaying={isPlaying}>
        <div className="transport-spacer" />
        <Bonki state={isPlaying ? 'vibing' : 'idle'} />
      </Transport>
    </div>
  );
}

export default App;
