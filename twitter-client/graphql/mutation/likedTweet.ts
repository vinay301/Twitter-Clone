import { graphql } from "@/gql";

export const likedTweetMutation = graphql(`#graphql
mutation LikeTweet($tweetId: ID!, $userId: ID!) {
  likeTweet(tweetId: $tweetId, userId: $userId)
}
`)