import React, { useState, useEffect, useRef, useMemo } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import { ROW_COLORS } from '../utils/rowModel.js';
import '../styles/code-view.css';

/**
 * CodeView — Phase 3 alive code display with beat-synced animations
 *
 * Uses positional row matching (active row index) instead of string-matching
 * to handle user-changed sounds via the sound browser.
 *
 * Shows ALL Phase 3 code: effects chains, scales, euclidean, transforms,
 * and master effects on a separate line.
 *
 * SAFETY NOTE on innerHTML usage:
 * All HTML content is exclusively generated from two controlled sources:
 * 1. Prism.highlight() which produces only <span class="token ..."> wrappers
 *    on internally-generated Strudel code strings (never user input)
 * 2. Pattern char spans where each character is 'x' or '~' extracted from
 *    the code generator output (never user input)
 * No user-supplied content ever reaches innerHTML. This is a safe, controlled
 * use identical in safety profile to any syntax highlighter component.
 *
 * @param {Object} props
 * @param {string} props.code - Full Strudel code string from code generator
 * @param {Function} props.onCodeClick - Callback when user clicks in the code area
 * @param {number|null} props.flashLine - Line index to flash (0-indexed), or null
 * @param {*} props.flashKey - Changes when flash should re-trigger
 * @param {number|null} props.beatStep - Current beat step (0-indexed), or null
 * @param {number} props.stepCount - Number of active steps (8 or 16)
 * @param {Array} [props.rows] - Row model array for positional matching
 */
