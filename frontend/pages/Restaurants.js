import React from 'react';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';

const Restaurants = () => {
  // For demonstration - in a real app, you would fetch from an API like Yelp
  const sampleRestaurants = [
    {
      id: 1,
      name: "Italian Bistro",
      cuisine: "Italian",
      rating: 4.5,
      image: "/placeholder-restaurant.jpg"
    },
    {
      id: 2,
      name: "Sushi Haven",
      cuisine: "Japanese",
      rating: 4.8,
      image: "/placeholder-restaurant.jpg"
    },
    {
      id: 3,
      name: "Burger Palace",
      cuisine: "American",
      rating: 4.2,
      image: "/placeholder-restaurant.jpg"
    },
    {
      id: 4,
      name: "Thai Orchid",
      cuisine: "Thai",
      rating: 4.6,
      image: "/placeholder-restaurant.jpg"
    }
  ];

  return (
    <Container>
      <div className="text-center mb-5">
        <h2>Restaurant Directory</h2>
        <p className="text-muted">Discover and review local restaurants</p>
      </div>

      <Alert variant="info" className="mb-4">
        <strong>Note:</strong> This is a demo page. In a complete implementation, 
        you would integrate with a restaurant API like Yelp or Google Places.
      </Alert>

      <Row className="g-4">
        {sampleRestaurants.map(restaurant => (
          <Col key={restaurant.id} md={6} lg={3}>
            <Card className="h-100 shadow-sm">
              <Card.Img 
                variant="top" 
                src={restaurant.image}
                style={{ height: '200px', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9IiNmNWY1ZjUiPjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIi8+PHRleHQgeD0iMTAwIiB5PSIxMDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+';
                }}
              />
              <Card.Body className="d-flex flex-column">
                <Card.Title className="h6">{restaurant.name}</Card.Title>
                <Card.Text className="text-muted small">
                  {restaurant.cuisine}
                </Card.Text>
                <div className="mt-auto">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-warning">
                      {'★'.repeat(Math.floor(restaurant.rating))}
                      {'☆'.repeat(5 - Math.floor(restaurant.rating))}
                    </span>
                    <small className="text-muted">{restaurant.rating}</small>
                  </div>
                  <Button variant="outline-primary" size="sm" className="w-100 mt-2">
                    View Reviews
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Restaurants;