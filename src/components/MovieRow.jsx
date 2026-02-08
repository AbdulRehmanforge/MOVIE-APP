import React from 'react';
import MovieCard from './moviecard.jsx';

const MovieRow = ({ title, movies, watchlistIds, onToggleWatchlist, onAddHistory, onLoadMore }) => {
  return (
    <section className="movie-row">
      <div className="row-header">
        <h3>{title}</h3>
        <button type="button" onClick={onLoadMore}>Load more</button>
      </div>
      <div className="row-scroll">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onToggleWatchlist={onToggleWatchlist}
            inWatchlist={watchlistIds.has(movie.id)}
            onAddHistory={onAddHistory}
          />
        ))}
      </div>
    </section>
  );
};

export default MovieRow;
