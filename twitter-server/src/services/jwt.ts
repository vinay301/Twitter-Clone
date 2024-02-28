import JWT from 'jsonwebtoken'
import { prismaClient } from "../clients/database";
import { User } from '@prisma/client';

const JWT_SECRET = 'THIS IS MY SUPER SECRET KEY'
class JWTService{
    public static generateTokenForUser(user : User){
        const payload = {
            id : user?.id || "",
            name : user?.firstName || "" ,
            email: user?.email
        };

        const token = JWT.sign(payload, JWT_SECRET);
        return token;
    }
}

export default JWTService