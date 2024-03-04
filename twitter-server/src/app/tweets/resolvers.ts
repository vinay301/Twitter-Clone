import { Tweet } from "@prisma/client";
import { prismaClient } from "../../clients/database";
import { GraphQLContext } from "../../interfaces";
import { S3Client,PutObjectCommand} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import UserService from "../../services/user";
import TweetService, { CreateTweetPayload } from "../../services/tweet";


const s3Client = new S3Client({
    region:process.env.AWS_DEFAULT_REGION,
})

const queries = {
    getAllTweets: () => TweetService.getAllTweets(),
    getSignedURLForTweet: async(parent:any, {imageType, imageName}:{imageType:string, imageName:string}, context:GraphQLContext) => {
        if(!context.user || !context.user.id)
        {
            throw new Error ("You must be logged in to perform this action.");
        }
        try{
            const allowedImageTypes = ['image/jpg','image/jpeg','image/png','image/webp'];
            if(!allowedImageTypes.includes(imageType)) throw new Error("Unsupported image type");
            const putObjectCommand = new PutObjectCommand({
                Bucket : process.env.AWS_S3_BUCKET,
                Key: `uploads/${context.user.id}/tweets/${imageName}-${Date.now().toString()}.${imageType}`,
            })
            const signedUrl = await getSignedUrl(s3Client,putObjectCommand)
            return signedUrl;
        }catch(error){

        }
    }
}

const mutations = {
    createTweet: async (parent:any, { payload }:{payload:CreateTweetPayload}, context:GraphQLContext) => {
        if(!context.user)
        {
            throw new  Error("You are Unauthorized");
        }

        try{
            const tweet = await TweetService.createTweet({
                ...payload,
                userId: context.user.id
            });
            return tweet;
        }catch(error){
            console.log(error);
            throw new Error("Error creating the Tweet")
        }
        
    },

  
};

const extraResolvers = {
    Tweet: {
        author: (parent:Tweet) =>UserService.getUserById(parent.authorId),
    }
}

export const resolvers = {mutations, extraResolvers, queries };