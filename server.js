const Koa = require("koa");
const Router = require('koa-router');

const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
const koaJwt = require('koa-jwt');
const { sign } = require('jsonwebtoken');

const db = require('./db');

const { ApolloServer, gql } = require("apollo-server-koa");

require("dotenv").config({ path: ".env" });

if (!process.env.JWT_SECRET) throw Error('Please supply a JWT_SECRET in your .env file.');

const app = new Koa();

const router = new Router();

router.post('/login', async (ctx, next) => {
    const { email, password } = ctx.request.body;

    const user = db.users.list().find((user) => user.email === email);

    if (!(user && user.password === password)) {
        ctx.status = 401;
        return next();
    }
    
    const token = sign(user, process.env.JWT_SECRET);

    ctx.body = { token };

    await next();
});

app
    .use(cors())
    .use(bodyParser())
    .use(router.routes())
    .use(router.allowedMethods())
    .use(koaJwt({ secret: process.env.JWT_SECRET, passthrough: true }));

const fs = require("fs");
const resolvers = require("./resolvers");

const typeDefs = gql(fs.readFileSync("./schemas.graphql", { encoding: "utf-8" }));

const graphqlServer = new ApolloServer({ 
    typeDefs, 
    resolvers, 
    context: ({ ctx }) => {
        const { user } = ctx.state;

        return { user };
    }, 
});

graphqlServer.applyMiddleware({ app });

const port = process.env.PORT || 3000;

app.listen({
        port
    },
    () => console.log(`Server listening at http://localhost:${port}`)
);
