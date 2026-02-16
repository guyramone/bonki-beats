import React, { useEffect, useState } from 'react';

/**
 * BonkiSpeech — Speech bubble overlay for Bonki reactions
 *
 * Appears near the transport bar when a preset loads or code view is clicked.
 * Auto-dismisses after 3 seconds. Small tail/triangle points toward Bonki.
 *
 * @param {Object} props
 * @param {string|null} props.message - Text to show (null/empty = hidden)
 * @param {*} [props.messageKey] - Change this to re-trigger the same message text
 */
function BonkiSpeech({ message, messageKey }) {
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
  }, [message, messageKey]);

  if (!visible || !displayMessage) return null;

  return (
    <div className="bonki-speech" role="status" aria-live="polite">
      {displayMessage}
    </div>
  );
}

export default BonkiSpeech;
