import React from 'react';

const Navigation = ({
  query,
  onQueryChange,
  suggestions,
  onPickSuggestion,
  activeProfile,
  onLogout,
  kidsMode,
  onToggleKidsMode,
  notifications,
  tabs,
  activeTab,
  onTabChange,
}) => {
  return (
    <header className="top-nav">
      <button type="button" className="logo" onClick={() => onTabChange('home')}>HD MOVIES</button>
      <nav className="tab-nav" aria-label="Primary">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => onTabChange(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </nav>
      <div className="search-wrap">
        <input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Search by movie, actor, or genre..." />
        {suggestions.length > 0 && (
          <ul className="suggestions">
            {suggestions.map((item) => (
              <li key={`${item.media_type}-${item.id}`}>
                <button type="button" onClick={() => onPickSuggestion(item)}>
                  {item.title || item.name} <small>({item.media_type})</small>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="nav-right">
        <button type="button" className="kids-toggle" onClick={onToggleKidsMode}>{kidsMode ? 'Kids: ON' : 'Kids: OFF'}</button>
        <div className="notif">🔔 {notifications.length}</div>
        <div className="profile">👤 {activeProfile?.name || 'Profile'}</div>
        <button type="button" onClick={onLogout}>Logout</button>
      </div>
    </header>
  );
};

export default Navigation;
