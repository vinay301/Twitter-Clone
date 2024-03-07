export const queries = `#graphql
    getAllTweets: [Tweet]!
    getTweetById(id:ID!): Tweet
    getSignedURLForTweet(imageName:String!,imageType: String!): String
`