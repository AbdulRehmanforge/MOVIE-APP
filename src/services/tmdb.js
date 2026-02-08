const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const cache = new Map();
const TTL_MS = 1000 * 60 * 10;

const buildHeaders = () => ({
  Accept: 'application/json',
  Authorization: `Bearer ${API_KEY}`,
});

const makeCacheKey = (url) => url;

export const fetchWithCache = async (url) => {
  const key = makeCacheKey(url);
  const inMemory = cache.get(key);
  const now = Date.now();

  if (inMemory && now - inMemory.timestamp < TTL_MS) {
    return inMemory.data;
  }

  const storageRaw = sessionStorage.getItem(key);
  if (storageRaw) {
    const parsed = JSON.parse(storageRaw);
    if (now - parsed.timestamp < TTL_MS) {
      cache.set(key, parsed);
      return parsed.data;
    }
  }

  const response = await fetch(url, { headers: buildHeaders() });
  if (!response.ok) {
    throw new Error(`TMDB request failed: ${response.status}`);
  }

  const data = await response.json();
  const payload = { data, timestamp: now };
  cache.set(key, payload);
  sessionStorage.setItem(key, JSON.stringify(payload));
  return data;
};

export const getGenreMap = async () => {
  const data = await fetchWithCache(`${API_BASE_URL}/genre/movie/list`);
  return data.genres || [];
};

export const getHomeRows = async (page = 1) => {
  const rowConfig = [
    { key: 'trending', label: 'Trending Now', path: `/trending/movie/week?page=${page}` },
    { key: 'popular', label: 'Popular', path: `/movie/popular?page=${page}` },
    { key: 'new', label: 'New Releases', path: `/movie/now_playing?page=${page}` },
    { key: 'top', label: 'Top Rated', path: `/movie/top_rated?page=${page}` },
    { key: 'action', label: 'Action', path: `/discover/movie?with_genres=28&sort_by=popularity.desc&page=${page}` },
    { key: 'drama', label: 'Drama', path: `/discover/movie?with_genres=18&sort_by=popularity.desc&page=${page}` },
    { key: 'comedy', label: 'Comedy', path: `/discover/movie?with_genres=35&sort_by=popularity.desc&page=${page}` },
    { key: 'horror', label: 'Horror', path: `/discover/movie?with_genres=27&sort_by=popularity.desc&page=${page}` },
    { key: 'romance', label: 'Romance', path: `/discover/movie?with_genres=10749&sort_by=popularity.desc&page=${page}` },
  ];

  const rows = await Promise.all(
    rowConfig.map(async (row) => {
      const data = await fetchWithCache(`${API_BASE_URL}${row.path}`);
      return { ...row, movies: data.results || [], page: data.page || 1, totalPages: data.total_pages || 1 };
    })
  );

  return rows;
};

export const discoverMovies = async ({ query = '', genre = '', year = '', minRating = '', sortBy = 'popularity.desc', page = 1, kidsMode = false }) => {
  const params = new URLSearchParams();
  if (query) {
    params.set('query', query);
    params.set('page', page);
    return fetchWithCache(`${API_BASE_URL}/search/movie?${params.toString()}`);
  }

  params.set('sort_by', sortBy);
  params.set('page', page);
  if (genre) params.set('with_genres', genre);
  if (year) params.set('primary_release_year', year);
  if (minRating) params.set('vote_average.gte', minRating);
  if (kidsMode) params.set('certification_country', 'US');
  if (kidsMode) params.set('certification.lte', 'PG');

  return fetchWithCache(`${API_BASE_URL}/discover/movie?${params.toString()}`);
};

export const getSearchSuggestions = async (query) => {
  if (!query) return [];
  const data = await fetchWithCache(`${API_BASE_URL}/search/multi?query=${encodeURIComponent(query)}&page=1`);
  return (data.results || []).filter((item) => ['movie', 'person'].includes(item.media_type)).slice(0, 6);
};

export const getMovieDetails = async (id) => fetchWithCache(`${API_BASE_URL}/movie/${id}?append_to_response=videos,credits,recommendations,similar`);

export const getMovieTrailer = async (id) => {
  const details = await getMovieDetails(id);
  const trailer = details?.videos?.results?.find((video) => video.site === 'YouTube' && ['Trailer', 'Teaser'].includes(video.type));
  return trailer?.key || null;
};
