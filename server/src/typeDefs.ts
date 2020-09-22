import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    customerId: String
    paymentId: String
    plan: String
  }

  type Card {
    brand: String
    exp_month: Int
    exp_year: Int
    last4: String
  }

  type Query {
    me: User
    getCard: Card
  }

  type Mutation {
    register(email: String!, password: String!): Boolean!
    login(email: String!, password: String!): User
    createSubscription(paymentId: String!): User
    updatePayment(paymentId: String!): User
    cancelSubscription: User
    logout: Boolean!
  }
`;
