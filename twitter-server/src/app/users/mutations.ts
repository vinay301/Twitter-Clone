// Only Whom to follow Id is passed as a param & returns whwether followed or not
export const mutations = `#graphql
    followUser(to: ID!): Boolean
    unFollowUser(to: ID!): Boolean
`