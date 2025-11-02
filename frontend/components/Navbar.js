import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const CustomNavbar = ({ user, setUser }) => {
  const handleLogin = () => {
    // Simulate user login
    setUser({
      id: '1',
      name: 'Bokang',
      email: 'bokang@example.com'
    });
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" style={{ padding: '1rem' }}>
      <Container>
        <Navbar.Brand as={Link} to="/">
          🎬 ReviewHub
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/reviews">All Reviews</Nav.Link>
            <Nav.Link as={Link} to="/movies">Movies</Nav.Link>
            <Nav.Link as={Link} to="/restaurants">Restaurants</Nav.Link>
            {user && (
              <Nav.Link as={Link} to="/create-review">Write Review</Nav.Link>
            )}
          </Nav>
          <Nav>
            {user ? (
              <>
                <Navbar.Text className="me-3">
                  Welcome, {user.name}
                </Navbar.Text>
                <Button variant="outline-light" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <Button variant="outline-light" onClick={handleLogin}>
                Login
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;