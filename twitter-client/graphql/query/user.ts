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