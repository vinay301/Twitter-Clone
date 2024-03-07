import { prismaClient } from "../clients/database";

class LikedTweetService {
  public static async likeTweet(tweetId: string, userId: string): Promise<void> {
    try {
      // Check if the tweet and user exist
      const tweet = await prismaClient.tweet.findUnique({
        where: { id: tweetId },
      });

      const user = await prismaClient.user.findUnique({
        where: { id: userId },
      });

      if (!tweet || !user) {
        throw new Error('Tweet or user not found');
      }

      // Check if the tweet is already liked by the user
      const existingLike = await prismaClient.likedTweet.findFirst({
        where: {
          userId: user.id,
          tweetId: tweet.id,
        },
      });

      if (existingLike) {
        throw new Error('Tweet already liked by the user');
      }

      // Create a new like
      await prismaClient.likedTweet.create({
        data: {
          userId: user.id,
          tweetId: tweet.id,
        },
      });

      
     
        if(tweet){
            //Update the likes count in the tweet entity (assuming you have a likes field in the Tweet model)
            await prismaClient.tweet.update({
                where: { id: tweet.id },
                data: {
                likes: tweet.likes + 1
                },
            });
        }
    
    } catch (error) {
      console.error('Error liking tweet:', error);
      throw new Error('Failed to like the tweet');
    }
  }

  public static async unlikeTweet(tweetId: string, userId: string): Promise<void> {
    try {
      // Check if the tweet and user exist
      const tweet = await prismaClient.tweet.findUnique({
        where: { id: tweetId },
      });

      const user = await prismaClient.user.findUnique({
        where: { id: userId },
      });

      if (!tweet || !user) {
        throw new Error('Tweet or user not found');
      }

      // Check if the tweet is liked by the user
      const existingLike = await prismaClient.likedTweet.findFirst({
        where: {
          userId: user.id,
          tweetId: tweet.id,
        },
      });

      if (!existingLike) {
        throw new Error('Tweet not liked by the user');
      }

      // Delete the existing like
      await prismaClient.likedTweet.delete({
        where: {
            tweetId_userId:{
                tweetId: tweet.id,
                userId: user.id,
            }
           
        },
      });

      // Update the likes count in the tweet entity
      await prismaClient.tweet.update({
        where: { id: tweet.id },
        data: {
          likes: tweet.likes - 1,
        },
      });
    } catch (error) {
      console.error('Error unliking tweet:', error);
      throw new Error('Failed to unlike the tweet');
    }
  }

  public static getAllLikedTweets(){
    return prismaClient.likedTweet.findMany({
        orderBy: {
            likedAt:'desc'
        },
        include: {
            tweet: true,
            user: true,
        }
    })
    }

    // Get Likedtweet by id
    // public static async getLikedTweetById(tweetId: string, userId: string) {
    //     return await prismaClient.likedTweet.findUnique({ where: { tweetId_userId: { tweetId, userId } } });
    // }
    public static async getLikedTweetById(tweetId: string, userId: string) {
        return await prismaClient.likedTweet.findUnique({
            where: {
                tweetId_userId: {
                    tweetId,
                    userId,
                },
            },
            include: {
                tweet: true,
                user: true,
            },
        });
    }
    
}



export default LikedTweetService;
