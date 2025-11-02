import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, Form, Button, 
  Spinner, Alert, Badge, Modal, InputGroup,
  Dropdown, Pagination, Accordion
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import restaurantService from '../services/restaurantService';

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useState({
    location: '',
    term: '',
    category: 'all'
  });
  const [filters, setFilters] = useState({
    price: '',
    open_now: false,
    sort_by: 'best_match'
  });
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [restaurantDetails, setRestaurantDetails] = useState(null);
  const [yelpReviews, setYelpReviews] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    total: 0,
    limit: 20
  });
  const [locationSuggestions, setLocationSuggestions] = useState([]);

  // Get user's location on component mount
  useEffect(() => {
    getUserLocation();
    loadDefaultRestaurants();
  }, []);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Reverse geocoding would be needed to get city name
          // For now, we'll use coordinates directly
          setSearchParams(prev => ({
            ...prev,
            location: 'Current Location'
          }));
        },
        (error) => {
          console.log('Geolocation error:', error);
          setSearchParams(prev => ({
            ...prev,
            location: 'New York'
          }));
        }
      );
    }
  };

  const loadDefaultRestaurants = async () => {
    setLoading(true);
    try {
      const data = await restaurantService.searchRestaurants({
        location: 'New York',
        term: 'restaurants',
        limit: 12
      });
      setRestaurants(data.businesses || []);
      setPagination(prev => ({ ...prev, total: data.total || 0 }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const searchRestaurants = async (page = 1) => {
    if (!searchParams.location && !searchParams.term) {
      setError('Please enter a location or search term');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const params = {
        ...searchParams,
        ...filters,
        limit: pagination.limit,
        offset: (page - 1) * pagination.limit
      };

      // Remove 'all' category as it's not a real Yelp category
      if (params.category === 'all') {
        delete params.category;
      }

      const data = await restaurantService.searchRestaurants(params);
      setRestaurants(data.businesses || []);
      setPagination(prev => ({ 
        ...prev, 
        current: page, 
        total: data.total || 0 
      }));

      if (!data.businesses || data.businesses.length === 0) {
        setError('No restaurants found. Try adjusting your search criteria.');
      }
    } catch (err) {
      setError(err.message);
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchRestaurants(1);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    // Trigger new search when filters change
    setTimeout(() => searchRestaurants(1), 100);
  };

  const handleRestaurantClick = async (restaurant) => {
    setSelectedRestaurant(restaurant);
    setShowModal(true);
    setRestaurantDetails(null);
    setYelpReviews([]);

    // Load restaurant details and reviews
    try {
      const [details, reviews] = await Promise.all([
        restaurantService.getRestaurant(restaurant.id),
        restaurantService.getRestaurantReviews(restaurant.id)
      ]);
      setRestaurantDetails(details);
      setYelpReviews(reviews.reviews || []);
    } catch (err) {
      console.error('Error loading restaurant details:', err);
    }
  };

  const handlePageChange = (page) => {
    searchRestaurants(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPriceColor = (price) => {
    if (!price) return 'secondary';
    switch (price.length) {
      case 1: return 'success';
      case 2: return 'warning';
      case 3: return 'danger';
      case 4: return 'dark';
      default: return 'secondary';
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="d-flex align-items-center">
        <span className="text-warning me-1" style={{ fontSize: '1.1rem' }}>
          {'★'.repeat(Math.floor(rating))}
          {rating % 1 >= 0.5 && '½'}
        </span>
        <small className="text-muted">({rating})</small>
      </div>
    );
  };

  const renderCategories = () => {
    return (
      <div className="mb-4">
        <h5 className="mb-3">Popular Categories</h5>
        <div className="d-flex flex-wrap gap-2">
          {restaurantService.popularCategories.map(category => (
            <Badge
              key={category.alias}
              bg={searchParams.category === category.alias ? 'primary' : 'outline-primary'}
              className="p-2 cursor-pointer category-badge"
              onClick={() => {
                setSearchParams(prev => ({ ...prev, category: category.alias }));
                setTimeout(() => searchRestaurants(1), 100);
              }}
            >
              {category.icon} {category.title}
            </Badge>
          ))}
        </div>
      </div>
    );
  };

  const renderFilters = () => {
    return (
      <Accordion className="mb-4">
        <Accordion.Item event="0">
          <Accordion.Header>🔍 Advanced Filters</Accordion.Header>
          <Accordion.Body>
            <Row className="g-3">
              <Col md={4}>
                <Form.Label>Price Range</Form.Label>
                <Form.Select
                  value={filters.price}
                  onChange={(e) => handleFilterChange({ ...filters, price: e.target.value })}
                >
                  <option value="">Any Price</option>
                  {restaurantService.priceFilters.map(price => (
                    <option key={price.value} value={price.value}>
                      {price.label} - {price.description}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={4}>
                <Form.Label>Sort By</Form.Label>
                <Form.Select
                  value={filters.sort_by}
                  onChange={(e) => handleFilterChange({ ...filters, sort_by: e.target.value })}
                >
                  {restaurantService.sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={4}>
                <Form.Check
                  type="checkbox"
                  label="Open Now"
                  checked={filters.open_now}
                  onChange={(e) => handleFilterChange({ ...filters, open_now: e.target.checked })}
                  className="mt-4"
                />
              </Col>
            </Row>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    );
  };

  const renderPagination = () => {
    if (pagination.total <= pagination.limit) return null;

    const totalPages = Math.ceil(pagination.total / pagination.limit);
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, pagination.current - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Pagination.Item
          key={i}
          active={i === pagination.current}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Pagination.Item>
      );
    }

    return (
      <div className="d-flex justify-content-center mt-4">
        <Pagination>
          <Pagination.Prev 
            disabled={pagination.current === 1}
            onClick={() => handlePageChange(pagination.current - 1)}
          />
          {pages}
          <Pagination.Next 
            disabled={pagination.current === totalPages}
            onClick={() => handlePageChange(pagination.current + 1)}
          />
        </Pagination>
      </div>
    );
  };

  return (
    <Container>
      {/* Header */}
      <div className="text-center mb-5">
        <h1>🍽️ Restaurant Finder</h1>
        <p className="lead text-muted">Discover real restaurants with live data from Yelp</p>
      </div>

      {/* Search Form */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Form onSubmit={handleSearch}>
            <Row className="g-2">
              <Col md={4}>
                <Form.Label>📍 Location</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="City, address, or zip code"
                  value={searchParams.location}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, location: e.target.value }))}
                  required
                />
              </Col>
              <Col md={4}>
                <Form.Label>🔍 What are you craving?</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g., pizza, sushi, burgers, vegan"
                  value={searchParams.term}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, term: e.target.value }))}
                />
              </Col>
              <Col md={4} className="d-flex align-items-end">
                <Button 
                  type="submit" 
                  variant="primary" 
                  className="w-100"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Searching...
                    </>
                  ) : (
                    'Find Restaurants'
                  )}
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {/* Categories */}
      {renderCategories()}

      {/* Filters */}
      {renderFilters()}

      {/* Results Info */}
      {restaurants.length > 0 && (
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5>
            Found {pagination.total} restaurants
            {searchParams.location && ` in ${searchParams.location}`}
          </h5>
          <Badge bg="light" text="dark">
            Page {pagination.current}
          </Badge>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <Alert variant="warning" className="mb-4">
          <Alert.Heading>Search Issue</Alert.Heading>
          {error}
          <hr />
          <div className="mb-0">
            <strong>Tips:</strong>
            <ul className="mb-0">
              <li>Make sure your Yelp API key is properly configured</li>
              <li>Try different search terms or locations</li>
              <li>Check your internet connection</li>
            </ul>
          </div>
        </Alert>
      )}

      {/* Restaurant Grid */}
      <Row className="g-4">
        {restaurants.map(restaurant => (
          <Col key={restaurant.id} xs={12} md={6} lg={4}>
            <Card className="h-100 shadow-sm restaurant-card">
              <div 
                className="restaurant-image position-relative"
                style={{
                  height: '200px',
                  backgroundImage: `url(${restaurant.image_url})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  cursor: 'pointer'
                }}
                onClick={() => handleRestaurantClick(restaurant)}
              >
                {restaurant.is_closed && (
                  <Badge bg="danger" className="position-absolute top-0 end-0 m-2">
                    Closed
                  </Badge>
                )}
                {!restaurant.is_closed && (
                  <Badge bg="success" className="position-absolute top-0 end-0 m-2">
                    Open
                  </Badge>
                )}
              </div>
              
              <Card.Body className="d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <Card.Title 
                    className="h6 mb-0 cursor-pointer text-truncate"
                    style={{ maxWidth: '70%' }}
                    onClick={() => handleRestaurantClick(restaurant)}
                  >
                    {restaurant.name}
                  </Card.Title>
                  {restaurant.price && (
                    <Badge bg={getPriceColor(restaurant.price)}>
                      {restaurant.price}
                    </Badge>
                  )}
                </div>

                <div className="mb-2">
                  {renderStars(restaurant.rating)}
                  <small className="text-muted ms-2">
                    ({restaurant.review_count} reviews)
                  </small>
                </div>

                <Card.Text className="text-muted small mb-2">
                  {restaurant.categories?.map(cat => cat.title).join(', ')}
                </Card.Text>

                <Card.Text className="small text-muted mb-2">
                  📍 {restaurant.location?.address1}
                  {restaurant.location?.city && `, ${restaurant.location.city}`}
                </Card.Text>

                {restaurant.distance && (
                  <Card.Text className="small text-muted mb-2">
                    📏 {restaurantService.formatDistance(restaurant.distance)}
                  </Card.Text>
                )}

                <Card.Text className="small text-muted mb-3">
                  📞 {restaurantService.formatPhoneNumber(restaurant.phone)}
                </Card.Text>

                <div className="mt-auto">
                  <div className="d-flex gap-2">
                    <Button 
                      variant="outline-primary" 
                      size="sm" 
                      className="flex-fill"
                      onClick={() => handleRestaurantClick(restaurant)}
                    >
                      View Details
                    </Button>
                    <Button 
                      as={Link}
                      to="/create-review" 
                      state={{ 
                        restaurant: {
                          id: restaurant.id,
                          name: restaurant.name,
                          type: 'restaurant'
                        }
                      }}
                      variant="primary" 
                      size="sm" 
                      className="flex-fill"
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
      {restaurants.length === 0 && !loading && !error && (
        <div className="text-center py-5">
          <h4>Ready to discover restaurants?</h4>
          <p className="text-muted">Enter a location and search term to find amazing restaurants near you.</p>
          <Button variant="primary" onClick={() => searchRestaurants(1)}>
            Search Restaurants in New York
          </Button>
        </div>
      )}

      {/* Restaurant Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" scrollable>
        <Modal.Header closeButton>
          <Modal.Title>{selectedRestaurant?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRestaurant && (
            <>
              {/* Restaurant Header */}
              <Row className="mb-4">
                <Col md={8}>
                  <div className="d-flex align-items-center mb-2">
                    {renderStars(selectedRestaurant.rating)}
                    <span className="text-muted ms-2">
                      ({selectedRestaurant.review_count} reviews)
                    </span>
                  </div>
                  <p className="text-muted mb-2">
                    {selectedRestaurant.categories?.map(cat => cat.title).join(' • ')}
                  </p>
                  {selectedRestaurant.price && (
                    <Badge bg={getPriceColor(selectedRestaurant.price)} className="mb-2">
                      {selectedRestaurant.price}
                    </Badge>
                  )}
                  <Badge bg={selectedRestaurant.is_closed ? 'danger' : 'success'} className="ms-2">
                    {selectedRestaurant.is_closed ? 'Closed' : 'Open Now'}
                  </Badge>
                </Col>
                <Col md={4}>
                  {selectedRestaurant.image_url && (
                    <img
                      src={selectedRestaurant.image_url}
                      alt={selectedRestaurant.name}
                      className="img-fluid rounded"
                      style={{ maxHeight: '150px', width: '100%', objectFit: 'cover' }}
                    />
                  )}
                </Col>
              </Row>

              {/* Location */}
              <h6>📍 Location</h6>
              <p className="mb-3">
                {selectedRestaurant.location?.address1}<br />
                {selectedRestaurant.location?.address2 && (
                  <>{selectedRestaurant.location.address2}<br /></>
                )}
                {selectedRestaurant.location?.city}, {selectedRestaurant.location?.state} {selectedRestaurant.location?.zip_code}
              </p>

              {/* Contact */}
              <h6>📞 Contact</h6>
              <p className="mb-3">
                {restaurantService.formatPhoneNumber(selectedRestaurant.phone)}
              </p>

              {/* Additional Details from Yelp */}
              {restaurantDetails && (
                <>
                  {restaurantDetails.hours && (
                    <>
                      <h6>🕒 Hours</h6>
                      <div className="mb-3">
                        {restaurantDetails.hours[0]?.open.map((hour, index) => (
                          <div key={index} className="small">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][hour.day]}: 
                            {formatTime(hour.start)} - {formatTime(hour.end)}
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {restaurantDetails.transactions && restaurantDetails.transactions.length > 0 && (
                    <>
                      <h6>✅ Services</h6>
                      <div className="mb-3">
                        {restaurantDetails.transactions.map((transaction, index) => (
                          <Badge key={index} bg="outline-secondary" className="me-1 text-capitalize">
                            {transaction.replace(/_/g, ' ')}
                          </Badge>
                        ))}
                      </div>
                    </>
                  )}
                </>
              )}

              {/* Yelp Reviews */}
              {yelpReviews.length > 0 && (
                <>
                  <h6>💬 Yelp Reviews</h6>
                  <div className="mb-3">
                    {yelpReviews.slice(0, 3).map((review, index) => (
                      <Card key={index} className="mb-2">
                        <Card.Body className="p-3">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <strong>{review.user.name}</strong>
                            <small className="text-muted">
                              {new Date(review.time_created).toLocaleDateString()}
                            </small>
                          </div>
                          {renderStars(review.rating)}
                          <p className="mb-0 mt-2 small">{review.text}</p>
                        </Card.Body>
                      </Card>
                    ))}
                  </div>
                </>
              )}

              {/* Yelp Link */}
              {selectedRestaurant.url && (
                <div className="text-center mt-4">
                  <a 
                    href={selectedRestaurant.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-outline-primary"
                  >
                    🔗 View on Yelp
                  </a>
                </div>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button 
            as={Link}
            to="/create-review" 
            state={{ 
              restaurant: {
                id: selectedRestaurant?.id,
                name: selectedRestaurant?.name,
                type: 'restaurant'
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

// Helper function to format time
const formatTime = (timeStr) => {
  const time = parseInt(timeStr);
  const hours = Math.floor(time / 100);
  const minutes = time % 100;
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
};

export default Restaurants;