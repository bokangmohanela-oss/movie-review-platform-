import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Container>
      <div className="hero-section text-center mb-5 py-5" style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '15px',
        color: 'white'
      }}>
        <h1 className="display-4 fw-bold">Welcome to ReviewHub</h1>
        <p className="lead">Discover and share reviews for movies and restaurants</p>
        <Button as={Link} to="/reviews" variant="light" size="lg" className="mt-3">
          Explore Reviews
        </Button>
      </div>

      <Row className="g-4">
        <Col md={6}>
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎬</div>
              <Card.Title>Movie Reviews</Card.Title>
              <Card.Text>
                Read and write reviews for your favorite movies. Get recommendations and share your thoughts.
              </Card.Text>
              <Button as={Link} to="/movies" variant="primary">
                Browse Movies
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🍽️</div>
              <Card.Title>Restaurant Reviews</Card.Title>
              <Card.Text>
                Discover new dining experiences and share your culinary adventures with the community.
              </Card.Text>
              <Button as={Link} to="/restaurants" variant="primary">
                Find Restaurants
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>How It Works</Card.Title>
              <Row>
                <Col md={4} className="text-center mb-3">
                  <div style={{ fontSize: '2rem', color: '#3498db' }}>1</div>
                  <h5>Sign Up</h5>
                  <p>Create an account to start reviewing</p>
                </Col>
                <Col md={4} className="text-center mb-3">
                  <div style={{ fontSize: '2rem', color: '#3498db' }}>2</div>
                  <h5>Explore</h5>
                  <p>Browse movies and restaurants</p>
                </Col>
                <Col md={4} className="text-center mb-3">
                  <div style={{ fontSize: '2rem', color: '#3498db' }}>3</div>
                  <h5>Review</h5>
                  <p>Share your experiences and ratings</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;