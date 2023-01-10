import React from "react";
import { NavLink } from "react-router-dom";
import {
  Navbar,
  Nav,
  Container,
  NavDropdown,
  Dropdown,
  Button,
  ButtonGroup,
  Form,
} from "react-bootstrap";
import { DarkmodeContext } from "../context/DarkmodeContext";
import CartPopover from "./popovers/CartPopover";
import { BP } from "../configuration";

function NavbarComponent(props: { categories: string[]; className?: string }) {
  const { darkmode, setDarkmode, watchMedia, setWatchMedia } =
    React.useContext(DarkmodeContext)!;

  return (
    <Navbar
      bg="primary"
      variant={darkmode ? "dark" : ""}
      expand={BP}
      id="navbar"
      sticky="top"
      className={`rounded-4 border border-secondary ${props.className || ""}`}
    >
      <Container>
        <Navbar.Brand as={NavLink} to="/">
          ReactApp
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto w-100">
            <Nav.Link as={NavLink} to="/products">
              Products
            </Nav.Link>
            <Nav.Link as={NavLink} to="/test">
              Test
            </Nav.Link>
            <NavDropdown title="Category">
              {props.categories.map((category, index) => (
                <NavDropdown.Item
                  key={index}
                  as={NavLink}
                  to={`/products/${category}`}
                  className="text-capitalize"
                >
                  {category}
                </NavDropdown.Item>
              ))}
            </NavDropdown>
            <div className="d-flex gap-2 ms-auto">
              <CartPopover>
                <Nav.Link as={NavLink} to="/cart">
                  Cart
                </Nav.Link>
              </CartPopover>
              <Dropdown as={ButtonGroup} align="end" autoClose="outside">
                <Button
                  variant="secondary-outline"
                  id="darkmode-btn"
                  className="border border-secondary"
                  onClick={() => setDarkmode(!darkmode)}
                >
                  <i
                    className={`bi bi-${darkmode ? "moon-stars" : "sun"}-fill`}
                  />
                </Button>
                <Dropdown.Toggle
                  split
                  variant="secondary-outline"
                  id="dropdown-split-darkmode"
                  className="border border-secondary"
                />
                <Dropdown.Menu className="position-absolute">
                  <Dropdown.Item as="label">
                    <Form.Check
                      label="System"
                      type="switch"
                      checked={watchMedia}
                      onChange={(e) => setWatchMedia(e.target.checked)}
                      id="custom-switch"
                    />
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;
