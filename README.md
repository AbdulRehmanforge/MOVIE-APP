# HDMovies — Netflix-Style Movie App Template

A modern, responsive movie application inspired by premium streaming UX patterns (original design, copyright-safe).

## Implemented Features

### UI & Design
- Dark, polished streaming-style interface
- Sticky top navigation with search, profile indicator, notifications, and kids-mode toggle
- Auto-sliding hero banner with featured movies
- Smooth hover and transition effects
- Responsive layouts for mobile/tablet/desktop

### Movie Discovery & Browsing
- Horizontal rails for:
  - Trending Now
  - Popular
  - New Releases
  - Top Rated
  - Action
  - Drama
  - Comedy
  - Horror
  - Romance
- Row-level **Load more** pagination
- Full catalog browse area with global load-more

### Movie Cards
- Poster thumbnails with lazy loading
- Hover zoom + overlay actions
- Overlay includes:
  - Play trailer
  - Title + rating + year
  - Add/Remove watchlist

### Search & Filters
- Live instant search suggestions (movie/person)
- Search by movie title / actor intent
- Filters for:
  - Genre
  - Release year
  - Rating
  - Popularity/Newest sort

### Movie Detail Experience
- Cinematic banner in modal
- Trailer action button
- Storyline + runtime + genres + rating
- Cast & crew section
- Recommended titles section

### User Features
- Sign up / login flow
- Multi-profile selection screen
- Watchlist (My List)
- Continue Watching / viewing history
- Kids profile mode with safer discover query constraints

### Performance & UX
- Poster lazy loading
- Skeleton loaders
- Session + in-memory API caching
- Smooth scrollable rails

### Pro-style Enhancements
- “Because You Watched” personalized rail
- Basic notifications from newly released row snapshots

## Tech & Architecture
- React + Vite
- Component-based structure
- API-driven TMDB integration
- Local caching layer (`sessionStorage` + in-memory)
- Accessibility-minded controls (buttons, semantic sections)

## Setup

```bash
npm install
npm run dev
```

## Build / Quality

```bash
npm run lint
npm run build
```

## Environment Variables
Create `.env` in project root:

```bash
VITE_TMDB_API_KEY=...
VITE_APPWRITE_PROJECT_ID=...
VITE_APPWRITE_DATABASE_ID=...
VITE_APPWRITE_TABLE_ID=...
```

> Note: auth in this template is localStorage/session-based demo auth. Replace with production auth (Firebase/Auth0/custom backend) for live deployment.
