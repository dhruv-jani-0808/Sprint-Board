import { Router } from "express";
import { create, getActive, start, complete } from "../controller/sprint.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", requireAuth, create);
router.get("/active/:workspaceId", requireAuth, getActive);
router.post("/:id/start", requireAuth, start);
router.post("/:id/complete", requireAuth, complete);

export default router;