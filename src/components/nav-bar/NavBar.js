import React from 'react';
import './NavBar.css';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';


const NavBar = () => {
    return (
        <div>
            <Navbar collapseOnSelect expand="lg" bg="light" variant="light">
                <Navbar.Brand>
                    <Link className="brand-link" to="/"><i className="bi-code-square nav-icon" /> Luke Irvine</Link>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link as={Link} to="/">Wordle Solver</Nav.Link>
                        <Nav.Link target="_blank" href="https://lukeirvine.github.io/portfolio/#/apps">Apps Portfolio</Nav.Link>
                        <Nav.Link target="_blank" href="https://lukeirvine.github.io/music">Music Portfolio</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </div>
    )
}

export default NavBar
