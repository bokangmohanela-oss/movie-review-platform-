import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Spinner, Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import reviewService from '../services/reviewService';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'movie', 'restaurant'

  useEffect(() => {
    fetchReviews();
  }, [filter]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError('');
      
      let data;
      if (filter === 'all') {
        data = await reviewService.getAllReviews();
      } else {
        data = await reviewService.getReviewsByType(filter);
      }
      
      setReviews(data);
    } catch (err) {
      setError('Failed to fetch reviews');
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return 'success';
    if (rating >= 3) return 'warning';
    return 'danger';
  };

  const getTypeIcon = (type) => {
    return type === 'movie' ? '🎬' : '🍽️';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await reviewService.deleteReview(reviewId);
        // Refresh the reviews list
        fetchReviews();
      } catch (err) {
        setError('Failed to delete review');
        console.error('Error deleting review:', err);
      }
    }
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>All Reviews</h2>
          <p className="text-muted">See what others are saying about movies and restaurants</p>
        </div>
        <Badge bg="primary" pill>{reviews.length} reviews</Badge>
      </div>

      {/* Filter Buttons */}
      <div className="mb-4">
        <Button
          variant={filter === 'all' ? 'primary' : 'outline-primary'}
          className="me-2"
          onClick={() => setFilter('all')}
        >
          All Reviews
        </Button>
        <Button
          variant={filter === 'movie' ? 'primary' : 'outline-primary'}
          className="me-2"
          onClick={() => setFilter('movie')}
        >
          🎬 Movies
        </Button>
        <Button
          variant={filter === 'restaurant' ? 'primary' : 'outline-primary'}
          onClick={() => setFilter('restaurant')}
        >
          🍽️ Restaurants
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="g-4">
        {reviews.map(review => (
          <Col key={review.id} md={6} lg={4}>
            <Card className="h-100 shadow-sm">
              <Card.Body className="d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <Card.Title className="h5">{review.title}</Card.Title>
                  <Badge bg={getRatingColor(review.rating)}>
                    {review.rating}/5
                  </Badge>
                </div>
                
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <Badge bg="secondary">
                    {getTypeIcon(review.type)} {review.type}
                  </Badge>
                  <small className="text-muted">
                    {formatDate(review.createdAt)}
                  </small>
                </div>

                <Card.Text className="text-muted small mb-2">
                  <strong>{review.itemName}</strong>
                </Card.Text>

                <Card.Text className="flex-grow-1">
                  {review.content}
                </Card.Text>

                <div className="mt-3">
                  <Card.Text className="text-muted small">
                    By <strong>{review.userName}</strong>
                  </Card.Text>
                  
                  <div className="d-flex gap-2">
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      as={Link}
                      to={
                        review.type === 'movie' 
                          ? `/movies` 
                          : `/restaurants`
                      }
                    >
                      View {review.type === 'movie' ? 'Movie' : 'Restaurant'}
                    </Button>
                    
                    {/* Delete button - only show if user owns the review */}
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => handleDeleteReview(review.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {reviews.length === 0 && !loading && (
        <div className="text-center py-5">
          <h4>No reviews yet</h4>
          <p className="text-muted">
            {filter === 'all' 
              ? "Be the first to write a review!" 
              : `No ${filter} reviews yet. Be the first to write one!`
            }
          </p>
          <Button as={Link} to="/create-review" variant="primary">
            Write Your First Review
          </Button>
        </div>
      )}

      {/* Quick Stats */}
      {reviews.length > 0 && (
        <div className="mt-5">
          <Card>
            <Card.Body>
              <h5>Review Statistics</h5>
              <Row>
                <Col>
                  <strong>Total Reviews:</strong> {reviews.length}
                </Col>
                <Col>
                  <strong>Average Rating:</strong>{' '}
                  {(reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)}/5
                </Col>
                <Col>
                  <strong>Movies:</strong>{' '}
                  {reviews.filter(r => r.type === 'movie').length}
                </Col>
                <Col>
                  <strong>Restaurants:</strong>{' '}
                  {reviews.filter(r => r.type === 'restaurant').length}
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </div>
      )}
    </Container>
  );
};

export default Reviews;