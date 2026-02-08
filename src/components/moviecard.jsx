import React, { memo, useState } from 'react';
import MovieModal from './MovieModal.jsx';

const MovieCard = memo(({ movie, onToggleWatchlist, inWatchlist, onAddHistory }) => {
  const [open, setOpen] = useState(false);
  const title = movie.title || movie.name;

  return (
    <>
      <article className="movie-card" onClick={() => setOpen(true)}>
        <img src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/movieposter.png.png'} alt={title} loading="lazy" />
        <div className="card-overlay">
          <h4>{title}</h4>
          <p>⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'} • {(movie.release_date || '').slice(0, 4)}</p>
          <div className="card-actions">
            <button type="button" onClick={(event) => { event.stopPropagation(); setOpen(true); }}>▶ Trailer</button>
            <button type="button" onClick={(event) => { event.stopPropagation(); onToggleWatchlist(movie); }}>
              {inWatchlist ? '✓ Watchlist' : '+ Watchlist'}
            </button>
          </div>
        </div>
      </article>
      <MovieModal movie={movie} isOpen={open} onClose={() => setOpen(false)} onAddHistory={onAddHistory} />
    </>
  );
});

MovieCard.displayName = 'MovieCard';

export default MovieCard;
