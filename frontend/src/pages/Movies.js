import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, Form, Button, 
  Spinner, Alert, Badge, Modal, Tabs, Tab
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import movieService from '../services/movieService';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movieDetails, setMovieDetails] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('search');
  const [pagination, setPagination] = useState({
    current: 1,
    total_pages: 0,
    total_results: 0
  });

  // Load popular movies on component mount
  useEffect(() => {
    loadPopularMovies();
  }, []);

  const loadPopularMovies = async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      const data = await movieService.getPopularMovies(page);
      setMovies(data.movies || []);
      setPagination({
        current: data.page,
        total_pages: data.total_pages,
        total_results: data.total_results
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadNowPlaying = async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      const data = await movieService.getNowPlaying(page);
      setMovies(data.movies || []);
      setPagination({
        current: data.page,
        total_pages: data.total_pages,
        total_results: data.total_results
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const searchMovies = async (page = 1) => {
    if (!searchTerm.trim()) {
      setError('Please enter a search term');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await movieService.searchMovies(searchTerm, page);
      setMovies(data.movies || []);
      setPagination({
        current: data.page,
        total_pages: data.total_pages,
        total_results: data.total_results
      });

      if (!data.movies || data.movies.length === 0) {
        setError('No movies found. Try a different search term.');
      }
    } catch (err) {
      setError(err.message);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setActiveTab('search');
    searchMovies(1);
  };

  const handleMovieClick = async (movie) => {
    setSelectedMovie(movie);
    setShowModal(true);
    setMovieDetails(null);

    try {
      const details = await movieService.getMovieDetails(movie.id);
      setMovieDetails(details);
    } catch (err) {
      console.error('Error loading movie details:', err);
    }
  };

  const handleTabSelect = (tab) => {
    setActiveTab(tab);
    setMovies([]);
    setError('');
    
    if (tab === 'popular') {
      loadPopularMovies(1);
    } else if (tab === 'now-playing') {
      loadNowPlaying(1);
    }
  };

  const handlePageChange = (page) => {
    if (activeTab === 'search') {
      searchMovies(page);
    } else if (activeTab === 'popular') {
      loadPopularMovies(page);
    } else if (activeTab === 'now-playing') {
      loadNowPlaying(page);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderStars = (voteAverage) => {
    const rating = voteAverage / 2; // Convert 10-point scale to 5-point scale
    return (
      <div className="d-flex align-items-center">
        <span className="text-warning me-1">
          {'★'.repeat(Math.floor(rating))}
          {rating % 1 >= 0.5 && '½'}
          {'☆'.repeat(5 - Math.ceil(rating))}
        </span>
        <small className="text-muted">({movieService.formatRating(voteAverage)})</small>
      </div>
    );
  };

  const renderPagination = () => {
    if (pagination.total_pages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, pagination.current - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(pagination.total_pages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant={i === pagination.current ? 'primary' : 'outline-primary'}
          size="sm"
          className="me-1"
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Button>
      );
    }

    return (
      <div className="d-flex justify-content-center mt-4">
        <Button
          variant="outline-primary"
          size="sm"
          className="me-1"
          disabled={pagination.current === 1}
          onClick={() => handlePageChange(pagination.current - 1)}
        >
          Previous
        </Button>
        {pages}
        <Button
          variant="outline-primary"
          size="sm"
          className="ms-1"
          disabled={pagination.current === pagination.total_pages}
          onClick={() => handlePageChange(pagination.current + 1)}
        >
          Next
        </Button>
      </div>
    );
  };

  return (
    <Container>
      <div className="text-center mb-5">
        <h1>🎬 Movie Database</h1>
        <p className="lead text-muted">Discover movies with live data from TMDB</p>
      </div>

      {/* Search Form */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Form onSubmit={handleSearch}>
            <Row className="g-2">
              <Col md={8}>
                <Form.Control
                  type="text"
                  placeholder="Search for movies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Col>
              <Col md={4}>
                <Button 
                  type="submit" 
                  variant="primary" 
                  className="w-100"
                  disabled={loading}
                >
                  {loading ? 'Searching...' : 'Search Movies'}
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {/* Tabs for different movie lists */}
      <Tabs activeKey={activeTab} onSelect={handleTabSelect} className="mb-4">
        <Tab eventKey="popular" title="🔥 Popular">
          {/* Content will be loaded when tab is selected */}
        </Tab>
        <Tab eventKey="now-playing" title="🎭 Now Playing">
          {/* Content will be loaded when tab is selected */}
        </Tab>
        <Tab eventKey="search" title="🔍 Search Results">
          {/* Content will be loaded when tab is selected */}
        </Tab>
      </Tabs>

      {error && <Alert variant="warning">{error}</Alert>}

      {loading && (
        <div className="text-center py-4">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}

      {/* Results Info */}
      {movies.length > 0 && (
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5>
            {pagination.total_results} movies found
            {activeTab === 'search' && searchTerm && ` for "${searchTerm}"`}
          </h5>
          <Badge bg="light" text="dark">
            Page {pagination.current} of {pagination.total_pages}
          </Badge>
        </div>
      )}

      {/* Movie Grid */}
      <Row className="g-4">
        {movies.map(movie => (
          <Col key={movie.id} xs={12} sm={6} md={4} lg={3}>
            <Card className="h-100 shadow-sm movie-card">
              <div 
                className="movie-poster position-relative"
                style={{
                  height: '300px',
                  backgroundImage: `url(${movie.poster_path || '/placeholder-movie.jpg'})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  cursor: 'pointer'
                }}
                onClick={() => handleMovieClick(movie)}
              >
                {!movie.poster_path && (
                  <div className="position-absolute top-50 start-50 translate-middle text-muted">
                    No Image
                  </div>
                )}
                <Badge bg="dark" className="position-absolute top-0 end-0 m-2">
                  {movieService.formatRating(movie.vote_average)}
                </Badge>
              </div>
              
              <Card.Body className="d-flex flex-column">
                <Card.Title 
                  className="h6 mb-2 cursor-pointer"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleMovieClick(movie)}
                >
                  {movie.title}
                </Card.Title>
                
                <div className="mb-2">
                  {renderStars(movie.vote_average)}
                </div>

                <Card.Text className="text-muted small mb-2">
                  {movieService.formatReleaseYear(movie.release_date)}
                </Card.Text>

                <Card.Text className="small text-muted mb-3 line-clamp-3">
                  {movie.overview || 'No overview available.'}
                </Card.Text>

                <div className="mt-auto">
                  <div className="d-grid gap-2">
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={() => handleMovieClick(movie)}
                    >
                      View Details
                    </Button>
                    <Button 
                      as={Link}
                      to="/create-review" 
                      state={{ 
                        movie: {
                          id: movie.id,
                          name: movie.title,
                          type: 'movie'
                        }
                      }}
                      variant="primary" 
                      size="sm"
                    >
                      Write Review
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Pagination */}
      {renderPagination()}

      {/* No Results */}
      {movies.length === 0 && !loading && !error && (
        <div className="text-center py-5">
          <h4>Discover Amazing Movies</h4>
          <p className="text-muted">
            {activeTab === 'search' 
              ? 'Enter a search term to find movies'
              : 'Browse popular or now playing movies using the tabs above'
            }
          </p>
        </div>
      )}

      {/* Movie Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" scrollable>
        <Modal.Header closeButton>
          <Modal.Title>{selectedMovie?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedMovie && (
            <>
              {/* Movie Header */}
              <Row className="mb-4">
                <Col md={4}>
                  {selectedMovie.poster_path && (
                    <img
                      src={selectedMovie.poster_path}
                      alt={selectedMovie.title}
                      className="img-fluid rounded"
                    />
                  )}
                </Col>
                <Col md={8}>
                  <div className="d-flex align-items-center mb-2">
                    {renderStars(selectedMovie.vote_average)}
                    <span className="text-muted ms-2">
                      ({selectedMovie.vote_count} votes)
                    </span>
                  </div>
                  
                  <p className="text-muted mb-2">
                    Released: {movieService.formatReleaseYear(selectedMovie.release_date)}
                  </p>

                  {movieDetails && (
                    <>
                      {movieDetails.runtime && (
                        <p className="text-muted mb-2">
                          Runtime: {movieService.formatRuntime(movieDetails.runtime)}
                        </p>
                      )}
                      
                      {movieDetails.genres && movieDetails.genres.length > 0 && (
                        <div className="mb-2">
                          <strong>Genres:</strong>
                          <div className="mt-1">
                            {movieDetails.genres.map(genre => (
                              <Badge key={genre.id} bg="secondary" className="me-1">
                                {genre.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </Col>
              </Row>

              {/* Overview */}
              <h6>Overview</h6>
              <p className="mb-4">
                {selectedMovie.overview || 'No overview available.'}
              </p>

              {/* Additional Details */}
              {movieDetails && (
                <>
                  {/* Production Companies */}
                  {movieDetails.production_companies && movieDetails.production_companies.length > 0 && (
                    <>
                      <h6>Production Companies</h6>
                      <p className="mb-3">
                        {movieDetails.production_companies.map(company => company.name).join(', ')}
                      </p>
                    </>
                  )}

                  {/* Cast */}
                  {movieDetails.credits && movieDetails.credits.cast && movieDetails.credits.cast.length > 0 && (
                    <>
                      <h6>Top Cast</h6>
                      <div className="mb-3">
                        <Row className="g-2">
                          {movieDetails.credits.cast.slice(0, 6).map(actor => (
                            <Col key={actor.id} xs={6} sm={4}>
                              <div className="small">
                                <strong>{actor.name}</strong>
                                <br />
                                <span className="text-muted">{actor.character}</span>
                              </div>
                            </Col>
                          ))}
                        </Row>
                      </div>
                    </>
                  )}
                </>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button 
            as={Link}
            to="/create-review" 
            state={{ 
              movie: {
                id: selectedMovie?.id,
                name: selectedMovie?.title,
                type: 'movie'
              }
            }}
            variant="primary"
            onClick={() => setShowModal(false)}
          >
            Write Review
          </Button>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Movies;