function CodeView({ code, onCodeClick, flashLine = null, flashKey, beatStep = null, stepCount = 8, rows = [] }) {
  const [copied, setCopied] = useState(false);
  const [activeFlashLine, setActiveFlashLine] = useState(null);
  const flashTimerRef = useRef(null);

  // Build map: position in stack → actual row index (for color-coding)
  const activeRowIndices = useMemo(() => {
    return rows
      .map((r, i) => ({ row: r, idx: i }))
      .filter(({ row }) => {
        if (row.muted) return false;
        const hasSteps = row.pattern.steps.slice(0, stepCount).some(s => s);
        const hasEuclid = row.pattern.euclid !== null;
        return hasSteps || hasEuclid;
      })
      .map(({ idx }) => idx);
  }, [rows, stepCount]);

  // Flash effect
  useEffect(() => {
    if (flashLine == null) return;
    if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
    setActiveFlashLine(flashLine);
    flashTimerRef.current = setTimeout(() => {
      setActiveFlashLine(null);
      flashTimerRef.current = null;
    }, 600);
    return () => { if (flashTimerRef.current) clearTimeout(flashTimerRef.current); };
  }, [flashLine, flashKey]);

  // Copy to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = code;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  // Parse code into display lines
  const parsedLines = useMemo(() => {
    if (!code) return [];

    // Check for stack() wrapper with optional master effects after
    const stackMatch = code.match(/^stack\(([\s\S]*?)\)([\s\S]*)$/);

    if (stackMatch) {
      const inner = stackMatch[1];
      const masterTail = stackMatch[2].trim();

      // Split inner on top-level commas
      const statements = [];
      let depth = 0;
      let current = '';
      for (let i = 0; i < inner.length; i++) {
        const ch = inner[i];
        if (ch === '(') depth++;
        else if (ch === ')') depth--;
        else if (ch === ',' && depth === 0) {
          statements.push(current.trim());
          current = '';
          continue;
        }
        current += ch;
      }
      if (current.trim()) statements.push(current.trim());

      const lines = [];
      lines.push({ type: 'wrapper', text: 'stack(' });
      statements.forEach((stmt, idx) => {
        const rowIdx = activeRowIndices[idx] ?? -1;
        lines.push({
          type: 'sound',
          text: stmt,
          soundIndex: rowIdx,
          isLast: idx === statements.length - 1,
        });
      });
      lines.push({ type: 'wrapper', text: ')' });

      // Master effects lines
      if (masterTail) {
        const masterMethods = masterTail.split('\n').map(l => l.trim()).filter(Boolean);
        masterMethods.forEach(m => {
          lines.push({ type: 'master', text: m });
        });
      }

      return lines;
    }

    // Single statement (no stack wrapper)
    const lines = code.split('\n');
    if (lines.length === 1) {
      const hasPattern = code.match(/\.struct\(|\.euclid\(/);
      return [{
        type: hasPattern ? 'sound' : 'other',
        text: code,
        soundIndex: activeRowIndices[0] ?? 0,
        isLast: true,
      }];
    }

    // Multi-line single statement with master effects
    const result = [];
    const firstLine = lines[0];
    const hasPattern = firstLine.match(/\.struct\(|\.euclid\(/);
    result.push({
      type: hasPattern ? 'sound' : 'other',
      text: firstLine,
      soundIndex: activeRowIndices[0] ?? 0,
      isLast: true,
    });
    for (let i = 1; i < lines.length; i++) {
      const trimmed = lines[i].trim();
      if (trimmed) {
        result.push({ type: 'master', text: trimmed });
      }
    }
    return result;
  }, [code, activeRowIndices]);

  // --- Render functions ---
  // All innerHTML usage below is safe: content comes exclusively from
  // Prism.highlight() on code-generator output and controlled pattern chars.

  function renderSoundLine(line, lineIndex) {
    const { text, soundIndex, isLast } = line;
    const color = soundIndex >= 0 && soundIndex < ROW_COLORS.length
      ? ROW_COLORS[soundIndex] : '#5c6370';

    const structRegex = /^(.*\.struct\(")([^"]+)("\).*)$/;
    const match = text.match(structRegex);

    if (!match) {
      const suffix = isLast ? '' : ',';
      // Input: internally-generated code string from codeGenerator.js
      const highlighted = Prism.highlight(text + suffix, Prism.languages.javascript, 'javascript');
      return renderHighlightedLine(highlighted, lineIndex, color, soundIndex);
    }

    const prefix = match[1];
    const pattern = match[2];
    const suffix = match[3];
    const comma = isLast ? '' : ',';
    const chars = pattern.split(' ');

    const shouldBounce = beatStep !== null
      && soundIndex >= 0 && beatStep < chars.length && chars[beatStep] === 'x';

    // Input: internally-generated code substrings
    const prefixHtml = Prism.highlight(prefix, Prism.languages.javascript, 'javascript');
    const suffixHtml = Prism.highlight(suffix + comma, Prism.languages.javascript, 'javascript');

    // Pattern chars: each is exactly 'x' or '~' from the code generator
    const patternHtml = chars.map((ch, ci) => {
      const isCursor = beatStep !== null && ci === beatStep;
      const isHit = ch === 'x';
      const isRest = ch === '~';
      let classes = 'pattern-char';
      if (isHit) classes += ' pattern-hit';
      if (isRest) classes += ' pattern-rest';
      if (isCursor) classes += ' pattern-cursor';
      if (isCursor && isHit) classes += ' pattern-cursor-hit';
      const space = ci > 0 ? '<span class="pattern-space"> </span>' : '';
      const style = isCursor && isHit ? ` style="--char-color: ${color}"` : '';
      return `${space}<span class="${classes}"${style}>${ch}</span>`;
    }).join('');

    const fullHtml = `${prefixHtml}${patternHtml}${suffixHtml}`;

    const lineClasses = [
      'code-line', 'code-line-sound',
      activeFlashLine === lineIndex ? 'flash' : '',
      shouldBounce ? 'code-line-bounce' : '',
    ].filter(Boolean).join(' ');

    return (
      <div key={lineIndex} className={lineClasses}
        style={{ borderLeftColor: color }}
        // Safe: fullHtml composed from Prism output + controlled pattern chars
        dangerouslySetInnerHTML={{ __html: fullHtml || '\u00a0' }}
      />
    );
  }

  function renderHighlightedLine(html, lineIndex, borderColor, soundIndex) {
    const lineClasses = [
      'code-line',
      soundIndex >= 0 ? 'code-line-sound' : '',
      activeFlashLine === lineIndex ? 'flash' : '',
    ].filter(Boolean).join(' ');
    const style = soundIndex >= 0 ? { borderLeftColor: borderColor } : {};
    return (
      <div key={lineIndex} className={lineClasses} style={style}
        // Safe: html from Prism.highlight() on internal code
        dangerouslySetInnerHTML={{ __html: html || '\u00a0' }}
      />
    );
  }

  function renderWrapperLine(line, lineIndex) {
    // Input: 'stack(' or ')' — hardcoded wrapper strings
    const highlighted = Prism.highlight(line.text, Prism.languages.javascript, 'javascript');
    return (
      <div key={lineIndex}
        className={`code-line code-line-wrapper${activeFlashLine === lineIndex ? ' flash' : ''}`}
        // Safe: hardcoded wrapper text through Prism
        dangerouslySetInnerHTML={{ __html: highlighted || '\u00a0' }}
      />
    );
  }

  function renderMasterLine(line, lineIndex) {
    // Input: master effect method like '.djf(0.30)' from code generator
    const highlighted = Prism.highlight(line.text, Prism.languages.javascript, 'javascript');
    return (
      <div key={lineIndex}
        className={`code-line code-line-master${activeFlashLine === lineIndex ? ' flash' : ''}`}
        // Safe: code generator output through Prism
        dangerouslySetInnerHTML={{ __html: highlighted || '\u00a0' }}
      />
    );
  }

  function renderOtherLine(line, lineIndex) {
    // Input: internally-generated code string
    const highlighted = Prism.highlight(line.text, Prism.languages.javascript, 'javascript');
    return (
      <div key={lineIndex}
        className={`code-line${activeFlashLine === lineIndex ? ' flash' : ''}`}
        // Safe: internal code through Prism
        dangerouslySetInnerHTML={{ __html: highlighted || '\u00a0' }}
      />
    );
  }

  return (
    <div className="code-view" onClick={onCodeClick}>
      {/* Header bar */}
      <div className="code-view-header">
        <span className="code-view-title">Code View</span>
        <span className="code-view-readonly">Read-only</span>
        <button
          className="code-view-copy"
          onClick={(e) => { e.stopPropagation(); handleCopy(); }}
          aria-label="Copy code to clipboard"
          disabled={!code}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      {/* Code display */}
      <pre className="code-view-pre">
        <code>
          {parsedLines.length > 0 ? (
            parsedLines.map((line, i) => {
              switch (line.type) {
                case 'sound': return renderSoundLine(line, i);
                case 'wrapper': return renderWrapperLine(line, i);
                case 'master': return renderMasterLine(line, i);
                case 'other':
                default: return renderOtherLine(line, i);
              }
            })
          ) : (
            <div className="code-line code-line-empty">
              <span className="token comment">{'// tap some cells to make music'}</span>
            </div>
          )}
        </code>
      </pre>
    </div>
  );
}

export default CodeView;
