import { gql } from "@apollo/client";

export const userFragment = gql`
  fragment UserParts on User {
    id
    email
    customerId
    paymentId
    plan
  }
`;
