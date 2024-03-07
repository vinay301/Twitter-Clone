export const types = `#graphql
    scalar DateTime
    
    type LikedTweet {
    tweetId: String
    likedAt: DateTime
    userId: String
    tweet: Tweet
    user: User
    }
`