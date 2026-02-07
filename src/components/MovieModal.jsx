import React, { useState, useEffect } from 'react';

const MovieModal = ({ movie, isOpen, onClose, onWatch }) => {
  const [trailer, setTrailer] = useState(null);
  const [streamingProviders, setStreamingProviders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && movie) {
      fetchTrailer();
      fetchStreamingProviders();
    }
  }, [isOpen, movie]);

  const fetchStreamingProviders = async () => {
    if (!movie) return;

    try {
      const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movie.id}/watch/providers?api_key=${API_KEY}`
      );
      const data = await response.json();

      const usProviders = data.results?.US;
      if (usProviders) {
        const providers = [
          ...(usProviders.flatrate || []),
          ...(usProviders.rent || []),
          ...(usProviders.buy || [])
        ];
        setStreamingProviders(providers.slice(0, 6));
      }
    } catch (error) {
      console.error('Error fetching streaming providers:', error);
    }
  };

  const fetchTrailer = async () => {
    if (!movie) return;

    setLoading(true);
    try {
      const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${API_KEY}`
      );
      const data = await response.json();

      const officialTrailer = data.results.find(
        video => video.type === 'Trailer' && video.site === 'YouTube'
      ) || data.results.find(
        video => video.site === 'YouTube'
      );

      setTrailer(officialTrailer);
    } catch (error) {
      console.error('Error fetching trailer:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !movie) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative max-w-4xl w-full my-8 bg-dark-100 rounded-2xl shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
        >
          ✕
        </button>

        <div className="relative h-64 md:h-96">
          <img
            src={movie.backdrop_path
              ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
              : movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : '/movieposter.png.png'
            }
            alt={movie.title}
            className="w-full h-full object-cover rounded-t-2xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-100 via-transparent to-transparent rounded-t-2xl" />

          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={onWatch}
              className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md border-2 border-white/30 hover:bg-white/30 transition-all duration-300 hover:scale-110"
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="white" className="ml-1">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <img
                src={movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : '/movieposter.png.png'
                }
                alt={movie.title}
                className="w-32 md:w-48 rounded-lg shadow-lg"
              />
            </div>

            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {movie.title}
              </h1>

              {movie.tagline && (
                <p className="text-lg text-gray-300 italic mb-4">
                  "{movie.tagline}"
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <img src="/star.png" alt="star" className="w-5 h-5" />
                  <span className="text-lg font-semibold text-white">
                    {movie.vote_average?.toFixed(1) || 'N/A'}
                  </span>
                </div>
                <span className="text-gray-400">•</span>
                <span className="text-gray-300">
                  {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-300 uppercase">
                  {movie.original_language}
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-300">
                  {movie.runtime ? `${movie.runtime} min` : ''}
                </span>
              </div>

              {movie.genres && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {movie.genres.map(genre => (
                    <span
                      key={genre.id}
                      className="px-3 py-1 bg-light-100/20 rounded-full text-sm text-gray-300"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}

              <p className="text-gray-300 leading-relaxed mb-6">
                {movie.overview}
              </p>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={onWatch}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  🔍 Find Streaming Options
                </button>
                <button
                  onClick={() => window.open(`https://www.imdb.com/title/${movie.imdb_id}`, '_blank')}
                  className="px-6 py-3 bg-yellow-600 text-white font-semibold rounded-lg hover:bg-yellow-700 transition-all duration-300"
                >
                  IMDb
                </button>
                <button
                  onClick={() => window.open(`https://www.themoviedb.org/movie/${movie.id}`, '_blank')}
                  className="px-6 py-3 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-600 transition-all duration-300"
                >
                  TMDB
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="mt-8 flex justify-center">
              <div className="w-8 h-8 border-4 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : trailer ? (
            <div className="mt-8">
              <h3 className="text-xl font-bold text-white mb-4">Official Trailer</h3>
              <div className="aspect-video rounded-lg overflow-hidden">
                <iframe
                  src={`https://www.youtube.com/embed/${trailer.key}`}
                  title={`${movie.title} Trailer`}
                  className="w-full h-full"
                  allowFullScreen
                />
              </div>
            </div>
          ) : (
            <div className="mt-8 text-center">
              <p className="text-gray-400">No trailer available</p>
            </div>
          )}

          {streamingProviders.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white mb-3">Available on:</h3>
              <div className="flex flex-wrap gap-3">
                {streamingProviders.map(provider => (
                  <div
                    key={provider.provider_id}
                    className="flex items-center gap-2 bg-gray-800/50 rounded-lg px-3 py-2 hover:bg-gray-700/50 transition-colors cursor-pointer"
                    onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(`${movie.title} on ${provider.provider_name}`)}`, '_blank')}
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/w45${provider.logo_path}`}
                      alt={provider.provider_name}
                      className="w-6 h-6 rounded"
                    />
                    <span className="text-sm text-gray-300">{provider.provider_name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieModal;