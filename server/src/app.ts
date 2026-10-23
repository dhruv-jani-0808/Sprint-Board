import express from "express";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes";
import workspaceRoutes from "./routes/workspace.routes";
import sprintRoutes from "./routes/sprint.routes";
import issueRoutes from "./routes/issue.routes";

import { initWebSocketServer } from "./sockets/wsServer";
import { initWorkers } from "./queues/worker";

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

initWebSocketServer(server);
initWorkers();

app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/sprints", sprintRoutes);
app.use("/api/issues", issueRoutes);

app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timeStamp: new Date().toISOString() });
});

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`); 
});

export default app;