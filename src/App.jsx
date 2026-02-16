import React, { useState } from 'react';
import { initAudio } from './main.jsx';

function App() {
  const [initState, setInitState] = useState('ready'); // 'ready' | 'loading' | 'initialized' | 'error'
  const [error, setError] = useState(null);

  const handleInitialize = async () => {
    if (initState !== 'ready') return;

    setInitState('loading');
    setError(null);

    try {
      await initAudio();
      setInitState('initialized');
    } catch (err) {
      setInitState('error');
      setError(err.message);
    }
  };

  const getButtonText = () => {
    switch (initState) {
      case 'ready': return 'Initialize Audio';
      case 'loading': return 'Loading...';
      case 'initialized': return 'Ready! Strudel initialized.';
      case 'error': return 'Failed - Try Again';
      default: return 'Initialize Audio';
    }
  };

  return (
    <div className="app" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      color: '#ffffff',
      textAlign: 'center',
      padding: '20px'
    }}>
      <h1 style={{
        fontSize: '48px',
        fontWeight: '700',
        marginBottom: '40px',
        letterSpacing: '-0.02em'
      }}>
        HOMIE Beats
      </h1>

      <button
        onClick={handleInitialize}
        disabled={initState === 'loading' || initState === 'initialized'}
        style={{
          padding: '16px 32px',
          fontSize: '16px',
          fontWeight: '600',
          fontFamily: 'Inter, sans-serif',
          background: initState === 'initialized' ? '#6b9080' : (initState === 'error' ? '#d97757' : '#2a2a2a'),
          color: '#ffffff',
          border: 'none',
          borderRadius: '8px',
          cursor: initState === 'loading' || initState === 'initialized' ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s',
          opacity: initState === 'loading' ? 0.6 : 1
        }}
      >
        {getButtonText()}
      </button>

      {error && (
        <p style={{
          marginTop: '20px',
          color: '#d97757',
          fontSize: '14px'
        }}>
          Error: {error}
        </p>
      )}

      <p style={{
        marginTop: '40px',
        fontSize: '14px',
        color: '#a0a0a0',
        maxWidth: '500px'
      }}>
        This placeholder will be replaced with the full beatpad UI in Plan 01-02.
        Click the button above to verify Strudel initialization works.
      </p>
    </div>
  );
}

export default App;
