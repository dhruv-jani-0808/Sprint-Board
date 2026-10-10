import { prisma } from "../config/db";
import { Role } from "@prisma/client";

const getWorkspaceBySlug = async (slug: string, userId: string) => {
    const workspace = await prisma.workspace.findUnique({ 
        where: {
            slug: slug
        },
        include: {
            members: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            avatarUrl: true,
                        }
                    }
                }
            },
            sprints: {
                orderBy: {
                    createdAt: "desc",
                },
            },
        } 
    });

    if(!workspace) {
        throw new Error("Workspace not found");
    }

    const isMember = workspace.members.some(m => m.userId === userId);
    if(!isMember) {
        throw new Error("Access denied to this workspace");
    }

    return workspace;
};

const inviteMember = async (workspaceId: string, email: string, role: Role = "MEMBER") => {
    const targetUser = await prisma.user.findUnique({ where: { email } });
    if(!targetUser) {
        throw new Error("No registered user found with this email");
    }

    const existingMember = await prisma.workspaceMember.findUnique({
        where: {
            workspaceId_userId: {
                workspaceId,
                userId: targetUser.id,
            },
        },
    });
    if(existingMember) {
        throw new Error("User is already a member of this workspace");
    }

    const newMember = await prisma.workspaceMember.create({
        data: {
            workspaceId,
            userId: targetUser.id,
            role,
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    avatarUrl: true,
                },
            },
        },
    });

    return newMember;
};

const updateWorkspace = async (workspaceId: string, data: { name?: string, slug?: string }) => {
    if(data.slug) {
        const existing = await prisma.workspace.findUnique({ where: { slug: data.slug } });
        if(existing && existing.id !== workspaceId) {
            throw new Error("Workspace URL slug is already taken");
        }
    }

    const updated = await prisma.workspace.update({
        where: { id: workspaceId },
        data,
    });

    return updated;
};

export { getWorkspaceBySlug, inviteMember, updateWorkspace };