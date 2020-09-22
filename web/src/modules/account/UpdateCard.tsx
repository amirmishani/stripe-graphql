import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useHistory } from "react-router-dom";
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { gql, useMutation } from "@apollo/client";

import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { userFragment } from "../../graphql/fragments";
import { getCard } from "../../graphql/queries";

const updatePaymentMutation = gql`
  mutation UpdatePaymentMutation($paymentId: String!) {
    updatePayment(paymentId: $paymentId) {
      ...UserParts
    }
  }

  ${userFragment}
`;

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      padding: 6,
      lineHeight: "35px",
      backgroundColor: "#ffffff",
      fontSize: "1rem",
      color: "#495057",
      "::placeholder": {
        color: "#868e96",
      },
    },
    invalid: {
      color: "#d9534f",
    },
  },
};

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const history = useHistory();
  const [error, setError] = useState<string | null>(null);
  const [update] = useMutation(updatePaymentMutation, {
    refetchQueries: [{ query: getCard }],
    awaitRefetchQueries: true,
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (stripe && elements) {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement(CardElement)!,
      });

      if (error && error.message) {
        console.error("error: ", error);
        setError(error.message);
      } else if (paymentMethod && paymentMethod.id) {
        try {
          await update({
            variables: { paymentId: paymentMethod.id },
          });
          history.push("/account");
        } catch (error) {
          console.error(error);
        }
      }
    }
  };

  return (
    <div className="wrapper-center">
      <Container className="p-3 text-center" style={{ maxWidth: 330 }}>
        <h1 className="h3 mb-4 font-weight-normal">Update Credit Card</h1>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formCardElement" className="mb-3">
            <CardElement options={CARD_ELEMENT_OPTIONS} />
            {error && <Form.Text className="text-danger">{error}</Form.Text>}
          </Form.Group>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="mt-2"
            disabled={!stripe}
            block
          >
            Update Card
          </Button>
        </Form>
      </Container>
    </div>
  );
};

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY!);

export const UpdateCard = () => (
  <Elements stripe={stripePromise}>
    <CheckoutForm />
  </Elements>
);
