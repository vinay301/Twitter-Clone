import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import bodyParser from 'body-parser';
import express from 'express';

export async function initServer() {
    const app = express();
    app.use(bodyParser.json());
    const graphQLServer = new ApolloServer({
        typeDefs : `
            type Query {
                sayHello : String
            }
           
        `,
        resolvers : {
            Query: {
                sayHello : () =>  `Hello World!`
            }
          
        },
      });
await graphQLServer.start();
app.use('/graphql', expressMiddleware(graphQLServer));
return app
}

