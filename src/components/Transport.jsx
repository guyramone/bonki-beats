import React from 'react';

/**
 * Transport — Play / Stop / HUSH controls.
 *
 * Play starts the sequencer pattern. Stop halts playback.
 * HUSH is the panic button — kills all sound and clears all layers.
 * Play button glows sage green when active.
 *
 * @param {Object} props
 * @param {function} props.onPlay - Called when Play is pressed
 * @param {function} props.onStop - Called when Stop is pressed
 * @param {function} props.onHush - Called when HUSH is pressed (handles hush + layer clear)
 * @param {boolean} props.isPlaying - Whether audio is currently playing
 */
function Transport({ onPlay, onStop, onHush, isPlaying, children }) {
  return (
    <div className="transport-bar" role="toolbar" aria-label="Transport controls">
      <button
        className={`transport-button${isPlaying ? ' active' : ''}`}
        onClick={onPlay}
        aria-label="Play"
        type="button"
      >
        &#9654;
      </button>
      <button
        className="transport-button"
        onClick={onStop}
        aria-label="Stop"
        type="button"
      >
        &#9632;
      </button>
      <button
        className="transport-button hush"
        onClick={onHush}
        aria-label="Hush all sounds"
        type="button"
      >
        HUSH
      </button>
      {children}
    </div>
  );
}

export default Transport;
