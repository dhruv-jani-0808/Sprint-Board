import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import * as authService from "../services/auth.service";

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password } = req.body;
        if(!name || !email || !password) {
            res.status(400).json({ message: "Name, email and password are required" });
            return;
        }

        const result = await authService.registerUser(name, email, password);
 
        res.cookie("token", result.token, COOKIE_OPTIONS);
        res.status(201).json({ user: result.user, workspace: result.workspace });
    }
    catch(error: any) {
        res.status(400).json({ message: error.message || "Failed to register" });
    }
}

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        if(!email || !password) {
            res.status(400).json({ message:  "Email and password are required" });
            return;
        }
    
        const result = await authService.loginUser(email, password);
        
        res.cookie("token", result.token, COOKIE_OPTIONS);
        res.status(200).json({ user: result.user });
    }
    catch(error: any) {
        res.status(401).json({ message: error.message || "Invalid credentials" });
    }
}

export const logout = async (req: Request, res: Response) => {
    res.clearCookie("token", { httpOnly: true, sameSite: "lax" });
    res.status(200).json({ message: "Logged out successfully" });
}

export const me = async(req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        if(!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const user = await authService.getCurrentUser(userId);
        res.status(200).json({ user });
    }
    catch(error: any) {
        res.status(404).json({ message: error.message || "User not found" });
    }
}