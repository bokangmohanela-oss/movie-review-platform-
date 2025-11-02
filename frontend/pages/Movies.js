import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { movieService } from '../services/movieService';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchMovies = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError('');

    try {
      const data = await movieService.searchMovies(searchTerm);
      if (data.Search) {
        setMovies(data.Search);
      } else {
        setMovies([]);
        setError('No movies found');
      }
    } catch (err) {
      setError('Failed to search movies');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <div className="text-center mb-5">
        <h2>Movie Database</h2>
        <p className="text-muted">Search for movies and read reviews</p>
      </div>

      <Form onSubmit={searchMovies} className="mb-4">
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

      {error && <Alert variant="warning">{error}</Alert>}

      {loading && (
        <div className="text-center py-4">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}

      <Row className="g-4">
        {movies.map(movie => (
          <Col key={movie.imdbID} md={6} lg={4} xl={3}>
            <Card className="h-100 shadow-sm">
              <Card.Img 
                variant="top" 
                src={movie.Poster !== 'N/A' ? movie.Poster : '/placeholder-movie.jpg'}
                style={{ height: '300px', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDIwMCAzMDAiIGZpbGw9IiNmNWY1ZjUiPjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMzAwIi8+PHRleHQgeD0iMTAwIiB5PSIxNTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+';
                }}
              />
              <Card.Body className="d-flex flex-column">
                <Card.Title className="h6">{movie.Title}</Card.Title>
                <Card.Text className="text-muted small">
                  {movie.Year} • {movie.Type}
                </Card.Text>
                <div className="mt-auto">
                  <Button variant="outline-primary" size="sm" className="w-100">
                    View Details
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {movies.length === 0 && !loading && searchTerm && (
        <div className="text-center py-5">
          <h4>No movies found</h4>
          <p className="text-muted">Try a different search term</p>
        </div>
      )}

      {movies.length === 0 && !loading && !searchTerm && (
        <div className="text-center py-5">
          <h4>Search for Movies</h4>
          <p className="text-muted">Use the search bar above to find movies</p>
        </div>
      )}
    </Container>
  );
};

export default Movies;