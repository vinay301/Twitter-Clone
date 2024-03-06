import { graphql } from "@/gql";

export const getAllTweetsQuery = graphql(`
    #graphql
    query GetAllTweets{
        getAllTweets{
            id,
            content,
            imageUrl,
            likes
            author{
                id
                firstName
                lastName
                profileImageUrl
            }
        }
    }
`)

export const getSignedURLForTweetQuery = graphql(`#graphql
    query GetSignedURLForTweet($imageName: String!, $imageType: String!) {
    getSignedURLForTweet(imageName: $imageName, imageType: $imageType)
    }
`)