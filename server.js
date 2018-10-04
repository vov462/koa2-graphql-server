const Koa = require("koa");
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');

const { ApolloServer, gql } = require("apollo-server-koa");

require("dotenv").config({ path: ".env" });

const fs = require("fs");
const resolvers = require("./resolvers");

const typeDefs = fs.readFileSync("./schemas.graphql", { encoding: "utf-8" });

const app = new Koa();
app.use(cors(), bodyParser({ enableTypes: ['json'] }));

const server = new ApolloServer({ typeDefs, resolvers });

server.applyMiddleware({ app });

app.listen({
        port: 3000
    },
    () => console.log(`Server listening at http://localhost:3000${server.graphqlPath}`)
);
