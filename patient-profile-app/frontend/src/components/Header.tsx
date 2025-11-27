import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

export const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="header">
      <Container>
        <Navbar.Brand href="#home">Patient Profile Management</Navbar.Brand>
        {isAuthenticated && (
          <Nav className="me-auto">
            <Nav.Link href="#patients">Patients</Nav.Link>
          </Nav>
        )}
        {isAuthenticated && (
          <Nav>
            <Navbar.Text>
              Signed in as: {user?.username}
            </Navbar.Text>
            <Nav.Link 
              onClick={(e) => {
                e.preventDefault();
                logout();
              }}
              className="text-light ms-3"
            >
              Logout
            </Nav.Link>
          </Nav>
        )}
      </Container>
    </Navbar>
  );
};