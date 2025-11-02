import React, { useState } from 'react';
import { Container, Form, Button, Alert, Row, Col, Card } from 'react-bootstrap';
import { reviewService } from '../services/reviewService';
import { useNavigate } from 'react-router-dom';

const CreateReview = ({ user }) => {
  const navigate = useNavigate();
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
      if (!user) {
        throw new Error('Please login to create a review');
      }

      const reviewData = {
        ...formData,
        userId: user.id,
        userName: user.name
      };

      await reviewService.createReview(reviewData);
      setSuccess('Review created successfully!');
      setTimeout(() => {
        navigate('/reviews');
      }, 2000);
    } catch (err) {
      setError(err.message);
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
                        <option value="movie">Movie</option>
                        <option value="restaurant">Restaurant</option>
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
                        <option value="5">5 - Excellent</option>
                        <option value="4">4 - Very Good</option>
                        <option value="3">3 - Good</option>
                        <option value="2">2 - Fair</option>
                        <option value="1">1 - Poor</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Item Name</Form.Label>
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
                    rows={4}
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    placeholder="Share your detailed experience..."
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