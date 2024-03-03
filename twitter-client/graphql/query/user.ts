import { graphql } from "../../gql";


export const verifyUserGoogleTokenQuery = graphql(`
  #graphql
  query VerifyUserGoogleToken($token: String!) {
    verifyGoogleToken(token: $token)
  }
`);

export const getCurrentUserQuery = graphql(
    `#graphql
    query GetCurrentUser {
        getCurrentUser{
            id,
            email,
            firstName,
            lastName,
            profileImageUrl,
            recommendedUsers{
                id
                firstName
                lastName
                profileImageUrl
            }
            followers {
                id
                firstName
                lastName
                profileImageUrl
            }
            following {
                id
                firstName
                lastName
                profileImageUrl
            }
            tweets{
                id
                content
                author{
                    id
                    firstName
                    lastName
                    profileImageUrl
                }
            }
        }
    }
    `
)

export const getUserByIdQuery = graphql(`#graphql
    query GetUserById($id: ID!){
        getUserById(id: $id) {
            id
            firstName
            lastName
            email
            profileImageUrl
            followers {
                id
                firstName
                lastName
                profileImageUrl
            }
            following {
                id
                firstName
                lastName
                profileImageUrl
            }
            tweets {
                content
                id
                author{
                    id
                    firstName
                    lastName
                    profileImageUrl
                }
            }
        }
    }
`)