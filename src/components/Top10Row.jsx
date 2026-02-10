import { useEffect, useState } from "react";
import useHorizontalScroll from '../hooks/useHorizontalScroll.js';
import useDragScroll from '../hooks/useDragScroll.js';
import "./top10.css";

export default function Top10Row({ movies, onOpenMovie }) {
  const [hovered, setHovered] = useState(false);
  const { ref: rowRef, update: updateScrollState } = useHorizontalScroll({ scrollRatio: 0.8, deps: [movies?.length] });
  const { isDragging, onPointerDown, onPointerMove, endDrag } = useDragScroll();
  useEffect(() => {
    updateScrollState();
  }, [updateScrollState, movies?.length]);

    return (
    <section className="top10-section">
      <h2 className="top10-title">Top 10 Trending Movies</h2>
      <div
        className={`top10-wrapper ${hovered ? 'is-hovered' : ''}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ position: "relative" }}
      >

        <div
          className={`top10-viewport ${isDragging ? 'is-dragging' : ''}`}
          ref={rowRef}
          onPointerDown={(event) => onPointerDown(event, rowRef)}
          onPointerMove={(event) => onPointerMove(event, rowRef)}
          onPointerUp={(event) => endDrag(event, rowRef)}
          onPointerLeave={(event) => endDrag(event, rowRef)}
        >
          <div className="top10-row">
            {movies.slice(0, 10).map((movie, index) => (
              <div className="top10-item" key={movie.id} onClick={() => onOpenMovie?.(movie)} role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === 'Enter') onOpenMovie?.(movie); }}>
                <div className="top10-rank">{index + 1}</div>
                <img
                  src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "/movieposter.png.png"}
                  alt={movie.title}
                  className="top10-poster"
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
