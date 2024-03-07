import { prismaClient } from "../clients/database";

export interface CreateTweetPayload{
    content: string
    imageUrl?: string
    userId: string
   
}

class TweetService{
    public static createTweet(data:CreateTweetPayload){
        return prismaClient.tweet.create({
            data:{
                content: data.content,
                imageUrl: data.imageUrl || null,
                author: {connect: {id:data.userId}},
            }
        })
    }

    public static getAllTweets(){
        return prismaClient.tweet.findMany({orderBy: {createdAt:'desc'}})
    }

    // Get tweet by id
    public static async getTweetById(id:string){
        return await prismaClient.tweet.findUnique( { where : { id}} )
    }

}

export default TweetService;