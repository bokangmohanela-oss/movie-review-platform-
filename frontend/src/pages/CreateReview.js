import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Row, Col, Card } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import reviewService from '../services/reviewService';
import { Link } from 'react-router-dom';

const CreateReview = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    rating: 5,
    type: 'movie',
    itemId: '',
    itemName: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Pre-fill form if coming from movie/restaurant page
  useEffect(() => {
    if (location.state) {
      const { movie, restaurant } = location.state;
      
      if (movie) {
        setFormData(prev => ({
          ...prev,
          type: 'movie',
          itemId: movie.id || movie.imdbID,
          itemName: movie.title || movie.name
        }));
      } else if (restaurant) {
        setFormData(prev => ({
          ...prev,
          type: 'restaurant',
          itemId: restaurant.id,
          itemName: restaurant.name
        }));
      }
    }
  }, [location.state]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Check if user is logged in and has required data
      if (!user) {
        throw new Error('Please login to create a review');
      }

      if (!user.uid || !user.name) {
        throw new Error('User information is missing. Please log in again.');
      }

      const reviewData = {
        title: formData.title,
        content: formData.content,
        rating: parseInt(formData.rating),
        type: formData.type,
        itemId: formData.itemId,
        itemName: formData.itemName,
        userId: user.uid, // This was undefined before
        userName: user.name // This was undefined before
      };

      console.log('Submitting review:', reviewData); // Debug log

      const result = await reviewService.createReview(reviewData);
      setSuccess('Review created successfully!');
      
      setTimeout(() => {
        navigate('/reviews');
      }, 2000);
    } catch (err) {
      console.error('Review creation error:', err);
      setError(err.message || 'Failed to create review');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Container>
        <Alert variant="warning" className="text-center">
          <h4>Please login to write a review</h4>
          <p>You need to be logged in to create reviews.</p>
          <Button as={Link} to="/login" variant="primary" className="mt-2">
            Go to Login
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow">
            <Card.Body>
              <h2 className="text-center mb-4">Write a Review</h2>

              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Review Type</Form.Label>
                      <Form.Select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        required
                      >
                        <option value="movie">🎬 Movie</option>
                        <option value="restaurant">🍽️ Restaurant</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Rating</Form.Label>
                      <Form.Select
                        name="rating"
                        value={formData.rating}
                        onChange={handleChange}
                        required
                      >
                        <option value="5">★★★★★ - Excellent</option>
                        <option value="4">★★★★☆ - Very Good</option>
                        <option value="3">★★★☆☆ - Good</option>
                        <option value="2">★★☆☆☆ - Fair</option>
                        <option value="1">★☆☆☆☆ - Poor</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>
                    {formData.type === 'movie' ? 'Movie Name' : 'Restaurant Name'}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="itemName"
                    value={formData.itemName}
                    onChange={handleChange}
                    placeholder={`Enter ${formData.type} name`}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>
                    {formData.type === 'movie' ? 'Movie ID' : 'Restaurant ID'}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="itemId"
                    value={formData.itemId}
                    onChange={handleChange}
                    placeholder={`Enter ${formData.type} ID`}
                    required
                  />
                  <Form.Text className="text-muted">
                    {formData.type === 'movie' 
                      ? 'Use TMDB ID (e.g., 278 for Shawshank Redemption)' 
                      : 'Use Yelp Business ID'
                    }
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Review Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter a catchy title for your review"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Review Content</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={6}
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    placeholder={`Share your detailed experience with this ${formData.type}...`}
                    required
                  />
                </Form.Group>

                <div className="d-grid">
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={loading}
                    size="lg"
                  >
                    {loading ? 'Publishing...' : 'Publish Review'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateReview;