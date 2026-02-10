import React, { useEffect, useState } from "react";
import { getMovieTrailer } from '../services/tmdb';
const TrendingMovieTrailerPreview = ({ movieId, visible }) => {
  const [trailerKey, setTrailerKey] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!visible || !movieId) return;
    setLoading(true);
    getMovieTrailer(movieId)
      .then((key) => setTrailerKey(key))
      .finally(() => setLoading(false));
  }, [movieId, visible]);

  if (!visible) return null;
  return (
    <div className="trailer-preview-popup">
      {loading ? (
        <div className="trailer-loading">Loading...</div>
      ) : trailerKey ? (
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
  );
};

export default TrendingMovieTrailerPreview;
