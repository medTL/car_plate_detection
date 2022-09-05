import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {NavLink} from "react-router-dom";
import NavDropdown from 'react-bootstrap/NavDropdown';
export default function Header() {
  return (
   
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand to="/" >Car Plate Detection</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
     

      </Container>
    </Navbar>
   
  )
}
