import { prismaClient } from "../clients/database";

export interface CreateTweetPayload{
    content: string
    imageUrl?: string
    userId: string
    id:string
}

class TweetService{
    public static createTweet(data:CreateTweetPayload){
        return prismaClient.tweet.create({
            data:{
                content: data.content,
                imageUrl: data.imageUrl || null,
                author: {connect: {id:data.userId}}
            }
        })
    }

    public static getAllTweets(){
        return prismaClient.tweet.findMany({orderBy: {createdAt:'desc'}})
    }

    // public static likeTweet(tweetId: string, userId: string) {
    //     return prismaClient.likedTweet.create({
    //       data: {
    //         tweet: { connect: { id: tweetId } },
    //         user: { connect: { id: userId } },
    //       },
    //     });
    //   }

}

export default TweetService;