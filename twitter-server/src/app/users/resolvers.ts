import axios from "axios";
import { prismaClient } from "../../clients/database";
import JWTService from "../../services/jwt";
import { GraphQLContext } from "../../interfaces";
interface GoogleTokenResults {
    iss? : string;
    azp? : string;
    aud?: string;
    sub?: string;
    email?: string;
    email_verified?: string;
    nbf?: string;
    name?: string;
    picture?: string;
    given_name?: string;
    family_name?: string;
    locale?: string;
    iat?: number;
    exp?:string;
    jti?: string;
    alg?: string;
    kid? : string;
    typ? : string;
}
const queries = {
    verifyGoogleToken : async(parent : any, { token } : {token : string}) => {
        const googleToken =  token;
        const googleOauthURL = new URL('https://oauth2.googleapis.com/tokeninfo')
        googleOauthURL.searchParams.set("id_token", googleToken);

        const {data} = await axios.get<GoogleTokenResults>(googleOauthURL.toString(), {
            responseType : 'json'
        })

        const user = await prismaClient.user.findUnique({where : {email: data.email}})
        if(!user)
        {
            await prismaClient.user.create({
                data:{
                    email: data.email!,
                    firstName: data.given_name!,
                    lastName: data.family_name || "",
                    profileImageUrl: data.picture!
                }
            })
        }
        const userInDb = await prismaClient.user.findUnique({where : {email : data.email}})
        if(!userInDb) throw new Error ('User with email not found in db');
        const userToken = JWTService.generateTokenForUser(userInDb)
        return userToken;
    },
    getCurrentUser: async(parent : any, args: any, ctx:GraphQLContext) => {
       // console.log(ctx.user);
        const id = ctx.user?.id
        if (!id) return null;

        const user = await prismaClient.user.findUnique({where:{id}})
        return user
    }
};
export const resolvers = { queries }