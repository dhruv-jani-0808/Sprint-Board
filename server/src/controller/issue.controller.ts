import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import * as issueService from "../services/issue.service";
import { Status, Priority } from "@prisma/client";

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
        return res.status(200).json({ message: "Issue deleted successfully", result });
    } catch (err: any) {
        return res.status(400).json({ message: err.message });
    }
};

export { create, getAll, getBoard, move, update, remove };