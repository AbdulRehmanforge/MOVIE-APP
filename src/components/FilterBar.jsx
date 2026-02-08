import React from 'react';

const FilterBar = ({ genres, filters, onChange }) => {
  return (
    <section className="filter-bar">
      <select value={filters.genre} onChange={(event) => onChange({ ...filters, genre: event.target.value })}>
        <option value="">All Genres</option>
        {genres.map((genre) => <option key={genre.id} value={genre.id}>{genre.name}</option>)}
      </select>

      <input
        type="number"
        min="1980"
        max="2030"
        value={filters.year}
        onChange={(event) => onChange({ ...filters, year: event.target.value })}
        placeholder="Year"
      />

      <select value={filters.minRating} onChange={(event) => onChange({ ...filters, minRating: event.target.value })}>
        <option value="">Min Rating</option>
        <option value="5">5+</option>
        <option value="6">6+</option>
        <option value="7">7+</option>
        <option value="8">8+</option>
      </select>

      <select value={filters.sortBy} onChange={(event) => onChange({ ...filters, sortBy: event.target.value })}>
        <option value="popularity.desc">Popularity</option>
        <option value="release_date.desc">Newest</option>
        <option value="vote_average.desc">Rating</option>
      </select>
    </section>
  );
};

export default FilterBar;
