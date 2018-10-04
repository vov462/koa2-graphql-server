# koa2-graphql-server

A simple Koa2 server using GraphQL with apollo-server@2

## Environment file

The app will look for a `.env` file in your root directory, and look for your `jwt` secret and `port` number in it. Create your `.env` file with the following content:

```
JWT_SECRET=<your_jwt_secret>
PORT=<port_number>
```
