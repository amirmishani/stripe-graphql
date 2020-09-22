import React from "react";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";

export function HomeView() {
  return (
    <div className="wrapper-center">
      <Container className="p-3">
        <div className="jumbotron">
          <h1 className="display-3">Stripe-GraphQL</h1>
          <p className="lead">
            An implementation of Stripe account services via GraphQL in
            Typescript. This stack includes Node, Express andd Apollo Server for
            backend, Postgres as the database with a React and GraphQL frontend.
          </p>
          <hr className="my-4" />
          <p>Get started below by registering as a new customer.</p>
          <p className="lead">
            <Link className="btn btn-primary btn-lg" to="/register">
              Get Started
            </Link>
            <Link className="ml-3" to="/login">
              Existing Customer? Login here.
            </Link>
          </p>
        </div>
      </Container>
    </div>
  );
}
