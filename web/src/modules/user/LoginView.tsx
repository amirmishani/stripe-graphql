import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useHistory } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import { meQuery } from "../../graphql/queries";
import { useAuth } from "../../hooks/useAuth";

const loginMutation = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
      email
      plan
    }
  }
`;

export function LoginView() {
  const history = useHistory();
  const { updateUser } = useAuth();
  const [{ email, password }, setState] = useState({ email: "", password: "" });
  const [login, { client }] = useMutation(loginMutation, {
    update(cache, { data }) {
      if (!data || !data.login) {
        return;
      }

      cache.writeQuery({
        query: meQuery,
        data: { me: data.login },
      });
    },
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    // reset the cache, clear old data
    await client.clearStore();
    const user = await login({ variables: { email, password } });
    if (user && user.data) {
      updateUser(user.data.login);
      setState({
        email: "",
        password: "",
      });
      history.push("/account");
    }
  };

  return (
    <div className="wrapper-center">
      <Container className="p-3 text-center" style={{ maxWidth: 330 }}>
        <h1 className="h3 mb-4 font-weight-normal">Please Login</h1>
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
            Login
          </Button>
        </Form>
      </Container>
    </div>
  );
}
