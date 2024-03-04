export const types = `#graphql

    input createTweetData {
        content: String!
        imageUrl: String
    }


    type Tweet {
        id: ID!
        content: String!
        imageUrl: String
        author: User
        likes: [Tweet]
    }
`