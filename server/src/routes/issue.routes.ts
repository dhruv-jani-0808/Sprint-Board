import { Router } from "express";
import { create, getAll, getBoard, move, update, remove } from "../controller/issue.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

router.use(requireAuth);

router.post("/", create);
router.get("/", getAll);
router.get("/board/:sprintId", getBoard);
router.patch("/:id/move", move);
router.patch("/:id", update);
router.delete("/:id", remove);

export default router;