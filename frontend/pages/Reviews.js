import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Spinner, Alert } from 'react-bootstrap';
import { reviewService } from '../services/reviewService';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await reviewService.getAllReviews();
        setReviews(data);
      } catch (err) {
        setError('Failed to fetch reviews');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const getRatingColor = (rating) => {
    if (rating >= 4) return 'success';
    if (rating >= 3) return 'warning';
    return 'danger';
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
        <h2>All Reviews</h2>
        <Badge bg="primary" pill>{reviews.length} reviews</Badge>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="g-4">
        {reviews.map(review => (
          <Col key={review.id} md={6} lg={4}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <Card.Title className="h5">{review.title}</Card.Title>
                  <Badge bg={getRatingColor(review.rating)}>
                    {review.rating}/5
                  </Badge>
                </div>
                <Card.Text className="text-muted small">
                  By {review.userName} • {new Date(review.createdAt).toLocaleDateString()}
                </Card.Text>
                <Card.Text>{review.content}</Card.Text>
                <div className="mt-auto">
                  <Badge bg="secondary">{review.type}</Badge>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {reviews.length === 0 && !loading && (
        <div className="text-center py-5">
          <h4>No reviews yet</h4>
          <p className="text-muted">Be the first to write a review!</p>
        </div>
      )}
    </Container>
  );
};

export default Reviews;