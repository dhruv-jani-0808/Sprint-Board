import { prisma } from "../config/db";
import { getCache, setCache, deleteCache } from "../config/redis";
import { Status, Priority } from "@prisma/client";

export interface CreateIssueInput {
    title: string;
    description?: string;
    status?: Status;
    priority?: Priority;
    workspaceId: string;
    sprintId?: string;
    assigneeId?: string;
    creatorId: string;
    tags?: string[];
}

export interface GetIssuesFilters {
    workspaceId: string;
    sprintId?: string;
    status?: Status;
    priority?: Priority;
    assigneeId?: string;
    search?: string;
}

export interface UpdateIssueInput {
    title?: string;
    description?: string;
    status?: Status;
    priority?: Priority;
    assigneeId?: string | null;
    sprintId?: string | null;
    tags?: string[];
    order?: number;
}

const createIssue = async (data: CreateIssueInput) => {
    const totalIssues = await prisma.issue.count({
        where: { workspaceId: data.workspaceId },
    });
    const key = `DEV-${100 + totalIssues + 1}`;

    const lastIssue = await prisma.issue.findFirst({
        where: {
            workspaceId: data.workspaceId,
            status: data.status || "TODO",
            ...(data.sprintId ? { sprintId: data.sprintId } : {}),
        },
        orderBy: { order: "desc" },
        select: { order: true },
    });
    const nextOrder = lastIssue ? lastIssue.order + 1000 : 1000;

    const issue = await prisma.issue.create({
        data: {
            key,
            title: data.title,
            description: data.description,
            status: data.status || "TODO",
            priority: data.priority || "MEDIUM",
            order: nextOrder,
            tags: data.tags || [],
            workspaceId: data.workspaceId,
            sprintId: data.sprintId || null,
            assigneeId: data.assigneeId || null,
            creatorId: data.creatorId,
        },
        include: {
            assignee: {
                select: { id: true, name: true, email: true, avatarUrl: true },
            },
        },
    });

    if(data.sprintId) {
        await deleteCache(`board:${data.sprintId}`);
    }

    return issue;
};

const getIssues = async (filters: GetIssuesFilters) => {
    const whereClause: any = {
        workspaceId: filters.workspaceId,
    };

    if(filters.sprintId) {
        whereClause.sprintId = filters.sprintId;
    }

    if(filters.status) {
        whereClause.status = filters.status;
    }

    if(filters.priority) {
        whereClause.priority = filters.priority;
    }

    if(filters.assigneeId) {
        whereClause.assigneeId = filters.assigneeId;
    }

    if(filters.search) {
        whereClause.OR = [
            { title: { contains: filters.search, mode: "insensitive" } },
            { key: { contains: filters.search, mode: "insensitive" } },
        ];
    }

    const issues = await prisma.issue.findMany({
        where: whereClause,
        include: {
            assignee: {
                select: { id: true, name: true, email: true, avatarUrl: true },
            },
        },
        orderBy: { order: "asc" },
    });

    return issues;
};

const getBoardWithCache = async (sprintId: string) => {
    const cacheKey = `board:${sprintId}`;
    const cached = await getCache<any[]>(cacheKey);

    if(cached) {
        return cached;
    }

    const issues = await prisma.issue.findMany({
        where: { sprintId },
        include: {
            assignee: {
                select: { id: true, name: true, email: true, avatarUrl: true },
            },
        },
        orderBy: { order: "asc" },
    });

    await setCache(cacheKey, issues, 3600);
    return issues;
};

const moveIssue = async (
    issueId: string,
    newStatus: Status,
    newOrder: number,
    sprintId?: string
) => {
    // 1. Locate issue by UUID id or DEV- key
    const existing = await prisma.issue.findFirst({
        where: {
            OR: [{ id: issueId }, { key: issueId }],
        },
    });

    if (!existing) {
        return null;
    }

    const issue = await prisma.issue.update({
        where: { id: existing.id },
        data: {
            status: newStatus,
            order: newOrder,
        },
        include: {
            assignee: {
                select: { id: true, name: true, email: true, avatarUrl: true },
            },
        },
    });

    const targetSprintId = sprintId || issue.sprintId;
    if (targetSprintId) {
        await deleteCache(`board:${targetSprintId}`);
    }

    return issue;
};

const updateIssue = async (
    issueId: string,
    data: UpdateIssueInput,
    sprintId?: string
) => {
    const issue = await prisma.issue.update({
        where: { id: issueId },
        data,
        include: {
            assignee: {
                select: { id: true, name: true, email: true, avatarUrl: true },
            },
        },
    });

    const targetSprintId = sprintId || issue.sprintId;
    if(targetSprintId) {
        await deleteCache(`board:${targetSprintId}`);
    }

    return issue;
};

const deleteIssue = async (issueId: string, sprintId?: string) => {
    const issue = await prisma.issue.delete({
        where: { id: issueId },
    });

    const targetSprintId = sprintId || issue.sprintId;
    if(targetSprintId) {
        await deleteCache(`board:${targetSprintId}`);
    }

    return { success: true, workspaceId: issue.workspaceId };
};

export {
    createIssue,
    getIssues,
    getBoardWithCache,
    moveIssue,
    updateIssue,
    deleteIssue,
};