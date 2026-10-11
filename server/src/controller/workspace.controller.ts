import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import * as WorkspaceService from "../services/workspace.service";

const getWorkspace = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { slug } = req.params;
        const userId = req.user?.userId;
        if(!userId) {
            res.status(401).json({ message: "Unauthorized"});
            return;
        }

        const workspace = await WorkspaceService.getWorkspaceBySlug(slug.toString(), userId);
        res.status(200).json({ workspace });
    }
    catch(error: any) {
        const status = error.message.includes("Access denied") ? 403 : 404;
        res.status(status).json({ message: error.message });
    }
};

const invite = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { email, role } = req.body;
        if (!email) {
            res.status(400).json({ message: "Email is required to invite a member" });
            return;
        }

        const member = await WorkspaceService.inviteMember(id.toString(), email, role);
        res.status(201).json({ member });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

const update = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { name, slug } = req.body;

        const workspace = await WorkspaceService.updateWorkspace(id.toString(), { name, slug });
        res.status(200).json({ workspace });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export { getWorkspace, invite, update };