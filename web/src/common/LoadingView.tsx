import React from "react";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";

export const LoadingView = () => {
  return (
    <div className="wrapper-center">
      <Container className="p-3 text-center" style={{ maxWidth: 330 }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    </div>
  );
};
