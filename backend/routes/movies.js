const express = require('express');
const router = express.Router();

// Mock movies data for development
const mockMovies = [
  {
    id: '278',
    title: 'The Shawshank Redemption',
    overview: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    poster_path: 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
    release_date: '1994-09-23',
    vote_average: 9.3,
    vote_count: 25000
  },
  {
    id: '238',
    title: 'The Godfather',
    overview: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
    poster_path: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
    release_date: '1972-03-14',
    vote_average: 9.2,
    vote_count: 18000
  },
  {
    id: '157336',
    title: 'Interstellar',
    overview: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    poster_path: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    release_date: '2014-11-07',
    vote_average: 8.6,
    vote_count: 32000
  },
  {
    id: '680',
    title: 'Pulp Fiction',
    overview: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
    poster_path: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
    release_date: '1994-10-14',
    vote_average: 8.9,
    vote_count: 26000
  },
  {
    id: '13',
    title: 'Forrest Gump',
    overview: 'The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75.',
    poster_path: 'https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg',
    release_date: '1994-06-23',
    vote_average: 8.8,
    vote_count: 25000
  }
];

// GET movies search
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    console.log(`🎬 Searching movies for: ${query}`);
    
    // Filter mock data based on search
    const filteredMovies = mockMovies.filter(movie => 
      movie.title.toLowerCase().includes(query.toLowerCase())
    );

    res.json({
      movies: filteredMovies,
      page: 1,
      total_pages: 1,
      total_results: filteredMovies.length
    });

  } catch (error) {
    console.error('Movie search error:', error);
    res.status(500).json({ 
      error: 'Failed to search movies',
      details: error.message
    });
  }
});

// GET popular movies
router.get('/popular', async (req, res) => {
  try {
    console.log('🎬 Fetching popular movies');
    
    res.json({
      movies: mockMovies,
      page: 1,
      total_pages: 1,
      total_results: mockMovies.length
    });

  } catch (error) {
    console.error('Popular movies error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch popular movies',
      details: error.message
    });
  }
});

// GET now playing movies
router.get('/now-playing', async (req, res) => {
  try {
    console.log('🎬 Fetching now playing movies');
    
    res.json({
      movies: mockMovies.slice(0, 3), // Return first 3 as "now playing"
      page: 1,
      total_pages: 1,
      total_results: 3
    });

  } catch (error) {
    console.error('Now playing error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch now playing movies',
      details: error.message
    });
  }
});

// GET movie details by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log(`🎬 Fetching movie details for ID: ${id}`);
    
    const movie = mockMovies.find(m => m.id === id);
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    // Enhanced movie details
    const movieDetails = {
      ...movie,
      runtime: 142,
      genres: [{ id: 18, name: 'Drama' }],
      production_companies: [{ name: 'Warner Bros.' }],
      credits: {
        cast: [
          { name: 'Tim Robbins', character: 'Andy Dufresne' },
          { name: 'Morgan Freeman', character: 'Ellis Boyd "Red" Redding' }
        ]
      }
    };

    res.json(movieDetails);

  } catch (error) {
    console.error('Movie details error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch movie details',
      details: error.message
    });
  }
});

module.exports = router;