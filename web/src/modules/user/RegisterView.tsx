import React, { useState } from "react";

import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useHistory } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";

const registerMutation = gql`
  mutation Register($email: String!, $password: String!) {
    register(email: $email, password: $password)
  }
`;

export function RegisterView() {
  const history = useHistory();
  const [{ email, password }, setState] = useState({ email: "", password: "" });
  const [register] = useMutation(registerMutation);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const response = await register({ variables: { email, password } });
    if (response) {
      setState({
        email: "",
        password: "",
      });
      history.push("/login");
    }
  };

  return (
    <div className="wrapper-center">
      <Container className="p-3 text-center" style={{ maxWidth: 330 }}>
        <h1 className="h3 mb-4 font-weight-normal">Please Register</h1>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formEmail">
            <Form.Control
              name="email"
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="formPassword">
            <Form.Control
              name="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={handleChange}
            />
          </Form.Group>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="mt-2"
            block
          >
            Register
          </Button>
        </Form>
      </Container>
    </div>
  );
}
