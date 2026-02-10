import React, { useEffect, useRef, useState } from 'react';
import { getMovieTrailer } from '../services/tmdb.js';

const HeroCarousel = ({ movies, onOpenMovie }) => {
  const [index, setIndex] = useState(0);
  const [trailerKey, setTrailerKey] = useState(null);
  const [muted, setMuted] = useState(() => {
    try {
      const user = JSON.parse(localStorage.getItem('hd_user') || sessionStorage.getItem('hd_user'));
      return !user;
    } catch {
      return true;
    }
  });
  const [paused, setPaused] = useState(false);
  const playerRef = useRef(null);
  const ytApiLoaded = useRef(false);

  const movie = movies[index];

  useEffect(() => {
    let isMounted = true;
    setTrailerKey(null);
    try {
      const user = JSON.parse(localStorage.getItem('hd_user') || sessionStorage.getItem('hd_user'));
      if (!user) setMuted(true);
    } catch {
      setMuted(true);
    }
    if (movie && movie.id) {
      getMovieTrailer(movie.id).then((key) => {
        if (isMounted) setTrailerKey(key);
      });
    }
    return () => { isMounted = false; };
  }, [movie]);
  useEffect(() => {
    if (ytApiLoaded.current) return;
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);
    ytApiLoaded.current = true;
  }, []);
  useEffect(() => {
    if (!trailerKey) return;
    let ytPlayer;
    window.onYouTubeIframeAPIReady = () => {
      ytPlayer = new window.YT.Player(`hero-trailer-player`, {
        videoId: trailerKey,
        playerVars: {
          autoplay: 1,
          mute: muted ? 0 : 1,
          controls: 0,
          playsinline: 1,
          rel: 0,
          showinfo: 0,
          modestbranding: 1,
          loop: 1,
        },
        events: {
          onReady: (event) => {
            playerRef.current = event.target;
            if (paused) event.target.pauseVideo();
            else event.target.playVideo();
          },
        },
      });
    };
    if (window.YT && window.YT.Player) {
      window.onYouTubeIframeAPIReady();
    }
    return () => {
      if (ytPlayer && ytPlayer.destroy) ytPlayer.destroy();
      playerRef.current = null;
    };
  }, [trailerKey]);
  useEffect(() => {
    if (!playerRef.current) return;
    if (paused) playerRef.current.pauseVideo();
    else playerRef.current.playVideo();
  }, [paused]);

  if (!movie) return null;

  return (
    <section className="hero-banner hero-banner-video" style={{ position: 'relative', width: '100%', height: '56.25vw', maxHeight: '70vh', minHeight: '360px', overflow: 'hidden', background: '#000' }}>
      {trailerKey ? (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 0,
            overflow: 'hidden',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: paused ? 'rgba(0,0,0,0.45)' : 'none',
            transition: 'background 0.4s',
          }}
          onClick={() => setPaused((p) => !p)}
        >
          <div
            style={{
              width: '100%',
              height: '56.25vw',
              minHeight: '100%',
              minWidth: '100%',
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: 1,
              filter: paused ? 'grayscale(1)' : 'none',
              transform: paused ? 'scale(0.95)' : 'scale(1)',
              transition: 'filter 0.5s, transform 0.5s cubic-bezier(0.23,1.01,0.32,1)',
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            <div id="hero-trailer-player" style={{
              width: '100%',
              height: '56.25vw',
              minHeight: '100%',
              minWidth: '100%',
              objectFit: 'cover',
              position: 'relative',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
            }} />
          </div>
          {}
          <div
            style={{
              opacity: paused ? 1 : 0,
              pointerEvents: 'none',
              zIndex: 2,
              position: 'relative',
              transition: 'opacity 0.4s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              background: 'rgba(30,30,30,0.7)',
              boxShadow: '0 0 32px 8px rgba(0,0,0,0.25)',
              animation: paused ? 'fmovies-pause-pulse 1.2s infinite cubic-bezier(0.4,0,0.2,1)' : 'none',
            }}>
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="12" y="10" width="8" height="28" rx="3" fill="#fff"/>
                <rect x="28" y="10" width="8" height="28" rx="3" fill="#fff"/>
              </svg>
            </span>
            <style>{`
              @keyframes fmovies-pause-pulse {
                0% { box-shadow: 0 0 32px 8px rgba(0,0,0,0.25), 0 0 0 0 rgba(255,255,255,0.15); }
                70% { box-shadow: 0 0 32px 8px rgba(0,0,0,0.25), 0 0 0 20px rgba(255,255,255,0); }
                100% { box-shadow: 0 0 32px 8px rgba(0,0,0,0.25), 0 0 0 0 rgba(255,255,255,0); }
              }
            `}</style>
          </div>
        </div>
      ) : (
        <div className="hero-fallback" style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path || movie.poster_path})`, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, backgroundSize: 'cover', backgroundPosition: 'center' }} />
      )}
      <div className="hero-inner" style={{ position: 'relative', zIndex: 1, padding: '2rem', color: '#fff', maxWidth: '700px' }}>
        <h1>{movie.title || movie.name}</h1>
        <p>{movie.overview}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button type="button" onClick={() => onOpenMovie(movie)} style={{ fontSize: '1.2rem', padding: '0.5rem 1.5rem', borderRadius: '2rem', background: '#fff', color: '#111', border: 'none', cursor: 'pointer' }}>▶ Play</button>
          {trailerKey && (
            <button
              type="button"
              onClick={() => setMuted((m) => !m)}
              aria-label={muted ? 'Unmute' : 'Mute'}
              style={{
                background: 'rgba(34,34,34,0.9)',
                border: 'none',
                borderRadius: '50%',
                width: '44px',
                height: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                outline: muted ? '2px solid #e50914' : 'none',
                boxShadow: muted ? '0 0 8px 2px #e50914' : 'none',
                transition: 'outline 0.2s, box-shadow 0.2s',
                marginLeft: '0.5rem',
              }}
            >
              {muted ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.5 12C16.5 10.067 15.433 8.433 13.999 7.684M19 12C19 8.13401 15.866 5 12 5V19C15.866 19 19 15.866 19 12Z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="4" y1="4" x2="20" y2="20" stroke="#e50914" strokeWidth="2"/>
                  <path d="M9 9V15H5V9H9ZM9 9L15 3V21L9 15" stroke="#fff" strokeWidth="2" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 9V15H5V9H9ZM9 9L15 3V21L9 15" stroke="#fff" strokeWidth="2" strokeLinejoin="round"/>
                  <path d="M17 9C18.1046 10.1046 18.1046 11.8954 17 13M19 7C21.2091 9.20914 21.2091 12.7909 19 15" stroke="#e50914" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              )}
            </button>
          )}
        </div>
      </div>
      {}
      {movies.length > 1 && (
        <>
          {}
          <button
            type="button"
            aria-label="Previous trailer"
            onClick={() => setIndex((prev) => (prev - 1 + movies.length) % movies.length)}
            style={{
              position: 'absolute',
              top: '50%',
              left: '2vw',
              transform: 'translateY(-50%)',
              zIndex: 2,
              background: 'rgba(20,20,20,0.7)',
              border: 'none',
              borderRadius: '50%',
              width: '56px',
              height: '56px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
              transition: 'background 0.2s',
              color: '#fff',
              outline: 'none',
            }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
            onMouseOut={e => e.currentTarget.style.background = 'rgba(20,20,20,0.7)'}
          >
            {}
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="16" fill="rgba(0,0,0,0.2)" />
              <polyline points="20,8 12,16 20,24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {}
          <button
            type="button"
            aria-label="Next trailer"
            onClick={() => setIndex((prev) => (prev + 1) % movies.length)}
            style={{
              position: 'absolute',
              top: '50%',
              right: '2vw',
              transform: 'translateY(-50%)',
              zIndex: 2,
              background: 'rgba(20,20,20,0.7)',
              border: 'none',
              borderRadius: '50%',
              width: '56px',
              height: '56px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
              transition: 'background 0.2s',
              color: '#fff',
              outline: 'none',
            }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
            onMouseOut={e => e.currentTarget.style.background = 'rgba(20,20,20,0.7)'}
          >
            {}
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="16" fill="rgba(0,0,0,0.2)" />
              <polyline points="12,8 20,16 12,24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </>
      )}
    </section>
  );
};

export default HeroCarousel;
