import { graphql } from "@/gql";

export const likedTweetMutation = graphql(`#graphql
mutation LikeTweet($tweetId: ID!, $userId: ID!) {
  likeTweet(tweetId: $tweetId, userId: $userId)
}
`)
export const UnLikeTweetMutation = graphql(`#graphql
mutation UnlikeTweet($tweetId: ID!, $userId: ID!) {
  unlikeTweet(tweetId: $tweetId, userId: $userId)
}
`)
