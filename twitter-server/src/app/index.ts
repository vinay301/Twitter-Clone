import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import bodyParser from 'body-parser';
import express from 'express';
import { prismaClient } from '../clients/database';
import { Users } from './users';
export async function initServer() {
    const app = express();
    app.use(bodyParser.json());
    app.use(cors());
    const graphQLServer = new ApolloServer({
        typeDefs : `
            ${Users.types}
            type Query {
                ${Users.queries}
            }
        `,
        resolvers : {
            Query: {
               ...Users.resolvers.queries,
            }
          
        },
      });
await graphQLServer.start();
app.use('/graphql', expressMiddleware(graphQLServer));
return app
}

