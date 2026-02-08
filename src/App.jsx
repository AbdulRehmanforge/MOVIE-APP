import React, { useEffect, useMemo, useState } from 'react';
import AuthPanel from './components/AuthPanel.jsx';
import Navigation from './components/Navigation.jsx';
import ProfileSelector from './components/ProfileSelector.jsx';
import HeroCarousel from './components/HeroCarousel.jsx';
import MovieRow from './components/MovieRow.jsx';
import MovieCard from './components/moviecard.jsx';
import FilterBar from './components/FilterBar.jsx';
import MovieModal from './components/MovieModal.jsx';
import SkeletonRow from './components/ui/SkeletonRow.jsx';
import { getCurrentUser, loginUser, logoutUser, registerUser } from './utils/auth.js';
import { discoverMovies, getGenreMap, getHomeRows, getSearchSuggestions } from './services/tmdb.js';
import './App.css';

const makeProfileKey = (email) => `hd_profile_${email}`;
const makeWatchlistKey = (email, profileId) => `hd_watchlist_${email}_${profileId}`;
const makeHistoryKey = (email, profileId) => `hd_history_${email}_${profileId}`;

const VIEW_TABS = [
  { key: 'home', label: 'Home' },
  { key: 'movies', label: 'Movies' },
  { key: 'tv', label: 'TV Shows' },
  { key: 'my-list', label: 'My List' },
  { key: 'new-popular', label: 'New & Popular' },
];

