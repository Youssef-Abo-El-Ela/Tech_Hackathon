import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ErrorGenerator } from "../utils/errorGenerator";

interface JwtPayload {
    id: string;
    email: string;
    role: string;
    national_id: string;
    phone_number: string;
    username: string;
}

declare global {
    namespace Express {
        interface Request {
            user: JwtPayload;
        }
    }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if (!token) {
        throw new ErrorGenerator("Unauthorized", 401);
    }

    try {
        const secret = process.env.JWT_SECRET!;
        const decoded = jwt.verify(token, secret) as JwtPayload;
        req.user = decoded;
        next();
    } catch (err) {
        throw new ErrorGenerator("Invalid token", 403);
    }
};