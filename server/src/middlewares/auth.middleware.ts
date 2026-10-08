import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
    user?: {
        userId: string;
        email: string;
    };
}

export const requireAuth = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): void => {
    try {
        const token =
            req.cookies?.token || 
            req.headers.authorization?.replace("Bearer ", "");

        if(!token) {
            res.status(401).json({ message: "Authentication required"});
            return;
        }

        const secret = process.env.JWT_SECRET || "default_jwt_secret_change_in_production";
        const decoded = jwt.verify(token, secret) as {
            userId: string;
            email: string;
        };

        req.user = decoded;
        next();
    }
    catch(error) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
}