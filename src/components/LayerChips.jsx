import React from 'react';

/**
 * LayerChips — Thin horizontal strip showing one chip per layer.
 *
 * Each chip shows a color dot (type-based), the layer name, and an X button.
 * Tap the name to solo/un-solo. Tap X to remove the layer.
 * Inactive (soloed-out) layers are dimmed. The solo'd layer gets a highlighted border.
 *
 * Returns null if no layers (empty state = invisible strip).
 *
 * @param {Object} props
 * @param {Array<{id: string, name: string, type: string, active: boolean}>} props.layers
 * @param {function} props.onRemove - Called with layerId
 * @param {function} props.onToggleSolo - Called with layerId
 */
function LayerChips({ layers, onRemove, onToggleSolo }) {
  if (!layers || layers.length === 0) return null;

  // Detect if any layer is solo'd (only 1 active while others exist)
  const activeCount = layers.filter(l => l.active).length;
  const hasSolo = activeCount === 1 && layers.length > 1;

  return (
    <div className="layer-chips">
      {layers.map((layer) => {
        const isSoloed = hasSolo && layer.active;
        const isDimmed = !layer.active;

        return (
          <div
            key={layer.id}
            className={`layer-chip${isSoloed ? ' soloed' : ''}${isDimmed ? ' dimmed' : ''}`}
          >
            <span
              className="layer-chip-dot"
              style={{
                background: layer.type === 'sequencer' ? 'var(--accent-cool)'
                  : layer.type === 'pad' ? 'var(--accent-warm)'
                  : layer.type === 'preset' ? 'var(--accent-primary)'
                  : 'var(--text-tertiary)'
              }}
            />
            <span
              className="layer-chip-name"
              onClick={() => onToggleSolo(layer.id)}
              title={`Solo ${layer.name}`}
            >
              {layer.name.length > 12 ? layer.name.slice(0, 12) + '...' : layer.name}
            </span>
            <button
              className="layer-chip-remove"
              onClick={() => onRemove(layer.id)}
              aria-label={`Remove ${layer.name} layer`}
              type="button"
            >
              &#10005;
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default LayerChips;
