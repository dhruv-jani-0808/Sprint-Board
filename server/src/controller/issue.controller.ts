import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import * as issueService from "../services/issue.service";
import { Status, Priority } from "@prisma/client";
import { broadcastToWorkspace } from "../sockets/wsServer";
import { queueEmailNotification, queueActivityLog } from "../queues/queue";

const create = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { title, description, status, priority, workspaceId, sprintId, assigneeId, tags } = req.body;
        const creatorId = req.user?.userId;
        
        if (!title || !workspaceId || !creatorId) {
            return res.status(400).json({ message: "Title and workspaceId are required" });
        }

        const issue = await issueService.createIssue({
            title,
            description,
            status,
            priority,
            workspaceId,
            sprintId,
            assigneeId,
            creatorId,
            tags,
        });

        broadcastToWorkspace(issue.workspaceId, {
            type: "ISSUE_CREATED",
            payload: issue,
        });
        
        queueActivityLog({
            issueId: issue.id,
            userId: creatorId,
            action: "ISSUE_CREATED",
            metadata: { title: issue.title, priority: issue.priority },
        });

        if(issue.assignee && issue.assignee.email) {
            queueEmailNotification({
                to: issue.assignee.email,
                subject: `Assigned: ${issue.key} - ${issue.title}`,
                body: `Hi ${issue.assignee.name}, you have been assigned to ${issue.key}.`,
            });
        }

        return res.status(201).json({ issue });
    } catch (err: any) {
        return res.status(400).json({ message: err.message });
    }
};

const getAll = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { workspaceId, sprintId, status, priority, assigneeId, search } = req.query;
        
        if (!workspaceId) {
            return res.status(400).json({ message: "workspaceId is required" });
        }
        
        const issues = await issueService.getIssues({
            workspaceId: workspaceId as string,
            sprintId: sprintId as string | undefined,
            status: status as Status | undefined,
            priority: priority as Priority | undefined,
            assigneeId: assigneeId as string | undefined,
            search: search as string | undefined,
        });
        
        return res.status(200).json({ issues });
    } catch (err: any) {
        return res.status(400).json({ message: err.message });
    }
};

const getBoard = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { sprintId } = req.params;
        
        if (!sprintId) {
            return res.status(400).json({ message: "sprintId is required" });
        }

        const issues = await issueService.getBoardWithCache(sprintId.toString());
        return res.status(200).json({ issues });
    } catch (err: any) {
        return res.status(400).json({ message: err.message });
    }
};

const move = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { status, order, sprintId } = req.body;
        
        if (!status || order === undefined) {
            return res.status(400).json({ message: "status and order are required" });
        }
        
        const issue = await issueService.moveIssue(
            id.toString(),
            status as Status,
            Number(order),
            sprintId
        );

        if (!issue) {
            return res.status(200).json({ message: "Mock issue moved locally", issue: null });
        }
        
        broadcastToWorkspace(issue.workspaceId, {
            type: "ISSUE_MOVED",
            payload: issue,
        });
        
        if(req.user?.userId) {
            queueActivityLog({
                issueId: issue.id,
                userId: req.user.userId,
                action: "STATUS_CHANGED",
                metadata: { newStatus: status, newOrder: order },
            });
        }
        
        return res.status(200).json({ issue });
    } catch (err: any) {
        return res.status(400).json({ message: err.message });
    }
};

const update = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { sprintId, ...updateData } = req.body;
        
        const issue = await issueService.updateIssue(id.toString(), updateData, sprintId);
        
        broadcastToWorkspace(issue.workspaceId, {
            type: "ISSUE_UPDATED",
            payload: issue,
        });

        if(req.user?.userId) {
            queueActivityLog({
                issueId: issue.id,
                userId: req.user.userId,
                action: "ISSUE_UPDATED",
                metadata: updateData,
            });
        }
        
        return res.status(200).json({ issue });
    } catch (err: any) {
        return res.status(400).json({ message: err.message });
    }
};

const remove = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { id } = req.params;
        const sprintId = (req.query.sprintId as string) || req.body.sprintId;
        
        const result = await issueService.deleteIssue(id.toString(), sprintId);
        
        broadcastToWorkspace(result.workspaceId, {
            type: "ISSUE_DELETED",
            payload: { id },
        });

        return res.status(200).json({ message: "Issue deleted successfully", result });
    } catch (err: any) {
        return res.status(400).json({ message: err.message });
    }
};

export { create, getAll, getBoard, move, update, remove };