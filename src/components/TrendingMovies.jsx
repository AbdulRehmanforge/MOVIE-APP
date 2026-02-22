
import React, { useEffect, useRef, useState } from "react";
import TrendingMoviePopup from "./TrendingMoviePopup.jsx";
import { getMovieTrailer } from '../services/tmdb';
import "./TrendingMovies.css";

// Removed AI-indented comment
const TrendingMovies = ({ movies = [], onOpenMovie, onToggleWatchlist, onToggleLike }) => {
  const rowRef = useRef(null);
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [popupIdx, setPopupIdx] = useState(null);
  const [popupTimer, setPopupTimer] = useState(null);
  const [popupTrailerKey, setPopupTrailerKey] = useState(null);
  const [popupStyle, setPopupStyle] = useState({ left: '50%', bottom: '110%', transform: 'translateX(-50%)' });
  const popupElRef = useRef(null);
  const EDGE_PADDING = 12; // px
  const isMobile = false;

  // ...existing code...

  // ...existing code...

  // ...existing code...

  // Handle hover with 300ms delay for popup
  const handleMouseEnter = (idx) => {
    if (isMobile) return;
    setHoveredIdx(idx);
    if (popupTimer) clearTimeout(popupTimer);
    if (!rowRef.current) return;
    const card = rowRef.current.querySelectorAll('.trending-movie-card')[idx];
    if (!card) return;
    const rowRect = rowRef.current.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const centerX = cardRect.left - rowRect.left + cardRect.width / 2;
    const tentativeTop = (cardRect.bottom - rowRect.top) + 12; // below
    const tentativeBottom = (rowRect.bottom - cardRect.top) + 12; // above

    // set a tentative position (above by default)
    setPopupStyle({ left: centerX + 'px', bottom: tentativeBottom + 'px', top: 'auto', transform: 'translateX(-50%)' });

    setPopupTimer(setTimeout(async () => {
      setPopupIdx(idx);
      const trailerKey = await getMovieTrailer(movies[idx].id);
      setPopupTrailerKey(trailerKey);
    }, 300));
  };
  const handleMouseLeave = () => {
    setHoveredIdx(null);
    if (popupTimer) clearTimeout(popupTimer);
    setPopupTimer(setTimeout(() => {
      setPopupIdx(null);
      setPopupTrailerKey(null);
    }, 120));
  };

  // adjust popup to avoid overflowing viewport and choose above/below
  useEffect(() => {
    if (popupIdx === null || !popupElRef.current || !rowRef.current) return;
    const popup = popupElRef.current;
    const rowRect = rowRef.current.getBoundingClientRect();
    const card = rowRef.current.querySelectorAll('.trending-movie-card')[popupIdx];
    if (!card) return;
    const cardRect = card.getBoundingClientRect();
    const popupRect = popup.getBoundingClientRect();
    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;

    let desiredCenterX = cardRect.left - rowRect.left + cardRect.width / 2;
    const minCenter = EDGE_PADDING + popupRect.width / 2;
    const maxCenter = rowRect.width - EDGE_PADDING - popupRect.width / 2;
    const finalCenterX = Math.min(Math.max(desiredCenterX, minCenter), Math.max(minCenter, maxCenter));

    const spaceAbove = cardRect.top - EDGE_PADDING;
    const spaceBelow = viewportH - cardRect.bottom - EDGE_PADDING;

    if (popupRect.height + 12 <= spaceAbove) {
      const bottom = (rowRect.bottom - cardRect.top) + 12;
      setPopupStyle({ left: finalCenterX + 'px', bottom: bottom + 'px', top: 'auto', transform: 'translateX(-50%)' });
    } else if (popupRect.height + 12 <= spaceBelow) {
      const top = (cardRect.bottom - rowRect.top) + 12;
      setPopupStyle({ left: finalCenterX + 'px', top: top + 'px', bottom: 'auto', transform: 'translateX(-50%)' });
    } else {
      if (spaceAbove >= spaceBelow) {
        const bottom = (rowRect.bottom - cardRect.top) + 12;
        setPopupStyle({ left: finalCenterX + 'px', bottom: bottom + 'px', top: 'auto', transform: 'translateX(-50%)' });
      } else {
        const top = (cardRect.bottom - rowRect.top) + 12;
        setPopupStyle({ left: finalCenterX + 'px', top: top + 'px', bottom: 'auto', transform: 'translateX(-50%)' });
      }
    }
  }, [popupIdx, popupTrailerKey]);

  // Mobile: open popup on tap/click
  const handleCardClick = (idx, movie) => {
    if (isMobile) {
      setPopupIdx(idx === popupIdx ? null : idx);
    } else {
      onOpenMovie && onOpenMovie(movie);
    }
  };

  return (
    <section className="trending-movies-section fade-slide-in">
      <h2 className="trending-title">Trending Movies</h2>
      <div className="trending-movies-row" ref={rowRef} tabIndex={0}>
        {movies.map((movie, idx) => (
          <div
            className="trending-movie-card"
            key={movie.id}
            style={{ animationDelay: `${idx * 60}ms` }}
            tabIndex={0}
            onClick={() => handleCardClick(idx, movie)}
            onMouseEnter={() => handleMouseEnter(idx)}
            onMouseLeave={handleMouseLeave}
            onFocus={() => handleMouseEnter(idx)}
            onBlur={handleMouseLeave}
          >
            {/* Large, bold, vertically centered number behind poster */}
            <span
              className="trending-rank netflix-rank"
              aria-hidden="true"
              style={{
                color: idx < 3 ? '#e50914' : '#fff',
                WebkitTextStroke: idx < 3 ? '2px #fff' : '2px #e50914',
                left: '-1.2em',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '6em',
                zIndex: 1,
                position: 'absolute',
                fontFamily: 'Impact, Bebas Neue, Arial Black, sans-serif',
                fontWeight: 900,
                opacity: 0.22,
                pointerEvents: 'none',
                lineHeight: 1,
              }}
            >
              {idx + 1}
            </span>
            {/* Poster overlaps number by 30-40% */}
            <img
              className="trending-movie-poster"
              src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "/movieposter.png.png"}
              alt={movie.title || movie.name}
              loading="lazy"
              draggable={false}
              style={{
                zIndex: 3,
                position: 'relative',
                left: '-2.2em',
                width: '120%',
                boxShadow: '0 6px 24px #000a, 0 1.5px 0 #fff2',
              }}
            />
            {/* Popup preview: trailer, title, actions */}
            {popupIdx === idx && (
              <TrendingMoviePopup
                movie={movie}
                trailerKey={popupTrailerKey}
                show={popupIdx === idx}
                anchorRef={null}
                onPopupMount={(el) => { popupElRef.current = el; }}
                onPlay={() => onOpenMovie && onOpenMovie(movie)}
                onAddToList={() => onToggleWatchlist && onToggleWatchlist(movie)}
                onLike={() => onToggleLike && onToggleLike(movie)}
                className={popupIdx === idx ? 'popup-visible' : 'popup-hidden'}
                style={{ position: 'absolute', left: popupStyle.left, top: popupStyle.top, bottom: popupStyle.bottom, transform: popupStyle.transform }}
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrendingMovies;
