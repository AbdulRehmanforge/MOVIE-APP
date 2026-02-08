import React, { useEffect, useState } from 'react';

const HeroCarousel = ({ movies, onOpenMovie }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!movies.length) return undefined;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % movies.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [movies]);

  const movie = movies[index];
  if (!movie) return null;

  return (
    <section className="hero-banner" style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path || movie.poster_path})` }}>
      <div className="hero-inner">
        <h1>{movie.title || movie.name}</h1>
        <p>{movie.overview}</p>
        <button type="button" onClick={() => onOpenMovie(movie)}>▶ Play</button>
      </div>
    </section>
  );
};

export default HeroCarousel;
