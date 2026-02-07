import React, { useState, memo, useCallback } from 'react';
import { updateSearchCount } from '../appwrite.js';
import MovieModal from './MovieModal.jsx';

const MovieCard = memo(({ movie, searchTerm = '', isTV = false }) => {
    const { id, title, name, poster_path, release_date, first_air_date, vote_average, original_language } = movie;
    const displayTitle = title || name;
    const displayDate = release_date || first_air_date;
    const [isHovered, setIsHovered] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    
    const handleClick = useCallback(() => {
        updateSearchCount(searchTerm, movie);
        setIsModalOpen(true);
    }, [searchTerm, movie]);

    const handleWatch = useCallback(() => {
        const streamingUrl = `https://www.google.com/search?q=${encodeURIComponent(`${displayTitle} ${isTV ? 'tv series' : 'movie'} streaming online free`)}`;
        window.open(streamingUrl, '_blank');
    }, [displayTitle, isTV]);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    const handleMouseEnter = useCallback(() => setIsHovered(true), []);
    const handleMouseLeave = useCallback(() => setIsHovered(false), []);
    const handleImageLoad = useCallback(() => setImageLoaded(true), []);

    return (
        <>
            <div 
                className="movie-card" 
                onClick={handleClick} 
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <img 
                    src={poster_path ? `https://image.tmdb.org/t/p/w500${poster_path}` : '/movieposter.png.png'} 
                    alt={displayTitle}
                    loading="lazy"
                    onLoad={handleImageLoad}
                    style={{ opacity: imageLoaded ? 1 : 0.7, transition: 'opacity 0.3s ease' }}
                />
                
                <div className="play-overlay">
                    <button 
                        className="play-button"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleClick();
                        }}
                        aria-label={`Watch ${displayTitle}`}
                    >
                        <svg 
                            width="24" 
                            height="24" 
                            viewBox="0 0 24 24" 
                            fill="white"
                            className="ml-1"
                        >
                            <path d="M8 5v14l11-7z"/>
                        </svg>
                    </button>
                </div>
                
                <h3>{displayTitle}</h3>
                <div className="content">
                    <div className="rating">
                        <img src="/star.png" alt="star" />
                        <p>{vote_average ? vote_average.toFixed(1) : 'N/A'}</p>
                    </div>
                    <span>•</span>
                    <p className="lang">{original_language}</p>
                    <span>•</span>
                    <p className="year">{displayDate ? displayDate.split('-')[0] : 'N/A'}</p>
                </div>
            </div>

            <MovieModal
                movie={movie}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onWatch={handleWatch}
            />
        </>
    )
});

MovieCard.displayName = 'MovieCard';

export default MovieCard;