import likedTweet from "../../services/likedTweet";
import TweetService from "../../services/tweet";


const likedTweetResolvers = {
  mutations: {
    likeTweet: async (parent:any, {userId,tweetId}:{ userId:string, tweetId:string }) => {
      try {
        await likedTweet.likeTweet(tweetId, userId);
        return true;
      } catch (error) {
        console.error('Error liking tweet:', error);
        throw new Error('Failed to like the tweet');
      }
    },
  },
};

export default likedTweetResolvers;
