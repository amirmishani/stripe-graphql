import React from "react";
import { gql, useMutation } from "@apollo/client";
import Button from "react-bootstrap/Button";
import { userFragment } from "../../graphql/fragments";

const cancelSubscriptionMutation = gql`
  mutation CancelSubscriptionMutation {
    cancelSubscription {
      ...UserParts
    }
  }

  ${userFragment}
`;

export const CancelSubscription = () => {
  //const history = useHistory();
  const [cancel] = useMutation(cancelSubscriptionMutation);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const user = await cancel();
      console.log(user);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Button
      type="text"
      variant="link"
      className="mt-2"
      style={{ color: "#fff", paddingLeft: 0 }}
      onClick={handleSubmit}
    >
      Cancel Subscription
    </Button>
  );
};
