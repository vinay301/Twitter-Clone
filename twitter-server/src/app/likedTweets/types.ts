export const types = `#graphql
    type LikedTweet {
    tweetId: String
    likedAt: DateTime
    userId: String
    tweet: Tweet
    user: User
    }
`