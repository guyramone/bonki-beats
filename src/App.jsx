import React, { useState } from 'react';
import { hush } from '@strudel/web';
import { initAudio } from './main.jsx';
import TabBar from './components/TabBar.jsx';

/**
 * App — HOMIE Beats instrument shell
 *
 * Layout: Audio init gate -> Tab bar -> Content area -> Transport bar
 * All views are placeholder until Plans 01-03 and 01-04 fill them in.
 */
function App() {
  const [audioReady, setAudioReady] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioError, setAudioError] = useState(null);
  const [activeTab, setActiveTab] = useState('SEQUENCE');

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

  // --- Transport Controls ---

  const handlePlay = () => {
    console.log('[HOMIE Beats] Play — wired in Plan 01-03');
  };

  const handleStop = () => {
    console.log('[HOMIE Beats] Stop — wired in Plan 01-03');
  };

  const handleHush = () => {
    console.log('[HOMIE Beats] HUSH!');
    hush();
  };

  // --- Tab Content Routing ---

  const renderTabContent = () => {
    switch (activeTab) {
      case 'SEQUENCE':
        return (
          <div className="ai-placeholder">
            <span className="placeholder-icon">&#9835;</span>
            <p className="placeholder-title">Sequencer</p>
            <p>Coming in Plan 01-03</p>
          </div>
        );
      case 'PADS':
        return (
          <div className="ai-placeholder">
            <span className="placeholder-icon">&#9641;</span>
            <p className="placeholder-title">Pads</p>
            <p>Coming in Plan 01-03</p>
          </div>
        );
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
      <div className="transport-bar" role="toolbar" aria-label="Transport controls">
        <button
          className="transport-button"
          onClick={handlePlay}
          aria-label="Play"
        >
          &#9654;
        </button>
        <button
          className="transport-button"
          onClick={handleStop}
          aria-label="Stop"
        >
          &#9632;
        </button>
        <button
          className="transport-button hush"
          onClick={handleHush}
          aria-label="Hush all sounds"
        >
          HUSH
        </button>
      </div>
    </div>
  );
}

export default App;
