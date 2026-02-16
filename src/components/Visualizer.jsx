import React, { useRef, useEffect } from 'react';

/**
 * Visualizer — Canvas-based real-time audio waveform/frequency display.
 *
 * Connects to a Web Audio AnalyserNode and draws audio data on a canvas.
 * Sits in the transport bar near Bonki. TE aesthetic: thin golden lines
 * on dark/transparent background. Only draws when audio is playing.
 *
 * @param {Object} props
 * @param {AnalyserNode|null} props.analyser - Web Audio AnalyserNode
 * @param {boolean} props.isPlaying - Whether audio is currently playing
 * @param {'waveform'|'bars'} props.mode - Visualization mode
 * @param {string} props.color - Line/bar color (default: accent gold)
 */
function Visualizer({ analyser, isPlaying, mode = 'waveform', color = '#f5a623' }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    if (!analyser || !isPlaying) {
      // Clear canvas when not playing
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    // Size canvas for retina
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    function drawWaveform() {
      analyser.getByteTimeDomainData(dataArray);
      const w = rect.width;
      const h = rect.height;

      ctx.clearRect(0, 0, w, h);

      // Center line (very subtle)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, h / 2);
      ctx.lineTo(w, h / 2);
      ctx.stroke();

      // Waveform
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.lineJoin = 'round';
      ctx.beginPath();

      const sliceWidth = w / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * h) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        x += sliceWidth;
      }

      ctx.stroke();
      rafRef.current = requestAnimationFrame(drawWaveform);
    }

    function drawBars() {
      analyser.getByteFrequencyData(dataArray);
      const w = rect.width;
      const h = rect.height;
      const barCount = 20;
      const barWidth = w / barCount;
      const step = Math.floor(bufferLength / barCount);

      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < barCount; i++) {
        const value = dataArray[i * step];
        const barHeight = (value / 255) * h * 0.85;
        const bx = i * barWidth;
        const by = h - barHeight;

        const alpha = 0.3 + (value / 255) * 0.7;
        ctx.fillStyle = color + Math.round(alpha * 255).toString(16).padStart(2, '0');
        ctx.fillRect(bx + 1, by, barWidth - 2, barHeight);
      }

      rafRef.current = requestAnimationFrame(drawBars);
    }

    const draw = mode === 'bars' ? drawBars : drawWaveform;
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [analyser, isPlaying, mode, color]);

  return (
    <canvas
      ref={canvasRef}
      className="visualizer-canvas"
      aria-hidden="true"
    />
  );
}

export default Visualizer;
