import React, { useState, useEffect, useRef } from 'react';

const Navigation = ({ activeTab, setActiveTab, onGenreSelect, onCountrySelect, onTabChange }) => {
    const [showGenres, setShowGenres] = useState(false);
    const [showCountries, setShowCountries] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const navRef = useRef(null);

    const genres = [
        'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary',
        'Drama', 'Family', 'Fantasy', 'History', 'Horror', 'Music', 'Mystery',
        'Romance', 'Science Fiction', 'TV Movie', 'Thriller', 'War', 'Western'
    ];

    const countries = [
        'United States', 'United Kingdom', 'Canada', 'Australia', 'France',
        'Germany', 'Italy', 'Spain', 'Japan', 'South Korea', 'India', 'China',
        'Brazil', 'Mexico', 'Russia', 'Netherlands', 'Sweden', 'Denmark'
    ];

    const tabs = [
        { id: 'home', label: 'Home', icon: '🏠' },
        { id: 'genres', label: 'Genres', hasDropdown: true, icon: '🎭' },
        { id: 'countries', label: 'Countries', hasDropdown: true, icon: '🌍' },
        { id: 'movies', label: 'Movies', icon: '🎬' },
        { id: 'tvseries', label: 'TV Series', icon: '📺' },
        { id: 'topimdb', label: 'Top IMDb', icon: '⭐' }
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (navRef.current && !navRef.current.contains(event.target)) {
                setShowGenres(false);
                setShowCountries(false);
                setShowMobileMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleTabClick = (tabId) => {
        if (tabId !== 'genres' && tabId !== 'countries') {
            if (onTabChange) onTabChange(tabId);
        }

        if (tabId !== 'genres') setShowGenres(false);
        if (tabId !== 'countries') setShowCountries(false);
        setShowMobileMenu(false);

        if (tabId === 'genres') {
            setShowGenres(!showGenres);
        } else if (tabId === 'countries') {
            setShowCountries(!showCountries);
        }
    };

    const handleGenreClick = (genre) => {
        onGenreSelect(genre);
        setShowGenres(false);
        setShowMobileMenu(false);
    };

    const handleKeyDown = (event, tabId) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleTabClick(tabId);
        } else if (event.key === 'Escape') {
            setShowGenres(false);
            setShowCountries(false);
            setShowMobileMenu(false);
        }
    };

    const handleDropdownKeyDown = (event, items, onSelect) => {
        if (event.key === 'Escape') {
            setShowGenres(false);
            setShowCountries(false);
        }
    };

    return (
        <nav className="navigation" ref={navRef}>
            <div className="nav-container">
                <div className="nav-brand">
                    <span className="brand-text">HD Movies</span>
                </div>

                <div className="nav-tabs">
                    {tabs.map(tab => (
                        <div key={tab.id} className="nav-tab-container">
                            <button
                                className={`nav-tab ${activeTab === tab.id ? 'active' : ''} ${tab.hasDropdown ? 'has-dropdown' : ''}`}
                                onClick={() => handleTabClick(tab.id)}
                                onKeyDown={(e) => handleKeyDown(e, tab.id)}
                                aria-expanded={tab.hasDropdown ? (tab.id === 'genres' ? showGenres : showCountries) : undefined}
                                aria-haspopup={tab.hasDropdown ? 'true' : undefined}
                                tabIndex={0}
                            >
                                <span className="tab-icon">{tab.icon}</span>
                                <span className="tab-label">{tab.label}</span>
                                {tab.hasDropdown && (
                                    <svg
                                        className={`dropdown-arrow ${(showGenres && tab.id === 'genres') || (showCountries && tab.id === 'countries') ? 'rotated' : ''}`}
                                        width="14"
                                        height="14"
                                        viewBox="0 0 14 14"
                                        fill="none"
                                    >
                                        <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                )}
                            </button>

                            {tab.id === 'genres' && showGenres && (
                                <div className="dropdown-menu genres-dropdown">
                                    <div className="dropdown-header">
                                        <span>Choose a Genre</span>
                                    </div>
                                    <div className="dropdown-grid">
                                        {genres.map(genre => (
                                            <button
                                                key={genre}
                                                className="dropdown-item genre-item"
                                                onClick={() => handleGenreClick(genre)}
                                            >
                                                <span className="genre-name">{genre}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {tab.id === 'countries' && showCountries && (
                                <div className="dropdown-menu countries-dropdown">
                                    <div className="dropdown-header">
                                        <span>Select Country</span>
                                    </div>
                                    <div className="dropdown-list">
                                        {countries.map(country => (
                                            <button
                                                key={country}
                                                className="dropdown-item country-item"
                                                onClick={() => handleCountryClick(country)}
                                            >
                                                <span className="country-flag">{getCountryFlag(country)}</span>
                                                <span className="country-name">{country}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <button
                    className="md:hidden mobile-menu-btn"
                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setShowMobileMenu(!showMobileMenu);
                        }
                    }}
                    aria-label="Toggle mobile menu"
                    aria-expanded={showMobileMenu}
                    tabIndex={0}
                >
                    <svg
                        className={`w-6 h-6 transition-transform duration-200 ${showMobileMenu ? 'rotate-90' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        {showMobileMenu ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>

                {showMobileMenu && (
                    <div className="md:hidden mobile-menu">
                        <div className="mobile-menu-content">
                            {tabs.map(tab => (
                                <div key={tab.id} className="mobile-menu-item">
                                    <button
                                        className={`mobile-menu-btn ${activeTab === tab.id ? 'active' : ''}`}
                                        onClick={() => handleTabClick(tab.id)}
                                    >
                                        <span className="mobile-icon">{tab.icon}</span>
                                        <span className="mobile-label">{tab.label}</span>
                                        {tab.hasDropdown && (
                                            <svg
                                                className={`mobile-arrow ${(showGenres && tab.id === 'genres') || (showCountries && tab.id === 'countries') ? 'rotated' : ''}`}
                                                width="16"
                                                height="16"
                                                viewBox="0 0 14 14"
                                                fill="none"
                                            >
                                                <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        )}
                                    </button>

                                    {tab.id === 'genres' && showGenres && (
                                        <div className="mobile-dropdown">
                                            {genres.map(genre => (
                                                <button
                                                    key={genre}
                                                    className="mobile-dropdown-item"
                                                    onClick={() => handleGenreClick(genre)}
                                                >
                                                    {genre}
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {tab.id === 'countries' && showCountries && (
                                        <div className="mobile-dropdown">
                                            {countries.map(country => (
                                                <button
                                                    key={country}
                                                    className="mobile-dropdown-item"
                                                    onClick={() => handleCountryClick(country)}
                                                >
                                                    <span className="country-flag">{getCountryFlag(country)}</span>
                                                    <span>{country}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="nav-actions">
                    <button className="nav-action-btn">
                        <span>🔍</span>
                    </button>
                    <button className="nav-action-btn">
                        <span>👤</span>
                    </button>
                </div>
            </div>
        </nav>
    );
};

const getCountryFlag = (country) => {
    const flags = {
        'United States': '🇺🇸',
        'United Kingdom': '🇬🇧',
        'Canada': '🇨🇦',
        'Australia': '🇦🇺',
        'France': '🇫🇷',
        'Germany': '🇩🇪',
        'Italy': '🇮🇹',
        'Spain': '🇪🇸',
        'Japan': '🇯🇵',
        'South Korea': '🇰🇷',
        'India': '🇮🇳',
        'China': '🇨🇳',
        'Brazil': '🇧🇷',
        'Mexico': '🇲🇽',
        'Russia': '🇷🇺',
        'Netherlands': '🇳🇱',
        'Sweden': '🇸🇪',
        'Denmark': '🇩🇰'
    };
    return flags[country] || '🌍';
};

export default Navigation;