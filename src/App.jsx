import React, {useEffect, useState, useRef } from 'react'
import Search from './components/search.jsx'
import Spinner from './components/spinner.jsx'
import MovieCard from './components/moviecard.jsx'
import Navigation from './components/Navigation.jsx'
import { getTrendingMovies, updateSearchCount } from './appwrite.js'

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const App =() =>{
const[searchTerm, setSearchTerm] =useState('');
const[debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
const[errorMessage, setErrorMessage] = useState('');
const[movielist, setMovielist] = useState([]);
const[trendingMovies, setTrendingMovies] = useState([]);
const[loading, setLoading] = useState(false);
const[activeTab, setActiveTab] = useState('home');
const[selectedGenre, setSelectedGenre] = useState('');
const[selectedCountry, setSelectedCountry] = useState('');
const isInitialMount = useRef(true);
const moviesSectionRef = useRef(null);

const fetchMovies = async (query= '') => {
    setLoading(true);
    setErrorMessage('');

  try {
    let endpoint = '';

    switch (activeTab) {
      case 'home':
        endpoint = query
          ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
          : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
        break;
      case 'genres':
        if (selectedGenre) {
          const genreIds = {
            'Action': 28,
            'Adventure': 12,
            'Animation': 16,
            'Comedy': 35,
            'Crime': 80,
            'Documentary': 99,
            'Drama': 18,
            'Family': 10751,
            'Fantasy': 14,
            'History': 36,
            'Horror': 27,
            'Music': 10402,
            'Mystery': 9648,
            'Romance': 10749,
            'Science Fiction': 878,
            'TV Movie': 10770,
            'Thriller': 53,
            'War': 10752,
            'Western': 37
          };

          const genreId = genreIds[selectedGenre];

          if (genreId) {
            endpoint = `${API_BASE_URL}/discover/movie?with_genres=${genreId}&sort_by=popularity.desc`;
          } else {
            endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
          }
        } else {
          endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
        }
        break;
      case 'countries':
        endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
        break;
      case 'movies':
        endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
        break;
      case 'tvseries':
        endpoint = `${API_BASE_URL}/discover/tv?sort_by=popularity.desc`;
        break;
      case 'topimdb':
        endpoint = `${API_BASE_URL}/discover/movie?sort_by=vote_average.desc&vote_count.gte=1000`;
        break;
      default:
        endpoint = query
          ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
          : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
    }

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`
      }
    });


    if (!response.ok) {
      throw new Error('FAILED TO FETCH MOVIES');

    }
    const data = await response.json();
    
    if(data.response === 'False'){
      setErrorMessage(data.Error || 'Unable to fetch movies at this time.');
      setMovielist([]);
      return;
    }

   setMovielist(data.results || []);
   
  if(query && data.results.length > 0){
    await updateSearchCount(query, data.results[0]);
  }

  } catch (error) {
    console.error('Error fetching movies:', error);
    setErrorMessage('Failed to fetch movies. Please try again later.');
  } finally{
    setLoading(false);
  }
}


useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearchTerm(searchTerm);
  }, 50);

  return () => clearTimeout(timer);
}, [searchTerm]);

useEffect(() => {
  if (isInitialMount.current) {
    isInitialMount.current = false;
    fetchMovies(debouncedSearchTerm);
  } else {
    fetchMovies(debouncedSearchTerm);
  }
}, [debouncedSearchTerm, activeTab, selectedGenre, selectedCountry]);

const handleGenreSelect = (genre) => {
  setSelectedGenre(genre);
  setSelectedCountry('');
  setSearchTerm('');
  setActiveTab('genres');
  fetchMovies('');
  setTimeout(() => {
    moviesSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
};

const handleCountrySelect = (country) => {
  setSelectedCountry(country);
  setSelectedGenre('');
  setSearchTerm('');
  setActiveTab('countries');
  fetchMovies('');
  setTimeout(() => {
    moviesSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
};

const handleTabChange = (tabId) => {
  if (tabId !== 'genres' && tabId !== 'countries') {
    setSelectedGenre('');
    setSelectedCountry('');
    setSearchTerm('');
  }
  setActiveTab(tabId);
  fetchMovies('');
  if (tabId !== 'home') {
    setTimeout(() => {
      moviesSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }
};

const loadTrendingMovies = async () => {
  const trending = await getTrendingMovies(10);
  setTrendingMovies(trending);
};

useEffect(() => {
  loadTrendingMovies();
}, []);

  return (
    <main>
      <div className = "pattern"/>
      <div className = "wrapper">

        <Navigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onGenreSelect={handleGenreSelect}
          onCountrySelect={handleCountrySelect}
          onTabChange={handleTabChange}
        />

        <header>
          <img src="/movieposter.png.png" alt="/bg.png.png" />
          <h1>Find <span className ="text-gradient">Movies</span> You will Enjoy Without the Hassle</h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {trendingMovies.length > 0 && activeTab === 'home' && (
          <section className="trending">
            <h2>Trending Movies</h2>
            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}
        

        <section className="all-movies" ref={moviesSectionRef}>
          <h2 style={{ marginTop: '40px' }}>
            {activeTab === 'home' && 'All Movies'}
            {activeTab === 'genres' && (selectedGenre ? `${selectedGenre} Movies` : 'Select a Genre')}
            {activeTab === 'countries' && (selectedCountry ? `Movies from ${selectedCountry}` : 'Select a Country')}
            {activeTab === 'movies' && 'Popular Movies'}
            {activeTab === 'tvseries' && 'TV Series'}
            {activeTab === 'topimdb' && 'Top IMDb Movies'}
          </h2>

          {loading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="error-message">{errorMessage}</p>
          ) : (
             <ul>
              {movielist.map((movie) => (
                <MovieCard key={movie.id} movie={movie} searchTerm={debouncedSearchTerm} isTV={activeTab === 'tvseries'} />
              ))}
             </ul>
          )}

        </section>






        </div>


    
     
    </main>
  )
}



export default App
