import React from "react";
import { useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import Card from "react-bootstrap/Card";
import { meQuery, getCard } from "../../graphql/queries";
import { CancelSubscription } from "./CancelSubscription";

function FreeTrialCard() {
  return (
    <Card
      bg="secondary"
      text="white"
      style={{ width: "18rem" }}
      className="mb-3"
    >
      <Card.Header>Account</Card.Header>
      <Card.Body style={{ textAlign: "left" }}>
        <Card.Title>Free Trial</Card.Title>
        <Card.Text>
          You are currently using the free trial. Please subscribe for full
          access.
        </Card.Text>
        <Link to="/subscribe" className="btn btn-primary">
          Subscribe
        </Link>
      </Card.Body>
    </Card>
  );
}

function PremiumPlanCard() {
  return (
    <Card bg="success" text="white" style={{ width: "18rem" }} className="mb-3">
      <Card.Header>Account</Card.Header>
      <Card.Body style={{ textAlign: "left" }}>
        <Card.Title>Premium Plan</Card.Title>
        <Card.Text>
          Thank you for your subscription. Please enjoy the product.
        </Card.Text>
        <CancelSubscription />
      </Card.Body>
    </Card>
  );
}

interface CardProps {
  card: {
    brand: string;
    exp_month: number;
    exp_year: number;
    last4: string;
  };
}

function PaymentCard({ card }: CardProps) {
  return (
    <Card
      bg="secondary"
      text="white"
      style={{ width: "18rem" }}
      className="mb-3"
    >
      <Card.Header>Credit Card</Card.Header>
      <Card.Body style={{ textAlign: "left" }}>
        <Card.Title>XXX XXX XXX {card.last4}</Card.Title>
        <Card.Text style={{ textAlign: "right" }}>
          Exp: {card.exp_month}/{card.exp_year}
        </Card.Text>
        <Link
          to="/update"
          className="btn btn-link"
          style={{ color: "#fff", paddingLeft: 0 }}
        >
          Update Card
        </Link>
      </Card.Body>
    </Card>
  );
}

function PaymentData() {
  const { loading, error, data } = useQuery(getCard);

  if (error) {
    console.log(error);
    return null;
  }

  return (
    <>{loading ? <div>Loading...</div> : <PaymentCard card={data.getCard} />}</>
  );
}

function AccountData({ data, card }: any) {
  if (!data) {
    return <Alert variant="warning">Could not reach server!</Alert>;
  }

  if (!data.me) {
    return <Link to="/login">Please login</Link>;
  }

  if (data.me.plan === "free-trial") {
    return <FreeTrialCard />;
  }

  return (
    <>
      <PremiumPlanCard />
      <PaymentData />
    </>
  );

  //return <div>{data.me.plan}</div>;
}

export function AccountView() {
  const { loading, error, data } = useQuery(meQuery);

  if (error) {
    console.log(error);
    return null;
  }

  return (
    <div className="wrapper-center">
      <Container className="p-3 text-center" style={{ maxWidth: 330 }}>
        {loading ? <div>Loading...</div> : <AccountData data={data} />}
      </Container>
    </div>
  );
}
