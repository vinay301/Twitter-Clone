export interface JWTUser{
    id: string,
    email:string
    name: string
}
export interface GraphQLContext{
    user?: JWTUser
}