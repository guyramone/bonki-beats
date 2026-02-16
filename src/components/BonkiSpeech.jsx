import React, { useEffect, useState } from 'react';

/**
 * BonkiSpeech — Speech bubble overlay for Bonki reactions
 *
 * Appears near the transport bar when a preset loads.
 * Auto-dismisses after 3 seconds. Small tail/triangle points toward Bonki.
 *
 * @param {Object} props
 * @param {string|null} props.message - Text to show (null/empty = hidden)
 */
function BonkiSpeech({ message }) {
  const [visible, setVisible] = useState(false);
  const [displayMessage, setDisplayMessage] = useState(null);

  useEffect(() => {
    if (message) {
      setDisplayMessage(message);
      setVisible(true);

      const timer = setTimeout(() => {
        setVisible(false);
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [message]);

  if (!visible || !displayMessage) return null;

  return (
    <div className="bonki-speech" role="status" aria-live="polite">
      {displayMessage}
    </div>
  );
}

export default BonkiSpeech;
