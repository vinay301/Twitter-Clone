"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initServer = void 0;
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const users_1 = require("./users");
const tweets_1 = require("./tweets");
const jwt_1 = __importDefault(require("../services/jwt"));
function initServer() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = (0, express_1.default)();
        app.use(body_parser_1.default.json());
        app.use((0, cors_1.default)());
        const graphQLServer = new server_1.ApolloServer({
            typeDefs: `
            ${users_1.Users.types}
            ${tweets_1.Tweet.types}
            type Query {
                ${users_1.Users.queries},
                ${tweets_1.Tweet.queries}
            }

            type Mutation {
                ${tweets_1.Tweet.mutations},
                ${users_1.Users.mutations}
            }
        `,
            resolvers: Object.assign(Object.assign({ Query: Object.assign(Object.assign({}, users_1.Users.resolvers.queries), tweets_1.Tweet.resolvers.queries), Mutation: Object.assign(Object.assign({}, tweets_1.Tweet.resolvers.mutations), users_1.Users.resolvers.mutations) }, tweets_1.Tweet.resolvers.extraResolvers), users_1.Users.resolvers.extraResolvers),
        });
        yield graphQLServer.start();
        app.use('/graphql', (0, express4_1.expressMiddleware)(graphQLServer, { context: ({ req, res }) => __awaiter(this, void 0, void 0, function* () {
                return {
                    user: req.headers.authorization ? jwt_1.default.decryptToken(req.headers.authorization.split("Bearer ")[1]) : undefined
                };
            }) }));
        return app;
    });
}
exports.initServer = initServer;
