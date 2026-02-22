import React, { useEffect, useRef } from 'react';
import './TrendingMoviePopup.css';

const TrendingMoviePopup = ({
  movie,
  trailerKey,
  show,
  onPlay,
  onAddToList,
  onLike,
  onPopupMount,
  className = '',
  style = {},
  onMouseEnter,
  onMouseLeave,
}) => {
  const rootRef = useRef(null);

  useEffect(() => {
    if (show && rootRef.current) {
      onPopupMount?.(rootRef.current);
    }
  }, [show, onPopupMount]);

  if (!show || !movie) return null;

  return (
    <div
      ref={rootRef}
      className={`trending-movie-popup ${className}`}
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      role="dialog"
      aria-label="Trailer preview"
    >
      <div className="popup-trailer">
        {trailerKey ? (
          <iframe
            title="Trailer Preview"
            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&controls=0&playsinline=1&rel=0`}
            allow="autoplay; encrypted-media"
            frameBorder="0"
            allowFullScreen
          />
        ) : (
          <div className="trailer-unavailable">No trailer found</div>
        )}
      </div>
      <div className="popup-info">
        <h4 className="popup-title">{movie.title || movie.name}</h4>
        <p className="popup-description">{movie.overview ? movie.overview.slice(0, 150) + '...' : 'No description available.'}</p>
        <div className="popup-actions">
          <button className="popup-btn play" onClick={onPlay}>Play</button>
          <button className="popup-btn add" onClick={onAddToList}>Add to List</button>
          <button className="popup-btn like" onClick={onLike}>Like</button>
        </div>
      </div>
    </div>
  );
};

export default TrendingMoviePopup;
