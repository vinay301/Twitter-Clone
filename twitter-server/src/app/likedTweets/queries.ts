export const queries = `#graphql
    getAllLikedTweets: [LikedTweet]!
    getLikedTweetById(tweetId:ID!,userId:ID!): LikedTweet
`