import React, { useRef, useState, useEffect } from 'react';
import MovieCard from './moviecard.jsx';
import useHorizontalScroll from '../hooks/useHorizontalScroll.js';
import useDragScroll from '../hooks/useDragScroll.js';
import TrendingMoviePopup from './TrendingMoviePopup.jsx';
import { getMovieTrailer } from '../services/tmdb';

const MovieRow = ({ title, movies, watchlistIds, onToggleWatchlist, onToggleLike, onAddHistory, onLoadMore, progressMap = {}, onProgressChange, onOpenMovie }) => {
  const { ref: scrollRef, update: updateScrollState } = useHorizontalScroll({ scrollRatio: 0.8, deps: [movies?.length] });
  const { isDragging, onPointerDown, onPointerMove, endDrag } = useDragScroll();
  const sectionRef = useRef(null);
  const [popupIdx, setPopupIdx] = useState(null);
  const [popupTrailerKey, setPopupTrailerKey] = useState(null);
  const [popupStyle, setPopupStyle] = useState({ left: '50%', bottom: '110%', transform: 'translateX(-50%)' });
  const popupTimer = useRef(null);
  const popupElRef = useRef(null);

  const EDGE_PADDING = 12; // px

  useEffect(() => {
    updateScrollState();
  }, [updateScrollState, movies?.length]);

  useEffect(() => () => {
    if (popupTimer.current) clearTimeout(popupTimer.current);
  }, []);

  const isMobile = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

  const handlePreviewEnter = (el, movie, idx) => {
    if (isMobile) return;
    if (popupTimer.current) clearTimeout(popupTimer.current);
    popupTimer.current = setTimeout(async () => {
      if (!el || !sectionRef.current) return;
      const secRect = sectionRef.current.getBoundingClientRect();
      const rect = el.getBoundingClientRect();
      const centerX = rect.left - secRect.left + rect.width / 2;
      const bottom = (secRect.bottom - rect.top) + 12; // px
      setPopupStyle({ left: centerX + 'px', bottom: bottom + 'px', transform: 'translateX(-50%)', top: 'auto' });
      setPopupIdx(idx);
      try {
        const key = await getMovieTrailer(movie.id);
        setPopupTrailerKey(key);
      } catch (e) {
        setPopupTrailerKey(null);
      }
    }, 350);
  };

  const keepPopupOpen = () => {
    if (popupTimer.current) clearTimeout(popupTimer.current);
  };

  const handlePreviewLeave = () => {
    if (popupTimer.current) clearTimeout(popupTimer.current);
    popupTimer.current = setTimeout(() => {
      setPopupIdx(null);
      setPopupTrailerKey(null);
    }, 220);
  };
  useEffect(() => {
    if (popupIdx === null || !popupElRef.current) return;
    const popupEl = popupElRef.current;
    const card = (sectionRef.current && sectionRef.current.querySelectorAll('.movie-card')[popupIdx]);
    if (!card || !sectionRef.current) return;

    const secRect = sectionRef.current.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const popupRect = popupEl.getBoundingClientRect();
    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;
    let desiredCenterX = cardRect.left - secRect.left + cardRect.width / 2;
    const minCenter = EDGE_PADDING + popupRect.width / 2;
    const maxCenter = secRect.width - EDGE_PADDING - popupRect.width / 2;
    const finalCenterX = Math.min(Math.max(desiredCenterX, minCenter), Math.max(minCenter, maxCenter));
    const spaceAbove = cardRect.top - EDGE_PADDING;
    const spaceBelow = viewportH - cardRect.bottom - EDGE_PADDING;
    if (popupRect.height + 12 <= spaceAbove) {
      const bottom = (secRect.bottom - cardRect.top) + 12;
      setPopupStyle({ left: finalCenterX + 'px', bottom: bottom + 'px', top: 'auto', transform: 'translateX(-50%)' });
    } else if (popupRect.height + 12 <= spaceBelow) {
      const top = (cardRect.bottom - secRect.top) + 12;
      setPopupStyle({ left: finalCenterX + 'px', top: top + 'px', bottom: 'auto', transform: 'translateX(-50%)' });
    } else {
      if (spaceAbove >= spaceBelow) {
        const bottom = (secRect.bottom - cardRect.top) + 12;
        setPopupStyle({ left: finalCenterX + 'px', bottom: bottom + 'px', top: 'auto', transform: 'translateX(-50%)' });
      } else {
        const top = (cardRect.bottom - secRect.top) + 12;
        setPopupStyle({ left: finalCenterX + 'px', top: top + 'px', bottom: 'auto', transform: 'translateX(-50%)' });
      }
    }
  }, [popupIdx, popupTrailerKey]);

  return (
    <section className="movie-row" ref={sectionRef} style={{ position: 'relative' }}>
      <div className="row-header">
        <h3>{title}</h3>
        <button type="button" onClick={onLoadMore}>Load more</button>
      </div>
      <div className="row-scroller">
        <div
          className={`row-scroll ${isDragging ? 'is-dragging' : ''}`}
          ref={scrollRef}
          style={{ overflowX: 'auto', scrollBehavior: 'smooth' }}
          onPointerDown={(event) => onPointerDown(event, scrollRef)}
          onPointerMove={(event) => onPointerMove(event, scrollRef)}
          onPointerUp={(event) => endDrag(event, scrollRef)}
          onPointerLeave={(event) => endDrag(event, scrollRef)}
        >
          {movies.map((movie, idx) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onToggleWatchlist={onToggleWatchlist}
              inWatchlist={watchlistIds.has(movie.id)}
              onAddHistory={onAddHistory}
              progress={progressMap[movie.id] || 0}
              onProgressChange={onProgressChange}
              onPreviewEnter={(el) => handlePreviewEnter(el, movie, idx)}
              onPreviewLeave={handlePreviewLeave}
            />
          ))}
        </div>
      </div>

      {}
      {popupIdx !== null && (
        <TrendingMoviePopup
          movie={movies[popupIdx]}
          trailerKey={popupTrailerKey}
          show={true}
          style={{ position: 'absolute', left: popupStyle.left, top: popupStyle.top, bottom: popupStyle.bottom, transform: popupStyle.transform }}
          className="popup-visible"
          onPopupMount={(el) => { popupElRef.current = el; }}
          onMouseEnter={keepPopupOpen}
          onMouseLeave={handlePreviewLeave}
          onClose={() => { setPopupIdx(null); setPopupTrailerKey(null); }}
          onPlay={() => onOpenMovie?.(movies[popupIdx])}
          onAddToList={() => { onToggleWatchlist?.(movies[popupIdx]); setPopupIdx(null); setPopupTrailerKey(null); }}
          onLike={() => { onToggleLike?.(movies[popupIdx]); setPopupIdx(null); setPopupTrailerKey(null); }}
        />
      )}
    </section>
  );
};

export default MovieRow;
