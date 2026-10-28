import { prisma } from "../config/db";
import { deleteCache } from "../config/redis";

const createSprint = async (workspaceId: string, name: string, startDate?: Date, endDate?: Date) => {
    const sprint = await prisma.sprint.create({ 
        data: {
            workspaceId,
            name,
            status: "PLANNING",
            startDate,
            endDate,
        }
    });

    return sprint;
};

const getActiveSprint = async (workspaceId: string) => {
    const sprint = await prisma.sprint.findFirst({
        where: {
            workspaceId,
            status: "ACTIVE",
        },
        include: {
            issues: {
                include: {
                    assignee: true,
                },
                orderBy: {
                    order: "asc",
                },
            },
        },
    });
    
    if (sprint) {
        return sprint;
    }
    
    const planningSprint = await prisma.sprint.findFirst({
        where: {
            workspaceId,
            status: "PLANNING",
        },
        include: {
            issues: {
                include: {
                    assignee: true,
                },
                orderBy: {
                    order: "asc",
                },
            },
        },
    });

    if (planningSprint) {
        return planningSprint;
    }

    // Auto-create active Sprint 1 if no sprint exists in this workspace
    const newSprint = await prisma.sprint.create({
        data: {
            workspaceId,
            name: "Sprint 1",
            status: "ACTIVE",
            startDate: new Date(),
        },
        include: {
            issues: {
                include: {
                    assignee: true,
                },
                orderBy: {
                    order: "asc",
                },
            },
        },
    });

    return newSprint;
};

const startSprint = async (sprintId: string, workspaceId: string) => {
    const existingActive = await prisma.sprint.findFirst({
        where: {
            workspaceId,
            status: "ACTIVE",
        },
    });

    if (existingActive) {
        throw new Error("Another sprint is already active in this workspace");
    }

    const sprint = await prisma.sprint.update({
        where: { id: sprintId },
        data: {
            status: "ACTIVE",
            startDate: new Date(),
        },
    });

    await deleteCache(`board:${sprintId}`);
    return sprint;
};

const completeSprint = async (sprintId: string) => {
    const sprint = await prisma.sprint.update({
        where: { id: sprintId },
        data: {
            status: "COMPLETED",
            endDate: new Date(),
        },
    });

    await deleteCache(`board:${sprintId}`);
    return sprint;
};

export { createSprint, getActiveSprint, startSprint, completeSprint };