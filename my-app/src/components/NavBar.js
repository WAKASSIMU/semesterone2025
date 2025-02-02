import React from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


const NavBar = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="/">security services system</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
           
            <Nav.Link href="/securityoffices">offices</Nav.Link>
            <Nav.Link href="/organization">organization</Nav.Link>
            
            <Nav.Link href="/securityguard">Security guard</Nav.Link>
            <Nav.Link href="/order">Order</Nav.Link>
            <Nav.Link href="/register">Register</Nav.Link>
            <Nav.Link href="/makeorder">MakeOrder</Nav.Link>
            
         
            <NavDropdown title="Account" id="basic-nav-dropdown">
              <NavDropdown.Item href="/login">Login</NavDropdown.Item>
              <NavDropdown.Item href="/register">Register</NavDropdown.Item>
              
              <NavDropdown.Divider />
              <NavDropdown.Item href="/profile">Profile</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;