const App = () => {
  const [user, setUser] = useState(() => getCurrentUser());
  const [profiles, setProfiles] = useState([]);
  const [activeProfile, setActiveProfile] = useState(null);
  const [kidsMode, setKidsMode] = useState(false);
  const [activeView, setActiveView] = useState('home');

  const [rows, setRows] = useState([]);
  const [loadingRows, setLoadingRows] = useState(true);
  const [rowPages, setRowPages] = useState({});

  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [genres, setGenres] = useState([]);
  const [filters, setFilters] = useState({ genre: '', year: '', minRating: '', sortBy: 'popularity.desc' });
  const [discoverPage, setDiscoverPage] = useState(1);
  const [catalog, setCatalog] = useState([]);
  const [catalogTotalPages, setCatalogTotalPages] = useState(1);

  const [watchlist, setWatchlist] = useState([]);
  const [history, setHistory] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const notifications = useMemo(() => {
    const upcoming = rows.find((row) => row.key === 'new')?.movies.slice(0, 2) || [];
    return upcoming.map((movie) => `${movie.title} just dropped`);
  }, [rows]);

  const progressMap = useMemo(() => Object.fromEntries(history.map((item) => [item.id, item.progress || 0])), [history]);
  const continueWatching = useMemo(
    () => history.filter((item) => (item.progress || 0) > 0 && (item.progress || 0) < 100),
    [history]
  );

  useEffect(() => {
    if (!user) return;
    const raw = localStorage.getItem(makeProfileKey(user.email));
    const parsed = raw ? JSON.parse(raw) : [{ id: 'default', name: user.name || 'Main', isKids: false }];
    setProfiles(parsed);
  }, [user]);

  useEffect(() => {
    const loadInitial = async () => {
      setLoadingRows(true);
      try {
        const [homeRows, genreMap] = await Promise.all([getHomeRows(1), getGenreMap()]);
        setRows(homeRows);
        setGenres(genreMap);
        setRowPages(Object.fromEntries(homeRows.map((row) => [row.key, 1])));
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingRows(false);
      }
    };

    loadInitial();
  }, []);

  useEffect(() => {
    const loadSuggestions = async () => {
      if (query.trim().length < 2) {
        setSuggestions([]);
        return;
      }
      const data = await getSearchSuggestions(query);
      setSuggestions(data);
    };

    const timeout = setTimeout(loadSuggestions, 250);
    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    const loadCatalog = async () => {
      try {
        const data = await discoverMovies({
          query: query.trim(),
          genre: filters.genre,
          year: filters.year,
          minRating: filters.minRating,
          sortBy: filters.sortBy,
          page: discoverPage,
          kidsMode,
        });

        if (discoverPage === 1) {
          setCatalog(data.results || []);
        } else {
          setCatalog((prev) => [...prev, ...(data.results || [])]);
        }
        setCatalogTotalPages(data.total_pages || 1);
      } catch (error) {
        console.error(error);
      }
    };

    loadCatalog();
  }, [filters, query, discoverPage, kidsMode]);

  useEffect(() => {
    setDiscoverPage(1);
  }, [filters, query, kidsMode]);

  useEffect(() => {
    if (!user || !activeProfile) return;
    const wlRaw = localStorage.getItem(makeWatchlistKey(user.email, activeProfile.id));
    const hsRaw = localStorage.getItem(makeHistoryKey(user.email, activeProfile.id));
    setWatchlist(wlRaw ? JSON.parse(wlRaw) : []);
    setHistory(hsRaw ? JSON.parse(hsRaw) : []);
    setKidsMode(activeProfile.isKids);
  }, [user, activeProfile]);

  const watchlistIds = useMemo(() => new Set(watchlist.map((movie) => movie.id)), [watchlist]);

  const saveProfiles = (nextProfiles) => {
    setProfiles(nextProfiles);
    if (user) localStorage.setItem(makeProfileKey(user.email), JSON.stringify(nextProfiles));
  };

  const createProfile = (profile) => {
    const next = [...profiles, { ...profile, id: crypto.randomUUID() }];
    saveProfiles(next);
  };

  const toggleWatchlist = (movie) => {
    if (!user || !activeProfile) return;
    const exists = watchlistIds.has(movie.id);
    const next = exists
      ? watchlist.filter((item) => item.id !== movie.id)
      : [{ id: movie.id, title: movie.title || movie.name, poster_path: movie.poster_path, vote_average: movie.vote_average, release_date: movie.release_date }, ...watchlist];
    setWatchlist(next);
    localStorage.setItem(makeWatchlistKey(user.email, activeProfile.id), JSON.stringify(next.slice(0, 100)));
  };

  const addHistory = (movie, progress = 5) => {
    if (!user || !activeProfile) return;
    const next = [{
      id: movie.id,
      title: movie.title || movie.name,
      poster_path: movie.poster_path,
      vote_average: movie.vote_average,
      release_date: movie.release_date,
      progress,
      watchedAt: Date.now(),
    }, ...history.filter((item) => item.id !== movie.id)].slice(0, 30);
    setHistory(next);
    localStorage.setItem(makeHistoryKey(user.email, activeProfile.id), JSON.stringify(next));
  };

  const updateProgress = (movie, progress) => {
    if (!movie?.id || !user || !activeProfile) return;
    const clamped = Math.max(0, Math.min(100, progress));
    const existing = history.find((item) => item.id === movie.id);
    const payload = {
      id: movie.id,
      title: movie.title || movie.name || existing?.title,
      poster_path: movie.poster_path || existing?.poster_path,
      vote_average: movie.vote_average || existing?.vote_average,
      release_date: movie.release_date || existing?.release_date,
      progress: clamped,
      watchedAt: Date.now(),
    };

    const next = [payload, ...history.filter((item) => item.id !== movie.id)].slice(0, 30);
    setHistory(next);
    localStorage.setItem(makeHistoryKey(user.email, activeProfile.id), JSON.stringify(next));
  };

  const handleLoadMoreRow = async (rowKey) => {
    const current = rowPages[rowKey] || 1;
    const nextPage = current + 1;
    const freshRows = await getHomeRows(nextPage);
    const nextRowData = freshRows.find((row) => row.key === rowKey);
    if (!nextRowData) return;

    setRows((prev) => prev.map((row) => (row.key === rowKey ? { ...row, movies: [...row.movies, ...nextRowData.movies] } : row)));
    setRowPages((prev) => ({ ...prev, [rowKey]: nextPage }));
  };

  if (!user) {
    return (
      <AuthPanel
        onLogin={(email, password) => setUser(loginUser(email, password))}
        onRegister={(name, email, password) => setUser(registerUser(name, email, password))}
      />
    );
  }

  if (!activeProfile) {
    return <ProfileSelector profiles={profiles} onSelectProfile={setActiveProfile} onCreateProfile={createProfile} />;
  }

  const historyIds = new Set(history.map((item) => item.id));
  const personalized = history.length > 0
    ? catalog.filter((movie) => !historyIds.has(movie.id)).slice(0, 12)
    : catalog.slice(0, 12);

  const movieRows = rows.filter((row) => !['drama', 'comedy', 'romance'].includes(row.key));
  const tvRows = rows.filter((row) => ['drama', 'comedy', 'romance'].includes(row.key));

  const renderRowSection = (rowList) => {
    if (loadingRows) return <SkeletonRow />;

    return rowList.map((row) => (
      <MovieRow
        key={row.key}
        title={row.label}
        movies={row.movies}
        watchlistIds={watchlistIds}
        onToggleWatchlist={toggleWatchlist}
        onAddHistory={addHistory}
        onLoadMore={() => handleLoadMoreRow(row.key)}
        progressMap={progressMap}
        onProgressChange={updateProgress}
      />
    ));
  };

  const renderHomeView = () => (
    <>
      <section className="special-row">
        <h3>My List</h3>
        <div className="row-scroll">
          {watchlist.length === 0 ? <p className="empty-state">Your watchlist is empty.</p> : watchlist.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onToggleWatchlist={toggleWatchlist}
              inWatchlist={watchlistIds.has(movie.id)}
              onAddHistory={addHistory}
              progress={progressMap[movie.id] || 0}
              onProgressChange={updateProgress}
            />
          ))}
        </div>
      </section>
      <section className="special-row">
        <h3>Continue Watching</h3>
        <div className="row-scroll">
          {continueWatching.length === 0 ? <p className="empty-state">Start watching a trailer to build your continue list.</p> : continueWatching.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onToggleWatchlist={toggleWatchlist}
              inWatchlist={watchlistIds.has(movie.id)}
              onAddHistory={addHistory}
              progress={progressMap[movie.id] || 0}
              onProgressChange={updateProgress}
            />
          ))}
        </div>
      </section>
      <section className="special-row">
        <h3>Because You Watched</h3>
        <div className="row-scroll">
          {personalized.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onToggleWatchlist={toggleWatchlist}
              inWatchlist={watchlistIds.has(movie.id)}
              onAddHistory={addHistory}
              progress={progressMap[movie.id] || 0}
              onProgressChange={updateProgress}
            />
          ))}
        </div>
      </section>
      {renderRowSection(rows)}
    </>
  );

  const renderMoviesView = () => (
    <>
      <p className="page-description">Movie-first collections and full catalog browsing.</p>
      {renderRowSection(movieRows)}
      <section className="special-row">
        <h3>Browse All Movies</h3>
        <div className="catalog-grid">
          {catalog.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onToggleWatchlist={toggleWatchlist}
              inWatchlist={watchlistIds.has(movie.id)}
              onAddHistory={addHistory}
              progress={progressMap[movie.id] || 0}
              onProgressChange={updateProgress}
            />
          ))}
        </div>
      </section>
    </>
  );

  const renderTvView = () => (
    <>
      <p className="page-description">Drama, comedy, and romance sections grouped as TV-style browsing.</p>
      {renderRowSection(tvRows)}
    </>
  );

  const renderMyListView = () => (
    <>
      <section className="special-row">
        <h3>My List</h3>
        <div className="catalog-grid">
          {watchlist.length === 0 ? <p className="empty-state">Your watchlist is empty.</p> : watchlist.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onToggleWatchlist={toggleWatchlist}
              inWatchlist={watchlistIds.has(movie.id)}
              onAddHistory={addHistory}
              progress={progressMap[movie.id] || 0}
              onProgressChange={updateProgress}
            />
          ))}
        </div>
      </section>
      <section className="special-row">
        <h3>Continue Watching</h3>
        <div className="row-scroll">
          {continueWatching.length === 0 ? <p className="empty-state">No viewing history yet.</p> : continueWatching.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onToggleWatchlist={toggleWatchlist}
              inWatchlist={watchlistIds.has(movie.id)}
              onAddHistory={addHistory}
              progress={progressMap[movie.id] || 0}
              onProgressChange={updateProgress}
            />
          ))}
        </div>
      </section>
    </>
  );

  const renderNewPopularView = () => (
    <>
      <section className="special-row">
        <h3>New Releases</h3>
        {renderRowSection(rows.filter((row) => row.key === 'new'))}
      </section>
      <section className="special-row">
        <h3>Top Rated Right Now</h3>
        {renderRowSection(rows.filter((row) => row.key === 'top'))}
      </section>
    </>
  );

  const viewMap = {
    home: renderHomeView,
    movies: renderMoviesView,
    tv: renderTvView,
    'my-list': renderMyListView,
    'new-popular': renderNewPopularView,
  };

  return (
    <main className="app-shell">
      <Navigation
        query={query}
        onQueryChange={setQuery}
        suggestions={suggestions}
        onPickSuggestion={(item) => {
          setQuery(item.title || item.name);
          setSuggestions([]);
          setActiveView('movies');
        }}
        activeProfile={activeProfile}
        onLogout={() => {
          logoutUser();
          setUser(null);
          setActiveProfile(null);
        }}
        kidsMode={kidsMode}
        onToggleKidsMode={() => setKidsMode((prev) => !prev)}
        notifications={notifications}
        tabs={VIEW_TABS}
        activeTab={activeView}
        onTabChange={setActiveView}
      />

      <HeroCarousel movies={rows.find((row) => row.key === 'trending')?.movies.slice(0, 5) || []} onOpenMovie={setSelectedMovie} />

      <section className="content-wrap">
        <FilterBar genres={genres} filters={filters} onChange={setFilters} />
        <header className="view-header">
          <h2>{VIEW_TABS.find((tab) => tab.key === activeView)?.label}</h2>
        </header>
        {viewMap[activeView] ? viewMap[activeView]() : renderHomeView()}
        {activeView !== 'movies' && (
          <section className="special-row">
            <h3>Browse All</h3>
            <div className="catalog-grid">
              {catalog.slice(0, 12).map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onToggleWatchlist={toggleWatchlist}
                  inWatchlist={watchlistIds.has(movie.id)}
                  onAddHistory={addHistory}
                  progress={progressMap[movie.id] || 0}
                  onProgressChange={updateProgress}
                />
              ))}
            </div>
          </section>
        )}
        <button
          type="button"
          className="load-more-btn"
          disabled={discoverPage >= catalogTotalPages}
          onClick={() => setDiscoverPage((prev) => prev + 1)}
        >
          {discoverPage >= catalogTotalPages ? 'No more titles' : 'Load More'}
        </button>
      </section>

      <MovieModal
        movie={selectedMovie}
        isOpen={Boolean(selectedMovie)}
        onClose={() => setSelectedMovie(null)}
        onAddHistory={addHistory}
        onToggleWatchlist={toggleWatchlist}
        inWatchlist={watchlistIds.has(selectedMovie?.id)}
        progress={progressMap[selectedMovie?.id] || 0}
        onProgressChange={updateProgress}
      />
    </main>
  );
};

export default App;
