
import { prismaClient } from "../../clients/database";
import JWTService from "../../services/jwt";
import { GraphQLContext } from "../../interfaces";
import { User } from "@prisma/client";
import UserService from "../../services/user";

const queries = {
    verifyGoogleToken : async(parent : any, { token } : {token : string}) => {
       const resultToken = await UserService.verifyGoogleAuthToken(token);
       return resultToken;
    },
    getCurrentUser: async(parent : any, args: any, ctx:GraphQLContext) => {
       // console.log(ctx.user);
        const id = ctx.user?.id
        if (!id) return null;

        const user = await UserService.getUserById(id);
        return user
    },
    getUserById:  async (parent:any , {id}:{id:string}, ctx:GraphQLContext) => UserService.getUserById(id)

    
};

const extraResolvers = {
    User: {
        tweets: (parent:User) => prismaClient.tweet.findMany({where:{author: {id:parent.id}}}),
        followers: async (parent:User) => { const result = await prismaClient.follows.findMany({
            where:{following: {id: parent.id}},
            include:{follower:true}
        })
        return result.map(element => element.follower)
    },
        following: async (parent:User) => {
            const result = await prismaClient.follows.findMany({
                where:{follower: {id: parent.id}},
                include:{following:true}
            })
            return result.map(element => element.following)
        },
        recommendedUsers: async(parent:User, _:any, ctx:GraphQLContext) => {
            if(!ctx.user)return [];
            const myFollowings = await prismaClient.follows.findMany({
                where:{follower:{id:ctx.user.id}},
                include: {following: {include:{followers:{include:{following:true}}}}}
            })
            const usersToRecommend: User[] = []
            for(const followings of myFollowings){
                for(const followingOfFollowedUser of followings.following.followers){
                    if(followingOfFollowedUser.followingId !==ctx.user.id &&
                        myFollowings.findIndex(e => e?.followingId === followingOfFollowedUser.following.id) < 0)
                        {
                            usersToRecommend.push(followingOfFollowedUser.following)
                        }
                }
            }
            return usersToRecommend
        }
    }
}
const mutations = {
    followUser: async(parent:any, {to}:{to:string}, ctx:GraphQLContext) => {
        if(!ctx.user || !ctx.user.id) throw new Error ("You have to be authenticated to follow another user");
        try{
            await UserService.followUser(ctx.user!.id, to);
            return true;
        }catch(error){
            console.log("Error in Follow", error);
            throw new Error('Failed To Follow');
        }
    },
    unFollowUser: async(parent:any, {to}:{to:string}, ctx:GraphQLContext) => {
        if(!ctx.user || !ctx.user.id) throw new Error ("You have to be authenticated to unfollow another user");
        try{
            await UserService.unFollowUser(ctx.user!.id, to);
            return true;
        }catch(error){
            console.log("Error in UnFollow", error);
            throw new Error('Failed To unfollow');
        }
    },

}

export const resolvers = { queries, extraResolvers, mutations }