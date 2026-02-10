import React, { memo, useRef, useState } from 'react';
import MovieModal from './MovieModal.jsx';

const MovieCard = memo(({ movie, onToggleWatchlist, inWatchlist, onAddHistory, progress = 0, onProgressChange, onPreviewEnter, onPreviewLeave }) => {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [autoStartModal, setAutoStartModal] = useState(false);
  const elRef = useRef(null);
  const title = movie.title || movie.name;

  const handleMouseEnter = () => {
    setHovered(true);
    try {
      onPreviewEnter?.(elRef.current, movie);
    } catch (e) {
    }
  };

  const handleMouseLeave = () => {
    setHovered(false);
    try {
      onPreviewLeave?.();
    } catch (e) {
    }
  };

  return (
    <>
      <article ref={elRef} className={`movie-card`} tabIndex={0} onFocus={handleMouseEnter} onBlur={handleMouseLeave} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={() => { setAutoStartModal(true); setOpen(true); }}>
        <img src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/movieposter.png.png'} alt={title} loading="lazy" />

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
