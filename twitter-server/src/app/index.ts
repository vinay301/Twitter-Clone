import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import bodyParser from 'body-parser';
import express from 'express';
import { prismaClient } from '../clients/database';
import { Users } from './users';
import { GraphQLContext } from '../interfaces';
import JWTService from '../services/jwt';


export async function initServer() {
    const app = express();
    app.use(bodyParser.json());
    app.use(cors());
    const graphQLServer = new ApolloServer<GraphQLContext>({
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
app.use('/graphql', expressMiddleware(graphQLServer, {context:async({ req,res }) => {
    return {
        user: req.headers.authorization ? JWTService.decryptToken(req.headers.authorization.split("Bearer ")[1]) : undefined
    }
}}));
return app
}

