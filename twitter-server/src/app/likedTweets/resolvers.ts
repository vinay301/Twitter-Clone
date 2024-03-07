import { LikedTweet } from "@prisma/client";
import { GraphQLContext } from "../../interfaces";
import likedTweet from "../../services/likedTweet";
import UserService from "../../services/user";
import TweetService from "../../services/tweet";

const  queries = {
        getAllLikedTweets: () => likedTweet.getAllLikedTweets(),
        getLikedTweetById:  async (parent:any , {tweetId,userId}:{tweetId:string,userId:string}, ctx:GraphQLContext) => likedTweet.getLikedTweetById(tweetId,userId)
}
const mutations = {
    likeTweet: async (parent:any, {userId,tweetId}:{ userId:string, tweetId:string }, context:GraphQLContext) => {
      try {
        await likedTweet.likeTweet(tweetId, userId);
        return true;
      } catch (error) {
        console.error('Error liking tweet:', error);
        throw new Error('Failed to like the tweet');
      }
    },
    unlikeTweet: async (parent: any, { userId, tweetId }: { userId: string, tweetId: string }, context: GraphQLContext) => {
        try {
          await likedTweet.unlikeTweet(tweetId, userId);
          return true;
        } catch (error) {
          console.error('Error unliking tweet:', error);
          throw new Error('Failed to unlike the tweet');
        }
    },
  }

  const extraResolvers = {
    LikedTweet: {
        user: (parent:LikedTweet) =>UserService.getUserById(parent.userId),
        tweet: (parent:LikedTweet) => TweetService.getTweetById(parent.tweetId),
    }
}



  export const resolvers = {mutations, queries, extraResolvers }
