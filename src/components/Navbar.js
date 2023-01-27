import React from 'react'
// import { Link } from 'react-router-dom'
import './Navbar.css'
// import { Container, Nav } from "reactstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Navbar, Nav, NavDropdown, Container} from "react-bootstrap"


class Navigation extends React.Component {

    handleClick() {
        localStorage.removeItem("token");
        window.location.reload();
      }

    render() {
        return (
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            {/* // <Navbar collapseOnSelect expand="lg" variant="dark"> */}
            <Container>
            <Navbar.Brand href="/Home">F1 Fantasy</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link href="/Home">Homesssss</Nav.Link>
                    <Nav.Link href="/Leagues">Leagues</Nav.Link>
                    <Nav.Link href="/TeamBuilder">Team Builder</Nav.Link>
                    <Nav.Link href="/Stats">Stats</Nav.Link> 
                </Nav>
            
                {this.props.loggedIn ? 
                    <NavDropdown title={this.props.loggedIn} className="dropdown">
                    <NavDropdown.Item href="/Profile">Profile</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="/" onClick={this.handleClick}>Log Out</NavDropdown.Item>
                    </NavDropdown> : 
                    <Nav>
                        <Nav.Link href="SignUp">Sign Up</Nav.Link>
                        <Nav.Link href="LogIn">Log In</Nav.Link>
                    </Nav>
                }
            </Navbar.Collapse>
            
            </Container>
            </Navbar>
        )
    }
}

export default Navigation


