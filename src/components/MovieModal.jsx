import React, { useEffect, useMemo, useState } from 'react';
import Spinner from './spinner.jsx';
import { getMovieDetails } from '../services/tmdb.js';

const MovieModal = ({ movie, isOpen, onClose, onAddHistory }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const trailer = useMemo(() => details?.videos?.results?.find((v) => v.site === 'YouTube' && v.type === 'Trailer') || null, [details]);
  const cast = details?.credits?.cast?.slice(0, 8) || [];
  const recommendations = details?.recommendations?.results?.slice(0, 8) || [];

  if (!isOpen || !movie) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-shell" onClick={(event) => event.stopPropagation()}>
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

              <div className="modal-actions">
                {trailer && (
                  <button
                    type="button"
                    onClick={() => {
                      onAddHistory?.(details || movie);
                      window.open(`https://www.youtube.com/watch?v=${trailer.key}`, '_blank');
                    }}
                  >▶ Play Trailer</button>
                )}
                <button type="button" onClick={() => onAddHistory?.(details || movie)}>+ Continue Watching</button>
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
