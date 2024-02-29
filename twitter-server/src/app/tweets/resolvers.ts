import { Tweet } from "@prisma/client";
import { prismaClient } from "../../clients/database";
import { GraphQLContext } from "../../interfaces";

interface CreateTweetPayload{
    content: string
    imageUrl?: string
}

const queries = {
    getAllTweets: () => prismaClient.tweet.findMany({orderBy: {createdAt:'desc'}}),
}

const mutations = {
    createTweet: async (parent:any, { payload }:{payload:CreateTweetPayload}, context:GraphQLContext) => {
        if(!context.user)
        {
            throw new  Error("You are Unauthorized");
        }

        try{
            const tweet = await prismaClient.tweet.create({
                data:{
                    content: payload.content,
                    imageUrl: payload.imageUrl || null,
                    author: {connect: {id:context.user.id}}
                    // authorId: context.user.id
                }
            })
            return tweet;
        }catch(error){
            console.log(error);
            throw new Error("Error creating the Tweet")
        }
        
    }
};

const extraResolvers = {
    Tweet: {
        author: (parent:Tweet) => prismaClient.user.findUnique({where:{id:parent.authorId}})
    }
}

export const resolvers = {mutations, extraResolvers, queries };