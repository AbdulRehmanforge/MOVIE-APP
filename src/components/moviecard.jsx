import React, { memo, useEffect, useRef, useState } from 'react';
import MovieModal from './MovieModal.jsx';
import { getMovieTrailer } from '../services/tmdb.js';

const MovieCard = memo(({ movie, onToggleWatchlist, inWatchlist, onAddHistory, progress = 0, onProgressChange }) => {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [trailerKey, setTrailerKey] = useState(null);
  const [loadingTrailer, setLoadingTrailer] = useState(false);
  const [autoStartModal, setAutoStartModal] = useState(false);
  const hoverTimeoutRef = useRef(null);
  const title = movie.title || movie.name;

  useEffect(() => () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
  }, []);

  const handleMouseEnter = () => {
    setHovered(true);
    if (trailerKey || loadingTrailer) return;
    hoverTimeoutRef.current = setTimeout(async () => {
      setLoadingTrailer(true);
      try {
        const key = await getMovieTrailer(movie.id);
        setTrailerKey(key);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingTrailer(false);
      }
    }, 350);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
  };

  return (
    <>
      <article className={`movie-card ${hovered ? 'is-hovered' : ''}`} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={() => { setAutoStartModal(progress > 1 && progress < 100); setOpen(true); }}>
        {hovered && trailerKey ? (
          <iframe
            className="card-preview"
            title={`${title} preview`}
            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&controls=0&playsinline=1&rel=0`}
            allow="autoplay; encrypted-media"
            loading="lazy"
          />
        ) : (
          <img src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/movieposter.png.png'} alt={title} loading="lazy" />
        )}

        {progress > 0 && progress < 100 && (
          <div className="card-progress"><span style={{ width: `${progress}%` }} /></div>
        )}

        <div className="card-overlay">
          <h4>{title}</h4>
          <p>⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'} • {(movie.release_date || '').slice(0, 4)}</p>
          <div className="card-actions">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setAutoStartModal(true);
                setOpen(true);
              }}
            >
              {progress > 1 && progress < 100 ? `▶ Resume ${Math.round(progress)}%` : '▶ Play'}
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onToggleWatchlist(movie);
              }}
            >
              {inWatchlist ? '✓ My List' : '+ My List'}
            </button>
          </div>
        </div>
      </article>
      <MovieModal
        movie={movie}
        isOpen={open}
        onClose={() => setOpen(false)}
        onAddHistory={onAddHistory}
        onToggleWatchlist={onToggleWatchlist}
        inWatchlist={inWatchlist}
        progress={progress}
        onProgressChange={onProgressChange}
        autoStart={autoStartModal}
      />
    </>
  );
});

MovieCard.displayName = 'MovieCard';

export default MovieCard;
