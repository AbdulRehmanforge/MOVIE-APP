import React, { useEffect, useRef, useState } from 'react';

const Navigation = ({
  query,
  onQueryChange,
  suggestions,
  onPickSuggestion,
  onCloseSuggestions,
  onSearchFocus,
  onSearchBlur,
  activeProfile,
  onLogout,
  kidsMode,
  onToggleKidsMode,
  notifications,
  tabs,
  activeTab,
  onTabChange,
}) => {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const searchRef = useRef(null);
  const searchBlurTimer = useRef(null);

  const handleSearchFocus = () => {
    onSearchFocus?.();
    if (typeof window === 'undefined') return;
    const y = window.scrollY;
    requestAnimationFrame(() => window.scrollTo({ top: y }));
  };

  const handleSearchBlur = () => {
    onSearchBlur?.();
    if (searchBlurTimer.current) clearTimeout(searchBlurTimer.current);
    searchBlurTimer.current = setTimeout(() => {
      onCloseSuggestions?.();
    }, 150);
  };

  const handleSearchPick = (item) => {
    if (searchBlurTimer.current) clearTimeout(searchBlurTimer.current);
    onPickSuggestion(item);
    onCloseSuggestions?.();
  };

  useEffect(() => {
    if (!profileMenuOpen) return;
    const handleClick = (event) => {
      if (!profileMenuRef.current) return;
      if (!profileMenuRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };
    const handleKey = (event) => {
      if (event.key === 'Escape') setProfileMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [profileMenuOpen]);

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
        <input
          ref={searchRef}
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          onFocus={handleSearchFocus}
          onBlur={handleSearchBlur}
          placeholder="Search by movie, actor, or genre..."
        />
        {suggestions.length > 0 && (
          <ul className="suggestions">
            {suggestions.map((item) => (
              <li key={`${item.media_type}-${item.id}`}>
                <button
                  type="button"
                  onMouseDown={(event) => { event.preventDefault(); handleSearchPick(item); }}
                >
                  {item.title || item.name} <small>({item.media_type})</small>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="nav-right">
        <button type="button" className="kids-toggle" onClick={onToggleKidsMode}>{kidsMode ? 'Kids: ON' : 'Kids: OFF'}</button>
        <div className="notif" aria-label="Notifications">Notif {notifications.length}</div>
        <div className="profile-menu" ref={profileMenuRef}>
          <button
            type="button"
            className="profile-toggle"
            aria-haspopup="menu"
            aria-expanded={profileMenuOpen}
            onClick={() => setProfileMenuOpen((prev) => !prev)}
          >
            <span className="profile-avatar" aria-hidden="true">{(activeProfile?.name || 'P').slice(0, 1).toUpperCase()}</span>
            <span className="profile-name">{activeProfile?.name || 'Profile'}</span>
            <span className="profile-caret" aria-hidden="true">v</span>
          </button>
          {profileMenuOpen && (
            <div className="profile-dropdown" role="menu">
              <button type="button" role="menuitem" onClick={() => setProfileMenuOpen(false)}>Manage Profiles</button>
              <button type="button" role="menuitem" onClick={() => setProfileMenuOpen(false)}>Account</button>
              <button type="button" role="menuitem" onClick={() => setProfileMenuOpen(false)}>Help Center</button>
              <button type="button" role="menuitem" onClick={onLogout}>Sign out</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navigation;
