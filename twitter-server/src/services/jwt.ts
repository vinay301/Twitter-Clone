import JWT from 'jsonwebtoken'
import { prismaClient } from "../clients/database";
import { User } from '@prisma/client';
import { JWTUser } from '../interfaces';

const JWT_SECRET = 'THIS IS MY SUPER SECRET KEY'
class JWTService{
    public static generateTokenForUser(user : User){
        const payload : JWTUser = {
            id : user?.id || "",
            name : user?.firstName || "" ,
            email: user?.email
        };

        const token = JWT.sign(payload, JWT_SECRET);
        return token;
    }

    public static decryptToken(token : string) {
        try {
            return JWT.verify(token,JWT_SECRET) as JWTUser;
        } catch (error) {
            return null
           // throw new Error("Invalid Token");
        }
    }
}

export default JWTService