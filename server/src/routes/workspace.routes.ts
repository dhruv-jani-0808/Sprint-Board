import { Router } from "express";
import { getWorkspace, invite, update, removeMember } from "../controller/workspace.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

router.get("/:slug", requireAuth, getWorkspace);
router.post("/:id/invite", requireAuth, invite);
router.patch("/:id", requireAuth, update);
router.delete("/:id/members/:userId", requireAuth, removeMember);

export default router;