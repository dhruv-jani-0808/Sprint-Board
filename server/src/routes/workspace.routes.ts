import { Router } from "express";
import { getWorkspace, invite, update } from "../controller/workspace.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

router.get("/:slug", requireAuth, getWorkspace);
router.post("/:id/invite", requireAuth, invite);
router.patch("/:id", requireAuth, update);

export default router;