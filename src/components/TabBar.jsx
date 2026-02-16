import React from 'react';

const TABS = ['SEQUENCE', 'PADS', 'AI'];

/**
 * TabBar — TE-inspired tab navigation
 * Renders SEQUENCE | PADS | AI buttons with proper ARIA roles.
 *
 * @param {Object} props
 * @param {string} props.activeTab - Currently selected tab name
 * @param {function} props.onTabChange - Callback when tab is clicked
 */
function TabBar({ activeTab, onTabChange }) {
  return (
    <nav className="tab-bar" role="tablist" aria-label="Main navigation">
      {TABS.map((tab) => (
        <button
          key={tab}
          className={`tab-button${activeTab === tab ? ' active' : ''}`}
          role="tab"
          aria-selected={activeTab === tab}
          onClick={() => onTabChange(tab)}
        >
          {tab}
        </button>
      ))}
    </nav>
  );
}

export default TabBar;
