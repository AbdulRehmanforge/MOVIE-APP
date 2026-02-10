import React, { useEffect, useMemo, useState } from 'react';
import Spinner from './spinner.jsx';
import { getMovieDetails } from '../services/tmdb.js';

const MovieModal = ({
  movie,
  isOpen,
  onClose,
  onAddHistory,
  onToggleWatchlist,
  inWatchlist,
  progress = 0,
  onProgressChange,
  autoStart = false,
}) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [localProgress, setLocalProgress] = useState(progress);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!movie?.id || !isOpen) return;
      setLoading(true);
      try {
        const data = await getMovieDetails(movie.id);
        setDetails(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [movie?.id, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    setLocalProgress(progress || 0);
    setIsPlaying(autoStart && (progress || 0) < 100);
  }, [progress, isOpen, autoStart]);

  useEffect(() => {
    if (!isOpen || !isPlaying) return undefined;
    const timer = setInterval(() => {
      setLocalProgress((prev) => {
        const next = Math.min(100, prev + 2);
        if (next >= 100) setIsPlaying(false);
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isPlaying]);

  useEffect(() => {
    if (!isOpen) return;
    const timeout = setTimeout(() => {
      onProgressChange?.(details || movie, localProgress);
    }, 200);

    return () => clearTimeout(timeout);
  }, [localProgress, details, movie, onProgressChange, isOpen]);

  const trailer = useMemo(() => details?.videos?.results?.find((v) => v.site === 'YouTube' && ['Trailer', 'Teaser'].includes(v.type)) || null, [details]);
  const cast = details?.credits?.cast?.slice(0, 8) || [];
  const recommendations = details?.recommendations?.results?.slice(0, 8) || [];
  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    if (isOpen) {
      setAnimate(false);
      setTimeout(() => setAnimate(true), 10);
    } else {
      setAnimate(false);
    }
  }, [isOpen]);

  if (!isOpen || !movie) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-shell${animate ? ' animated' : ''}`} onClick={(event) => event.stopPropagation()}>
        {loading ? <Spinner /> : (
          <>
            <img
              className="modal-backdrop"
              src={details?.backdrop_path ? `https://image.tmdb.org/t/p/original${details.backdrop_path}` : '/movieposter.png.png'}
              alt={details?.title || movie.title}
            />
            <button type="button" className="modal-close" onClick={onClose}>✕</button>
            <div className="modal-content-zone">
              <h2>{details?.title || movie.title || movie.name}</h2>
              <p>{details?.overview || movie.overview}</p>
              <p className="meta-line">⭐ {details?.vote_average?.toFixed(1) || movie.vote_average?.toFixed(1) || 'N/A'} • {details?.runtime || '—'} min • {(details?.genres || []).map((g) => g.name).join(', ')}</p>

              {trailer && (
                <div className="modal-trailer-wrap">
                  <iframe
                    title={`${details?.title || movie.title} trailer`}
                    src={`https://www.youtube.com/embed/${trailer.key}?autoplay=${isPlaying ? 1 : 0}&mute=1&controls=0&playsinline=1&rel=0`}
                    allow="autoplay; encrypted-media"
                  />
                </div>
              )}

              <div className="modal-actions">
                {trailer && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsPlaying((prev) => !prev);
                      onAddHistory?.(details || movie, localProgress || 3);
                    }}
                  >
                    {isPlaying ? '❚❚ Pause Preview' : (localProgress > 1 ? '▶ Resume Preview' : '▶ Play Preview')}
                  </button>
                )}
                <button type="button" onClick={() => onToggleWatchlist?.(details || movie)}>
                  {inWatchlist ? '✓ In My List' : '+ Add to My List'}
                </button>
              </div>
              <div className="modal-progress">
                <span>Progress: {Math.round(localProgress)}%</span>
                <input type="range" min="0" max="100" value={localProgress} onChange={(event) => setLocalProgress(Number(event.target.value))} />
              </div>

              <div className="details-grid">
                <section>
                  <h3>Cast & Crew</h3>
                  <ul>{cast.map((person) => <li key={person.id}>{person.name} • {person.character || person.known_for_department}</li>)}</ul>
                </section>
                <section>
                  <h3>Recommended</h3>
                  <ul>{recommendations.map((rec) => <li key={rec.id}>{rec.title}</li>)}</ul>
                </section>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MovieModal;
