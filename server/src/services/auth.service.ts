import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../config/db";

const generateToken = (
    userId: string,
    email: string
): string => {
    const secret = process.env.JWT_SECRET || "default_jwt_secret_change_in_production";
    const token = jwt.sign({ userId, email }, secret, { expiresIn: "7d" });
 
    return token;
}

export const registerUser = async (name: string, email: string, password: string) => {
    const alreadyExists = await prisma.user.findUnique({ where: {email} });
    
    if(alreadyExists) {
        throw new Error("User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const workspaceSlug = `${name.toLowerCase().replace(/\s+/g, '-')}-workspace`;

    const newUser = await prisma.user.create({
        data: {
            name,
            email,
            passwordHash: hashedPassword,
            ownedWorkspaces: {
                create: {
                    name: `${name}'s workspace`,
                    slug: workspaceSlug
                }
            }
        },
        include: {
            ownedWorkspaces: true,
        },
    });

    const defaultWorkspace = newUser.ownedWorkspaces[0];
    const workspaceId = defaultWorkspace.id;

    await prisma.workspaceMember.create({
        data: {
            userId: newUser.id,
            workspaceId,
            role: "ADMIN"
        },
    });

    const token = generateToken(newUser.id, newUser.email);
    return {
        user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
        },
        workspace: defaultWorkspace,
        token,
    };
}

export const loginUser = async (email: string, password: string) => {
    const user = await prisma.user.findUnique({ where: { email } });

    if(!user) {
        throw new Error("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if(!isPasswordValid) {
        throw new Error("Invalid email or password");
    }

    const token = generateToken(user.id, user.email);
    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            avatarUrl: user.avatarUrl,
        },
        token,
    }
};

export const getCurrentUser = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        },
        select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
            createdAt: true,
            memberships: {
                include: {
                    workspace: true,
                },
            },
        },
    });

    if(!user) {
        throw new Error("User not found");
    }

    return user;
}