import api from './apiService';

// TMDB API service
export const movieService = {
  // Search movies with TMDB
  searchMovies: async (query, page = 1) => {
    try {
      const response = await api.get(`/movies/search?query=${encodeURIComponent(query)}&page=${page}`);
      return response.data;
    } catch (error) {
      console.error('Movie search error:', error);
      throw new Error(error.response?.data?.error || 'Failed to search movies');
    }
  },

  // Get popular movies
  getPopularMovies: async (page = 1) => {
    try {
      const response = await api.get(`/movies/popular?page=${page}`);
      return response.data;
    } catch (error) {
      console.error('Popular movies error:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch popular movies');
    }
  },

  // Get now playing movies
  getNowPlaying: async (page = 1) => {
    try {
      const response = await api.get(`/movies/now-playing?page=${page}`);
      return response.data;
    } catch (error) {
      console.error('Now playing error:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch now playing movies');
    }
  },

  // Get movie details by ID
  getMovieDetails: async (movieId) => {
    try {
      const response = await api.get(`/movies/${movieId}`);
      return response.data;
    } catch (error) {
      console.error('Movie details error:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch movie details');
    }
  },

  // Get movie genres
  getGenres: async () => {
    try {
      const response = await api.get('/movies/genres/list');
      return response.data;
    } catch (error) {
      console.error('Genres error:', error);
      return { genres: [] };
    }
  },

  // Helper functions
  formatReleaseYear: (releaseDate) => {
    if (!releaseDate) return 'TBA';
    return new Date(releaseDate).getFullYear();
  },

  formatRating: (voteAverage) => {
    return voteAverage ? voteAverage.toFixed(1) : 'N/A';
  },

  formatRuntime: (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }
};

export default movieService;