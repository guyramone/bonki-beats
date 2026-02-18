import React, { useState } from 'react';
import CodeView from './CodeView.jsx';

/**
 * CodeToggle -- Floating collapsible code view pill/overlay.
 *
 * Collapsed: shows a small "CODE" pill in the top-right corner.
 * Expanded: glassmorphism overlay showing the Strudel code.
 *
 * @param {Object} props
 * @param {string} props.code - Full Strudel display code
 * @param {function} props.onCodeClick - Callback when user clicks in code area
 * @param {Object|null} props.flashInfo - { line, key } for flash animation
 * @param {number|null} props.beatStep - Current beat step
 * @param {number} props.stepCount - Number of active steps
 * @param {Array} props.rows - Row model array
 */
export default function CodeToggle({ code, onCodeClick, flashInfo, beatStep, stepCount, rows }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating pill toggle */}
      <button
        className={`code-toggle-pill${isOpen ? ' active' : ''}`}
        onClick={() => setIsOpen(prev => !prev)}
        type="button"
        aria-label={isOpen ? 'Hide code view' : 'Show code view'}
      >
        {isOpen ? '\u2715' : 'CODE'}
      </button>

      {/* Code overlay */}
      {isOpen && (
        <div className="code-toggle-overlay">
          <CodeView
            code={code}
            onCodeClick={onCodeClick}
            flashLine={flashInfo?.line}
            flashKey={flashInfo?.key}
            beatStep={beatStep}
            stepCount={stepCount}
            rows={rows}
          />
        </div>
      )}
    </>
  );
}
