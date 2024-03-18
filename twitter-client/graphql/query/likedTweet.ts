import { graphql } from "@/gql"

export const GetAllLikedTweets = graphql(`
    query getAllLikedTweets {
    userId
    tweetId  
    user {
      firstName
    }
    tweet {
      content
    }
    }
  }
`)

export const GetLikedTweetById = graphql(`
    query getLikedTweetById(tweetId: $tweetId, userId: $userId) {
      user {
        email
      }
      userId
      tweetId
      tweet {
        content
      }
    }
`)
   
  