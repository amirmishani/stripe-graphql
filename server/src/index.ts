// import "reflect-metadata";
import "dotenv/config";
import { createConnection } from "typeorm";
import { ApolloServer } from "apollo-server-express";
import * as express from "express";
import * as session from "express-session";
import { typeDefs } from "./typeDefs";
import { resolvers } from "./resolvers";
import { stripe } from "./stripe";

stripe;

const startServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }: any) => ({ req }),
  });

  await createConnection();

  const app = express();

  app.use(
    session({
      secret: "flskjflrweopivcfsdf",
      resave: false,
      saveUninitialized: false,
    })
  );

  server.applyMiddleware({
    app,
    cors: { credentials: true, origin: "http://localhost:3000" },
  });

  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
};

startServer();
