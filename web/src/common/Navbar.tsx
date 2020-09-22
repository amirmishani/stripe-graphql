import React from "react";
import { gql, useMutation } from "@apollo/client";
import { NavLink, useHistory } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { useAuth } from "../hooks/useAuth";

const logoutMutation = gql`
  mutation Logout {
    logout
  }
`;

function AuthorizedLinks() {
  const history = useHistory();
  const { updateUser } = useAuth();
  const [logout, { client }] = useMutation(logoutMutation);

  const _logout = async () => {
    const { data } = await logout();

    if (data && data.logout) {
      updateUser(null);
      await client.clearStore();
      history.push("/");
    }
  };

  return (
    <>
      <Nav.Link as={NavLink} to="/account" activeClassName="active">
        Account
      </Nav.Link>
      <Nav.Link onClick={() => _logout()}>Logout</Nav.Link>
    </>
  );
}

function UnauthorizedLinks() {
  return (
    <>
      <Nav.Link as={NavLink} to="/register" activeClassName="active">
        Register
      </Nav.Link>
      <Nav.Link as={NavLink} to="/login" activeClassName="active">
        Login
      </Nav.Link>
    </>
  );
}

function NavLinks() {
  const { user, isLoaded } = useAuth();

  if (!isLoaded) return <div>loading...</div>;

  if (isLoaded && user) return <AuthorizedLinks />;

  return <UnauthorizedLinks />;
}

export function NavbarView() {
  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Navbar.Brand as={NavLink} to="/">
          Stripe-GraphQL
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <NavLinks />
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
}
