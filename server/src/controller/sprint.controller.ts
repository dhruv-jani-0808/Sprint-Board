import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import * as sprintService from "../services/sprint.service";

const create = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { workspaceId, name, startDate, endDate } = req.body;
        if (!workspaceId || !name) {
            res.status(400).json({ message: "Workspace ID and sprint name are required." });
            return;
        }

        const sprint = await sprintService.createSprint(
            workspaceId,
            name,
            startDate ? new Date(startDate) : undefined,
            endDate ? new Date(endDate) : undefined
        );
        res.status(201).json({ sprint });
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
};

const getActive = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { workspaceId } = req.params;
        if (!workspaceId) {
            res.status(400).json({ message: "Workspace ID is required." });
            return;
        }

        const sprint = await sprintService.getActiveSprint(workspaceId.toString());
        res.status(200).json({ sprint });
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
};

const start = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { workspaceId } = req.body;
        if (!workspaceId) {
            res.status(400).json({ message: "Workspace ID is required." });
            return;
        }

        const sprint = await sprintService.startSprint(id.toString(), workspaceId);
        res.status(200).json({ sprint });
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
};

const complete = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const sprint = await sprintService.completeSprint(id.toString());
        res.status(200).json({ sprint });
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
};

export { create, getActive, start, complete };