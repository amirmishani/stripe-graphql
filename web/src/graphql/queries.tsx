import { gql } from "@apollo/client";
import { userFragment } from "./fragments";

export const meQuery = gql`
  query Me {
    me {
      ...UserParts
    }
  }

  ${userFragment}
`;

export const getCard = gql`
  query GetCard {
    getCard {
      brand
      exp_month
      exp_year
      last4
    }
  }
`;
